import React, { useState } from 'react'

/**
 * Props:
 * - initialData?: { employeeId, startDate, endDate, reason }
 * - onSubmit(payload)
 * - submitting?: boolean
 *
 * Matches ApplyLeaveDto:
 * { employeeId: number, startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', reason: string }
 */
const init = {
  employeeId: '',
  startDate: '',
  endDate: '',
  reason: '',
}

export default function LeaveForm({ initialData = null, onSubmit, submitting }) {
  const [form, setForm] = useState(initialData ? {
    employeeId: initialData.employeeId ?? '',
    startDate: (initialData.startDate ?? '').substring(0,10),
    endDate: (initialData.endDate ?? '').substring(0,10),
    reason: initialData.reason ?? '',
  } : init)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const submit = (e) => {
    e.preventDefault()

    // ✅ Validation: End date must be >= Start date
    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("End Date cannot be before Start Date.")
      return
    }

    const payload = {
      employeeId: form.employeeId ? Number(form.employeeId) : null,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason || null,
    }
    onSubmit?.(payload)
  }

  return (
    <form onSubmit={submit} style={{ display:'grid', gap:16, maxWidth:600 }}>
      <div>
        <label>Employee ID *</label>
        <input
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div>
          <label>Start Date *</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
        </div>
        <div>
          <label>End Date *</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
        </div>
      </div>

      <div>
        <label>Reason</label>
        <textarea name="reason" value={form.reason} onChange={handleChange} rows={4} />
      </div>

      <div>
        <button type="submit" disabled={!!submitting}>
          {submitting ? 'Submitting…' : 'Apply Leave'}
        </button>
      </div>
    </form>
  )
}
