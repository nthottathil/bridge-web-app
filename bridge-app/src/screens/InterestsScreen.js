import React from 'react';
import { SplitLayout } from '../components';
import { theme } from '../theme';

const ALL_INTERESTS = [
  'Technology', 'Sciences', 'Social', 'Humanity', 'Business', 'Finance',
  'Lifestyle', 'Art', 'Music', 'Gaming', 'Creativity', 'Sport',
  'Fitness', 'Travel', 'Mindset', 'Wellbeing', 'Food & Drink',
];

const MAX_SELECTIONS = 5;

function InterestsScreen({ data, update }) {
  const interests = data.interests || [];

  const toggleInterest = (interest) => {
    const current = [...interests];
    const index = current.indexOf(interest);
    if (index > -1) {
      current.splice(index, 1);
    } else if (current.length < MAX_SELECTIONS) {
      current.push(interest);
    }
    update('interests', current);
  };

  return (
    <SplitLayout
      currentTab={2}
      leftTitle="Interests"
      subtitle={`Rank your top ${MAX_SELECTIONS} interests by clicking them in order [1: most favourite, ${MAX_SELECTIONS}: least favourite]. ${interests.length}/${MAX_SELECTIONS} selected.`}
      rightContent={
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '4px',
        }}>
          {ALL_INTERESTS.map(interest => {
            const rank = interests.indexOf(interest);
            const isSelected = rank > -1;
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '24px',
                  border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.borderLight}`,
                  backgroundColor: '#fff',
                  color: theme.colors.textDark,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isSelected && (
                  <span style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary,
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {rank + 1}
                  </span>
                )}
                {interest}
              </button>
            );
          })}
        </div>
      }
    />
  );
}

export default InterestsScreen;
