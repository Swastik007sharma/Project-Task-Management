import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createTask,
  deleteTask,
  getAllUsers,
  getProjectById,
  getProjectTaskStats,
  getTasksByProject,
  updateTask,
} from "../../services/api.js";
import TaskForm from "../../Components/TaskForm.jsx";
import TaskList from "../../Components/TaskList.jsx";
import "./Tasks.css";

function ProjectTasks({ user }) {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const isAdmin = user?.role === "admin";

  const loadProject = async () => {
    try {
      const data = await getProjectById(projectId);
      setProject(data.project || null);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const loadTasks = async () => {
    try {
      const data = await getTasksByProject(projectId);
      setTasks(data.tasks || []);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users || []);
    } catch (error) {
      // If not admin, this may fail; keep list empty.
      setUsers([]);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getProjectTaskStats(projectId);
      setStats(data);
    } catch (error) {
      setStats(null);
    }
  };

  useEffect(() => {
    loadProject();
    loadTasks();
    loadUsers();
    loadStats();
  }, [projectId]);

  const handleCreate = async (payload) => {
    try {
      setIsSubmitting(true);
      await createTask(projectId, payload);
      setStatus({ type: "success", message: "Task created." });
      await loadTasks();
      await loadStats();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingTask) return;
    try {
      setIsSubmitting(true);
      await updateTask(projectId, editingTask._id, payload);
      setStatus({ type: "success", message: "Task updated." });
      await loadTasks();
      await loadStats();
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(projectId, taskId);
      setStatus({ type: "success", message: "Task deleted." });
      await loadTasks();
      await loadStats();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <div>
          <p className="eyebrow">Tasks</p>
          <h1>{project?.title || "Project Tasks"}</h1>
          {project?.description ? (
            <p className="muted">{project.description}</p>
          ) : null}
        </div>
        <Link className="ghost-btn" to="/projects">
          Back to Projects
        </Link>
      </header>

      {status.message ? (
        <div className={`task-alert ${status.type}`}>{status.message}</div>
      ) : null}

      <section className="tasks-grid">
        <div className="card">
          <div className="card-header">
            <h2>Create Task</h2>
            <button
              className="primary-btn"
              type="button"
              onClick={() => {
                if (editingTask) {
                  setEditingTask(null);
                }
                setShowForm((prev) => !prev);
              }}
            >
              {showForm ? "Hide form" : "Create task"}
            </button>
          </div>
          {showForm && !editingTask && (
            <TaskForm
              onCreate={handleCreate}
              isSubmitting={isSubmitting}
              users={users}
              showAssign={false}
            />
          )}
          {showForm && editingTask ? (
            <TaskForm
              onCreate={handleUpdate}
              isSubmitting={isSubmitting}
              users={users}
              initialValues={editingTask}
              submitLabel="Update task"
              showAssign={isAdmin}
            />
          ) : null}
        </div>
        <div className="card">
          <h2>All Tasks</h2>
          <TaskList
            tasks={tasks}
            onDelete={handleDelete}
            onEdit={(task) => {
              setEditingTask(task);
              setShowForm(true);
            }}
          />
        </div>
      </section>

      {stats ? (
        <section className="tasks-stats">
          <div className="card">
            <h2>Task Statistics</h2>
            <div className="stats-grid">
              <div>
                <span className="stat-value">{stats.total ?? 0}</span>
                <span className="stat-label">Total</span>
              </div>
              <div>
                <span className="stat-value">{stats.status?.pending ?? 0}</span>
                <span className="stat-label">Todo</span>
              </div>
              <div>
                <span className="stat-value">
                  {stats.status?.["in progress"] ?? 0}
                </span>
                <span className="stat-label">In Progress</span>
              </div>
              <div>
                <span className="stat-value">{stats.status?.done ?? 0}</span>
                <span className="stat-label">Done</span>
              </div>
              <div>
                <span className="stat-value">{stats.priority?.low ?? 0}</span>
                <span className="stat-label">Low</span>
              </div>
              <div>
                <span className="stat-value">
                  {stats.priority?.medium ?? 0}
                </span>
                <span className="stat-label">Medium</span>
              </div>
              <div>
                <span className="stat-value">{stats.priority?.high ?? 0}</span>
                <span className="stat-label">High</span>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default ProjectTasks;
