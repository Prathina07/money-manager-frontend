import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleLogin = async () => {
  if (!username || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const response = await fetch(
      "https://money-manager-backend-1-dw8w.onrender.com/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      }
    );

    // ✅ read ONCE
    const text = await response.text();
    console.log("LOGIN RESPONSE:", text);

    if (!response.ok) {
      alert(text);
      return;
    }

    // ✅ parse manually
    const data = JSON.parse(text);

    if (data && data.id) {
  alert("Login Successful");

  setUser(data);
  localStorage.setItem("user", JSON.stringify(data));

  navigate("/dashboard");
}
     else {
      alert("Invalid username or password");
    }

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};
  return (
    <div className="login-container">
      <div className="login-box">

        <h2>🔐 Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;