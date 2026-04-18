import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import api from "../api";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function UserAvatar({ name, isAdmin }) {
  return (
    <div className={`user-avatar ${isAdmin ? "admin-avatar" : ""}`}>
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("");

  const isAdmin = user?.role === "admin";

  // Fetch all users if admin
  useEffect(() => {
    if (isAdmin) {
      setUsersLoading(true);
      api.get("/auth/users")
        .then((res) => setAllUsers(res.data.users))
        .catch((err) => console.error("Failed to fetch users:", err))
        .finally(() => setUsersLoading(false));
    }
  }, [isAdmin]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/auth/users/${id}`);
      setAllUsers((prev) => prev.filter((u) => u._id !== id));
      setDeleteMsg(`User "${name}" deleted.`);
      setTimeout(() => setDeleteMsg(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="brand">
            <div className="brand-icon" style={{ width: 28, height: 28, fontSize: 14 }}>🔐</div>
            <span className="brand-name" style={{ fontSize: 16 }}>AuthSystem</span>
          </div>
          <span className={`role-badge ${isAdmin ? "admin" : "user"}`}>
            {isAdmin ? "⚡ Admin" : "👤 User"}
          </span>
        </div>
        <div className="navbar-right">
          <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{user?.name}</span>
          <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: 13 }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Welcome */}
        <div className="welcome-section">
          <h1 className="welcome-title">
            {isAdmin ? "Admin " : ""}
            <span className="highlight">Dashboard</span>
          </h1>
          <p className="welcome-sub">
            {isAdmin
              ? `Welcome back, ${user?.name}. You have full administrative access.`
              : `Welcome back, ${user?.name}. Here's your profile information.`}
          </p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Logged In As</div>
            <div className="stat-value accent">{user?.name}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Role</div>
            <div className={`stat-value ${isAdmin ? "admin-color" : "accent"}`}>
              {isAdmin ? "Administrator" : "Standard User"}
            </div>
          </div>
          {isAdmin && (
            <div className="stat-card">
              <div className="stat-label">Total Users</div>
              <div className="stat-value success-color">{usersLoading ? "…" : allUsers.length}</div>
            </div>
          )}
          {!isAdmin && (
            <div className="stat-card">
              <div className="stat-label">Member Since</div>
              <div className="stat-value" style={{ fontSize: 16 }}>{formatDate(user?.createdAt)}</div>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">👤</span> Your Profile
            </div>
            <span className={`role-badge ${isAdmin ? "admin" : "user"}`}>{user?.role}</span>
          </div>

          <div className="profile-grid">
            <div className="profile-field">
              <div className="profile-field-label">Full Name</div>
              <div className="profile-field-value">{user?.name}</div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Email</div>
              <div className="profile-field-value">{user?.email}</div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Role</div>
              <div className="profile-field-value" style={{ color: isAdmin ? "var(--admin)" : "var(--accent-bright)" }}>
                {isAdmin ? "⚡ Administrator" : "👤 Standard User"}
              </div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Account ID</div>
              <div className="profile-field-value" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                {user?.id}
              </div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Member Since</div>
              <div className="profile-field-value">{formatDate(user?.createdAt)}</div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Access Level</div>
              <div className="profile-field-value">
                {isAdmin ? "Full System Access" : "Profile View Only"}
              </div>
            </div>
          </div>
        </div>

        {/* Admin: All Users Table */}
        {isAdmin && (
          <div className="section-card">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon">🗂️</span> All Registered Users
              </div>
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {allUsers.length} records
              </span>
            </div>

            {deleteMsg && (
              <div className="alert alert-success" style={{ marginBottom: 16 }}>
                ✅ {deleteMsg}
              </div>
            )}

            {usersLoading ? (
              <div className="loading-state">
                <div className="spinner" />
                Loading users…
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className="user-cell">
                            <UserAvatar name={u.name} isAdmin={u.role === "admin"} />
                            <span style={{ fontWeight: 500 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                          {u.email}
                        </td>
                        <td>
                          <span className={`role-badge ${u.role}`}>{u.role}</span>
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: 13 }}>
                          {formatDate(u.createdAt)}
                        </td>
                        <td>
                          {u._id !== user?.id ? (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(u._id, u.name)}
                            >
                              Delete
                            </button>
                          ) : (
                            <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                              (you)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {allUsers.length === 0 && (
                  <div className="loading-state">No users found.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Regular user: access info */}
        {!isAdmin && (
          <div className="section-card" style={{ borderColor: "var(--border-light)" }}>
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon">🔒</span> Access Permissions
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "✅", text: "View your own profile", allowed: true },
                { icon: "✅", text: "Update your information", allowed: true },
                { icon: "✅", text: "Access protected routes", allowed: true },
                { icon: "🚫", text: "View all users (Admin only)", allowed: false },
                { icon: "🚫", text: "Delete users (Admin only)", allowed: false },
                { icon: "🚫", text: "Admin panel access", allowed: false },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 14,
                  color: item.allowed ? "var(--text)" : "var(--text-muted)",
                }}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
