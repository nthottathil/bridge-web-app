import React from 'react';
import { SplitLayout, TextInput, SelectionChip, NavButton } from '../components';

function ProfessionScreen({ data, update, onNext, onBack }) {
  const commonProfessions = [
    'Software Engineer',
    'Designer',
    'Product Manager',
    'Marketing',
    'Finance',
    'Healthcare',
    'Education',
    'Consulting',
    'Entrepreneur',
    'Student',
    'Creative/Arts',
    'Legal',
    'Sales',
    'Research',
    'Other'
  ];
  
  const handleProfessionSelect = (profession) => {
    if (profession === 'Other') {
      update('professionCategory', 'Other');
    } else {
      update('profession', profession);
      update('professionCategory', profession);
    }
  };
  
  const showCustomInput = data.professionCategory === 'Other';
  const canProceed = data.profession && data.profession.trim().length > 0;
  
  return (
    <SplitLayout
      progress={12}
      leftTitle="What do you do for a living?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>What's your profession?</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '28px',
            lineHeight: '1.5'
          }}>This helps us connect you with like-minded professionals.</p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {commonProfessions.map(profession => (
              <SelectionChip
                key={profession}
                label={profession}
                selected={data.professionCategory === profession}
                onClick={() => handleProfessionSelect(profession)}
              />
            ))}
          </div>
          {showCustomInput && (
            <TextInput
              label="Please specify your profession"
              value={data.profession || ''}
              onChange={v => update('profession', v)}
              placeholder="e.g., Architect, Journalist, Chef..."
            />
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

export default ProfessionScreen;
