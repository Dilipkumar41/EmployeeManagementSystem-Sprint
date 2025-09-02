import React from 'react'

export default function StatusBadge({ status }) {
  const s = (status || 'Pending').toString()
  const bg =
    s === 'Approved' ? '#d1fae5' :
    s === 'Rejected' ? '#fee2e2' : '#e5e7eb'
  const col =
    s === 'Approved' ? '#065f46' :
    s === 'Rejected' ? '#991b1b' : '#374151'
  return <span style={{ background:bg, color:col, padding:'2px 8px', borderRadius:8 }}>{s}</span>
}
