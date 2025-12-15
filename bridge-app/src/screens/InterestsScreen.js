import React from 'react';
import { SplitLayout, SelectionChip, NavButton } from '../components';

function InterestsScreen({ data, update, onNext, onBack }) {
  const interestCategories = {
    'Sports & Fitness': ['Running', 'Yoga', 'Football', 'Tennis', 'Gym', 'Swimming', 'Cycling', 'Hiking'],
    'Arts & Culture': ['Music', 'Photography', 'Art', 'Film', 'Theatre', 'Dance', 'Writing', 'Museums'],
    'Tech & Gaming': ['Gaming', 'Programming', 'AI/ML', 'Startups', 'Crypto', 'VR/AR'],
    'Lifestyle': ['Travel', 'Food', 'Fashion', 'Reading', 'Cooking', 'Gardening', 'Meditation'],
    'Social': ['Volunteering', 'Politics', 'Languages', 'Networking', 'Book clubs']
  };
  
  const toggleInterest = (interest) => {
    const current = [...data.interests];
    const index = current.indexOf(interest);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(interest);
    }
    update('interests', current);
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
          }}>Choose at least 3. Earlier selections are weighted higher.</p>
          <div style={{
            maxHeight: '380px',
            overflowY: 'auto',
            paddingRight: '8px'
          }}>
            {Object.entries(interestCategories).map(([category, interests]) => (
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
                  {interests.map(interest => (
                    <SelectionChip
                      key={interest}
                      label={interest}
                      selected={data.interests.includes(interest)}
                      ranked={data.interests.indexOf(interest) > -1 ? data.interests.indexOf(interest) + 1 : null}
                      onClick={() => toggleInterest(interest)}
                    />
                  ))}
                </div>
              </div>
            ))}
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
