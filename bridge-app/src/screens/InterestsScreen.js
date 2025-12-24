import React from 'react';
import { SplitLayout, SelectionChip, NavButton } from '../components';

function InterestsScreen({ data, update, onNext, onBack }) {
  const interestCategories = {
    'Sports & Fitness': ['Running', 'Yoga', 'Football', 'Tennis', 'Gym', 'Swimming', 'Cycling', 'Hiking', 'Other'],
    'Arts & Culture': ['Music', 'Photography', 'Art', 'Film', 'Theatre', 'Dance', 'Writing', 'Museums', 'Other'],
    'Tech & Gaming': ['Gaming', 'Programming', 'AI/ML', 'Startups', 'Crypto', 'VR/AR', 'Other'],
    'Lifestyle': ['Travel', 'Food', 'Fashion', 'Reading', 'Cooking', 'Gardening', 'Meditation', 'Other'],
    'Social': ['Volunteering', 'Politics', 'Languages', 'Networking', 'Book clubs', 'Other']
  };
  
  const toggleInterest = (interest) => {
    const current = [...data.interests];
    const index = current.indexOf(interest);
    if (index > -1) {
      // Remove if already selected
      current.splice(index, 1);
    } else {
      // Add to the beginning (top priority)
      current.unshift(interest);
    }
    update('interests', current);
  };

  // Helper function to sort interests within a category
  const sortInterestsInCategory = (interests) => {
    const selected = interests.filter(i => data.interests.includes(i));
    const unselected = interests.filter(i => !data.interests.includes(i));

    // Sort selected by their rank (order in data.interests array)
    selected.sort((a, b) => data.interests.indexOf(a) - data.interests.indexOf(b));

    return [...selected, ...unselected];
  };

  return (
    <SplitLayout
      progress={71}
      leftTitle="What makes you tick?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Select your interests</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>Choose at least 3. Click to rank - selected items move to the top.</p>
          <div style={{
            maxHeight: '380px',
            overflowY: 'auto',
            paddingRight: '8px'
          }}>
            {Object.entries(interestCategories).map(([category, interests]) => {
              const sortedInterests = sortInterestsInCategory(interests);
              return (
                <div key={category} style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#888',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px'
                  }}>{category}</h3>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    {sortedInterests.map(interest => (
                      <SelectionChip
                        key={interest}
                        label={interest}
                        selected={data.interests.includes(interest)}
                        onClick={() => toggleInterest(interest)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px'
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} disabled={data.interests.length < 3} />
          </div>
        </div>
      }
    />
  );
}

export default InterestsScreen;
