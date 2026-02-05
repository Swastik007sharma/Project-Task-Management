import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../services/api.js";
import "./Dashboard.css";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.projects || []);
      } catch (error) {
        setStatus({ type: "error", message: error.message });
      }
    };
    loadProjects();
  }, []);

  const hasProjects = projects.length > 0;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Project Overview</h1>
        </div>
        <Link className="primary-btn" to="/projects">
          View Projects
        </Link>
      </header>

      <section className="dashboard-grid">
        <div className="card">
          <h2>Projects</h2>
          {status.message ? (
            <p className="muted">{status.message}</p>
          ) : hasProjects ? (
            <ul className="project-preview">
              {projects.slice(0, 4).map((project) => (
                <li key={project._id}>
                  <span>{project.title}</span>
                  <span className="muted">{project.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No projects yet. Create your first project.</p>
          )}
        </div>
        <div className="card">
          <h2>Tasks</h2>
          <div className="stats">
            <div>
              <span className="stat-value">0</span>
              <span className="stat-label">Todo</span>
            </div>
            <div>
              <span className="stat-value">0</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div>
              <span className="stat-value">0</span>
              <span className="stat-label">Done</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-list">
        <div className="card">
          <h2>Recent Tasks</h2>
          <p className="muted">Tasks will appear here once you add them.</p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
