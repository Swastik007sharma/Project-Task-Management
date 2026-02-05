import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/api.js";
import "./Profile.css";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setForm({
          name: data.user?.name || "",
          email: data.user?.email || "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        setStatus({ type: "error", message: error.message });
      }
    };
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const nextErrors = {};
      if (!form.name.trim()) nextErrors.name = "Name is required.";
      if (!form.email.trim()) nextErrors.email = "Email is required.";
      if (showPasswordFields) {
        if (!form.password || !form.confirmPassword) {
          nextErrors.password = "Both password fields are required.";
        }
        if (form.password !== form.confirmPassword) {
          nextErrors.confirmPassword = "Passwords do not match.";
        }
        if (form.password && form.password.length < 8) {
          nextErrors.password = "Password must be at least 8 characters.";
        }
      }
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) {
        return;
      }

      if (showPasswordFields) {
        if (!form.password || !form.confirmPassword) {
          setStatus({
            type: "error",
            message: "Both password fields are required.",
          });
          return;
        }
        if (form.password !== form.confirmPassword) {
          setStatus({ type: "error", message: "Passwords do not match." });
          return;
        }
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
      };
      if (showPasswordFields && form.password) payload.password = form.password;
      await updateProfile(payload);
      setStatus({ type: "success", message: "Profile updated." });
      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      setShowPasswordFields(false);
      setErrors({});
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>Account Settings</h1>
        </div>
      </header>

      <section className="profile-layout">
        <div className="profile-card profile-summary">
          <div className="profile-avatar">
            {(form.name || form.email || "U")[0].toUpperCase()}
          </div>
          <div className="profile-meta">
            <h2>{form.name || "Your Name"}</h2>
            <p className="muted">{form.email || "your@email.com"}</p>
          </div>
        </div>

        <div className="profile-card profile-form-card">
          <h2>Profile details</h2>
          <p className="muted profile-helper">
            Update your details. Password changes are optional.
          </p>

          {status.message ? (
            <div className={`profile-alert ${status.type}`}>
              {status.message}
            </div>
          ) : null}

          <form className="profile-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
              {errors.name ? (
                <span className="field-error">{errors.name}</span>
              ) : null}
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              {errors.email ? (
                <span className="field-error">{errors.email}</span>
              ) : null}
            </label>
            <label>
              Password
              <button
                className="ghost-btn profile-toggle"
                type="button"
                onClick={() => {
                  setShowPasswordFields((prev) => !prev);
                  setForm((prev) => ({
                    ...prev,
                    password: "",
                    confirmPassword: "",
                  }));
                }}
              >
                {showPasswordFields
                  ? "Cancel password change"
                  : "Change password"}
              </button>
            </label>
            {showPasswordFields ? (
              <>
                <label>
                  New password
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                  />
                  {errors.password ? (
                    <span className="field-error">{errors.password}</span>
                  ) : null}
                </label>
                <label>
                  Confirm password
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    minLength={8}
                    required
                  />
                  {errors.confirmPassword ? (
                    <span className="field-error">
                      {errors.confirmPassword}
                    </span>
                  ) : null}
                </label>
              </>
            ) : null}
            <button
              className="primary-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Profile;
