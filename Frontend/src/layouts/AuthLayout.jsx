import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'linear-gradient(135deg, #f7f7fb 0%, #eef2ff 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#fff',
        padding: 24,
        borderRadius: 16,
        boxShadow: '0 20px 70px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Employee Management System</h2>
        <div style={{ color: '#666', marginBottom: 16 }}>Sign in to continue</div>
        <Outlet />
      </div>
    </div>
  )
}
