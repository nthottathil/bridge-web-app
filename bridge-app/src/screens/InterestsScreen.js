import React, { useState } from 'react';
import { SplitLayout, SelectionChip } from '../components';

const ALL_INTERESTS = [
  'Fitness', 'Tech', 'Startups', 'AI', 'Books', 'Travel',
  'Music', 'Photography', 'Film', 'Art', 'Design', 'Writing',
  'Gaming', 'Cooking', 'Yoga', 'Running', 'Football', 'Tennis',
  'Cycling', 'Hiking', 'Swimming', 'Dance', 'Theatre', 'Fashion',
  'Crypto', 'Marketing', 'Finance', 'Volunteering', 'Languages',
  'Meditation', 'Podcasts', 'Networking', 'Gardening',
];

function InterestsScreen({ data, update, onNext, onBack }) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? ALL_INTERESTS.filter(i => i.toLowerCase().includes(search.toLowerCase()))
    : ALL_INTERESTS;

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
      currentTab={2}
      leftTitle="Your interests"
      subtitle="Select at least 3 interests. These help us find your people."
      rightContent={
        <div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search interests..."
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '25px',
              border: '1.5px solid #ccc',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'transparent',
              marginBottom: '16px',
            }}
          />
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            maxHeight: '320px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}>
            {filtered.map(interest => (
              <SelectionChip
                key={interest}
                label={interest}
                selected={data.interests.includes(interest)}
                onClick={() => toggleInterest(interest)}
              />
            ))}
          </div>
          {data.interests.length > 0 && (
            <p style={{
              fontSize: '13px',
              color: '#555',
              marginTop: '12px',
            }}>
              {data.interests.length} selected
            </p>
          )}
        </div>
      }
    />
  );
}

export default InterestsScreen;
