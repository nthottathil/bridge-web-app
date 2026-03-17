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

          {error && (
            <div style={{
              padding: '12px', backgroundColor: theme.colors.errorBg,
              borderRadius: '8px', color: theme.colors.error,
              fontSize: '14px', marginTop: '12px',
            }}>{error}</div>
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
