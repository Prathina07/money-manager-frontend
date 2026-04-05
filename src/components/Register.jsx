import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {

    if (!username || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "https://money-manager-backend-1-dw8w.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        }
      );

      // ✅ READ RESPONSE PROPERLY
      const text = await response.text();
      console.log("REGISTER RESPONSE:", text);

      if (!response.ok) {
        alert("Error: " + text);   // show backend error
        return;
      }

      alert("User Registered Successfully");
      navigate("/login");

    } catch (error) {
      console.error("FULL ERROR:", error);
      alert("Server error: " + error.message); // show real error
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>📝 Register</h2>

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

        <button onClick={handleSubmit}>Register</button>

        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;