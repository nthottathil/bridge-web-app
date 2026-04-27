import React from 'react';

function BridgeLogo({ size = 'medium' }) {
  const sizes = {
    small: '32px',
    medium: '56px',
    large: '96px',
  };
  const height = sizes[size] || sizes.medium;

  return (
    <img
      src="/bridge-logo.png"
      alt="Bridge"
      style={{
        height,
        width: 'auto',
        display: 'block',
      }}
    />
  );
}

export default BridgeLogo;
