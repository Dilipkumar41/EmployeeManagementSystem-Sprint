import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Breadcrumbs() {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)

  return (
    <nav style={{ fontSize: 14, marginBottom: 12 }}>
      <Link to="/" style={{ color: '#4f46e5' }}>Home</Link>
      {parts.map((part, i) => {
        const to = '/' + parts.slice(0, i + 1).join('/')
        return (
          <span key={to}>
            <span> / </span>
            <Link to={to} style={{ color: '#4f46e5' }}>{part}</Link>
          </span>
        )
      })}
    </nav>
  )
}
