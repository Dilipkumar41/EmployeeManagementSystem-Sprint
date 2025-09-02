import React from 'react'

export default function ConfirmDialog({ text = 'Are you sure?', onConfirm, onCancel }) {
  return (
    <div style={{
      position:'fixed', inset:0, display:'grid', placeItems:'center',
      background:'rgba(0,0,0,0.3)', zIndex: 50
    }}>
      <div style={{ background:'#fff', padding:20, borderRadius:12, width:'90%', maxWidth:420 }}>
        <div style={{ marginBottom: 16 }}>{text}</div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} style={{ background:'#ef4444', color:'#fff' }}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
