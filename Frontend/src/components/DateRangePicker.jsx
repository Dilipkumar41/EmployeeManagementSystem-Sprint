import React from 'react'

export default function DateRangePicker({ start, end, onChange, labels = { start:'Start Date', end:'End Date' } }) {
  const change = (e) => {
    const { name, value } = e.target
    onChange?.({ start, end, [name]: value })
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
      <div>
        <label>{labels.start}</label>
        <input type="date" name="start" value={start || ''} onChange={change} />
      </div>
      <div>
        <label>{labels.end}</label>
        <input type="date" name="end" value={end || ''} onChange={change} />
      </div>
    </div>
  )
}
