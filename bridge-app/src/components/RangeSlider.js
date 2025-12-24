import React, { useRef, useEffect, useState } from 'react';

function RangeSlider({ min, max, minValue, maxValue, onChange, label }) {
  const rangeRef = useRef(null);
  const [dragging, setDragging] = useState(null); // 'min' or 'max'

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  const handleMouseDown = (type) => (e) => {
    e.preventDefault();
    setDragging(type);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging || !rangeRef.current) return;

      const rect = rangeRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      const value = Math.round((percent / 100) * (max - min) + min);

      if (dragging === 'min') {
        const newMin = Math.max(min, Math.min(value, maxValue - 1));
        onChange(newMin, maxValue);
      } else if (dragging === 'max') {
        const newMax = Math.max(minValue + 1, Math.min(value, max));
        onChange(minValue, newMax);
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, min, max, minValue, maxValue, onChange]);

  return (
    <div style={{ marginBottom: '28px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          color: '#555',
          marginBottom: '12px',
          fontWeight: '500'
        }}>{label}</label>
      )}

      <div style={{ padding: '0 12px' }}>
        {/* Value display */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
          fontSize: '15px',
          color: '#1a5f5a',
          fontWeight: '600'
        }}>
          <span>{minValue}</span>
          <span>{maxValue}</span>
        </div>

        {/* Slider track */}
        <div
          ref={rangeRef}
          style={{
            position: 'relative',
            height: '6px',
            backgroundColor: '#e0e0e0',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          {/* Active range */}
          <div style={{
            position: 'absolute',
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
            height: '100%',
            backgroundColor: '#1a5f5a',
            borderRadius: '3px'
          }} />

          {/* Min thumb */}
          <div
            onMouseDown={handleMouseDown('min')}
            style={{
              position: 'absolute',
              left: `${minPercent}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              backgroundColor: '#fff',
              border: '3px solid #1a5f5a',
              borderRadius: '50%',
              cursor: 'grab',
              boxShadow: dragging === 'min' ? '0 0 0 4px rgba(26, 95, 90, 0.1)' : '0 2px 4px rgba(0,0,0,0.1)',
              transition: dragging === 'min' ? 'none' : 'box-shadow 0.2s'
            }}
          />

          {/* Max thumb */}
          <div
            onMouseDown={handleMouseDown('max')}
            style={{
              position: 'absolute',
              left: `${maxPercent}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              backgroundColor: '#fff',
              border: '3px solid #1a5f5a',
              borderRadius: '50%',
              cursor: 'grab',
              boxShadow: dragging === 'max' ? '0 0 0 4px rgba(26, 95, 90, 0.1)' : '0 2px 4px rgba(0,0,0,0.1)',
              transition: dragging === 'max' ? 'none' : 'box-shadow 0.2s'
            }}
          />
        </div>

        {/* Min/Max labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          fontSize: '12px',
          color: '#888'
        }}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}

export default RangeSlider;