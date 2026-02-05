import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import AuthLayout from "./Pages/auth/AuthLayout.jsx";
import Login from "./Pages/auth/Login.jsx";
import Register from "./Pages/auth/Register.jsx";
import { getProfile, loginUser, registerUser } from "./services/api.js";
import Dashboard from "./Pages/Dashboard.jsx";

function App() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
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
        await getProfile();
        setAuthState({ loading: false, isAuthenticated: true });
      } catch (error) {
        setAuthState({ loading: false, isAuthenticated: false });
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
      setAuthState({ loading: false, isAuthenticated: true });
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
        path="/dashboard"
        element={
          <ProtectedRoute authState={authState}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

function ProtectedRoute({ children, authState }) {
  if (authState.loading) {
    return <div className="auth-page">Loading...</div>;
  }
  if (!authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}
