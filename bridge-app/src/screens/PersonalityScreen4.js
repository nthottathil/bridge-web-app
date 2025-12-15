import React from 'react';
import { SplitLayout, SliderInput, NavButton } from '../components';

function PersonalityScreen4({ data, update, onNext, onBack }) {
  const updatePersonality = (trait, value) => {
    update('personality', { ...data.personality, [trait]: value });
  };
  
  const getHint = () => {
    if (data.personality.conscientiousness < 33) return "You prefer flexibility and going with the flow";
    if (data.personality.conscientiousness > 66) return "You love planning and staying organised";
    return "You balance structure with spontaneity";
  };
  
  return (
    <SplitLayout
      progress={65}
      leftTitle="How do you approach tasks?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Conscientiousness</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>How do you organise your life?</p>
          <SliderInput
            label="Where do you fall on the spectrum?"
            value={data.personality.conscientiousness}
            onChange={v => updatePersonality('conscientiousness', v)}
            leftLabel="Spontaneous"
            rightLabel="Organised"
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

export default PersonalityScreen4;
