import React from 'react';
import { SplitLayout, TextInput, Checkbox, NavButton } from '../components';

function WelcomeScreen({ data, update, onNext }) {
  const canProceed = data.firstName.trim() && data.lastName.trim();
  
  return (
    <SplitLayout
      progress={6}
      leftTitle="It begins with a little something about yourself..."
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '32px'
          }}>What's your name?</h2>
          <TextInput
            label="First name"
            value={data.firstName}
            onChange={v => update('firstName', v)}
          />
          <TextInput
            label="Last name"
            value={data.lastName}
            onChange={v => update('lastName', v)}
          />
          <Checkbox
            label="I have a preferred name"
            checked={data.hasPreferredName}
            onChange={v => update('hasPreferredName', v)}
          />
          {data.hasPreferredName && (
            <div style={{ marginTop: '16px' }}>
              <TextInput
                label="Preferred name"
                value={data.preferredName}
                onChange={v => update('preferredName', v)}
              />
            </div>
          )}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '40px'
          }}>
            <div />
            <NavButton onClick={onNext} disabled={!canProceed} />
          </div>
        </div>
      }
    />
  );
}

export default WelcomeScreen;
