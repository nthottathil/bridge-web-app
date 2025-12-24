import React from 'react';
import { SplitLayout, SliderInput, NavButton } from '../components';

function PersonalityScreen({ data, update, onNext, onBack }) {
  const updatePersonality = (trait, value) => {
    update('personality', { ...data.personality, [trait]: value });
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
          }}>Your Personality</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>Help us understand you better</p>

          <SliderInput
            label="Social Energy"
            value={data.personality.extroversion}
            onChange={v => updatePersonality('extroversion', v)}
            leftLabel="Introvert"
            rightLabel="Extrovert"
          />

          <SliderInput
            label="New Experiences"
            value={data.personality.openness}
            onChange={v => updatePersonality('openness', v)}
            leftLabel="Routine"
            rightLabel="Adventure"
          />

          <SliderInput
            label="Decision Making"
            value={data.personality.agreeableness}
            onChange={v => updatePersonality('agreeableness', v)}
            leftLabel="Logical"
            rightLabel="Empathetic"
          />

          <SliderInput
            label="Organization"
            value={data.personality.conscientiousness}
            onChange={v => updatePersonality('conscientiousness', v)}
            leftLabel="Spontaneous"
            rightLabel="Planned"
          />

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

export default PersonalityScreen;