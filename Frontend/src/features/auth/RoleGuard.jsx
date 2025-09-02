import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const RoleGuard = ({ allowedRoles = [], children }) => {
  const token = useSelector((s) => s.auth?.token)
  const role = useSelector((s) => s.auth?.role)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default RoleGuard
