import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createTask,
  deleteTask,
  getTasksByProject,
} from "../../services/api.js";
import TaskForm from "../../Components/TaskForm.jsx";
import TaskList from "../../Components/TaskList.jsx";
import "./Tasks.css";

function ProjectTasks() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTasks = async () => {
    try {
      const data = await getTasksByProject(projectId);
      setTasks(data.tasks || []);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const handleCreate = async (payload) => {
    try {
      setIsSubmitting(true);
      await createTask(projectId, payload);
      setStatus({ type: "success", message: "Task created." });
      await loadTasks();
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
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <div>
          <p className="eyebrow">Tasks</p>
          <h1>Project Tasks</h1>
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
          <h2>Create Task</h2>
          <TaskForm onCreate={handleCreate} isSubmitting={isSubmitting} />
        </div>
        <div className="card">
          <h2>All Tasks</h2>
          <TaskList tasks={tasks} onDelete={handleDelete} />
        </div>
      </section>
    </div>
  );
}

export default ProjectTasks;
