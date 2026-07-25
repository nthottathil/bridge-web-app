import React, { useEffect } from 'react';
import { SplitLayout } from '../components';
import { theme } from '../theme';

const CATEGORIES = [
  { label: 'Active & Lifestyle', interests: [
    'Sport', 'Outdoor & Adventure', 'Wellbeing', 'Food & Drink', 'Travel', 'Nature & Animals',
  ]},
  { label: 'Knowledge & Ideas', interests: [
    'Technology', 'Business', 'Psychology', 'Science', 'Humanities', 'Law',
    'Politics', 'Social Impact', 'Environment', 'Languages', 'Architecture',
  ]},
  { label: 'Culture & Entertainment', interests: [
    'Music', 'Gaming', 'Media & Pop Culture', 'Film & Video', 'Photography',
    'Art & Design', 'Reading', 'Writing',
  ]},
];

const MAX_SELECTIONS = 5;
const VALID_SET = new Set(CATEGORIES.flatMap(c => c.interests));

function InterestsScreen({ data, update }) {
  const interests = data.interests || [];

  // Drop any stored interests that aren't in the current canonical list
  // (e.g. leftovers from older app versions with different category names).
  useEffect(() => {
    const cleaned = interests.filter(i => VALID_SET.has(i));
    if (cleaned.length !== interests.length) {
      update('interests', cleaned);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      subtitle={`Pick your top ${MAX_SELECTIONS} from any category by clicking them in order [1: most favourite, ${MAX_SELECTIONS}: least favourite]. ${interests.length}/${MAX_SELECTIONS} selected.`}
      rightContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {CATEGORIES.map(category => (
            <div key={category.label}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: theme.colors.textMedium,
                margin: '0 0 10px',
                paddingLeft: '4px',
              }}>{category.label}</h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                padding: '4px',
              }}>
                {category.interests.map(interest => {
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
            </div>
          ))}
        </div>
      }
    />
  );
}

export default InterestsScreen;
