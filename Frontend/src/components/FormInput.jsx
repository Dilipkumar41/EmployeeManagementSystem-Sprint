import React from 'react'

export default function FormInput({ label, error, ...props }) {
  return (
    <div>
      {label && <label style={{ display:'block', marginBottom:4 }}>{label}</label>}
      <input {...props} style={{
        width:'100%', padding:'10px 12px', borderRadius:10,
        border: '1px solid #e5e7eb', outline: 'none'
      }} />
      {error && <div style={{ color:'crimson', fontSize:12, marginTop:4 }}>{error}</div>}
    </div>
  )
}
