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
    // Allow typing, only filter non-digits
    const cleanedValue = value.replace(/\D/g, '');
    const numValue = cleanedValue ? parseInt(cleanedValue) : (field === 'min' ? 18 : 99);
    const clampedValue = Math.max(18, Math.min(99, numValue));

    update('agePreference', {
      ...data.agePreference,
      [field]: clampedValue
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

            {/* Text Input Option */}
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: '#888',
                  marginBottom: '8px'
                }}>From</label>
                <input
                  type="text"
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
                  type="text"
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

            {/* Slider Option */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '12px',
                color: '#888'
              }}>
                <span>18</span>
                <span>99+</span>
              </div>
              <div style={{ position: 'relative', height: '40px' }}>
                <input
                  type="range"
                  min="18"
                  max="99"
                  value={data.agePreference?.min || 18}
                  onChange={e => handleAgeRangeChange('min', e.target.value)}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    pointerEvents: 'none',
                    background: `linear-gradient(to right, #e0e0e0 0%, #e0e0e0 ${((data.agePreference?.min - 18) / (99 - 18)) * 100}%, #1a5f5a ${((data.agePreference?.min - 18) / (99 - 18)) * 100}%, #1a5f5a ${((data.agePreference?.max - 18) / (99 - 18)) * 100}%, #e0e0e0 ${((data.agePreference?.max - 18) / (99 - 18)) * 100}%, #e0e0e0 100%)`
                  }}
                />
                <input
                  type="range"
                  min="18"
                  max="99"
                  value={data.agePreference?.min || 18}
                  onChange={e => handleAgeRangeChange('min', e.target.value)}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    appearance: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                />
                <input
                  type="range"
                  min="18"
                  max="99"
                  value={data.agePreference?.max || 99}
                  onChange={e => handleAgeRangeChange('max', e.target.value)}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    appearance: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    outline: 'none'
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