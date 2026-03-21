import React, { useState } from 'react';
import { SplitLayout, SelectionChip } from '../components';
import { theme } from '../theme';

const DEFAULT_GOALS = [
  'Land my first role in Tech',
  'Secure an internship in my field',
  'Transition into a new industry',
  'Get promoted within my current role',
  'Build job-ready portfolio projects',
  'Strengthen my CV & LinkedIn presence',
];

function GoalsPrimaryScreen({ data, update, onNext, onBack }) {
  const [customGoals, setCustomGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [showInput, setShowInput] = useState(false);

  const allGoals = [...DEFAULT_GOALS, ...customGoals];

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setCustomGoals(prev => [...prev, newGoal.trim()]);
      update('primaryGoal', newGoal.trim());
      setNewGoal('');
      setShowInput(false);
    }
  };

  return (
    <SplitLayout
      currentTab={1}
      leftTitle="Goals"
      titleExtra={
        <span style={{
          padding: '6px 16px',
          borderRadius: '20px',
          backgroundColor: theme.colors.textDark,
          color: '#fff',
          fontSize: '13px',
          fontWeight: '600',
        }}>Primary</span>
      }
      subtitle="Select the ONE goal that matters most to you. This will be the foundation of your matches."
      rightContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {allGoals.map(goal => (
            <SelectionChip
              key={goal}
              label={goal}
              selected={data.primaryGoal === goal}
              onClick={() => update('primaryGoal', goal)}
            />
          ))}

          {showInput ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={newGoal}
                onChange={e => setNewGoal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddGoal()}
                placeholder="Type your goal..."
                autoFocus
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: '25px',
                  border: '1.5px solid #ccc',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'transparent',
                }}
              />
              <button
                onClick={handleAddGoal}
                style={{
                  padding: '10px 16px',
                  borderRadius: '25px',
                  border: 'none',
                  backgroundColor: '#7499B6',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >Add</button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              style={{
                padding: '11px 20px',
                borderRadius: '25px',
                border: '1.5px dashed #ccc',
                backgroundColor: 'transparent',
                color: '#555',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              + Add new goal
            </button>
          )}
        </div>
      }
    />
  );
}

export default GoalsPrimaryScreen;
