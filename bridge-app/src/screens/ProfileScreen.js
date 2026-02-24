import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { SelectionChip, SliderInput, RangeSlider } from '../components';

const goals = [
  'Make new friends', 'Professional networking', 'Find a study group',
  'Support group', 'Dating', 'Activity partners', 'Mentorship',
  'Cultural exchange', 'Creative collaboration', 'Other'
];

const interestCategories = {
  'Sports & Fitness': ['Running', 'Yoga', 'Football', 'Tennis', 'Gym', 'Swimming', 'Cycling', 'Hiking'],
  'Arts & Culture': ['Music', 'Photography', 'Art', 'Film', 'Theatre', 'Dance', 'Writing', 'Museums'],
  'Tech & Gaming': ['Gaming', 'Programming', 'AI/ML', 'Startups', 'Crypto', 'VR/AR'],
  'Lifestyle': ['Travel', 'Food', 'Fashion', 'Reading', 'Cooking', 'Gardening', 'Meditation'],
  'Social': ['Volunteering', 'Politics', 'Languages', 'Networking', 'Book clubs']
};

const genderOptions = ['Male', 'Female', 'Non-binary', 'Any', 'Other'];

function ProfileScreen({ onBack, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      // Convert personality from 1-10 (DB) to 0-100 (slider)
      if (data.personality) {
        data.personality = {
          extroversion: (data.personality.extroversion || 5) * 10,
          openness: (data.personality.openness || 5) * 10,
          agreeableness: (data.personality.agreeableness || 5) * 10,
          conscientiousness: (data.personality.conscientiousness || 5) * 10,
        };
      }
      setProfile(data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updatePersonality = (trait, value) => {
    setProfile(prev => ({
      ...prev,
      personality: { ...prev.personality, [trait]: value }
    }));
  };

  const toggleInterest = (interest) => {
    const current = [...(profile.interests || [])];
    const index = current.indexOf(interest);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(interest);
    }
    updateField('interests', current);
  };

  const toggleGenderPreference = (gender) => {
    const current = [...(profile.gender_preference || [])];
    if (gender === 'Any') {
      updateField('gender_preference', ['Any']);
    } else {
      const filtered = current.filter(g => g !== 'Any');
      const idx = filtered.indexOf(gender);
      if (idx > -1) {
        filtered.splice(idx, 1);
      } else {
        filtered.push(gender);
      }
      updateField('gender_preference', filtered.length > 0 ? filtered : ['Any']);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await authAPI.updateProfile({
        first_name: profile.first_name,
        surname: profile.surname,
        age: profile.age,
        profession: profile.profession,
        primary_goal: profile.primary_goal,
        interests: profile.interests,
        personality: {
          extroversion: Math.round(profile.personality.extroversion / 10),
          openness: Math.round(profile.personality.openness / 10),
          agreeableness: Math.round(profile.personality.agreeableness / 10),
          conscientiousness: Math.round(profile.personality.conscientiousness / 10),
        },
        gender_preference: profile.gender_preference,
        age_preference: profile.age_preference,
        statement: profile.statement,
        location: profile.location,
        max_distance: profile.max_distance,
      });
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '3px solid #e0e0e0', borderTop: '3px solid #1a5f5a',
          borderRadius: '50%', animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <p style={{ color: '#666' }}>Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1a5f5a',
        color: '#fff',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', color: '#fff',
            cursor: 'pointer', fontSize: '20px', padding: '4px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Edit Profile</h2>
        </div>
        <button onClick={onLogout} style={{
          padding: '8px 18px',
          borderRadius: '16px',
          border: '2px solid rgba(255,255,255,0.3)',
          backgroundColor: 'transparent',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          Log Out
        </button>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '24px 20px 100px'
      }}>
        {/* Status messages */}
        {message && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px',
            backgroundColor: '#e8f5e9', color: '#2e7d32',
            marginBottom: '20px', fontSize: '14px', fontWeight: '500'
          }}>{message}</div>
        )}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px',
            backgroundColor: '#fce4ec', color: '#c62828',
            marginBottom: '20px', fontSize: '14px', fontWeight: '500'
          }}>{error}</div>
        )}

        {/* Basic Info */}
        <Section title="Basic Info">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="First Name" value={profile.first_name}
              onChange={v => updateField('first_name', v)} />
            <Field label="Surname" value={profile.surname}
              onChange={v => updateField('surname', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <Field label="Age" type="number" value={profile.age}
              onChange={v => updateField('age', parseInt(v) || 0)} />
            <Field label="Profession" value={profile.profession}
              onChange={v => updateField('profession', v)} />
          </div>
          <div style={{ marginTop: '16px' }}>
            <Field label="Location" value={profile.location}
              onChange={v => updateField('location', v)} />
          </div>
        </Section>

        {/* Primary Goal */}
        <Section title="Primary Goal">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {goals.map(goal => (
              <SelectionChip key={goal} label={goal}
                selected={profile.primary_goal === goal}
                onClick={() => updateField('primary_goal', goal)} />
            ))}
          </div>
        </Section>

        {/* Interests */}
        <Section title="Interests">
          {Object.entries(interestCategories).map(([category, interests]) => (
            <div key={category} style={{ marginBottom: '20px' }}>
              <h4 style={{
                fontSize: '12px', fontWeight: '600', color: '#888',
                marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.8px'
              }}>{category}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {interests.map(interest => (
                  <SelectionChip key={interest} label={interest}
                    selected={profile.interests?.includes(interest)}
                    onClick={() => toggleInterest(interest)} />
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* Personality */}
        <Section title="Personality">
          <SliderInput label="Social Energy"
            value={profile.personality?.extroversion || 50}
            onChange={v => updatePersonality('extroversion', v)}
            leftLabel="Introvert" rightLabel="Extrovert" />
          <SliderInput label="New Experiences"
            value={profile.personality?.openness || 50}
            onChange={v => updatePersonality('openness', v)}
            leftLabel="Routine" rightLabel="Adventure" />
          <SliderInput label="Decision Making"
            value={profile.personality?.agreeableness || 50}
            onChange={v => updatePersonality('agreeableness', v)}
            leftLabel="Logical" rightLabel="Empathetic" />
          <SliderInput label="Organisation"
            value={profile.personality?.conscientiousness || 50}
            onChange={v => updatePersonality('conscientiousness', v)}
            leftLabel="Spontaneous" rightLabel="Planned" />
        </Section>

        {/* Preferences */}
        <Section title="Connection Preferences">
          <label style={{
            display: 'block', fontSize: '14px', color: '#555',
            marginBottom: '12px', fontWeight: '500'
          }}>Gender preference</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
            {genderOptions.map(gender => (
              <SelectionChip key={gender} label={gender}
                selected={profile.gender_preference?.includes(gender)}
                onClick={() => toggleGenderPreference(gender)} />
            ))}
          </div>
          <RangeSlider label="Age range" min={18} max={99}
            minValue={profile.age_preference?.min || 18}
            maxValue={profile.age_preference?.max || 99}
            onChange={(min, max) => updateField('age_preference', { min: Math.max(18, min), max })} />
          <div style={{ marginTop: '24px' }}>
            <label style={{
              display: 'block', fontSize: '14px', color: '#555',
              marginBottom: '8px', fontWeight: '500'
            }}>Max distance (miles)</label>
            <input type="number" value={profile.max_distance || 5}
              onChange={e => updateField('max_distance', parseInt(e.target.value) || 5)}
              style={{
                width: '100px', padding: '10px 14px', fontSize: '15px',
                border: '2px solid #e0e0e0', borderRadius: '10px', outline: 'none'
              }} />
          </div>
        </Section>

        {/* Statement */}
        <Section title="Personal Statement">
          <textarea value={profile.statement || ''}
            onChange={e => updateField('statement', e.target.value)}
            placeholder="Write something about yourself and what you're looking for..."
            rows={4}
            style={{
              width: '100%', padding: '14px', fontSize: '15px', lineHeight: '1.5',
              border: '2px solid #e0e0e0', borderRadius: '12px', outline: 'none',
              resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box'
            }} />
        </Section>

        {/* Save Button */}
        <button onClick={handleSave} disabled={saving}
          style={{
            width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600',
            backgroundColor: saving ? '#ccc' : '#1a5f5a', color: '#fff',
            border: 'none', borderRadius: '12px',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: saving ? 'none' : '0 4px 12px rgba(26, 95, 90, 0.25)',
            marginTop: '8px'
          }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '14px', padding: '20px',
      marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      <h3 style={{
        fontSize: '16px', fontWeight: '600', color: '#1a1a1a',
        marginBottom: '16px', margin: '0 0 16px 0'
      }}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '13px', color: '#555',
        marginBottom: '6px', fontWeight: '500'
      }}>{label}</label>
      <input type={type} value={value || ''}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px', fontSize: '15px',
          border: '2px solid #e0e0e0', borderRadius: '10px',
          outline: 'none', boxSizing: 'border-box'
        }} />
    </div>
  );
}

export default ProfileScreen;
