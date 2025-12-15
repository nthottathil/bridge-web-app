import React from 'react';

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      marginTop: '8px'
    }}>
      <div 
        onClick={() => onChange(!checked)}
        style={{
          width: '22px',
          height: '22px',
          border: `2px solid ${checked ? '#1a5f5a' : '#ddd'}`,
          borderRadius: '5px',
          marginRight: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? '#1a5f5a' : '#fff',
          transition: 'all 0.2s'
        }}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        )}
      </div>
      <span style={{ fontSize: '14px', color: '#666' }}>{label}</span>
    </label>
  );
}

export default Checkbox;
