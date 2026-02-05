function Login() {
  return (
    <form className="auth-form">
      <h2>Welcome back</h2>
      <p className="form-subtitle">Sign in to continue.</p>
      <label>
        Email
        <input type="email" placeholder="you@company.com" />
      </label>
      <label>
        Password
        <input type="password" placeholder="••••••••" />
      </label>
      <button className="primary-btn" type="button">
        Login
      </button>
    </form>
  );
}

export default Login;
