import React, { useEffect, useState } from 'react'
import departmentsApi from '../../../api/departmentsApi'
import employeesApi from '../../../api/employeesApi'

const init = {
  userId: '',
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  hireDate: '',
  jobTitle: '',
  departmentId: '',
  managerId: '',
}

export default function EmployeeForm({ initialData = null, onSubmit, submitting }) {
  const [form, setForm] = useState(init)
  const [departments, setDepartments] = useState([])
  const [managers, setManagers] = useState([])

  useEffect(() => {
    if (initialData) {
      setForm({
        userId: initialData.userId ?? initialData.UserId ?? '',
        firstName: initialData.firstName ?? initialData.FirstName ?? '',
        lastName: initialData.lastName ?? initialData.LastName ?? '',
        gender: initialData.gender ?? initialData.Gender ?? '',
        dateOfBirth: (initialData.dateOfBirth ?? initialData.DateOfBirth ?? '')?.substring(0,10) || '',
        hireDate: (initialData.hireDate ?? initialData.HireDate ?? '')?.substring(0,10) || '',
        jobTitle: initialData.jobTitle ?? initialData.JobTitle ?? '',
        departmentId: initialData.departmentId ?? initialData.DepartmentId ?? '',
        managerId: initialData.managerId ?? initialData.ManagerId ?? '',
      })
    } else {
      setForm(init)
    }
  }, [initialData])

  useEffect(() => {
    const load = async () => {
      try {
        const [depRes, empRes] = await Promise.all([
          departmentsApi.getAll(),
          employeesApi.getAll()
        ])
        setDepartments(depRes.data || [])
        setManagers(empRes.data || [])
      } catch {
        console.error('Failed to load dropdown data')
      }
    }
    load()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const submit = (e) => {
    e.preventDefault()
    const payload = {
      userId: form.userId ? Number(form.userId) : null,
      firstName: form.firstName,
      lastName: form.lastName,
      gender: form.gender || null,
      dateOfBirth: form.dateOfBirth || null,
      hireDate: form.hireDate,
      jobTitle: form.jobTitle || null,
      departmentId: form.departmentId ? Number(form.departmentId) : null,
      managerId: form.managerId ? Number(form.managerId) : null,
    }
    onSubmit?.(payload)
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 16 }}>
        <div>
          <label>User Id *</label>
          <input name="userId" value={form.userId} onChange={handleChange} required />
        </div>
        <div>
          <label>Department</label>
          <select name="departmentId" value={form.departmentId} onChange={handleChange}>
            <option value="">— None —</option>
            {departments.map(d => (
              <option key={d.departmentId ?? d.id} value={d.departmentId ?? d.id}>
                {d.departmentName ?? d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>First Name *</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name *</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>

        <div>
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">— Select —</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
        </div>

        <div>
          <label>Hire Date *</label>
          <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Job Title</label>
          <input name="jobTitle" value={form.jobTitle} onChange={handleChange} />
        </div>

        <div>
          <label>Manager</label>
          <select name="managerId" value={form.managerId} onChange={handleChange}>
            <option value="">— None —</option>
            {managers.map(m => (
              <option key={m.employeeId ?? m.id} value={m.employeeId ?? m.id}>
                {(m.firstName ?? m.FirstName) + ' ' + (m.lastName ?? m.LastName)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <button type="submit" disabled={!!submitting}>
          {submitting ? 'Saving…' : 'Save Employee'}
        </button>
      </div>
    </form>
  )
}
