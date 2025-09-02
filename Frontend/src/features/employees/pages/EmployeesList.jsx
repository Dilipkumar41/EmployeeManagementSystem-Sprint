import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployees, deleteEmployee } from '../employeesSlice'
import { useNavigate } from 'react-router-dom'

export default function EmployeesList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { list, status, error } = useSelector(s => s.employees || {})
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchEmployees())
  }, [status, dispatch])

  const onDelete = async (id) => {
    if (!confirm('Delete this employee?')) return
    setRemoving(id)
    try {
      await dispatch(deleteEmployee(id)).unwrap()
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2>Employees</h2>
        <button onClick={() => navigate('/employees/new')}>+ New Employee</button>
      </div>

      {status === 'loading' && <div>Loading…</div>}
      {status === 'failed' && <div style={{ color:'crimson' }}>Error: {error}</div>}

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <table width="100%" cellPadding="8" style={{ background:'#fff', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ textAlign:'left', background:'#f0f0f0' }}>
              <th>ID</th><th>Name</th><th>Department</th><th>Job Title</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(list || []).map(e => {
              const id = e.employeeId ?? e.id
              const name = `${e.firstName ?? e.FirstName ?? ''} ${e.lastName ?? e.LastName ?? ''}`.trim()
              const dept = e.department?.departmentName ?? e.Department?.DepartmentName ?? e.departmentName ?? '-'
              const job = e.jobTitle ?? e.JobTitle ?? '-'
              return (
                <tr key={id} style={{ borderTop:'1px solid #eee' }}>
                  <td>{id}</td>
                  <td>{name || '-'}</td>
                  <td>{dept}</td>
                  <td>{job}</td>
                  <td>
                    <button onClick={() => navigate(`/employees/${id}`)}>Edit</button>
                    <button
                      onClick={() => onDelete(id)}
                      disabled={removing === id}
                      style={{ marginLeft: 8, color:'white', background:'crimson' }}
                    >
                      {removing === id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              )
            })}
            {(!list || list.length === 0) && status === 'succeeded' && (
              <tr><td colSpan="5" style={{ padding:16, textAlign:'center' }}>No employees yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
