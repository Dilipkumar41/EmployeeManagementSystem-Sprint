import React from 'react'

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const go = (p) => onPageChange?.(Math.min(Math.max(1, p), pages))
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12 }}>
      <button onClick={() => go(page - 1)} disabled={page <= 1}>Prev</button>
      <span>Page {page} / {pages}</span>
      <button onClick={() => go(page + 1)} disabled={page >= pages}>Next</button>
    </div>
  )
}
