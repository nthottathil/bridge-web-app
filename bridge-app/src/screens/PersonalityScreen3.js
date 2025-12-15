import React from 'react';
import { SplitLayout, SliderInput, NavButton } from '../components';

function PersonalityScreen3({ data, update, onNext, onBack }) {
  const updatePersonality = (trait, value) => {
    update('personality', { ...data.personality, [trait]: value });
  };
  
  const getHint = () => {
    if (data.personality.agreeableness < 33) return "You're not afraid to push back and debate";
    if (data.personality.agreeableness > 66) return "You prioritise harmony and collaboration";
    return "You balance standing your ground with compromise";
  };
  
  return (
    <SplitLayout
      progress={59}
      leftTitle="How do you work with others?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Agreeableness</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>How do you handle different opinions?</p>
          <SliderInput
            label="Where do you fall on the spectrum?"
            value={data.personality.agreeableness}
            onChange={v => updatePersonality('agreeableness', v)}
            leftLabel="Challenger"
            rightLabel="Harmoniser"
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

export default PersonalityScreen3;
