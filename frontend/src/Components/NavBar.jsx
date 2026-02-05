import "./NavBar.css";

function NavBar({ user, onLogout }) {
  return (
    <nav className="app-nav">
      <div className="nav-brand">TaskForge</div>
      <div className="nav-actions">
        <div className="nav-profile">
          <span className="nav-avatar">
            {(user?.name || user?.email || "U")[0].toUpperCase()}
          </span>
          <div className="nav-meta">
            <span className="nav-name">{user?.name || "Profile"}</span>
            <span className="nav-email">{user?.email || ""}</span>
          </div>
        </div>
        <button className="ghost-btn" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
