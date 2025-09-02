import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllLeaves, updateLeaveStatus } from '../leavesSlice'

const StatusBadge = ({ status }) => {
  const s = (status || 'Pending').toString()
  const bg =
    s === 'Approved' ? '#d1fae5' :
    s === 'Rejected' ? '#fee2e2' : '#e5e7eb'
  const col =
    s === 'Approved' ? '#065f46' :
    s === 'Rejected' ? '#991b1b' : '#374151'
  return <span style={{ background:bg, color:col, padding:'2px 8px', borderRadius:8 }}>{s}</span>
}

export default function ApproveLeaves() {
  const dispatch = useDispatch()
  const { all, status, error, actionStatus } = useSelector(s => s.leaves || {})
  const [working, setWorking] = useState(null)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchAllLeaves())
  }, [status, dispatch])

  const act = async (id, next) => {
    setWorking(id)
    try {
      await dispatch(updateLeaveStatus({ id, status: next })).unwrap()
    } finally {
      setWorking(null)
    }
  }

  return (
    <div style={{ padding:24 }}>
      <h2>Approve / Reject Leaves</h2>

      {status === 'loading' && <div>Loading…</div>}
      {status === 'failed' && <div style={{ color:'crimson' }}>Error: {error}</div>}

      <div style={{ marginTop:16, overflowX:'auto' }}>
        <table width="100%" cellPadding="8" style={{ background:'#fff', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f0f0f0', textAlign:'left' }}>
              <th>ID</th><th>Employee</th><th>Department</th><th>Job Title</th><th>Dates</th><th>Reason</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(all || []).map(l => {
              const id = l.leaveId ?? l.id
              const emp = l.employee || l.Employee
              const name = emp ? `${emp.firstName ?? emp.FirstName ?? ''} ${emp.lastName ?? emp.LastName ?? ''}`.trim() : '-'
              const dept = emp?.department?.departmentName ?? emp?.Department?.DepartmentName ?? '-'
              const job = emp?.jobTitle ?? emp?.JobTitle ?? '-'
              const start = l.startDate ?? l.StartDate
              const end = l.endDate ?? l.EndDate
              const status = l.status ?? l.Status
              const reason = l.reason ?? l.Reason

              return (
                <tr key={id} style={{ borderTop:'1px solid #eee' }}>
                  <td>{id}</td>
                  <td>{name || '-'}</td>
                  <td>{dept}</td>
                  <td>{job}</td>
                  <td>{new Date(start).toLocaleDateString()} – {new Date(end).toLocaleDateString()}</td>
                  <td>{reason || '-'}</td>
                  <td><StatusBadge status={status} /></td>
                  <td>
                    <button
                      onClick={() => act(id, 'Approved')}
                      disabled={working === id || status === 'Approved' || actionStatus === 'loading'}
                    >
                      {working === id ? 'Working…' : 'Approve'}
                    </button>
                    <button
                      onClick={() => act(id, 'Rejected')}
                      disabled={working === id || status === 'Rejected' || actionStatus === 'loading'}
                      style={{ marginLeft:8, background:'crimson', color:'#fff' }}
                    >
                      {working === id ? 'Working…' : 'Reject'}
                    </button>
                  </td>
                </tr>
              )
            })}
            {(!all || all.length === 0) && status === 'succeeded' && (
              <tr><td colSpan="8" style={{ padding:16, textAlign:'center' }}>No leave requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
