import React, { useState } from 'react';
import { SplitLayout } from '../components';
import { theme } from '../theme';

const CATEGORIES = [
  { key: 'build', label: 'Build', icon: '🔨', subtitle: 'create something', goals: [
    'Launch a startup',
    'Build a side project',
    'Grow a brand/audience',
    'Launch a social enterprise',
  ]},
  { key: 'climb', label: 'Climb', icon: '🧗', subtitle: 'advance my career', goals: [
    'Get promoted in my current role',
    'Land a senior role',
    'Transition into a new industry',
    'Build my professional network',
    'Strengthen my CV & LinkedIn presence',
  ]},
  { key: 'grow', label: 'Grow', icon: '🌱', subtitle: 'become a better version of myself', goals: [
    'Develop new technical skills',
    'Improve my mindset & habits',
    'Build a portfolio of projects',
    'Learn from mentors',
  ]},
  { key: 'passion', label: 'Passion', icon: '❤️', subtitle: 'find my people', goals: [
    'Find collaborators',
    'Build a community around my craft',
    'Mentor others in my field',
    'Pursue a creative project',
  ]},
];

function CategoryChip({ category, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '14px 18px', borderRadius: '28px',
        backgroundColor: selected ? theme.colors.primary : '#fff',
        color: selected ? '#fff' : theme.colors.textDark,
        border: `1px solid ${selected ? theme.colors.primary : theme.colors.borderLight}`,
        fontSize: '15px', fontWeight: '500', cursor: 'pointer',
        boxShadow: selected ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>{category.icon}</span>
        {category.label}
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </button>
  );
}

function GoalsPrimaryScreen({ data, update }) {
  const matchingCategory = CATEGORIES.find(c => c.goals.includes(data.primaryGoal));
  const [selectedCategory, setSelectedCategory] = useState(matchingCategory || null);

  return (
    <SplitLayout
      currentTab={1}
      leftTitle="Goals"
      subtitle="Select the ONE goal that matters most to you. This will be the foundation of your matches."
      rightContent={
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '20px' }}>
          {!selectedCategory ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {CATEGORIES.map(cat => (
                <div key={cat.key}>
                  <CategoryChip category={cat} onClick={() => setSelectedCategory(cat)} />
                  <p style={{
                    fontSize: '13px', color: theme.colors.textMedium,
                    margin: '6px 0 0', paddingLeft: '18px',
                  }}>{cat.subtitle}</p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  marginBottom: '16px',
                  padding: '8px 16px', borderRadius: '20px',
                  border: `1px solid ${theme.colors.borderLight}`,
                  backgroundColor: '#fff', cursor: 'pointer',
                  fontSize: '14px', color: theme.colors.textDark,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>{selectedCategory.icon}</span>
                {selectedCategory.label}
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedCategory.goals.map(goal => {
                  const isSelected = data.primaryGoal === goal;
                  return (
                    <button
                      key={goal}
                      onClick={() => update('primaryGoal', goal)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        width: '100%', padding: '14px 18px', borderRadius: '28px',
                        backgroundColor: isSelected ? theme.colors.primary : '#fff',
                        color: isSelected ? '#fff' : theme.colors.textDark,
                        border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.borderLight}`,
                        fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span>{selectedCategory.icon}</span>
                      {goal}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}

export default GoalsPrimaryScreen;
