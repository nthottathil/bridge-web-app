import React from 'react';

function BridgeLogo({ size = 'medium' }) {
  const sizes = {
    small: { svg: 28, text: '24px' },
    medium: { svg: 44, text: '40px' },
    large: { svg: 72, text: '64px' },
  };
  const { svg, text } = sizes[size] || sizes.medium;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
      <svg width={svg * 0.85} height={svg} viewBox="0 0 34 44" fill="none">
        <path
          d="M0 0 H18 C28 0 32 6 32 11 C32 15 29 18.5 24 19.5 C30 20.5 34 25 34 31 C34 38 28 44 18 44 H0 V0 Z"
          fill="#fff"
        />
        <path
          d="M14 11 L16 6.5 L18 11 L22.5 13 L18 15 L16 19.5 L14 15 L9.5 13 Z"
          fill="#A8BDD0"
        />
      </svg>
      <span style={{
        fontSize: text,
        fontWeight: '800',
        letterSpacing: '-1.5px',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        marginLeft: '-2px',
      }}>ridge</span>
    </div>
  );
}

export default BridgeLogo;
