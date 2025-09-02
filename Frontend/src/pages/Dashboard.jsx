import React from "react";
import { Link } from "react-router-dom";
import useAuth, { ROLES } from "../features/auth/useAuth";

const Card = ({ title, children, to }) => (
  <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
    <div
      style={{
        background: "#fff",
        padding: 18,
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ color: "#555" }}>{children}</div>
    </div>
  </Link>
);

export default function Dashboard() {
  const { role } = useAuth();

  return (
    <div style={{ padding: 8 }}>
      {/* ✅ Welcome Header */}
      <h2 style={{ marginBottom: 16, fontWeight: 700 }}>
        Welcome, {role || "User"}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <Card title="My Profile" to="/my-profile">
          View your employee info
        </Card>
        <Card title="My Leaves" to="/my-leaves">
          Apply & track leave requests
        </Card>

        {(role === ROLES.MANAGER || role === ROLES.HR) && (
          <>
            <Card title="Approve Leaves" to="/approve-leaves">
              Review and act on leaves
            </Card>
            <Card title="Leaves Reports" to="/leaves/all">
              All leave requests
            </Card>
            <Card title="Employees" to="/employees">
              Manage employees
            </Card>
            <Card title="Departments" to="/departments">
              Manage departments
            </Card>
          </>
        )}

        {role === ROLES.HR && (
          <>
            <Card title="Users" to="/users">
              Manage users & roles
            </Card>
            <Card title="Roles" to="/roles">
              View roles
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
