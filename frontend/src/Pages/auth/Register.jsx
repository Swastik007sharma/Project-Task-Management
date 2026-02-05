function Register({ onRegister }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      password: formData.get("password")?.toString(),
    };
    await onRegister?.(payload);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create an account</h2>
      <p className="form-subtitle">Create your account to get started.</p>
      <label>
        Full name
        <input name="name" type="text" placeholder="Alex Morgan" required />
      </label>
      <label>
        Email
        <input
          name="email"
          type="email"
          placeholder="alex@company.com"
          required
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          placeholder="Minimum 8 characters"
          minLength={8}
          required
        />
      </label>
      <button className="primary-btn" type="submit">
        Create account
      </button>
    </form>
  );
}

export default Register;
