import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ LOGIN FUNCTION (FIXED)
  const handleLogin = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      (u) =>
        u.username === username.trim() &&
        u.password === password.trim()
    );

    if (!existingUser) {
      alert("Invalid username or password");
      return false;
    }

    localStorage.setItem("user", JSON.stringify(existingUser));
    setUser(existingUser);

    return true; // ✅ VERY IMPORTANT
  };

  // ✅ REGISTER FUNCTION (FIXED)
  const handleRegister = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find(
      (u) => u.username === username.trim()
    );

    if (userExists) {
      alert("User already exists");
      return false;
    }

    const newUser = {
      username: username.trim(),
      password: password.trim(),
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Please login.");

    return true; // ✅ VERY IMPORTANT
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ Protected Route
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onLogin={handleLogin} />}
      />
      <Route
        path="/register"
        element={<Register onRegister={handleRegister} />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;