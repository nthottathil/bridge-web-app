import React, { useState, useRef } from 'react';
import { TextInput } from '../components';
import { theme } from '../theme';
import BridgeLogo from '../components/BridgeLogo';
import { useAuth } from '../context/AuthContext';

function SignupScreen({ data, update, onNext, onSwitchToLogin }) {
  const { signup, verify } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [showError, setShowError] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const inputRefs = useRef([]);

  const isValidEmail = data.email.includes('@') && data.email.includes('.');
  const passwordsMatch = password === confirmPassword;
  const passwordValid = password.length >= 8;
  const canProceed = data.email && passwordValid && passwordsMatch;

  const handleSendVerification = async () => {
    if (!isValidEmail) { setShowError('Please enter a valid email address'); return; }
    if (!passwordValid) { setShowError('Password must be at least 8 characters long'); return; }
    if (!passwordsMatch) { setShowError('Passwords do not match'); return; }

    setLoading(true);
    setShowError('');

    try {
      await signup({
        email: data.email,
        password: password,
        first_name: data.firstName || 'New',
        surname: data.surname || 'User',
        age: data.age || 18,
        profession: data.profession || 'Not set',
        primary_goal: 'networking',
        interests: [],
        personality: { extroversion: 5, openness: 5, agreeableness: 5, conscientiousness: 5 },
        gender_preference: ['any'],
        age_preference: { min: 18, max: 99 },
        statement: '',
        location: 'London',
        max_distance: 5,
      });
      setEmailSent(true);
    } catch (error) {
      setShowError(error.response?.data?.detail || 'Failed to send verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      const code = codeDigits.join('');
      if (code.length === 6) handleVerifyAndNext();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = [...codeDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setCodeDigits(newDigits);
    if (pasted.length > 0) {
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerifyAndNext = async () => {
    const code = codeDigits.join('');
    if (code.length !== 6) {
      setShowError('Please enter the 6-digit verification code');
      return;
    }
    setLoading(true);
    setShowError('');
    try {
      await verify(data.email, code);
      onNext();
    } catch (error) {
      setShowError(error.response?.data?.detail || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Verification code screen
  if (emailSent) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '60px 16px 80px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 'var(--app-max-width, 100%)',
          animation: 'fadeIn 0.4s ease',
        }}>
          <div style={{ marginBottom: '24px' }}><BridgeLogo /></div>
          <h1 style={{
            fontSize: '26px', fontWeight: '600',
            color: theme.colors.textDark, marginBottom: '32px',
          }}>Verification code please</h1>

          {/* 6 code boxes */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '32px',
          }}>
            {codeDigits.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={e => handleCodeChange(i, e.target.value)}
                onKeyDown={e => handleCodeKeyDown(i, e)}
                onPaste={i === 0 ? handleCodePaste : undefined}
                style={{
                  width: '48px',
                  height: '60px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: theme.colors.surfaceWhite,
                  outline: 'none',
                  color: theme.colors.textDark,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              />
            ))}
          </div>

          {showError && (
            <div style={{
              padding: '12px', backgroundColor: theme.colors.errorBg,
              borderRadius: '8px', color: theme.colors.error,
              fontSize: '14px', marginBottom: '16px', textAlign: 'center',
            }}>{showError}</div>
          )}

          <p style={{ fontSize: '13px', color: theme.colors.textLight, textAlign: 'center' }}>
            Didn't receive it?{' '}
            <button onClick={handleSendVerification} style={{
              background: 'none', border: 'none',
              color: theme.colors.primary, cursor: 'pointer',
              textDecoration: 'underline', fontSize: '13px',
            }}>Resend code</button>
          </p>

          {/* Next button */}
          <div style={{ position: 'fixed', bottom: '32px', right: '32px' }}>
            <button
              onClick={handleVerifyAndNext}
              disabled={codeDigits.join('').length !== 6 || loading}
              style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: 'none',
                backgroundColor: codeDigits.join('').length === 6 && !loading
                  ? theme.colors.primary : 'rgba(45, 79, 92, 0.3)',
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Signup form - email + password only
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '60px 16px 80px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 'var(--app-max-width, 100%)',
        animation: 'fadeIn 0.4s ease',
      }}>
        <div style={{ marginBottom: '24px' }}><BridgeLogo /></div>
        <h1 style={{
          fontSize: '26px', fontWeight: '600',
          color: theme.colors.textDark, marginBottom: '24px',
        }}>Let's create your account</h1>

        <div style={{
          backgroundColor: theme.colors.surfaceCard,
          borderRadius: theme.borderRadius.card,
          padding: '28px 24px',
          backdropFilter: 'blur(10px)',
        }}>
          <TextInput label="Email address" type="email" value={data.email} onChange={v => update('email', v)} placeholder="" />
          <TextInput label="Password" type="password" value={password} onChange={v => setPassword(v)} placeholder="" />
          <TextInput label="Confirm password" type="password" value={confirmPassword} onChange={v => setConfirmPassword(v)} placeholder="" />

          {showError && (
            <div style={{
              padding: '12px', backgroundColor: theme.colors.errorBg,
              borderRadius: '8px', color: theme.colors.error,
              fontSize: '14px', marginTop: '12px',
            }}>{showError}</div>
          )}
        </div>

        {/* Bottom buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '32px',
          padding: '0 4px',
        }}>
          <button
            onClick={onSwitchToLogin}
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: `1.5px solid ${theme.colors.textDark}`,
              backgroundColor: 'transparent',
              color: theme.colors.textDark,
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Sign in
          </button>
          <button
            onClick={handleSendVerification}
            disabled={!canProceed || loading}
            style={{
              padding: '10px 24px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: canProceed && !loading ? theme.colors.primary : '#ccc',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: canProceed && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Sending...' : 'send verification email'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupScreen;
