import { Link } from "react-router-dom";

function ProjectList({ projects, onDelete }) {
  if (!projects.length) {
    return <p className="muted">No projects yet.</p>;
  }

  const handleDelete = (project) => {
    const confirmed = window.confirm(
      `Delete project "${project.title}"? This action cannot be undone.`,
    );
    if (confirmed) {
      onDelete?.(project._id);
    }
  };

  return (
    <div className="project-list">
      {projects.map((project) => (
        <div className="project-card" key={project._id}>
          <div>
            <h3>{project.title}</h3>
            <p className="muted">{project.description}</p>
            <Link className="ghost-btn" to={`/projects/${project._id}/tasks`}>
              View tasks
            </Link>
          </div>
          <button
            className="ghost-btn"
            type="button"
            onClick={() => handleDelete(project)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
