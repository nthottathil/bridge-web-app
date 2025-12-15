import React from 'react';
import { SplitLayout, TextInput, NavButton } from '../components';

function GenderScreen({ data, update, onNext, onBack }) {
  const genders = ['Woman', 'Man', 'Non-binary', 'Prefer not to say', 'Other'];
  
  const handleSelect = (gender) => {
    if (gender === 'Other') {
      update('genderCategory', 'Other');
      if (data.genderCategory !== 'Other') {
        update('gender', '');
      }
    } else {
      update('gender', gender);
      update('genderCategory', gender);
    }
  };
  
  const canProceed = data.gender && data.gender.trim().length > 0;
  
  return (
    <SplitLayout
      progress={24}
      leftTitle="How do you identify?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '28px'
          }}>What's your gender?</h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {genders.map(gender => (
              <button
                key={gender}
                onClick={() => handleSelect(gender)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${(gender === 'Other' ? data.genderCategory : data.gender) === gender ? '#1a5f5a' : '#e0e0e0'}`,
                  backgroundColor: (gender === 'Other' ? data.genderCategory : data.gender) === gender ? '#1a5f5a' : '#fff',
                  color: (gender === 'Other' ? data.genderCategory : data.gender) === gender ? '#fff' : '#333',
                  fontSize: '15px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: (gender === 'Other' ? data.genderCategory : data.gender) === gender ? '500' : '400'
                }}
              >
                {gender}
              </button>
            ))}
          </div>
          {data.genderCategory === 'Other' && (
            <div style={{ marginTop: '20px' }}>
              <TextInput
                label="Please specify"
                value={data.gender || ''}
                onChange={v => update('gender', v)}
                placeholder="How do you identify?"
              />
            </div>
          )}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '40px'
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} disabled={!canProceed} />
          </div>
        </div>
      }
    />
  );
}

export default GenderScreen;
