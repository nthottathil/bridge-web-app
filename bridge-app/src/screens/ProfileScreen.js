import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { theme } from '../theme';
import { SelectionChip, SliderInput, RangeSlider } from '../components';

const INTERESTS = [
  'Fitness', 'Tech', 'Startups', 'AI', 'Books', 'Travel',
  'Music', 'Photography', 'Film', 'Art', 'Design', 'Writing',
  'Gaming', 'Cooking', 'Yoga', 'Running', 'Football', 'Tennis',
  'Cycling', 'Hiking', 'Swimming', 'Dance', 'Fashion',
  'Crypto', 'Marketing', 'Finance', 'Volunteering', 'Languages',
  'Meditation', 'Podcasts', 'Networking',
];

const FOCUS_OPTIONS = [
  'Portfolio builder', 'Career transition', 'Start-up founder',
  'Skills refiner', 'Side hustler', 'Explorer',
];

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
      personality: { ...prev.personality, [trait]: value },
    }));
  };

  const toggleInterest = (interest) => {
    const current = [...(profile.interests || [])];
    const index = current.indexOf(interest);
    if (index > -1) current.splice(index, 1);
    else current.push(interest);
    updateField('interests', current);
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
        gender: profile.gender,
        focus: profile.focus,
        headline: profile.headline,
        commitment_level: profile.commitment_level,
        deal_breakers: profile.deal_breakers,
        country: profile.country,
      });
      setMessage('Profile saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: `3px solid ${theme.colors.borderLight}`,
          borderTop: `3px solid ${theme.colors.primary}`,
          borderRadius: '50%', animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      }}>
        <p style={{ color: theme.colors.textMedium }}>Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: theme.colors.primary,
        color: '#fff',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', color: '#fff',
            cursor: 'pointer', padding: '4px',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          <h2 style={{ fontSize: '17px', fontWeight: '600', margin: 0 }}>Edit Profile</h2>
        </div>
        <button onClick={onLogout} style={{
          padding: '6px 16px', borderRadius: '14px',
          border: '1.5px solid rgba(255,255,255,0.3)',
          backgroundColor: 'transparent', color: '#fff',
          cursor: 'pointer', fontSize: '12px', fontWeight: '500',
        }}>Log Out</button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '430px', margin: '0 auto', padding: '16px 16px 100px' }}>
        {message && (
          <div style={{
            padding: '12px', borderRadius: '10px',
            backgroundColor: theme.colors.successBg, color: theme.colors.success,
            marginBottom: '16px', fontSize: '14px', fontWeight: '500',
          }}>{message}</div>
        )}
        {error && (
          <div style={{
            padding: '12px', borderRadius: '10px',
            backgroundColor: theme.colors.errorBg, color: theme.colors.error,
            marginBottom: '16px', fontSize: '14px', fontWeight: '500',
          }}>{error}</div>
        )}

        {/* Basic Info */}
        <Section title="Basic Info">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="First Name" value={profile.first_name} onChange={v => updateField('first_name', v)} />
            <Field label="Surname" value={profile.surname} onChange={v => updateField('surname', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <Field label="Age" type="number" value={profile.age} onChange={v => updateField('age', parseInt(v) || 0)} />
            <Field label="Profession" value={profile.profession} onChange={v => updateField('profession', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <Field label="City" value={profile.location} onChange={v => updateField('location', v)} />
            <Field label="Country" value={profile.country} onChange={v => updateField('country', v)} />
          </div>
        </Section>

        {/* Focus */}
        <Section title="Focus">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {FOCUS_OPTIONS.map(f => (
              <SelectionChip key={f} label={f}
                selected={profile.focus === f}
                onClick={() => updateField('focus', f)} />
            ))}
          </div>
        </Section>

        {/* Headline */}
        <Section title="Headline">
          <textarea value={profile.headline || profile.statement || ''}
            onChange={e => {
              updateField('headline', e.target.value);
              updateField('statement', e.target.value);
            }}
            placeholder="Where you're headed + what you're building"
            rows={3}
            style={{
              width: '100%', padding: '12px', fontSize: '14px', lineHeight: '1.5',
              border: '1.5px solid #e0e0e0', borderRadius: '12px', outline: 'none',
              resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
              backgroundColor: 'transparent',
            }} />
        </Section>

        {/* Interests */}
        <Section title="Interests">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {INTERESTS.map(interest => (
              <SelectionChip key={interest} label={interest}
                selected={profile.interests?.includes(interest)}
                onClick={() => toggleInterest(interest)} />
            ))}
          </div>
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
        <Section title="Preferences">
          <RangeSlider label="Age range" min={18} max={99}
            minValue={profile.age_preference?.min || 18}
            maxValue={profile.age_preference?.max || 99}
            onChange={(min, max) => updateField('age_preference', { min: Math.max(18, min), max })} />
        </Section>

        {/* Save */}
        <button onClick={handleSave} disabled={saving}
          style={{
            width: '100%', padding: '14px', fontSize: '15px', fontWeight: '600',
            backgroundColor: saving ? '#ccc' : theme.colors.primary, color: '#fff',
            border: 'none', borderRadius: '25px',
            cursor: saving ? 'not-allowed' : 'pointer',
            marginTop: '8px',
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
      backgroundColor: theme.colors.surfaceCard,
      borderRadius: '16px', padding: '18px',
      marginBottom: '14px', backdropFilter: 'blur(10px)',
    }}>
      <h3 style={{
        fontSize: '15px', fontWeight: '600', color: theme.colors.textDark,
        margin: '0 0 14px',
      }}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '12px', color: theme.colors.textMedium,
        marginBottom: '4px', fontWeight: '500',
      }}>{label}</label>
      <input type={type} value={value || ''}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px', fontSize: '14px',
          border: '1.5px solid #e0e0e0', borderRadius: '10px',
          outline: 'none', boxSizing: 'border-box', backgroundColor: 'transparent',
        }} />
    </div>
  );
}

export default ProfileScreen;
