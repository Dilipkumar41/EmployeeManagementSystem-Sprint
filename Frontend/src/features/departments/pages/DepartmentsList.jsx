import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createDepartment, deleteDepartment, fetchDepartments, updateDepartment } from '../departmentsSlice'

export default function DepartmentsList() {
  const dispatch = useDispatch()
  const { list, status, error } = useSelector(s => s.departments || {})
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    if (status === 'idle') dispatch(fetchDepartments())
  }, [status, dispatch])

  const add = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await dispatch(createDepartment({ departmentName: name.trim() })).unwrap()
    setName('')
  }

  const startEdit = (dep) => {
    setEditing(dep.departmentId ?? dep.id)
    setEditName(dep.departmentName ?? dep.name ?? '')
  }

  const saveEdit = async () => {
    const id = editing
    await dispatch(updateDepartment({ id, payload: { departmentName: editName.trim() } })).unwrap()
    setEditing(null)
    setEditName('')
  }

  const remove = async (id) => {
    if (!confirm('Delete this department?')) return
    await dispatch(deleteDepartment(id)).unwrap()
  }

  return (
    <div style={{ padding:24 }}>
      <h2>Departments</h2>

      <form onSubmit={add} style={{ display:'flex', gap:8, marginTop:12 }}>
        <input
          placeholder="New department name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {status === 'loading' && <div>Loading…</div>}
      {status === 'failed' && <div style={{ color:'crimson' }}>Error: {error}</div>}

      <div style={{ marginTop: 16, background:'#fff' }}>
        <table width="100%" cellPadding="8" style={{ borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f0f0f0', textAlign:'left' }}>
              <th>ID</th><th>Name</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(list || []).map(d => {
              const id = d.departmentId ?? d.id
              const isEditing = editing === id
              return (
                <tr key={id} style={{ borderTop:'1px solid #eee' }}>
                  <td>{id}</td>
                  <td>
                    {isEditing ? (
                      <input value={editName} onChange={e => setEditName(e.target.value)} />
                    ) : (
                      d.departmentName ?? d.name
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <>
                        <button onClick={saveEdit}>Save</button>
                        <button onClick={() => setEditing(null)} style={{ marginLeft:8 }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(d)}>Edit</button>
                        <button onClick={() => remove(id)} style={{ marginLeft:8, color:'white', background:'crimson' }}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
            {(!list || list.length === 0) && status === 'succeeded' && (
              <tr><td colSpan="3" style={{ padding:16, textAlign:'center' }}>No departments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
