import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavItem = ({ to, label, collapsed }) => {
  const { pathname } = useLocation()
  const active = pathname.startsWith(to)
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', margin: '4px 8px', borderRadius: 10,
      background: active ? '#e5e7eb' : 'transparent',
      color: '#111827'
    }}>
      <span>•</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

export default function Sidebar({ collapsed }) {
  return (
    <aside style={{
      background: '#fff',
      borderRight: '1px solid #e5e7eb',
      paddingTop: 8,
      overflow: 'auto'
    }}>
      <NavItem to="/dashboard" label="Dashboard" collapsed={collapsed} />
      <NavItem to="/my-profile" label="My Profile" collapsed={collapsed} /> {/* ✅ fixed */}
      <NavItem to="/employees" label="Employees" collapsed={collapsed} />
      <NavItem to="/departments" label="Departments" collapsed={collapsed} />
      <NavItem to="/my-leaves" label="My Leaves" collapsed={collapsed} />   {/* ✅ fixed */}
      <NavItem to="/approve-leaves" label="Approve Leaves" collapsed={collapsed} />
      <NavItem to="/users" label="Users" collapsed={collapsed} />
      <NavItem to="/roles" label="Roles" collapsed={collapsed} />
    </aside>
  )
}
