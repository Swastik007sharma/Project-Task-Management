import { useState } from "react";
import "./App.css";
import AuthLayout from "./Pages/auth/AuthLayout.jsx";
import Login from "./Pages/auth/Login.jsx";
import Register from "./Pages/auth/Register.jsx";

function App() {
  const [mode, setMode] = useState("login");

  return (
    <AuthLayout mode={mode} onModeChange={setMode}>
      {mode === "login" ? <Login /> : <Register />}
    </AuthLayout>
  );
}

export default App;
