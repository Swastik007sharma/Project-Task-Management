import { useEffect, useState } from "react";
import "./App.css";
import AuthLayout from "./Pages/auth/AuthLayout.jsx";
import Login from "./Pages/auth/Login.jsx";
import Register from "./Pages/auth/Register.jsx";
import { loginUser, registerUser } from "./services/api.js";

function App() {
  const [mode, setMode] = useState("login");
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!status.message) return;
    const timer = setTimeout(() => {
      setStatus({ type: "", message: "" });
    }, 3000);
    return () => clearTimeout(timer);
  }, [status.message]);

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
    <AuthLayout mode={mode} onModeChange={setMode}>
      {status.message ? (
        <div className={`auth-alert ${status.type}`}>{status.message}</div>
      ) : null}
      {mode === "login" ? (
        <Login onLogin={(payload) => handleAuth("login", payload)} />
      ) : (
        <Register onRegister={(payload) => handleAuth("register", payload)} />
      )}
    </AuthLayout>
  );
}

export default App;
