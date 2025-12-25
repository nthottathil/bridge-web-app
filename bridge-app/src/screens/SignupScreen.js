import React, { useState } from 'react';
import { SplitLayout, TextInput } from '../components';
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
    if (!isValidEmail) {
      setShowError('Please enter a valid email address');
      return;
    }
    if (!data.firstName.trim()) {
      setShowError('Please enter your first name');
      return;
    }
    if (!data.surname.trim()) {
      setShowError('Please enter your surname');
      return;
    }
    if (!data.age || data.age < 18) {
      setShowError('You must be at least 18 years old');
      return;
    }
    if (!data.profession.trim()) {
      setShowError('Please enter your profession');
      return;
    }
    if (!passwordValid) {
      setShowError('Password must be at least 8 characters long');
      return;
    }
    if (!passwordsMatch) {
      setShowError('Passwords do not match');
      return;
    }

    setLoading(true);
    setShowError('');

    try {
      // Call real signup API
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
          conscientiousness: Math.round(data.personality.conscientiousness / 10)
        },
        gender_preference: data.genderPreference || ['any'],
        age_preference: data.agePreference || { min: 18, max: 99 },
        statement: data.statement || '',
        location: data.location || 'London',
        max_distance: data.maxDistance || 5
      });

      console.log('Verification email sent to:', data.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Signup error:', error);
      setShowError(error.response?.data?.detail || 'Failed to send verification email. Please try again.');
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
      console.error('Verification error:', error);
      setShowError(error.response?.data?.detail || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SplitLayout
      progress={0}
      leftTitle="Let's get started with your details..."
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '24px'
          }}>Sign Up for Bridge</h2>

          {!emailSent ? (
            <>
              <TextInput
                label="First name"
                value={data.firstName}
                onChange={v => update('firstName', v)}
                placeholder="John"
              />
              <TextInput
                label="Surname"
                value={data.surname}
                onChange={v => update('surname', v)}
                placeholder="Smith"
              />
              <TextInput
                label="Email address"
                type="email"
                value={data.email}
                onChange={v => update('email', v)}
                placeholder="you@example.com"
              />
              <TextInput
                label="Age"
                type="text"
                value={data.age || ''}
                onChange={v => {
                  const numValue = v.replace(/\D/g, '');
                  update('age', numValue ? parseInt(numValue) : 0);
                }}
                placeholder="25"
              />
              <TextInput
                label="Profession"
                value={data.profession}
                onChange={v => update('profession', v)}
                placeholder="Software Engineer"
              />
              <TextInput
                label="Password"
                type="password"
                value={password}
                onChange={v => setPassword(v)}
                placeholder="At least 8 characters"
              />
              <TextInput
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={v => setConfirmPassword(v)}
                placeholder="Re-enter your password"
              />

              {showError && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '8px',
                  color: '#c33',
                  fontSize: '14px'
                }}>
                  {showError}
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '40px',
                gap: '16px'
              }}>
                {onSwitchToLogin && (
                  <button
                    onClick={onSwitchToLogin}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '20px',
                      border: '2px solid #1a5f5a',
                      backgroundColor: 'transparent',
                      color: '#1a5f5a',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f0f7f6';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    Already have an account?
                  </button>
                )}
                <button
                  onClick={handleSendVerification}
                  disabled={!canProceed || loading}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '24px',
                    border: 'none',
                    backgroundColor: canProceed && !loading ? '#1a5f5a' : '#ccc',
                    color: '#fff',
                    fontSize: '15px',
                    cursor: canProceed && !loading ? 'pointer' : 'not-allowed',
                    fontWeight: '500'
                  }}
                >
                  {loading ? 'Sending...' : 'Send Verification Email'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{
                padding: '16px',
                backgroundColor: '#e8f5e9',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <p style={{
                  fontSize: '15px',
                  color: '#2e7d32',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  We've sent a verification code to <strong>{data.email}</strong>.
                  Please check your inbox and enter the code below.
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
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '8px',
                  color: '#c33',
                  fontSize: '14px'
                }}>
                  {showError}
                </div>
              )}

              <p style={{
                fontSize: '13px',
                color: '#888',
                marginTop: '16px'
              }}>
                Didn't receive it?{' '}
                <button
                  onClick={handleSendVerification}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1a5f5a',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '13px'
                  }}
                >
                  Resend code
                </button>
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '40px'
              }}>
                <button
                  onClick={() => setEmailSent(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '24px',
                    border: '2px solid #1a5f5a',
                    backgroundColor: '#fff',
                    color: '#1a5f5a',
                    fontSize: '15px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  ← Edit Details
                </button>
                <button
                  onClick={handleVerifyAndNext}
                  disabled={verificationCode.length !== 6 || loading}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '24px',
                    border: 'none',
                    backgroundColor: verificationCode.length === 6 && !loading ? '#1a5f5a' : '#ccc',
                    color: '#fff',
                    fontSize: '15px',
                    cursor: verificationCode.length === 6 && !loading ? 'pointer' : 'not-allowed',
                    fontWeight: '500'
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue →'}
                </button>
              </div>
            </>
          )}
        </div>
      }
    />
  );
}

export default SignupScreen;