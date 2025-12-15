import React from 'react';
import { SplitLayout, TextInput, NavButton } from '../components';

function EthnicityScreen({ data, update, onNext, onBack }) {
  const ethnicities = [
    'Asian', 'Black / African', 'Hispanic / Latino', 'Middle Eastern',
    'White / Caucasian', 'Mixed / Multiple', 'Pacific Islander',
    'Indigenous', 'Prefer not to say', 'Other'
  ];
  
  const handleSelect = (eth) => {
    if (eth === 'Other') {
      update('ethnicityCategory', 'Other');
      if (data.ethnicityCategory !== 'Other') {
        update('ethnicity', '');
      }
    } else {
      update('ethnicity', eth);
      update('ethnicityCategory', eth);
    }
  };
  
  const canProceed = data.ethnicity && data.ethnicity.trim().length > 0;
  
  return (
    <SplitLayout
      progress={35}
      leftTitle="A bit more about your background..."
      rightContent={
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '20px',
            flexShrink: 0
          }}>Which ethnicity best describes you?</h2>
          
          <div style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '16px',
            maxHeight: '340px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {ethnicities.map(eth => (
                <button
                  key={eth}
                  onClick={() => handleSelect(eth)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: `2px solid ${(eth === 'Other' ? data.ethnicityCategory : data.ethnicity) === eth ? '#1a5f5a' : '#e0e0e0'}`,
                    backgroundColor: (eth === 'Other' ? data.ethnicityCategory : data.ethnicity) === eth ? '#1a5f5a' : '#fff',
                    color: (eth === 'Other' ? data.ethnicityCategory : data.ethnicity) === eth ? '#fff' : '#333',
                    fontSize: '15px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: (eth === 'Other' ? data.ethnicityCategory : data.ethnicity) === eth ? '500' : '400',
                    flexShrink: 0
                  }}
                >
                  {eth}
                </button>
              ))}
            </div>
          </div>
          
          {data.ethnicityCategory === 'Other' && (
            <div style={{ marginBottom: '16px', flexShrink: 0 }}>
              <TextInput
                label="Please specify"
                value={data.ethnicity || ''}
                onChange={v => update('ethnicity', v)}
                placeholder="How would you describe your ethnicity?"
              />
            </div>
          )}
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            flexShrink: 0
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} disabled={!canProceed} />
          </div>
        </div>
      }
    />
  );
}

export default EthnicityScreen;
