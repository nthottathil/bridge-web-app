import React, { useState } from 'react';
import { TextInput } from '../components';
import { theme } from '../theme';
import BridgeLogo from '../components/BridgeLogo';
import { useAuth } from '../context/AuthContext';

function SignupScreen({ data, update, onNext, onSwitchToLogin }) {
  const { signup, verify } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showError, setShowError] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isValidEmail = data.email.includes('@') && data.email.includes('.');
  const passwordsMatch = password === confirmPassword;
  const passwordValid = password.length >= 8;
  const canProceed = data.firstName.trim() && data.surname.trim() && data.email && data.age && passwordValid && passwordsMatch;

  const handleSendVerification = async () => {
    if (!isValidEmail) { setShowError('Please enter a valid email address'); return; }
    if (!data.firstName.trim()) { setShowError('Please enter your first name'); return; }
    if (!data.surname.trim()) { setShowError('Please enter your surname'); return; }
    if (!data.age || data.age < 18) { setShowError('You must be at least 18 years old'); return; }
    if (!data.profession.trim()) { setShowError('Please enter your profession'); return; }
    if (!passwordValid) { setShowError('Password must be at least 8 characters long'); return; }
    if (!passwordsMatch) { setShowError('Passwords do not match'); return; }

    setLoading(true);
    setShowError('');

    try {
      await signup({
        email: data.email,
        password: password,
        first_name: data.firstName,
        surname: data.surname,
        age: data.age,
        profession: data.profession,
        primary_goal: data.primaryGoal || 'networking',
        interests: data.interests || [],
        personality: {
          extroversion: Math.round(data.personality.extroversion / 10),
          openness: Math.round(data.personality.openness / 10),
          agreeableness: Math.round(data.personality.agreeableness / 10),
          conscientiousness: Math.round(data.personality.conscientiousness / 10),
        },
        gender_preference: data.genderPreference || ['any'],
        age_preference: data.agePreference || { min: 18, max: 99 },
        statement: data.statement || '',
        location: data.location || 'London',
        max_distance: data.maxDistance || 5,
      });
      setEmailSent(true);
    } catch (error) {
      setShowError(error.response?.data?.detail || 'Failed to send verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndNext = async () => {
    if (verificationCode.length !== 6) {
      setShowError('Please enter the 6-digit verification code');
      return;
    }
    setLoading(true);
    setShowError('');
    try {
      await verify(data.email, verificationCode);
      onNext();
    } catch (error) {
      setShowError(error.response?.data?.detail || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '40px 16px 80px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '430px',
        animation: 'fadeIn 0.4s ease',
      }}>
        <div style={{ marginBottom: '24px' }}><BridgeLogo /></div>
        <h1 style={{
          fontSize: '26px', fontWeight: '600',
          color: theme.colors.textDark, marginBottom: '8px',
        }}>Create your account</h1>
        <p style={{
          fontSize: '14px', color: theme.colors.textMedium,
          marginBottom: '24px',
        }}>Join Bridge and find your people</p>

        <div style={{
          backgroundColor: theme.colors.surfaceCard,
          borderRadius: theme.borderRadius.card,
          padding: '24px 20px',
          backdropFilter: 'blur(10px)',
        }}>
          {!emailSent ? (
            <>
              <TextInput label="First name" value={data.firstName} onChange={v => update('firstName', v)} placeholder="John" />
              <TextInput label="Surname" value={data.surname} onChange={v => update('surname', v)} placeholder="Smith" />
              <TextInput label="Email address" type="email" value={data.email} onChange={v => update('email', v)} placeholder="you@example.com" />
              <TextInput
                label="Age" type="text"
                value={data.age || ''}
                onChange={v => { const n = v.replace(/\D/g, ''); update('age', n ? parseInt(n) : 0); }}
                placeholder="25"
              />
              <TextInput label="Profession" value={data.profession} onChange={v => update('profession', v)} placeholder="Software Engineer" />
              <TextInput label="Password" type="password" value={password} onChange={v => setPassword(v)} placeholder="At least 8 characters" />
              <TextInput label="Confirm Password" type="password" value={confirmPassword} onChange={v => setConfirmPassword(v)} placeholder="Re-enter your password" />

              {showError && (
                <div style={{
                  padding: '12px', backgroundColor: theme.colors.errorBg,
                  borderRadius: '8px', color: theme.colors.error,
                  fontSize: '14px', marginTop: '12px',
                }}>{showError}</div>
              )}

              <button
                onClick={handleSendVerification}
                disabled={!canProceed || loading}
                style={{
                  width: '100%', padding: '14px',
                  borderRadius: '25px', border: 'none',
                  backgroundColor: canProceed && !loading ? theme.colors.primary : '#ccc',
                  color: '#fff', fontSize: '15px', fontWeight: '600',
                  cursor: canProceed && !loading ? 'pointer' : 'not-allowed',
                  marginTop: '20px',
                }}
              >
                {loading ? 'Sending...' : 'Send Verification Email'}
              </button>

              <p style={{
                textAlign: 'center', fontSize: '14px',
                color: theme.colors.textMedium, marginTop: '16px',
              }}>
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} style={{
                  background: 'none', border: 'none',
                  color: theme.colors.primary, cursor: 'pointer',
                  fontWeight: '600', fontSize: '14px', textDecoration: 'underline',
                }}>
                  Log in
                </button>
              </p>
            </>
          ) : (
            <>
              <div style={{
                padding: '14px', backgroundColor: theme.colors.successBg,
                borderRadius: '12px', marginBottom: '20px',
              }}>
                <p style={{ fontSize: '14px', color: theme.colors.success, margin: 0, lineHeight: '1.5' }}>
                  We've sent a verification code to <strong>{data.email}</strong>. Check your inbox.
                </p>
              </div>

              <TextInput
                label="Verification Code"
                value={verificationCode}
                onChange={v => setVerificationCode(v.slice(0, 6))}
                placeholder="123456"
                type="text"
              />

              {showError && (
                <div style={{
                  padding: '12px', backgroundColor: theme.colors.errorBg,
                  borderRadius: '8px', color: theme.colors.error,
                  fontSize: '14px', marginTop: '12px',
                }}>{showError}</div>
              )}

              <p style={{ fontSize: '13px', color: theme.colors.textLight, marginTop: '12px' }}>
                Didn't receive it?{' '}
                <button onClick={handleSendVerification} style={{
                  background: 'none', border: 'none',
                  color: theme.colors.primary, cursor: 'pointer',
                  textDecoration: 'underline', fontSize: '13px',
                }}>Resend code</button>
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button
                  onClick={() => setEmailSent(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '25px',
                    border: `1.5px solid ${theme.colors.primary}`,
                    backgroundColor: 'transparent', color: theme.colors.primary,
                    fontSize: '14px', cursor: 'pointer', fontWeight: '500',
                  }}
                >
                  Edit Details
                </button>
                <button
                  onClick={handleVerifyAndNext}
                  disabled={verificationCode.length !== 6 || loading}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '25px',
                    border: 'none',
                    backgroundColor: verificationCode.length === 6 && !loading ? theme.colors.primary : '#ccc',
                    color: '#fff', fontSize: '14px', fontWeight: '600',
                    cursor: verificationCode.length === 6 && !loading ? 'pointer' : 'not-allowed',
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignupScreen;
