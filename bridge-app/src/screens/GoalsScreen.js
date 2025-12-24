import React from 'react';
import { SplitLayout, SelectionChip, NavButton } from '../components';

function GoalsScreen({ data, update, onNext, onBack }) {
  const goals = [
    'Make new friends',
    'Professional networking',
    'Find a study group',
    'Support group',
    'Dating',
    'Activity partners',
    'Mentorship',
    'Cultural exchange',
    'Creative collaboration',
    'Other'
  ];

  const selectGoal = (goal) => {
    update('primaryGoal', goal);
  };
  
  return (
    <SplitLayout
      progress={18}
      leftTitle="What are you looking to get out of Bridge?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>What's your primary goal?</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '28px',
            lineHeight: '1.5'
          }}>Choose the ONE goal that matters most to you. This will be the foundation of your matches.</p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px'
          }}>
            {goals.map(goal => (
              <SelectionChip
                key={goal}
                label={goal}
                selected={data.primaryGoal === goal}
                onClick={() => selectGoal(goal)}
              />
            ))}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '40px'
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} disabled={!data.primaryGoal} />
          </div>
        </div>
      }
    />
  );
}

export default GoalsScreen;
