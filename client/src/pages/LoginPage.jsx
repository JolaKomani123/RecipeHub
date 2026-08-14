import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="modal-overlay" onClick={() => navigate("/")}>
      <div className="form-wrap modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h1>Login</h1>
          <Link to="/" className="modal-close" aria-label="Back to home">
            ×
          </Link>
        </div>
        <form className="form" onSubmit={onSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn" type="submit">
            Login
          </button>
        </form>
        <p className="muted">
          No account? <Link to="/register">Register</Link>
          {" · "}
          <Link to="/">Home</Link>
        </p>
      </div>
    </div>
  );
}
