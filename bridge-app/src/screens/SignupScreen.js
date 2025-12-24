import React, { useState } from 'react';
import { SplitLayout, TextInput, NavButton } from '../components';

function SignupScreen({ data, update, onNext, onBack }) {
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showError, setShowError] = useState('');

  const isValidEmail = data.email.includes('@') && data.email.includes('.');
  const canProceed = data.firstName.trim() && data.surname.trim() && data.email && data.age;

  const handleSendVerification = () => {
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

    // Simulate sending verification email
    console.log('Sending verification email to:', data.email);
    setEmailSent(true);
    setShowError('');
  };

  const handleVerifyAndNext = () => {
    // In a real app, verify the code here
    if (verificationCode.length === 6) {
      onNext();
    } else {
      setShowError('Please enter the 6-digit verification code');
    }
  };

  return (
    <SplitLayout
      progress={6}
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
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '40px'
              }}>
                <button
                  onClick={handleSendVerification}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '24px',
                    border: 'none',
                    backgroundColor: canProceed ? '#1a5f5a' : '#ccc',
                    color: '#fff',
                    fontSize: '15px',
                    cursor: canProceed ? 'pointer' : 'not-allowed',
                    fontWeight: '500'
                  }}
                >
                  Send Verification Email
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
                  style={{
                    padding: '12px 24px',
                    borderRadius: '24px',
                    border: 'none',
                    backgroundColor: verificationCode.length === 6 ? '#1a5f5a' : '#ccc',
                    color: '#fff',
                    fontSize: '15px',
                    cursor: verificationCode.length === 6 ? 'pointer' : 'not-allowed',
                    fontWeight: '500'
                  }}
                >
                  Verify & Continue →
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