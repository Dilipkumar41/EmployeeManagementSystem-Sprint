import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRoles } from '../rolesSlice'

export default function RolesList() {
  const dispatch = useDispatch()
  const { list, status, error } = useSelector(s => s.roles || {})

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRoles())
  }, [status, dispatch])

  return (
    <div style={{ padding:24 }}>
      <h2>Roles</h2>
      {status === 'loading' && <div>Loading…</div>}
      {status === 'failed' && <div style={{ color:'crimson' }}>Error: {error}</div>}

      <div style={{ marginTop: 12, overflowX:'auto' }}>
        <table width="100%" cellPadding="8" style={{ background:'#fff', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ textAlign:'left', background:'#f0f0f0' }}>
              <th>RoleId</th><th>RoleName</th>
            </tr>
          </thead>
          <tbody>
            {(list || []).map(r => (
              <tr key={r.roleId ?? r.id} style={{ borderTop:'1px solid #eee' }}>
                <td>{r.roleId ?? r.id}</td>
                <td>{r.roleName ?? r.name}</td>
              </tr>
            ))}
            {(!list || list.length === 0) && status === 'succeeded' && (
              <tr><td colSpan="2" style={{ padding:16, textAlign:'center' }}>No roles.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
