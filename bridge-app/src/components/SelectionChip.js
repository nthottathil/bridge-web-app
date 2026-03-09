import React from 'react';

function SelectionChip({ label, selected, onClick, ranked }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '11px 20px',
        borderRadius: '25px',
        border: `1.5px solid ${selected ? '#2D4F5C' : '#ccc'}`,
        backgroundColor: selected ? '#2D4F5C' : 'transparent',
        color: selected ? '#fff' : '#1a1a1a',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: selected ? '500' : '400',
        transition: 'all 0.2s ease'
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
