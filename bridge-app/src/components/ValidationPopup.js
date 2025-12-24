import React, { useEffect } from 'react';

function ValidationPopup({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (message && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#fff',
      border: '2px solid #fcc',
      borderRadius: '12px',
      padding: '16px 24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      maxWidth: '90%',
      minWidth: '300px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#fee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <span style={{
          color: '#c33',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>!</span>
      </div>
      <div style={{
        flex: 1,
        fontSize: '14px',
        color: '#c33',
        lineHeight: '1.4'
      }}>
        {message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#999',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '0',
          lineHeight: '1',
          flexShrink: 0
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes slideUp {
          from {
            transform: translate(-50%, 100px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default ValidationPopup;