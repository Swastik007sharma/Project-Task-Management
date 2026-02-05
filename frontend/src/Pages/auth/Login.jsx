function Login({ onLogin }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      email: formData.get("email")?.toString().trim(),
      password: formData.get("password")?.toString(),
    };
    await onLogin?.(payload);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Welcome back</h2>
      <p className="form-subtitle">Sign in to continue.</p>
      <label>
        Email
        <input
          name="email"
          type="email"
          placeholder="you@company.com"
          required
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </label>
      <button className="primary-btn" type="submit">
        Login
      </button>
    </form>
  );
}

export default Login;
