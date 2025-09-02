import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, fetchUsers, updateUserRole } from '../usersSlice'   // ✅ changed updateUser → updateUserRole
import { fetchRoles } from '../../roles/rolesSlice'

export default function UsersList() {
  const dispatch = useDispatch()
  const { list: users, status, error } = useSelector((s) => s.users || {})
  const { list: roles, status: roleStatus } = useSelector((s) => s.roles || {})

  const [editingRole, setEditingRole] = useState({}) // { [userId]: roleId }

  useEffect(() => {
    if (status === 'idle') dispatch(fetchUsers())
    if (roleStatus === 'idle') dispatch(fetchRoles())
  }, [status, roleStatus, dispatch])

  const onRoleChange = (userId, nextRoleId) => {
    setEditingRole((prev) => ({ ...prev, [userId]: nextRoleId }))
  }

  const saveRole = async (user) => {
    const userId = user.userId ?? user.id
    const nextRoleId = Number(editingRole[userId])
    if (!nextRoleId) return
    // ✅ call updateUserRole thunk with id and roleId
    await dispatch(updateUserRole({ id: userId, roleId: nextRoleId })).unwrap()
    setEditingRole((prev) => {
      const copy = { ...prev }
      delete copy[userId]
      return copy
    })
  }

  const removeUser = async (userId) => {
    if (!confirm('Delete this user?')) return
    await dispatch(deleteUser(userId)).unwrap()
  }

  const roleName = (user) =>
    user.role?.roleName ??
    user.Role?.RoleName ??
    user.roleName ??
    '-'

  return (
    <div style={{ padding: 24 }}>
      <h2>Users</h2>

      {status === 'loading' && <div>Loading…</div>}
      {status === 'failed' && <div style={{ color: 'crimson' }}>Error: {error}</div>}

      <div style={{ marginTop: 16, overflowX: 'auto' }}>
        <table
          width="100%"
          cellPadding="8"
          style={{ background: '#fff', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
              <th>UserId</th>
              <th>Email</th>
              <th>Role</th>
              <th>Set Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((u) => {
              const id = u.userId ?? u.id
              const selected = editingRole[id] ?? ''
              return (
                <tr key={id} style={{ borderTop: '1px solid #eee' }}>
                  <td>{id}</td>
                  <td>{u.email ?? u.Email}</td>
                  <td>{roleName(u)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <select
                        value={selected}
                        onChange={(e) => onRoleChange(id, e.target.value)}
                      >
                        <option value="">Select role</option>
                        {(roles || []).map((r) => (
                          <option key={r.roleId ?? r.id} value={r.roleId ?? r.id}>
                            {r.roleName ?? r.name}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => saveRole(u)} disabled={!selected}>
                        Save
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => removeUser(id)}
                      style={{ background: 'crimson', color: '#fff' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
            {(!users || users.length === 0) && status === 'succeeded' && (
              <tr>
                <td colSpan="5" style={{ padding: 16, textAlign: 'center' }}>
                  No users.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
