import React from 'react';

function SliderInput({ label, value, onChange, leftLabel, rightLabel, snapToPoints = true }) {
  const snapPoints = [0, 25, 50, 75, 100];

  const handleChange = (rawValue) => {
    if (!snapToPoints) {
      onChange(rawValue);
      return;
    }

    // Find the closest snap point
    const closest = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - rawValue) < Math.abs(prev - rawValue) ? curr : prev
    );
    onChange(closest);
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      <label style={{
        display: 'block',
        fontSize: '14px',
        color: '#555',
        marginBottom: '20px',
        fontWeight: '500'
      }}>{label}</label>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <span style={{
          fontSize: '13px',
          color: '#888',
          minWidth: '80px',
          textAlign: 'right'
        }}>{leftLabel}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={e => handleChange(parseInt(e.target.value))}
          style={{
            flex: 1,
            height: '6px',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        />
        <span style={{
          fontSize: '13px',
          color: '#888',
          minWidth: '80px'
        }}>{rightLabel}</span>
      </div>
    </div>
  );
}

export default SliderInput;
