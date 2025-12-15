import React from 'react';
import { SplitLayout, SliderInput, NavButton } from '../components';

function PersonalityScreen2({ data, update, onNext, onBack }) {
  const updatePersonality = (trait, value) => {
    update('personality', { ...data.personality, [trait]: value });
  };
  
  const getHint = () => {
    if (data.personality.openness < 33) return "You value stability and proven approaches";
    if (data.personality.openness > 66) return "You love trying new things and exploring ideas";
    return "You appreciate both routine and occasional adventure";
  };
  
  return (
    <SplitLayout
      progress={53}
      leftTitle="How do you approach new experiences?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Openness</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>Do you prefer the familiar or the novel?</p>
          <SliderInput
            label="Where do you fall on the spectrum?"
            value={data.personality.openness}
            onChange={v => updatePersonality('openness', v)}
            leftLabel="Traditional"
            rightLabel="Adventurous"
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

export default PersonalityScreen2;
