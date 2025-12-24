import React from 'react';
import { SplitLayout, SelectionChip, NavButton, RangeSlider } from '../components';

function PreferencesScreen({ data, update, onNext, onBack }) {
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Any', 'Other'];

  const toggleGenderPreference = (gender) => {
    const current = [...(data.genderPreference || [])];
    const index = current.indexOf(gender);

    if (gender === 'Any') {
      update('genderPreference', ['Any']);
    } else {
      const filteredCurrent = current.filter(g => g !== 'Any');
      if (index > -1) {
        filteredCurrent.splice(filteredCurrent.indexOf(gender), 1);
      } else {
        filteredCurrent.push(gender);
      }
      update('genderPreference', filteredCurrent.length > 0 ? filteredCurrent : ['Any']);
    }
  };

  const handleAgeRangeSlider = (min, max) => {
    update('agePreference', {
      min: Math.max(18, min),
      max: max
    });
  };

  const canProceed =
    data.genderPreference?.length > 0 &&
    data.agePreference?.min >= 18 &&
    data.agePreference?.max !== '' &&
    data.agePreference?.max >= data.agePreference?.min;

  return (
    <SplitLayout
      progress={70}
      leftTitle="Who would you like to meet?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Connection Preferences</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '28px',
            lineHeight: '1.5'
          }}>Help us match you with the right people</p>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#555',
              marginBottom: '12px',
              fontWeight: '500'
            }}>Gender preference</label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {genderOptions.map(gender => (
                <SelectionChip
                  key={gender}
                  label={gender}
                  selected={data.genderPreference?.includes(gender)}
                  onClick={() => toggleGenderPreference(gender)}
                />
              ))}
            </div>
          </div>

          <RangeSlider
            label="Age range"
            min={18}
            max={99}
            minValue={data.agePreference?.min || 18}
            maxValue={data.agePreference?.max || 99}
            onChange={handleAgeRangeSlider}
          />

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

export default PreferencesScreen;