import React, { useState, useRef, useEffect } from 'react';
import { SplitLayout } from '../components';
import { theme } from '../theme';

const CITIES = [
  // United Kingdom
  { city: 'London', country: 'United Kingdom' },
  { city: 'Manchester', country: 'United Kingdom' },
  { city: 'Birmingham', country: 'United Kingdom' },
  { city: 'Leeds', country: 'United Kingdom' },
  { city: 'Liverpool', country: 'United Kingdom' },
  { city: 'Bristol', country: 'United Kingdom' },
  { city: 'Edinburgh', country: 'United Kingdom' },
  { city: 'Glasgow', country: 'United Kingdom' },
  { city: 'Cardiff', country: 'United Kingdom' },
  { city: 'Belfast', country: 'United Kingdom' },
  { city: 'Newcastle', country: 'United Kingdom' },
  { city: 'Nottingham', country: 'United Kingdom' },
  { city: 'Sheffield', country: 'United Kingdom' },
  { city: 'Cambridge', country: 'United Kingdom' },
  { city: 'Oxford', country: 'United Kingdom' },
  { city: 'Brighton', country: 'United Kingdom' },
  // United States
  { city: 'New York', country: 'United States' },
  { city: 'Los Angeles', country: 'United States' },
  { city: 'Chicago', country: 'United States' },
  { city: 'San Francisco', country: 'United States' },
  { city: 'Miami', country: 'United States' },
  { city: 'Austin', country: 'United States' },
  { city: 'Seattle', country: 'United States' },
  { city: 'Boston', country: 'United States' },
  { city: 'Washington D.C.', country: 'United States' },
  { city: 'Denver', country: 'United States' },
  { city: 'Atlanta', country: 'United States' },
  { city: 'Dallas', country: 'United States' },
  { city: 'Houston', country: 'United States' },
  { city: 'Philadelphia', country: 'United States' },
  // Canada
  { city: 'Toronto', country: 'Canada' },
  { city: 'Vancouver', country: 'Canada' },
  { city: 'Montreal', country: 'Canada' },
  // Europe
  { city: 'Paris', country: 'France' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'Munich', country: 'Germany' },
  { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Madrid', country: 'Spain' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Milan', country: 'Italy' },
  { city: 'Lisbon', country: 'Portugal' },
  { city: 'Dublin', country: 'Ireland' },
  { city: 'Stockholm', country: 'Sweden' },
  { city: 'Copenhagen', country: 'Denmark' },
  { city: 'Oslo', country: 'Norway' },
  { city: 'Helsinki', country: 'Finland' },
  { city: 'Zurich', country: 'Switzerland' },
  { city: 'Vienna', country: 'Austria' },
  { city: 'Brussels', country: 'Belgium' },
  { city: 'Prague', country: 'Czech Republic' },
  { city: 'Warsaw', country: 'Poland' },
  { city: 'Budapest', country: 'Hungary' },
  { city: 'Athens', country: 'Greece' },
  // Asia
  { city: 'Singapore', country: 'Singapore' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Seoul', country: 'South Korea' },
  { city: 'Hong Kong', country: 'China' },
  { city: 'Shanghai', country: 'China' },
  { city: 'Beijing', country: 'China' },
  { city: 'Mumbai', country: 'India' },
  { city: 'Delhi', country: 'India' },
  { city: 'Bangalore', country: 'India' },
  { city: 'Bangkok', country: 'Thailand' },
  { city: 'Kuala Lumpur', country: 'Malaysia' },
  { city: 'Jakarta', country: 'Indonesia' },
  // Middle East
  { city: 'Dubai', country: 'United Arab Emirates' },
  { city: 'Abu Dhabi', country: 'United Arab Emirates' },
  { city: 'Tel Aviv', country: 'Israel' },
  { city: 'Riyadh', country: 'Saudi Arabia' },
  // Africa
  { city: 'Lagos', country: 'Nigeria' },
  { city: 'Nairobi', country: 'Kenya' },
  { city: 'Cape Town', country: 'South Africa' },
  { city: 'Johannesburg', country: 'South Africa' },
  { city: 'Cairo', country: 'Egypt' },
  { city: 'Accra', country: 'Ghana' },
  // Australia & NZ
  { city: 'Sydney', country: 'Australia' },
  { city: 'Melbourne', country: 'Australia' },
  { city: 'Brisbane', country: 'Australia' },
  { city: 'Auckland', country: 'New Zealand' },
  // South America
  { city: 'São Paulo', country: 'Brazil' },
  { city: 'Buenos Aires', country: 'Argentina' },
  { city: 'Mexico City', country: 'Mexico' },
  { city: 'Bogotá', country: 'Colombia' },
  { city: 'Lima', country: 'Peru' },
];

function LocationScreen({ data, update }) {
  const [query, setQuery] = useState(
    data.location && data.country
      ? `${data.location}, ${data.country}`
      : data.location || ''
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = query.length > 0
    ? CITIES.filter(c => {
        const text = `${c.city}, ${c.country}`.toLowerCase();
        return text.includes(query.toLowerCase());
      })
    : CITIES;

  const handleSelect = (item) => {
    update('location', item.city);
    update('country', item.country);
    setQuery(`${item.city}, ${item.country}`);
    setShowDropdown(false);
  };

  const handleChange = (v) => {
    setQuery(v);
    setShowDropdown(true);
    // Clear selection if user edits the text
    if (data.location) {
      const current = `${data.location}, ${data.country}`;
      if (v !== current) {
        update('location', '');
        update('country', '');
      }
    }
  };

  return (
    <SplitLayout
      currentTab={0}
      leftTitle="Your location"
      subtitle="Where should we find your people?"
      rightContent={
        <div ref={wrapperRef} style={{ position: 'relative' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            color: theme.colors.textMedium,
            marginBottom: '8px',
            fontWeight: '500',
          }}>City</label>

          <input
            type="text"
            value={query}
            onChange={e => handleChange(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for your city..."
            style={{
              width: '100%',
              padding: '14px 0',
              fontSize: '16px',
              border: 'none',
              borderBottom: `2px solid ${data.location ? theme.colors.primary : '#e0e0e0'}`,
              outline: 'none',
              backgroundColor: 'transparent',
              boxSizing: 'border-box',
              color: theme.colors.textDark,
            }}
          />

          {/* Selected indicator */}
          {data.location && (
            <div style={{
              marginTop: '8px',
              fontSize: '12px',
              color: theme.colors.success,
              fontWeight: '500',
            }}>
              Selected: {data.location}, {data.country}
            </div>
          )}

          {/* Dropdown */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: theme.colors.surfaceWhite,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              zIndex: 50,
              marginTop: '4px',
            }}>
              {filtered.length === 0 ? (
                <div style={{
                  padding: '14px 16px',
                  fontSize: '14px',
                  color: theme.colors.textLight,
                }}>No results found</div>
              ) : (
                filtered.slice(0, 20).map((item, i) => (
                  <button
                    key={`${item.city}-${item.country}`}
                    onClick={() => handleSelect(item)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      borderBottom: i < filtered.length - 1 && i < 19 ? '1px solid #f0f0f0' : 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: theme.colors.textDark,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={theme.colors.textLight} style={{ flexShrink: 0 }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>
                      <strong>{item.city}</strong>
                      <span style={{ color: theme.colors.textLight }}>, {item.country}</span>
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      }
    />
  );
}

export default LocationScreen;
