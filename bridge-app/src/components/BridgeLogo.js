import React from 'react';

function BridgeLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
        {/* Capital B shape */}
        <path 
          d="M0 0 H18 C28 0 32 6 32 11 C32 15 29 18.5 24 19.5 C30 20.5 34 25 34 31 C34 38 28 44 18 44 H0 V0 Z" 
          fill="#fff"
        />
        {/* 4-pointed star cutout */}
        <path 
          d="M16 22 L18.5 16 L21 22 L27 24.5 L21 27 L18.5 33 L16 27 L10 24.5 Z" 
          fill="#1a5f5a"
        />
      </svg>
      <span style={{ 
        fontSize: '20px', 
        fontWeight: '600',
        letterSpacing: '-0.5px'
      }}>Bridge</span>
    </div>
  );
}

export default BridgeLogo;
