// src/App.jsx
import React, { Suspense } from 'react'
import AppRoutes from './routes/AppRoutes'

// Optional: a tiny fallback while routes/pages load
const Fallback = () => (
  <div style={{ padding: 24 }}>Loading…</div>
)

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <AppRoutes />
    </Suspense>
  )
}
