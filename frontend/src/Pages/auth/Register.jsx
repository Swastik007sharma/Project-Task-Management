function Register() {
  return (
    <form className="auth-form">
      <h2>Create an account</h2>
      <p className="form-subtitle">Create your account to get started.</p>
      <label>
        Full name
        <input type="text" placeholder="Alex Morgan" />
      </label>
      <label>
        Email
        <input type="email" placeholder="alex@company.com" />
      </label>
      <label>
        Password
        <input type="password" placeholder="Minimum 8 characters" />
      </label>
      <button className="primary-btn" type="button">
        Create account
      </button>
    </form>
  );
}

export default Register;
