import React from 'react';
import { SplitLayout, TextInput, Checkbox, FloatingNav, NavButton } from '../components';

function IntroducingScreen({ data, update, onNext, onBack }) {
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const canProceed = data.firstName && data.surname && data.profession && data.age >= 18;

  return (
    <SplitLayout
      currentTab={0}
      leftTitle="Introducing yourself.."
      rightContent={
        <div>
          <TextInput
            label="First name"
            value={data.firstName}
            onChange={v => update('firstName', v)}
            placeholder=""
          />
          <TextInput
            label="Surname"
            value={data.surname}
            onChange={v => update('surname', v)}
            placeholder=""
          />
          <TextInput
            label="Profession"
            value={data.profession}
            onChange={v => update('profession', v)}
            placeholder=""
          />
          <TextInput
            label="Age"
            value={data.age || ''}
            onChange={v => update('age', parseInt(v) || 0)}
            type="number"
            placeholder=""
          />
          <Checkbox
            label="Only collaborate with people around my age."
            checked={data.ageCollabOnly || false}
            onChange={v => update('ageCollabOnly', v)}
          />

          <div style={{ marginTop: '24px', marginBottom: '8px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#555',
              marginBottom: '10px',
              fontWeight: '500'
            }}>Gender</label>
            <select
              value={data.gender || ''}
              onChange={e => update('gender', e.target.value)}
              style={{
                width: '100%',
                padding: '14px 0',
                fontSize: '16px',
                border: 'none',
                borderBottom: '2px solid #e0e0e0',
                outline: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <option value="">Gender</option>
              {genderOptions.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <div style={{ textAlign: 'right', marginTop: '-20px', pointerEvents: 'none' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>&#9660;</span>
            </div>
          </div>
          <Checkbox
            label="Only collaborate with the same gender."
            checked={data.genderCollabOnly || false}
            onChange={v => update('genderCollabOnly', v)}
          />
        </div>
      }
    />
  );
}

export default IntroducingScreen;
