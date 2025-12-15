import React from 'react';

function TextInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      {label && <label style={{
        display: 'block',
        fontSize: '14px',
        color: '#555',
        marginBottom: '10px',
        fontWeight: '500'
      }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 0',
          fontSize: '16px',
          border: 'none',
          borderBottom: '2px solid #e0e0e0',
          outline: 'none',
          transition: 'border-color 0.2s',
          backgroundColor: 'transparent',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}

export default TextInput;
