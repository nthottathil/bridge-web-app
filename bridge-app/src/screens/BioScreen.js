import React from 'react';
import { SplitLayout, NavButton } from '../components';

function BioScreen({ data, update, onNext, onBack }) {
  return (
    <SplitLayout
      progress={88}
      leftTitle="Tell your story..."
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Write a short bio</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>Help others get to know you.</p>
          <textarea
            value={data.bio}
            onChange={e => update('bio', e.target.value.slice(0, 300))}
            placeholder="A few sentences about yourself, what you do, and what you're passionate about..."
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              minHeight: '160px',
              lineHeight: '1.5'
            }}
            rows={6}
          />
          <div style={{
            fontSize: '13px',
            color: data.bio.length > 280 ? '#e74c3c' : '#999',
            textAlign: 'right',
            marginTop: '8px'
          }}>{data.bio.length}/300</div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px'
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} disabled={data.bio.length < 20} />
          </div>
        </div>
      }
    />
  );
}

export default BioScreen;
