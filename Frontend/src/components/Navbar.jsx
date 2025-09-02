import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutThunk } from '../features/auth/authSlice'
import toast from 'react-hot-toast'

export default function Navbar({ onToggleSidebar }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const role = useSelector((s) => s.auth?.role) // ✅ get role from auth slice

  const logout = async () => {
    await dispatch(logoutThunk())
    toast.success('Signed out')
    navigate('/login', { replace: true })
  }

  return (
    <header style={{
      height: 56, background: '#111827', color: '#fff',
      display: 'flex', alignItems: 'center', padding: '0 16px',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onToggleSidebar}
          title="Toggle menu"
          style={{
            background: 'transparent', color: '#fff', border: '1px solid #374151',
            borderRadius: 8, padding: '6px 10px', cursor: 'pointer'
          }}
        >
          ☰
        </button>
        <strong>EMS</strong>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/dashboard" style={{ color: '#d1d5db', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/my-profile" style={{ color: '#d1d5db', textDecoration: 'none' }}>My Profile</Link>

        {/* HR-only links */}
        {role === 'HR' && (
          <>
            <Link to="/employees" style={{ color: '#d1d5db', textDecoration: 'none' }}>Employees</Link>
            <Link to="/departments" style={{ color: '#d1d5db', textDecoration: 'none' }}>Departments</Link>
            <Link to="/users" style={{ color: '#d1d5db', textDecoration: 'none' }}>Users</Link>
            <Link to="/roles" style={{ color: '#d1d5db', textDecoration: 'none' }}>Roles</Link>
            <Link to="/leaves/all" style={{ color: '#d1d5db', textDecoration: 'none' }}>All Leaves</Link>
          </>
        )}

        {/* HR & Manager */}
        {(role === 'HR' || role === 'Manager') && (
          <Link to="/approve-leaves" style={{ color: '#d1d5db', textDecoration: 'none' }}>Approve Leaves</Link>
        )}

        {/* Employee */}
        {role === 'Employee' && (
          <Link to="/my-leaves" style={{ color: '#d1d5db', textDecoration: 'none' }}>My Leaves</Link>
        )}

        <button
          onClick={logout}
          style={{
            marginLeft: 8,
            background: 'crimson',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '6px 12px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </nav>
    </header>
  )
}
