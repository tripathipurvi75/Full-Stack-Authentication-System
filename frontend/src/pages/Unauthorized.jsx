import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="page">
      <div className="card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🚫</div>
        <h1 className="card-title" style={{ fontSize: 22 }}>Access Denied</h1>
        <p className="card-subtitle" style={{ marginBottom: 28 }}>
          You don't have permission to view this page.
          This route requires elevated privileges.
        </p>
        <div style={{
          background: "var(--error-dim)",
          border: "1px solid rgba(240,106,122,0.3)",
          borderRadius: "var(--radius-sm)",
          padding: "12px 16px",
          marginBottom: 28,
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--error)",
          textAlign: "left",
        }}>
          <div>HTTP 403 — Forbidden</div>
          <div style={{ marginTop: 4, opacity: 0.7 }}>Required role: admin</div>
        </div>
        <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: "none" }}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
