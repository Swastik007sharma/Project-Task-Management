function AuthLayout({ mode, onModeChange, children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="brand">TaskForge</span>
          <h1>Task Management</h1>
          <p>Sign in to manage projects and track tasks.</p>
        </div>

        <div className="auth-toggle">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => onModeChange("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => onModeChange("register")}
            type="button"
          >
            Register
          </button>
        </div>

        <div className="auth-body">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
