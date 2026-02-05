import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
} from "../../services/api.js";
import ProjectForm from "../../Components/ProjectForm.jsx";
import ProjectList from "../../Components/ProjectList.jsx";
import "./Projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (payload) => {
    try {
      setIsSubmitting(true);
      await createProject(payload);
      setStatus({ type: "success", message: "Project created." });
      await loadProjects();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      setStatus({ type: "success", message: "Project deleted." });
      await loadProjects();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="projects-page">
      <header className="projects-header">
        <div>
          <p className="eyebrow">Projects</p>
          <h1>Manage Projects</h1>
        </div>
      </header>

      {status.message ? (
        <div className={`project-alert ${status.type}`}>{status.message}</div>
      ) : null}

      <section className="projects-grid">
        <div className="card">
          <div className="card-header">
            <h2>Create Project</h2>
            <button
              className="primary-btn"
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? "Hide form" : "Create project"}
            </button>
          </div>
          {showForm && (
            <ProjectForm onCreate={handleCreate} isSubmitting={isSubmitting} />
          )}
        </div>
        <div className="card">
          <h2>All Projects</h2>
          <ProjectList projects={projects} onDelete={handleDelete} />
        </div>
      </section>
    </div>
  );
}

export default Projects;
