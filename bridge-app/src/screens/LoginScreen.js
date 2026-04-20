import React, { useState } from 'react';
import { TextInput } from '../components';
import { theme } from '../theme';
import BridgeLogo from '../components/BridgeLogo';
import { authAPI } from '../services/api';

function LoginScreen({ onLoginSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(null); // null | 'email' | 'code' | 'newpass'
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authAPI.login(email, password);
      const profile = await authAPI.getProfile();
      onLoginSuccess(profile);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetCode = async () => {
    if (!resetEmail) {
      setError('Please enter your email');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await authAPI.forgotPassword(resetEmail);
      setForgotMode('code');
      setSuccessMsg('A reset code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (!resetCode) {
      setError('Please enter the reset code');
      return;
    }
    setError('');
    setForgotMode('newpass');
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      setError('Please fill in both fields');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await authAPI.resetPassword(resetEmail, resetCode, newPassword);
      setSuccessMsg('Password reset successfully! You can now log in.');
      setForgotMode(null);
      setEmail(resetEmail);
      setPassword('');
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired reset code');
    } finally {
      setLoading(false);
    }
  };

  const exitForgotMode = () => {
    setForgotMode(null);
    setError('');
    setSuccessMsg('');
    setResetEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const canProceed = email && password && !loading;

  // Forgot password - enter email
  if (forgotMode === 'email') {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        padding: '60px 16px',
      }}>
        <div style={{ width: '100%', maxWidth: 'var(--app-max-width, 100%)', animation: 'fadeIn 0.4s ease' }}>
          <div style={{ marginBottom: '24px' }}><BridgeLogo /></div>
          <h1 style={{ fontSize: '26px', fontWeight: '600', color: theme.colors.textDark, marginBottom: '8px' }}>
            Forgot your password?
          </h1>
          <p style={{ fontSize: '14px', color: theme.colors.textMedium, marginBottom: '24px' }}>
            Enter your email and we'll send you a reset code.
          </p>

          <div style={{
            backgroundColor: theme.colors.surfaceCard, borderRadius: theme.borderRadius.card,
            padding: '28px 24px', backdropFilter: 'blur(10px)',
          }}>
            <TextInput label="Email address" type="email" value={resetEmail} onChange={v => setResetEmail(v)} />
            {error && (
              <div style={{ padding: '12px', backgroundColor: theme.colors.errorBg, borderRadius: '8px', color: theme.colors.error, fontSize: '14px', marginTop: '12px' }}>
                {error}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', padding: '0 4px' }}>
            <button onClick={exitForgotMode} style={{
              padding: '10px 20px', borderRadius: '25px', border: `1.5px solid ${theme.colors.textDark}`,
              backgroundColor: 'transparent', color: theme.colors.textDark, fontSize: '14px', cursor: 'pointer', fontWeight: '500',
            }}>Back</button>
            <button onClick={handleSendResetCode} disabled={!resetEmail || loading} style={{
              padding: '10px 24px', borderRadius: '25px', border: 'none',
              backgroundColor: resetEmail && !loading ? theme.colors.primary : '#ccc',
              color: '#fff', fontSize: '14px', fontWeight: '600', cursor: resetEmail && !loading ? 'pointer' : 'not-allowed',
            }}>{loading ? 'Sending...' : 'Send reset code'}</button>
          </div>
        </div>
      </div>
    );
  }

  // Forgot password - enter code
  if (forgotMode === 'code') {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        padding: '60px 16px',
      }}>
        <div style={{ width: '100%', maxWidth: 'var(--app-max-width, 100%)', animation: 'fadeIn 0.4s ease' }}>
          <div style={{ marginBottom: '24px' }}><BridgeLogo /></div>
          <h1 style={{ fontSize: '26px', fontWeight: '600', color: theme.colors.textDark, marginBottom: '8px' }}>
            Enter reset code
          </h1>
          <p style={{ fontSize: '14px', color: theme.colors.textMedium, marginBottom: '24px' }}>
            Check your email for a 6-digit code.
          </p>

          <div style={{
            backgroundColor: theme.colors.surfaceCard, borderRadius: theme.borderRadius.card,
            padding: '28px 24px', backdropFilter: 'blur(10px)',
          }}>
            {successMsg && (
              <div style={{ padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '8px', color: '#2e7d32', fontSize: '14px', marginBottom: '12px' }}>
                {successMsg}
              </div>
            )}
            <TextInput label="Reset code" type="text" value={resetCode} onChange={v => setResetCode(v)} />
            {error && (
              <div style={{ padding: '12px', backgroundColor: theme.colors.errorBg, borderRadius: '8px', color: theme.colors.error, fontSize: '14px', marginTop: '12px' }}>
                {error}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', padding: '0 4px' }}>
            <button onClick={exitForgotMode} style={{
              padding: '10px 20px', borderRadius: '25px', border: `1.5px solid ${theme.colors.textDark}`,
              backgroundColor: 'transparent', color: theme.colors.textDark, fontSize: '14px', cursor: 'pointer', fontWeight: '500',
            }}>Back</button>
            <button onClick={handleVerifyCode} disabled={!resetCode} style={{
              padding: '10px 24px', borderRadius: '25px', border: 'none',
              backgroundColor: resetCode ? theme.colors.primary : '#ccc',
              color: '#fff', fontSize: '14px', fontWeight: '600', cursor: resetCode ? 'pointer' : 'not-allowed',
            }}>Next</button>
          </div>
        </div>
      </div>
    );
  }

  // Forgot password - enter new password
  if (forgotMode === 'newpass') {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        padding: '60px 16px',
      }}>
        <div style={{ width: '100%', maxWidth: 'var(--app-max-width, 100%)', animation: 'fadeIn 0.4s ease' }}>
          <div style={{ marginBottom: '24px' }}><BridgeLogo /></div>
          <h1 style={{ fontSize: '26px', fontWeight: '600', color: theme.colors.textDark, marginBottom: '8px' }}>
            Set new password
          </h1>

          <div style={{
            backgroundColor: theme.colors.surfaceCard, borderRadius: theme.borderRadius.card,
            padding: '28px 24px', backdropFilter: 'blur(10px)',
          }}>
            <TextInput label="New password" type="password" value={newPassword} onChange={v => setNewPassword(v)} />
            <TextInput label="Confirm new password" type="password" value={confirmNewPassword} onChange={v => setConfirmNewPassword(v)} />
            {error && (
              <div style={{ padding: '12px', backgroundColor: theme.colors.errorBg, borderRadius: '8px', color: theme.colors.error, fontSize: '14px', marginTop: '12px' }}>
                {error}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', padding: '0 4px' }}>
            <button onClick={() => setForgotMode('code')} style={{
              padding: '10px 20px', borderRadius: '25px', border: `1.5px solid ${theme.colors.textDark}`,
              backgroundColor: 'transparent', color: theme.colors.textDark, fontSize: '14px', cursor: 'pointer', fontWeight: '500',
            }}>Back</button>
            <button onClick={handleResetPassword} disabled={!newPassword || !confirmNewPassword || loading} style={{
              padding: '10px 24px', borderRadius: '25px', border: 'none',
              backgroundColor: newPassword && confirmNewPassword && !loading ? theme.colors.primary : '#ccc',
              color: '#fff', fontSize: '14px', fontWeight: '600',
              cursor: newPassword && confirmNewPassword && !loading ? 'pointer' : 'not-allowed',
            }}>{loading ? 'Resetting...' : 'Reset password'}</button>
          </div>
        </div>
      </div>
    );
  }

  // Normal login view
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '60px 16px',
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
        }}>Log into your account</h1>

        <div style={{
          backgroundColor: theme.colors.surfaceCard,
          borderRadius: theme.borderRadius.card,
          padding: '28px 24px',
          backdropFilter: 'blur(10px)',
        }}>
          <TextInput
            label="Email address"
            type="email"
            placeholder=""
            value={email}
            onChange={v => setEmail(v)}
          />
          <TextInput
            label="Password"
            type="password"
            placeholder=""
            value={password}
            onChange={v => setPassword(v)}
          />

          <button
            onClick={() => { setForgotMode('email'); setResetEmail(email); setError(''); setSuccessMsg(''); }}
            style={{
              background: 'none', border: 'none', padding: '8px 0', marginTop: '4px',
              color: theme.colors.primary, fontSize: '13px', fontWeight: '500',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            Forgot password?
          </button>

          {error && (
            <div style={{
              padding: '12px', backgroundColor: theme.colors.errorBg,
              borderRadius: '8px', color: theme.colors.error,
              fontSize: '14px', marginTop: '12px',
            }}>{error}</div>
          )}

          {successMsg && (
            <div style={{
              padding: '12px', backgroundColor: '#e8f5e9',
              borderRadius: '8px', color: '#2e7d32',
              fontSize: '14px', marginTop: '12px',
            }}>{successMsg}</div>
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
            onClick={onSwitchToSignup}
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
            Sign up
          </button>
          <button
            onClick={handleLogin}
            disabled={!canProceed}
            style={{
              padding: '10px 24px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: canProceed ? theme.colors.primary : '#ccc',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: canProceed ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
