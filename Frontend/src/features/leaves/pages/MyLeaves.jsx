// src/features/leaves/pages/MyLeaves.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyLeave, fetchAllLeaves } from '../leavesSlice'
import LeaveForm from '../components/LeaveForm'

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

export default function MyLeaves() {
  const dispatch = useDispatch()
  const { all, status, error, actionStatus } = useSelector((s) => s.leaves || {})
  const me = useSelector((s) => s.me?.data)
  const [submitting, setSubmitting] = useState(false)

  const myEmployeeId = me?.employee?.employeeId ?? me?.Employee?.EmployeeId

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllLeaves())
    }
  }, [status, dispatch])

  const myList = useMemo(() => {
    if (!Array.isArray(all) || !myEmployeeId) return []
    return all.filter((l) => {
      const eid =
        l.employeeId ??
        l.EmployeeId ??
        l.employee?.employeeId ??
        l.Employee?.EmployeeId
      return String(eid) === String(myEmployeeId)
    })
  }, [all, myEmployeeId])

  const onSubmit = async (payload) => {
    const safe = {
      ...payload,
      employeeId: payload.employeeId ? Number(payload.employeeId) : myEmployeeId
    }
    setSubmitting(true)
    try {
      await dispatch(applyLeave(safe)).unwrap()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding:24 }}>
      <h2>My Leaves</h2>

      <div style={{ marginTop:16 }}>
        <LeaveForm onSubmit={onSubmit} submitting={submitting || actionStatus === 'loading'} />
      </div>

      {status === 'loading' && <div>Loading…</div>}
      {status === 'failed' && <div style={{ color:'crimson' }}>Error: {error}</div>}

      <div style={{ marginTop:24, overflowX:'auto' }}>
        <table width="100%" cellPadding="8" style={{ background:'#fff', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f0f0f0' }}>
              <th>ID</th><th>Dates</th><th>Reason</th><th>Status</th><th>Requested</th>
            </tr>
          </thead>
          <tbody>
            {myList.map(l => {
              const id = l.leaveId ?? l.id
              const start = l.startDate ?? l.StartDate
              const end = l.endDate ?? l.EndDate
              const reason = l.reason ?? l.Reason
              const st = l.status ?? l.Status
              const reqAt = l.requestedAt ?? l.RequestedAt
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{new Date(start).toLocaleDateString()} – {new Date(end).toLocaleDateString()}</td>
                  <td>{reason || '-'}</td>
                  <td><StatusBadge status={st} /></td>
                  <td>{reqAt ? new Date(reqAt).toLocaleString() : '-'}</td>
                </tr>
              )
            })}
            {myList.length === 0 && status === 'succeeded' && (
              <tr><td colSpan="5" style={{ textAlign:'center' }}>No leave requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
