import React from 'react';

function FloatingNav({ children, align = 'right' }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: align === 'right' ? '24px' : 'auto',
      left: align === 'left' ? '24px' : 'auto',
      display: 'flex',
      gap: '12px',
      zIndex: 100,
      animation: 'fadeIn 0.3s ease'
    }}>
      {children}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default FloatingNav;