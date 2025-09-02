import React from 'react'

/**
 * props:
 * - columns: [{ key, header, render?(row) }]
 * - data: array
 * - keySelector?(row) default: row.id || row[key]
 */
export default function DataTable({ columns = [], data = [], keySelector }) {
  const getKey = keySelector || ((row, idx) => row.id ?? row.key ?? idx)
  return (
    <div style={{ overflowX: 'auto' }}>
      <table width="100%" cellPadding={8} style={{ background:'#fff', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ background:'#f0f0f0', textAlign:'left' }}>
            {columns.map(col => (<th key={col.key}>{col.header}</th>))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={getKey(row, idx)} style={{ borderTop: '1px solid #eee' }}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row) : (row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={columns.length} style={{ padding: 16, textAlign: 'center' }}>No data.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
