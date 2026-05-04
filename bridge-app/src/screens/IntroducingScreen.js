import React, { useState, useRef, useEffect } from 'react';
import { SplitLayout } from '../components';
import { theme } from '../theme';

const PRONOUN_OPTIONS = ['She/her', 'He/him', 'They/them', 'Other', 'Prefer not to say'];
const AGE_OPTIONS = Array.from({ length: 83 }, (_, i) => 18 + i); // 18-100

const CITIES = [
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { city: 'Manchester', country: 'United Kingdom', lat: 53.4808, lon: -2.2426 },
  { city: 'Birmingham', country: 'United Kingdom', lat: 52.4862, lon: -1.8904 },
  { city: 'Leeds', country: 'United Kingdom', lat: 53.8008, lon: -1.5491 },
  { city: 'Liverpool', country: 'United Kingdom', lat: 53.4084, lon: -2.9916 },
  { city: 'Bristol', country: 'United Kingdom', lat: 51.4545, lon: -2.5879 },
  { city: 'Edinburgh', country: 'United Kingdom', lat: 55.9533, lon: -3.1883 },
  { city: 'Glasgow', country: 'United Kingdom', lat: 55.8642, lon: -4.2518 },
  { city: 'Cardiff', country: 'United Kingdom', lat: 51.4816, lon: -3.1791 },
  { city: 'Belfast', country: 'United Kingdom', lat: 54.5973, lon: -5.9301 },
  { city: 'Newcastle', country: 'United Kingdom', lat: 54.9783, lon: -1.6178 },
  { city: 'Nottingham', country: 'United Kingdom', lat: 52.9548, lon: -1.1581 },
  { city: 'Sheffield', country: 'United Kingdom', lat: 53.3811, lon: -1.4701 },
  { city: 'Cambridge', country: 'United Kingdom', lat: 52.2053, lon: 0.1218 },
  { city: 'Oxford', country: 'United Kingdom', lat: 51.7520, lon: -1.2577 },
  { city: 'Brighton', country: 'United Kingdom', lat: 50.8225, lon: -0.1372 },
  { city: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  { city: 'Los Angeles', country: 'United States', lat: 34.0522, lon: -118.2437 },
  { city: 'Chicago', country: 'United States', lat: 41.8781, lon: -87.6298 },
  { city: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194 },
  { city: 'Miami', country: 'United States', lat: 25.7617, lon: -80.1918 },
  { city: 'Austin', country: 'United States', lat: 30.2672, lon: -97.7431 },
  { city: 'Seattle', country: 'United States', lat: 47.6062, lon: -122.3321 },
  { city: 'Boston', country: 'United States', lat: 42.3601, lon: -71.0589 },
  { city: 'Washington D.C.', country: 'United States', lat: 38.9072, lon: -77.0369 },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832 },
  { city: 'Vancouver', country: 'Canada', lat: 49.2827, lon: -123.1207 },
  { city: 'Montreal', country: 'Canada', lat: 45.5017, lon: -73.5673 },
  { city: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { city: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050 },
  { city: 'Munich', country: 'Germany', lat: 48.1351, lon: 11.5820 },
  { city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041 },
  { city: 'Barcelona', country: 'Spain', lat: 41.3851, lon: 2.1734 },
  { city: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038 },
  { city: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964 },
  { city: 'Lisbon', country: 'Portugal', lat: 38.7223, lon: -9.1393 },
  { city: 'Dublin', country: 'Ireland', lat: 53.3498, lon: -6.2603 },
  { city: 'Stockholm', country: 'Sweden', lat: 59.3293, lon: 18.0686 },
  { city: 'Copenhagen', country: 'Denmark', lat: 55.6761, lon: 12.5683 },
  { city: 'Zurich', country: 'Switzerland', lat: 47.3769, lon: 8.5417 },
  { city: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738 },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { city: 'Hong Kong', country: 'China', lat: 22.3193, lon: 114.1694 },
  { city: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777 },
  { city: 'Delhi', country: 'India', lat: 28.7041, lon: 77.1025 },
  { city: 'Bangalore', country: 'India', lat: 12.9716, lon: 77.5946 },
  { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { city: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631 },
];

function IntroducingScreen({ data, update }) {
  const fileInputRef = useRef(null);
  const [cityQuery, setCityQuery] = useState(data.location || '');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityWrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityWrapperRef.current && !cityWrapperRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCity = CITIES.find(c => c.city === data.location);
  const filteredCities = cityQuery.length > 0
    ? CITIES.filter(c => c.city.toLowerCase().includes(cityQuery.toLowerCase()))
    : CITIES;

  const handleSelectCity = (item) => {
    update('location', item.city);
    update('country', item.country);
    setCityQuery(item.city);
    setShowCityDropdown(false);
  };

  const mapCenter = selectedCity || CITIES[0]; // default London
  const distance = data.maxDistance || 5;
  const span = Math.max(0.05, distance * 0.015);
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lon - span},${mapCenter.lat - span},${mapCenter.lon + span},${mapCenter.lat + span}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lon}`;

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
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        update('profilePhoto', canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: 'none',
    borderRadius: '14px',
    outline: 'none',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    color: theme.colors.textDark,
    boxSizing: 'border-box',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'><path fill=\'%23999\' d=\'M6 8L0 0h12z\'/></svg>")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    paddingRight: '36px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    color: theme.colors.textMedium,
    marginTop: '6px',
  };

  return (
    <SplitLayout
      currentTab={0}
      leftTitle="Introducing yourself.."
      rightContent={
        <div>
          {/* Optional profile photo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: data.profilePhoto ? 'transparent' : '#fff',
                border: `2px dashed ${data.profilePhoto ? theme.colors.primary : theme.colors.borderLight}`,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative',
              }}
            >
              {data.profilePhoto ? (
                <img src={data.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill={theme.colors.textLight}>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: 'none' }} />
          </div>

          {/* Name row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="First name"
              value={data.firstName}
              onChange={e => update('firstName', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Surname"
              value={data.surname}
              onChange={e => update('surname', e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Profession */}
          <input
            type="text"
            placeholder="Profession"
            value={data.profession}
            onChange={e => update('profession', e.target.value)}
            style={{ ...inputStyle, marginBottom: '20px' }}
          />

          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginBottom: '16px' }} />

          {/* Age + Pronoun row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
            <div style={{ flex: 1 }}>
              <select
                value={data.age || ''}
                onChange={e => update('age', parseInt(e.target.value) || 0)}
                style={selectStyle}
              >
                <option value="">Age</option>
                {AGE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <select
                value={data.gender || ''}
                onChange={e => update('gender', e.target.value)}
                style={selectStyle}
              >
                <option value="">Pronoun</option>
                {PRONOUN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Checkboxes row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <label style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={data.ageCollabOnly || false}
                onChange={e => update('ageCollabOnly', e.target.checked)}
                style={{ marginTop: '2px', accentColor: theme.colors.primary }}
              />
              <span style={labelStyle}>Only bridge within my age group.</span>
            </label>
            <label style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={data.genderCollabOnly || false}
                onChange={e => update('genderCollabOnly', e.target.checked)}
                style={{ marginTop: '2px', accentColor: theme.colors.primary }}
              />
              <span style={labelStyle}>Only bridge with the same pronoun.</span>
            </label>
          </div>

          {/* Location card */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <div ref={cityWrapperRef} style={{ position: 'relative', marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                color: theme.colors.textDark,
                fontWeight: '500',
                marginBottom: '6px',
              }}>Location</label>
              <input
                type="text"
                value={cityQuery}
                onChange={e => { setCityQuery(e.target.value); setShowCityDropdown(true); }}
                onFocus={() => setShowCityDropdown(true)}
                placeholder="Search for your city..."
                style={{
                  width: '100%',
                  padding: '8px 0',
                  fontSize: '15px',
                  border: 'none',
                  borderBottom: `1px solid ${data.location ? theme.colors.primary : '#ddd'}`,
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: theme.colors.textDark,
                }}
              />
              {showCityDropdown && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  maxHeight: '180px', overflowY: 'auto',
                  backgroundColor: '#fff', borderRadius: '10px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  zIndex: 50, marginTop: '4px',
                }}>
                  {filteredCities.slice(0, 15).map((item) => (
                    <button
                      key={`${item.city}-${item.country}`}
                      onClick={() => handleSelectCity(item)}
                      style={{
                        width: '100%', padding: '10px 14px',
                        border: 'none', backgroundColor: 'transparent',
                        cursor: 'pointer', textAlign: 'left',
                        fontSize: '14px', color: theme.colors.textDark,
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <strong>{item.city}</strong>
                      <span style={{ color: theme.colors.textLight }}>, {item.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Distance slider */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: theme.colors.textDark, fontWeight: '500' }}>Location preference</span>
                <span style={{ fontSize: '13px', color: theme.colors.primary, fontWeight: '600' }}>{distance} km</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={distance}
                onChange={e => update('maxDistance', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: theme.colors.primary }}
              />
            </div>

            {/* Map */}
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #eee',
              height: '180px',
              backgroundColor: '#e8eaed',
            }}>
              <iframe
                title="Location preview"
                src={mapSrc}
                style={{ width: '100%', height: '100%', border: 0 }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      }
    />
  );
}

export default IntroducingScreen;
