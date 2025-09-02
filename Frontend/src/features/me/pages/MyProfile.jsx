import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchMyProfile,
  selectMyProfile,
  selectMyProfileError,
  selectMyProfileStatus,
} from '../meSlice'

const Label = ({ children }) => (
  <div style={{ fontSize: 12, color: '#666', marginTop: 12 }}>{children}</div>
)
const Value = ({ children }) => (
  <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{children ?? '-'}</div>
)

const Card = ({ children }) => (
  <div
    style={{
      background: '#fff',
      padding: 20,
      borderRadius: 12,
      boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
      maxWidth: 900,
      margin: '24px auto',
    }}
  >
    {children}
  </div>
)

export default function MyProfile() {
  const dispatch = useDispatch()
  const data = useSelector(selectMyProfile)
  const status = useSelector(selectMyProfileStatus)
  const error = useSelector(selectMyProfileError)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMyProfile())
    }
  }, [status, dispatch])

  if (status === 'loading')
    return (
      <Card>
        <div>Loading your profile…</div>
      </Card>
    )
  if (status === 'failed')
    return (
      <Card>
        <div style={{ color: 'crimson' }}>Error: {error}</div>
      </Card>
    )
  if (!data)
    return (
      <Card>
        <div>No profile data</div>
      </Card>
    )

  // ✅ Read directly from data (top-level fields)
  const email = data?.email || '-'
  const createdAt = data?.createdAt || '-'
  const role = data?.role || '-'

  // Employee details
  const employee = data?.employee
  const firstName = employee?.firstName ?? employee?.FirstName
  const lastName = employee?.lastName ?? employee?.LastName
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || '-'
  const empId = employee?.employeeId ?? employee?.EmployeeId
  const gender = employee?.gender ?? employee?.Gender
  const dob = employee?.dateOfBirth ?? employee?.DateOfBirth
  const jobTitle = employee?.jobTitle ?? employee?.JobTitle
  const hireDate = employee?.hireDate ?? employee?.HireDate
  const departmentName =
    employee?.department?.departmentName ??
    employee?.Department?.DepartmentName ??
    '-'
  const managerName = employee?.manager
    ? [
        employee?.manager?.firstName ?? employee?.manager?.FirstName,
        employee?.manager?.lastName ?? employee?.manager?.LastName,
      ]
        .filter(Boolean)
        .join(' ')
    : '-'

  return (
    <div style={{ padding: 24 }}>
      <h2>My Profile</h2>

      <Card>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 24,
          }}
        >
          <div>
            <Label>Full Name</Label>
            <Value>{fullName}</Value>

            <Label>Email</Label>
            <Value>{email}</Value>

            <Label>Role</Label>
            <Value>{role}</Value>

            <Label>Employee ID</Label>
            <Value>{empId}</Value>

            <Label>Gender</Label>
            <Value>{gender}</Value>
          </div>

          <div>
            <Label>Department</Label>
            <Value>{departmentName}</Value>

            <Label>Job Title</Label>
            <Value>{jobTitle}</Value>

            <Label>Date of Birth</Label>
            <Value>{dob ? new Date(dob).toLocaleDateString() : '-'}</Value>

            <Label>Hire Date</Label>
            <Value>{hireDate ? new Date(hireDate).toLocaleDateString() : '-'}</Value>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <Label>Manager</Label>
          <Value>{managerName}</Value>
        </div>

        <div style={{ marginTop: 24 }}>
          <Label>Account Created</Label>
          <Value>{createdAt}</Value>
        </div>
      </Card>
    </div>
  )
}
