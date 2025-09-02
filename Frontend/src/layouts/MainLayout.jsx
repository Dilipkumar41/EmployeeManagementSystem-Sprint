import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function MainLayout() {
  const [open, setOpen] = useState(true)

return (
    <div style={{ display: 'grid', gridTemplateRows: '56px 1fr', height: '100vh' }}>
      <Navbar onToggleSidebar={() => setOpen(o => !o)} />
      <div style={{ display: 'grid', gridTemplateColumns: open ? '240px 1fr' : '64px 1fr', height: '100%' }}>
        <Sidebar collapsed={!open} />
        <main style={{ padding: 20, overflow: 'auto', background: '#f7f7fb' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}