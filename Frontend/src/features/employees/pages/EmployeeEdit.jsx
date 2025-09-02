import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import EmployeeForm from '../components/EmployeeForm'
import { createEmployee, fetchEmployeeById, updateEmployee, clearCurrentEmployee } from '../employeesSlice'

export default function EmployeeEdit() {
  const { id } = useParams()
  const isNew = id === 'new'
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current, status, error } = useSelector((s) => s.employees || {})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isNew) {
      dispatch(fetchEmployeeById(id))
    } else {
      dispatch(clearCurrentEmployee())
    }
    return () => {
      dispatch(clearCurrentEmployee())
    }
  }, [id, isNew, dispatch])

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (isNew) {
        await dispatch(createEmployee(payload)).unwrap()
      } else {
        await dispatch(updateEmployee({ id, payload })).unwrap()
      }
      navigate('/employees')
    } catch (e) {
      console.error('Save failed', e)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isNew && status === 'loading') {
    return <div style={{ padding: 24 }}>Loading…</div>
  }
  if (status === 'failed') {
    return <div style={{ padding: 24, color: 'crimson' }}>Error: {error}</div>
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>{isNew ? 'New Employee' : 'Edit Employee'}</h2>
      <EmployeeForm
        initialData={isNew ? null : current}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  )
}
