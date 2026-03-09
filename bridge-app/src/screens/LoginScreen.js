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

  const canProceed = email && password && !loading;

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
        maxWidth: '430px',
        animation: 'fadeIn 0.4s ease',
      }}>
        <div style={{ marginBottom: '32px' }}><BridgeLogo /></div>
        <h1 style={{
          fontSize: '28px', fontWeight: '600',
          color: theme.colors.textDark, marginBottom: '8px',
        }}>Welcome back</h1>
        <p style={{
          fontSize: '15px', color: theme.colors.textMedium,
          marginBottom: '28px',
        }}>Log in to your account</p>

        <div style={{
          backgroundColor: theme.colors.surfaceCard,
          borderRadius: theme.borderRadius.card,
          padding: '28px 24px',
          backdropFilter: 'blur(10px)',
        }}>
          <TextInput
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={v => setEmail(v)}
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={v => setPassword(v)}
          />

          {error && (
            <div style={{
              padding: '12px', backgroundColor: theme.colors.errorBg,
              borderRadius: '8px', color: theme.colors.error,
              fontSize: '14px', marginBottom: '16px',
            }}>{error}</div>
          )}

          <button
            onClick={handleLogin}
            disabled={!canProceed}
            style={{
              width: '100%', padding: '14px',
              borderRadius: '25px', border: 'none',
              backgroundColor: canProceed ? theme.colors.primary : '#ccc',
              color: '#fff', fontSize: '15px', fontWeight: '600',
              cursor: canProceed ? 'pointer' : 'not-allowed',
              marginTop: '8px',
            }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <p style={{
            textAlign: 'center', fontSize: '14px',
            color: theme.colors.textMedium, marginTop: '20px',
          }}>
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              style={{
                background: 'none', border: 'none',
                color: theme.colors.primary, cursor: 'pointer',
                fontWeight: '600', fontSize: '14px',
                textDecoration: 'underline',
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
