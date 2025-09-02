import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllLeaves } from '../leavesSlice'

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

export default function LeavesList() {
  const dispatch = useDispatch()
  const { all, status, error } = useSelector(s => s.leaves || {})

  useEffect(() => {
    if (status === 'idle') dispatch(fetchAllLeaves())
  }, [status, dispatch])

  return (
    <div style={{ padding:24 }}>
      <h2>All Leave Requests</h2>

      {status === 'loading' && <div>Loading…</div>}
      {status === 'failed' && <div style={{ color:'crimson' }}>Error: {error}</div>}

      <div style={{ marginTop:16, overflowX:'auto' }}>
        <table width="100%" cellPadding="8" style={{ background:'#fff', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f0f0f0', textAlign:'left' }}>
              <th>ID</th><th>Employee</th><th>Dates</th><th>Reason</th><th>Status</th><th>Requested</th>
            </tr>
          </thead>
          <tbody>
            {(all || []).map(l => {
              const id = l.leaveId ?? l.id
              const emp = l.employee || l.Employee
              const name = emp ? `${emp.firstName ?? emp.FirstName ?? ''} ${emp.lastName ?? emp.LastName ?? ''}`.trim() : (l.employeeName || '-')
              const start = l.startDate ?? l.StartDate
              const end = l.endDate ?? l.EndDate
              const reason = l.reason ?? l.Reason
              const status = l.status ?? l.Status
              const reqAt = l.requestedAt ?? l.RequestedAt
              return (
                <tr key={id} style={{ borderTop:'1px solid #eee' }}>
                  <td>{id}</td>
                  <td>{name || '-'}</td>
                  <td>{new Date(start).toLocaleDateString()} – {new Date(end).toLocaleDateString()}</td>
                  <td>{reason || '-'}</td>
                  <td><StatusBadge status={status} /></td>
                  <td>{reqAt ? new Date(reqAt).toLocaleString() : '-'}</td>
                </tr>
              )
            })}
            {(!all || all.length === 0) && status === 'succeeded' && (
              <tr><td colSpan="6" style={{ padding:16, textAlign:'center' }}>No leave requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
