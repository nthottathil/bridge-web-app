import React from 'react';
import { SplitLayout, NavButton } from '../components';

function ConnectionGoalScreen({ data, update, onNext, onBack }) {
  return (
    <SplitLayout
      progress={76}
      leftTitle="What does your ideal connection look like?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Describe your ideal connection</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>This helps us find the right group for you.</p>
          <textarea
            value={data.connectionGoal}
            onChange={e => update('connectionGoal', e.target.value)}
            placeholder="e.g., I'm looking to meet creative people who want to collaborate on side projects and grab a coffee at the weekends..."
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
              minHeight: '140px',
              lineHeight: '1.5'
            }}
            rows={5}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '32px'
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} disabled={data.connectionGoal.length < 20} />
          </div>
        </div>
      }
    />
  );
}

export default ConnectionGoalScreen;
