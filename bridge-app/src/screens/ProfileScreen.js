import React, { useState, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';
import { theme } from '../theme';
import BridgeLogo from '../components/BridgeLogo';
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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const size = 300;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        updateField('profile_photo_url', dataUrl);
        try {
          await authAPI.updateProfile({ profile_photo_url: dataUrl });
          setMessage('Photo saved!');
          setTimeout(() => setMessage(''), 3000);
        } catch (err) {
          setError('Failed to save photo');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

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
        profile_photo_url: profile.profile_photo_url || '',
      });
      setMessage('Profile saved!');
      setEditing(false);
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

  // Get perspective answers for display
  const perspectiveAnswers = profile.perspective_answers || {};
  const answeredPrompts = Object.entries(perspectiveAnswers).filter(([, v]) => v && v.trim());

  // ─── EDIT MODE ───
  if (editing) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '430px',
          margin: '0 auto',
        }}>
          <button onClick={() => setEditing(false)} style={{
            background: 'none', border: 'none', color: theme.colors.textDark,
            cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '15px', fontWeight: '500',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back
          </button>
          <button onClick={onLogout} style={{
            padding: '6px 16px', borderRadius: '14px',
            border: `1.5px solid ${theme.colors.borderLight}`,
            backgroundColor: 'transparent', color: theme.colors.textMedium,
            cursor: 'pointer', fontSize: '12px', fontWeight: '500',
          }}>Log Out</button>
        </div>

        <div style={{ maxWidth: '430px', margin: '0 auto', padding: '0 16px 100px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: theme.colors.textDark, marginBottom: '16px' }}>
            Edit Profile
          </h2>

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

          {/* Profile Photo */}
          <EditSection title="Profile Photo">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '80px', height: '80px', borderRadius: '16px',
                  backgroundColor: profile.profile_photo_url ? 'transparent' : '#f0f0f0',
                  border: `2px dashed ${profile.profile_photo_url ? theme.colors.primary : theme.colors.borderLight}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', flexShrink: 0,
                }}
              >
                {profile.profile_photo_url ? (
                  <img src={profile.profile_photo_url} alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={theme.colors.textLight}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>
              <div>
                <button onClick={() => fileInputRef.current?.click()} style={{
                  padding: '8px 16px', borderRadius: '20px',
                  border: `1.5px solid ${theme.colors.primary}`,
                  backgroundColor: 'transparent', color: theme.colors.primary,
                  fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                }}>
                  {profile.profile_photo_url ? 'Change Photo' : 'Upload Photo'}
                </button>
                {profile.profile_photo_url && (
                  <button onClick={() => updateField('profile_photo_url', '')} style={{
                    padding: '8px 12px', background: 'none', border: 'none',
                    color: theme.colors.error, fontSize: '12px', cursor: 'pointer', marginLeft: '4px',
                  }}>Remove</button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*"
                onChange={handlePhotoSelect} style={{ display: 'none' }} />
            </div>
          </EditSection>

          {/* Basic Info */}
          <EditSection title="Basic Info">
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
          </EditSection>

          <EditSection title="Focus">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {FOCUS_OPTIONS.map(f => (
                <SelectionChip key={f} label={f} selected={profile.focus === f}
                  onClick={() => updateField('focus', f)} />
              ))}
            </div>
          </EditSection>

          <EditSection title="Headline">
            <textarea value={profile.headline || profile.statement || ''}
              onChange={e => { updateField('headline', e.target.value); updateField('statement', e.target.value); }}
              placeholder="Where you're headed + what you're building"
              rows={3}
              style={{
                width: '100%', padding: '12px', fontSize: '14px', lineHeight: '1.5',
                border: '1.5px solid #e0e0e0', borderRadius: '12px', outline: 'none',
                resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
                backgroundColor: 'transparent',
              }} />
          </EditSection>

          <EditSection title="Interests">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {INTERESTS.map(interest => (
                <SelectionChip key={interest} label={interest}
                  selected={profile.interests?.includes(interest)}
                  onClick={() => toggleInterest(interest)} />
              ))}
            </div>
          </EditSection>

          <EditSection title="Personality">
            <SliderInput label="Social Energy" value={profile.personality?.extroversion || 50}
              onChange={v => updatePersonality('extroversion', v)} leftLabel="Introvert" rightLabel="Extrovert" />
            <SliderInput label="New Experiences" value={profile.personality?.openness || 50}
              onChange={v => updatePersonality('openness', v)} leftLabel="Routine" rightLabel="Adventure" />
            <SliderInput label="Decision Making" value={profile.personality?.agreeableness || 50}
              onChange={v => updatePersonality('agreeableness', v)} leftLabel="Logical" rightLabel="Empathetic" />
            <SliderInput label="Organisation" value={profile.personality?.conscientiousness || 50}
              onChange={v => updatePersonality('conscientiousness', v)} leftLabel="Spontaneous" rightLabel="Planned" />
          </EditSection>

          <EditSection title="Preferences">
            <RangeSlider label="Age range" min={18} max={99}
              minValue={profile.age_preference?.min || 18}
              maxValue={profile.age_preference?.max || 99}
              onChange={(min, max) => updateField('age_preference', { min: Math.max(18, min), max })} />
          </EditSection>

          <button onClick={handleSave} disabled={saving} style={{
            width: '100%', padding: '14px', fontSize: '15px', fontWeight: '600',
            backgroundColor: saving ? '#ccc' : theme.colors.primary, color: '#fff',
            border: 'none', borderRadius: '25px',
            cursor: saving ? 'not-allowed' : 'pointer', marginTop: '8px',
          }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button onClick={onLogout} style={{
            width: '100%', padding: '14px', fontSize: '15px', fontWeight: '500',
            backgroundColor: 'transparent', color: theme.colors.error,
            border: `1.5px solid ${theme.colors.error}`, borderRadius: '25px',
            cursor: 'pointer', marginTop: '12px',
          }}>
            Log Out
          </button>
        </div>
      </div>
    );
  }

  // ─── VIEW MODE (matches mockup) ───
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
    }}>
      <div style={{ maxWidth: '430px', margin: '0 auto', paddingTop: '16px' }}>
        {/* Profile hero card */}
        <div style={{
          backgroundColor: theme.colors.surfaceCard,
          borderRadius: '20px',
          margin: '0 16px',
          padding: '24px 20px 20px',
          backdropFilter: 'blur(10px)',
          position: 'relative',
        }}>
          {/* Top row: logo + arrow */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px',
          }}>
            <BridgeLogo />
            <button onClick={onBack} style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.textMedium}>
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
              </svg>
            </button>
          </div>

          {/* Profile photo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', position: 'relative' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '140px', height: '160px', borderRadius: '16px',
                backgroundColor: '#e8e8e8', overflow: 'hidden', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
            >
              {profile.profile_photo_url ? (
                <img src={profile.profile_photo_url} alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={theme.colors.textLight}>
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <p style={{ fontSize: '11px', color: theme.colors.textLight, margin: '4px 0 0', lineHeight: '1.3' }}>
                    Add your profile<br/>picture
                  </p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*"
              onChange={handlePhotoSelect} style={{ display: 'none' }} />
            {/* Edit pencil */}
            <button onClick={() => setEditing(true)} style={{
              position: 'absolute', bottom: '0', right: '20%',
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: 'transparent', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={theme.colors.textMedium}>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
          </div>

          {/* Name */}
          <h1 style={{
            fontSize: '24px', fontWeight: '600', color: theme.colors.textDark,
            textAlign: 'center', margin: '0 0 8px',
          }}>
            {profile.first_name} {profile.surname}
          </h1>

          {/* Location | Focus */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: '10px', marginBottom: '14px',
          }}>
            {profile.location && (
              <span style={{ fontSize: '14px', color: theme.colors.textMedium }}>
                {profile.location}
              </span>
            )}
            {profile.location && profile.focus && (
              <span style={{ color: theme.colors.borderLight, fontSize: '14px' }}>|</span>
            )}
            {profile.focus && (
              <span style={{
                fontSize: '13px', padding: '4px 12px',
                border: `1px solid ${theme.colors.textMedium}`,
                borderRadius: '20px', color: theme.colors.textDark,
                fontWeight: '500',
              }}>
                {profile.focus}
              </span>
            )}
          </div>

          {/* Headline */}
          {(profile.headline || profile.statement) && (
            <p style={{
              fontSize: '14px', color: theme.colors.textDark,
              textAlign: 'center', lineHeight: '1.5', margin: 0,
            }}>
              {profile.headline || profile.statement}
            </p>
          )}
        </div>

        {/* Success message */}
        {message && (
          <div style={{
            padding: '12px', borderRadius: '10px',
            backgroundColor: theme.colors.successBg, color: theme.colors.success,
            margin: '12px 16px', fontSize: '14px', fontWeight: '500',
          }}>{message}</div>
        )}

        {/* Goal + Perspective combined card */}
        <div style={{
          backgroundColor: theme.colors.surfaceCard,
          borderRadius: '20px',
          margin: '14px 16px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
        }}>
          {/* Goal section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.primary}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.textDark, margin: 0 }}>
              Goal
            </h3>
          </div>

          {profile.primary_goal ? (
            <div>
              <p style={{
                fontSize: '15px', fontWeight: '600', color: theme.colors.textDark,
                margin: '0 0 4px', lineHeight: '1.4',
              }}>
                {profile.primary_goal}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: theme.colors.textLight, margin: 0 }}>
              No goal set yet
            </p>
          )}

          {/* Divider */}
          <div style={{ borderTop: '1px solid #e8e8e8', margin: '18px 0' }} />

          {/* Perspective section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.primary}>
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
            </svg>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.textDark, margin: 0 }}>
              Perspective question
            </h3>
          </div>

          {answeredPrompts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {answeredPrompts.map(([prompt, answer]) => (
                <div key={prompt}>
                  <p style={{
                    fontSize: '14px', fontWeight: '600', color: theme.colors.textDark,
                    margin: '0 0 4px', lineHeight: '1.4',
                  }}>
                    {prompt}
                  </p>
                  <p style={{
                    fontSize: '13px', color: theme.colors.textMedium,
                    margin: 0, lineHeight: '1.5',
                  }}>
                    {answer}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: theme.colors.textLight, margin: 0 }}>
              No perspective answers yet
            </p>
          )}
        </div>

        {/* Interests + Deal breakers */}
        {((profile.interests && profile.interests.length > 0) || (profile.deal_breakers && profile.deal_breakers.length > 0)) && (
          <div style={{
            backgroundColor: theme.colors.surfaceCard,
            borderRadius: '20px',
            margin: '0 16px 14px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{
              borderTop: '1px solid #e8e8e8',
              paddingTop: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}>
              {(profile.interests || []).map(interest => (
                <span key={interest} style={{
                  padding: '6px 14px', borderRadius: '20px',
                  border: '1px solid #ccc',
                  color: theme.colors.textDark, fontSize: '13px', fontWeight: '500',
                }}>
                  {interest}
                </span>
              ))}
              {(profile.deal_breakers || []).map(db => (
                <span key={db} style={{
                  padding: '6px 14px', borderRadius: '20px',
                  border: '1px solid #ccc',
                  color: theme.colors.textDark, fontSize: '13px', fontWeight: '500',
                }}>
                  {db}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: '40px' }} />
      </div>
    </div>
  );
}

function EditSection({ title, children }) {
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
