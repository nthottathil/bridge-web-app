import React from 'react';
import { SplitLayout, SelectionChip, TextInput, NavButton } from '../components';

function NationalityScreen({ data, update, onNext, onBack }) {
  const nationalitiesBase = [
    'United Kingdom', 'United States', 'India', 'China', 'Nigeria',
    'Germany', 'France', 'Brazil', 'Japan', 'Australia', 'Canada',
    'South Korea', 'Mexico', 'Italy', 'Spain'
  ];

  // Sort alphabetically and add 'Other' at the end
  const nationalities = [...nationalitiesBase].sort().concat(['Other']);
  
  const handleSelect = (nat) => {
    if (nat === 'Other') {
      update('nationalityCategory', 'Other');
      if (data.nationalityCategory !== 'Other') {
        update('nationality', '');
      }
    } else {
      update('nationality', nat);
      update('nationalityCategory', nat);
    }
  };
  
  const canProceed = data.nationality && data.nationality.trim().length > 0;
  
  return (
    <SplitLayout
      progress={29}
      leftTitle="Where are you from?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '28px'
          }}>What's your nationality?</h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px'
          }}>
            {nationalities.map(nat => (
              <SelectionChip
                key={nat}
                label={nat}
                selected={(nat === 'Other' ? data.nationalityCategory : data.nationality) === nat}
                onClick={() => handleSelect(nat)}
              />
            ))}
          </div>
          {data.nationalityCategory === 'Other' && (
            <div style={{ marginTop: '20px' }}>
              <TextInput
                label="Please specify your nationality"
                value={data.nationality || ''}
                onChange={v => update('nationality', v)}
                placeholder="e.g., Swedish, Polish, Thai..."
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

export default NationalityScreen;
