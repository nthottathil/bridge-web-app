import React from 'react';

function SelectionChip({ label, selected, onClick, ranked }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '11px 20px',
        borderRadius: '25px',
        border: `2px solid ${selected ? '#1a5f5a' : '#e0e0e0'}`,
        backgroundColor: selected ? '#1a5f5a' : '#fff',
        color: selected ? '#fff' : '#333',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: selected ? '500' : '400',
        boxShadow: selected ? '0 2px 8px rgba(26, 95, 90, 0.2)' : 'none'
      }}
    >
      {ranked && (
        <span style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.25)',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600'
        }}>{ranked}</span>
      )}
      {label}
    </button>
  );
}

export default SelectionChip;
