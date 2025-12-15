import React from 'react';
import { SplitLayout, TextInput, NavButton } from '../components';

function LocationScreen({ data, update, onNext, onBack }) {
  const distances = [5, 10, 25, 50, 100, 'Any'];
  
  return (
    <SplitLayout
      progress={94}
      leftTitle="Where should we find your people?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '28px'
          }}>Your location</h2>
          <TextInput
            label="City or area"
            value={data.location}
            onChange={v => update('location', v)}
            placeholder="e.g., London, UK"
          />
          <div style={{ marginTop: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#555',
              marginBottom: '14px',
              fontWeight: '500'
            }}>Maximum distance to meet people</label>
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              {distances.map(d => (
                <button
                  key={d}
                  onClick={() => update('maxDistance', d)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '24px',
                    border: `2px solid ${data.maxDistance === d ? '#1a5f5a' : '#e0e0e0'}`,
                    backgroundColor: data.maxDistance === d ? '#1a5f5a' : '#fff',
                    color: data.maxDistance === d ? '#fff' : '#333',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: data.maxDistance === d ? '500' : '400'
                  }}
                >
                  {d === 'Any' ? 'Any distance' : `${d} miles`}
                </button>
              ))}
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '48px'
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} disabled={!data.location} label="Find my group →" />
          </div>
        </div>
      }
    />
  );
}

export default LocationScreen;
