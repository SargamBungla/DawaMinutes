import { useState } from "react";
import "./AdminLogin.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ADMIN_LOGIN_EMAIL,
  ADMIN_LOGIN_PASSWORD,
} from "../config/adminCredentials";

export default function AdminLogin() {
  const { adminSession, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(ADMIN_LOGIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_LOGIN_PASSWORD);
  const [error, setError] = useState("");

  if (adminSession) return <Navigate to="/admin" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const ok = loginAdmin(email.trim(), password);
    if (ok) navigate("/admin", { replace: true });
    else setError("Invalid email or password.");
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin Login</h1>
        <p className="admin-login-sub">
          DawaMinute seller portal — staff access only.
        </p>
        <div className="admin-portal-row" style={{ marginBottom: 20 }}>
          <span className="admin-portal-label">Portal</span>
          <div className="admin-portal-buttons">
            <button
              type="button"
              className="admin-portal-btn"
              onClick={() => navigate("/signin")}
            >
              🛒 User
            </button>
            <button
              type="button"
              className="admin-portal-btn"
              onClick={() => navigate("/signin")}
            >
              🏍️ Delivery
            </button>
            <button type="button" className="admin-portal-btn active">
              🛠️ Admin
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <label className="admin-field-label">Email</label>
          <input
            className="admin-input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@dawaminute.com"
            required
          />
          <label className="admin-field-label">Password</label>
          <input
            className="admin-input"
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error ? <p className="admin-login-error">{error}</p> : null}
          <button
            type="submit"
            className="admin-btn-primary admin-login-submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
