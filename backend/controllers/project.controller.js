const Project = require("../models/project.model");
const Task = require("../models/task.model");

// Helper to check for Admin role
const isAdmin = (user) => user?.role === "admin";

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private (Handled by middleware)
 */
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/projects
 * @desc    Get projects (Admin: all, User: only their own)
 */
exports.getProjects = async (req, res) => {
  try {
    // If Admin, empty query {} returns all. If User, filter by owner.
    const query = isAdmin(req.user) ? {} : { owner: req.user.id };

    const projects = await Project.find(query)
      .populate("owner", "name email role")
      .sort("-createdAt"); // Show newest projects first

    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching projects",
    });
  }
};

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project by ID
 */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "owner",
      "name email role",
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Authorization: Must be Admin OR the Owner
    if (!isAdmin(req.user) && !project.owner.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this project",
      });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Invalid Project ID format" });
  }
};

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project (Partial updates allowed)
 */
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Authorization check
    if (!isAdmin(req.user) && !project.owner.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this project",
      });
    }

    // Update only provided fields & run schema validators (for enums, etc.)
    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    res
      .status(200)
      .json({ success: true, message: "Project updated", project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project and its associated tasks
 */
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Authorization check
    if (!isAdmin(req.user) && !project.owner.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this project",
      });
    }

    // 1. Delete the project
    await Project.deleteOne({ _id: project._id });

    // 2. Cascade Delete: Cleanup all tasks belonging to this project
    await Task.deleteMany({ project: project._id });

    res
      .status(200)
      .json({ success: true, message: "Project and associated tasks deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error during deletion" });
  }
};
