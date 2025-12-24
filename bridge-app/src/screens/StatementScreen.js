import React from 'react';
import { SplitLayout, NavButton } from '../components';

function StatementScreen({ data, update, onNext, onBack }) {
  const handleChange = (e) => {
    update('statement', e.target.value.slice(0, 500));
  };

  return (
    <SplitLayout
      progress={88}
      leftTitle="Tell us about yourself..."
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>About You</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            Write a short statement about yourself and who you're looking to meet.
            This will be visible on your profile.
          </p>
          <textarea
            value={data.statement || ''}
            onChange={handleChange}
            placeholder="Tell us about yourself - what you do, what you're passionate about, and what kind of connections you're hoping to make on Bridge..."
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
              minHeight: '200px',
              lineHeight: '1.6'
            }}
            rows={8}
          />
          <div style={{
            fontSize: '13px',
            color: data.statement?.length > 480 ? '#e74c3c' : '#999',
            textAlign: 'right',
            marginTop: '8px'
          }}>{data.statement?.length || 0}/500</div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px'
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} disabled={(data.statement?.length || 0) < 30} />
          </div>
        </div>
      }
    />
  );
}

export default StatementScreen;