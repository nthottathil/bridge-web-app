import React from 'react';
import { SplitLayout, SelectionChip, NavButton } from '../components';

function GoalsScreen({ data, update, onNext, onBack }) {
  const goals = [
    'Make new friends',
    'Professional networking',
    'Find a study group',
    'Dating',
    'Activity partners',
    'Mentorship',
    'Cultural exchange',
    'Creative collaboration'
  ];
  
  const toggleGoal = (goal) => {
    const current = [...data.goals];
    const index = current.indexOf(goal);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(goal);
    }
    update('goals', current);
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
          }}>Select your goals</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '28px',
            lineHeight: '1.5'
          }}>Choose all that apply. Your first selection will be weighted highest.</p>
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
                selected={data.goals.includes(goal)}
                ranked={data.goals.indexOf(goal) > -1 ? data.goals.indexOf(goal) + 1 : null}
                onClick={() => toggleGoal(goal)}
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
            <NavButton onClick={onNext} disabled={data.goals.length === 0} />
          </div>
        </div>
      }
    />
  );
}

export default GoalsScreen;
