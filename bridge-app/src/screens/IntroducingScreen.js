import React, { useRef } from 'react';
import { SplitLayout, TextInput, Checkbox } from '../components';
import { theme } from '../theme';

function IntroducingScreen({ data, update, onNext, onBack }) {
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const fileInputRef = useRef(null);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 300;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Crop to square from center
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        update('profilePhoto', dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <SplitLayout
      currentTab={0}
      leftTitle="Introducing yourself.."
      rightContent={
        <div>
          {/* Profile Photo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: data.profilePhoto ? 'transparent' : theme.colors.surfaceCard,
                border: `2px dashed ${data.profilePhoto ? theme.colors.primary : theme.colors.borderLight}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {data.profilePhoto ? (
                <>
                  <img
                    src={data.profilePhoto}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    color: '#fff',
                    fontSize: '10px',
                    textAlign: 'center',
                    padding: '3px 0',
                  }}>Change</div>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={theme.colors.textLight}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <div style={{ fontSize: '10px', color: theme.colors.textLight, marginTop: '2px' }}>
                    Add photo
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
            />
          </div>

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
