import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="brand">
          <div className="brand-icon">🔐</div>
          <span className="brand-name">AuthSystem</span>
        </div>

        <h1 className="card-title">Welcome back</h1>
        <p className="card-subtitle">Sign in to access your dashboard.</p>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in…</> : "Sign in →"}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: 20,
          padding: "12px 14px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          fontSize: 13,
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)"
        }}>
          <div style={{ marginBottom: 4, color: "var(--text-dim)", fontWeight: 500 }}>Demo credentials</div>
          <div>admin@demo.com / admin123</div>
          <div>user@demo.com / user123</div>
        </div>

        <p className="link-center">
          Don't have an account?{" "}
          <Link to="/register" className="link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
