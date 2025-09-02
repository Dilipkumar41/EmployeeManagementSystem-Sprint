import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from '../features/auth/PrivateRoute'
import RoleGuard from '../features/auth/RoleGuard'
import { ROLES } from '../features/auth/useAuth'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

// Pages
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Unauthorized from '../pages/Unauthorized'
import NotFound from '../pages/NotFound'

// Feature pages
import MyProfile from '../features/me/pages/MyProfile'
import EmployeesList from '../features/employees/pages/EmployeesList'
import EmployeeEdit from '../features/employees/pages/EmployeeEdit'
import DepartmentsList from '../features/departments/pages/DepartmentsList'
import MyLeaves from '../features/leaves/pages/MyLeaves'
import LeavesList from '../features/leaves/pages/LeavesList'
import ApproveLeaves from '../features/leaves/pages/ApproveLeaves'
import UsersList from '../features/users/pages/UsersList'
import RolesList from '../features/roles/pages/RolesList'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth area */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected area */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Profile */}
          <Route path="/my-profile" element={<MyProfile />} /> {/* ✅ renamed for clarity */}

          {/* Employees — HR only */}
          <Route
            path="/employees"
            element={
              <RoleGuard allowedRoles={[ROLES.HR, ROLES.MANAGER]}>
                <EmployeesList />
              </RoleGuard>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <RoleGuard allowedRoles={[ROLES.HR]}>
                <EmployeeEdit />
              </RoleGuard>
            }
          />

          {/* Departments — HR only */}
          <Route
            path="/departments"
            element={
              <RoleGuard allowedRoles={[ROLES.HR, ROLES.MANAGER]}>
                <DepartmentsList />
              </RoleGuard>
            }
          />

          {/* Leaves */}
          <Route path="/my-leaves" element={<MyLeaves />} /> {/* ✅ clearer name */}
          <Route
            path="/leaves/all"
            element={
              <RoleGuard allowedRoles={[ROLES.HR]}>
                <LeavesList />
              </RoleGuard>
            }
          />
          <Route
            path="/approve-leaves"
            element={
              <RoleGuard allowedRoles={[ROLES.HR, ROLES.MANAGER]}>
                <ApproveLeaves />
              </RoleGuard>
            }
          />

          {/* Users & Roles — HR only */}
          <Route
            path="/users"
            element={
              <RoleGuard allowedRoles={[ROLES.HR]}>
                <UsersList />
              </RoleGuard>
            }
          />
          <Route
            path="/roles"
            element={
              <RoleGuard allowedRoles={[ROLES.HR]}>
                <RolesList />
              </RoleGuard>
            }
          />
        </Route>
      </Route>

      {/* Common */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
