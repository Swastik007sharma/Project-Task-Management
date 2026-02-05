import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Project Overview</h1>
        </div>
        <button className="primary-btn" type="button">
          New Project
        </button>
      </header>

      <section className="dashboard-grid">
        <div className="card">
          <h2>Projects</h2>
          <p className="muted">No projects yet. Create your first project.</p>
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
