import React from 'react';

function NavButton({ onClick, direction = 'next', disabled = false, label }) {
  const isNext = direction === 'next';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: label ? '140px' : '50px',
        height: '50px',
        borderRadius: label ? '25px' : '50%',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: isNext ? '#1a5f5a' : '#f0f0f0',
        color: isNext ? '#fff' : '#333',
        opacity: disabled ? 0.4 : 1,
        fontSize: '15px',
        fontWeight: '500',
        padding: label ? '0 24px' : '0',
        boxShadow: isNext && !disabled ? '0 4px 12px rgba(26, 95, 90, 0.25)' : 'none'
      }}
    >
      {label || (isNext ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      ))}
    </button>
  );
}

export default NavButton;
