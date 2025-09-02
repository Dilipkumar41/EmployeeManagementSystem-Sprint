import React from 'react'
import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div>
      <h2>Unauthorized</h2>
      <p>You don’t have permission to view this page.</p>
      <Link to="/dashboard">Back to dashboard</Link>
    </div>
  )
}
