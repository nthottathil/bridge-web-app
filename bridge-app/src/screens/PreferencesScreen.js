import React from 'react';
import { SplitLayout, SelectionChip, NavButton } from '../components';

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

  const handleAgeRangeChange = (field, value) => {
    const numValue = parseInt(value) || 18;
    update('agePreference', {
      ...data.agePreference,
      [field]: Math.max(18, Math.min(99, numValue))
    });
  };

  const canProceed =
    data.genderPreference?.length > 0 &&
    data.agePreference?.min >= 18 &&
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

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#555',
              marginBottom: '12px',
              fontWeight: '500'
            }}>Age range</label>
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: '#888',
                  marginBottom: '8px'
                }}>From</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  value={data.agePreference?.min || 18}
                  onChange={e => handleAgeRangeChange('min', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <span style={{
                fontSize: '20px',
                color: '#ccc',
                marginTop: '20px'
              }}>—</span>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: '#888',
                  marginBottom: '8px'
                }}>To</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  value={data.agePreference?.max || 99}
                  onChange={e => handleAgeRangeChange('max', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

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