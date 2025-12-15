import React from 'react';
import { SplitLayout, SliderInput, NavButton } from '../components';

function PersonalityScreen1({ data, update, onNext, onBack }) {
  const updatePersonality = (trait, value) => {
    update('personality', { ...data.personality, [trait]: value });
  };
  
  const getHint = () => {
    if (data.personality.extroversion < 33) return "You prefer quiet time and small gatherings";
    if (data.personality.extroversion > 66) return "You thrive in social settings and group activities";
    return "You enjoy a balance of social time and solitude";
  };
  
  return (
    <SplitLayout
      progress={47}
      leftTitle="Let's understand your personality..."
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Social Energy</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>How do you recharge?</p>
          <SliderInput
            label="Where do you fall on the spectrum?"
            value={data.personality.extroversion}
            onChange={v => updatePersonality('extroversion', v)}
            leftLabel="Introvert"
            rightLabel="Extrovert"
          />
          <div style={{
            fontSize: '14px',
            color: '#666',
            fontStyle: 'italic',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            borderLeft: '4px solid #1a5f5a'
          }}>{getHint()}</div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '40px'
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} />
          </div>
        </div>
      }
    />
  );
}

export default PersonalityScreen1;
