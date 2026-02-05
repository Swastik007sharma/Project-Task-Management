const Task = require("../models/task.model");
const Project = require("../models/project.model");

// Helper: Standardized Admin Check
const isAdmin = (user) => user?.role === "admin";

// Helper: Centralized Authorization Logic
const ensureProjectAccess = (req, project) => {
  if (isAdmin(req.user)) return true;
  if (!project?.owner) return false;
  // Use .equals() - it is the safest way to compare Mongoose ObjectIds
  return project.owner.equals(req.user.id);
};

// Create task under a project
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (!ensureProjectAccess(req, project)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Spread req.body to catch all fields, but manually override 'project' for safety
    const task = await Task.create({
      ...req.body,
      project: projectId,
    });

    res.status(201).json({ success: true, message: "Task created", task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get tasks for a project
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (!ensureProjectAccess(req, project)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email role")
      .populate("project", "title owner");

    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching tasks" });
  }
};

// Get task by id (within a project)
exports.getTaskById = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    // findOne ensures the task actually belongs to this project in one query
    const task = await Task.findOne({ _id: taskId, project: projectId })
      .populate("assignedTo", "name email role")
      .populate("project", "title owner");

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found in this project" });
    }

    const project = await Project.findById(task.project._id || task.project);
    if (!project || !ensureProjectAccess(req, project)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update task (within a project)
exports.updateTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await Task.findOne({ _id: taskId, project: projectId });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const project = await Project.findById(projectId);
    if (!project || !ensureProjectAccess(req, project)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // findByIdAndUpdate is cleaner than manual field mapping
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: req.body },
      { new: true, runValidators: true },
    )
      .populate("assignedTo", "name email role")
      .populate("project", "title owner");

    res
      .status(200)
      .json({ success: true, message: "Task updated", task: updatedTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete task (within a project)
exports.deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await Task.findOne({ _id: taskId, project: projectId });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const project = await Project.findById(projectId);
    if (!project || !ensureProjectAccess(req, project)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await Task.deleteOne({ _id: taskId });
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get statistics for a project (admin or owner)
exports.getProjectTaskStats = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (!ensureProjectAccess(req, project)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const total = await Task.countDocuments({ project: projectId });
    const byStatus = await Task.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const byPriority = await Task.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const statusCounts = { pending: 0, "in progress": 0, done: 0 };
    byStatus.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    const priorityCounts = { low: 0, medium: 0, high: 0 };
    byPriority.forEach((item) => {
      priorityCounts[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      projectId,
      total,
      status: statusCounts,
      priority: priorityCounts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all tasks for current user (admin: all, user: tasks in owned projects)
exports.getAllTasks = async (req, res) => {
  try {
    const projects = await Project.find(
      isAdmin(req.user) ? {} : { owner: req.user.id },
      "_id",
    );
    const projectIds = projects.map((project) => project._id);

    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate("assignedTo", "name email role")
      .populate("project", "title owner")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
