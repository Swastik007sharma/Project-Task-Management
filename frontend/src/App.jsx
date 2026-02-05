import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import AuthLayout from "./Pages/auth/AuthLayout.jsx";
import Login from "./Pages/auth/Login.jsx";
import Register from "./Pages/auth/Register.jsx";
import {
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "./services/api.js";
import Dashboard from "./Pages/Dashboard.jsx";
import Projects from "./Pages/projects/Projects.jsx";
import NavBar from "./Components/NavBar.jsx";
import Profile from "./Pages/profile/Profile.jsx";
import ProjectTasks from "./Pages/tasks/ProjectTasks.jsx";
import Users from "./Pages/users/Users.jsx";

function App() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    if (!status.message) return;
    const timer = setTimeout(() => {
      setStatus({ type: "", message: "" });
    }, 3000);
    return () => clearTimeout(timer);
  }, [status.message]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const profile = await getProfile();
        setAuthState({
          loading: false,
          isAuthenticated: true,
          user: profile.user || null,
        });
      } catch (error) {
        setAuthState({ loading: false, isAuthenticated: false, user: null });
      }
    };
    checkAuth();
  }, []);

  const handleAuth = async (action, payload) => {
    try {
      setStatus({ type: "loading", message: "Please wait..." });
      const result =
        action === "login"
          ? await loginUser(payload)
          : await registerUser(payload);
      const successMessage =
        action === "login" ? "Login successful." : "Registration successful.";
      setStatus({ type: "success", message: successMessage });
      const profile = await getProfile();
      setAuthState({
        loading: false,
        isAuthenticated: true,
        user: profile.user || null,
      });
      navigate("/dashboard");
      return result;
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong.",
      });
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // even if logout fails, clear local auth state
    }
    setAuthState({ loading: false, isAuthenticated: false, user: null });
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthLayout mode={mode} onModeChange={setMode}>
            {status.message ? (
              <div className={`auth-alert ${status.type}`}>
                {status.message}
              </div>
            ) : null}
            {mode === "login" ? (
              <Login onLogin={(payload) => handleAuth("login", payload)} />
            ) : (
              <Register
                onRegister={(payload) => handleAuth("register", payload)}
              />
            )}
          </AuthLayout>
        }
      />
      <Route
        element={
          <ProtectedLayout authState={authState} onLogout={handleLogout} />
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route
          path="/projects/:projectId/tasks"
          element={<ProjectTasks user={authState.user} />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user" element={<Users />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

function ProtectedLayout({ authState, onLogout }) {
  if (authState.loading) {
    return <div className="auth-page">Loading...</div>;
  }
  if (!authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <NavBar user={authState.user} onLogout={onLogout} />
      <Outlet />
    </>
  );
}
