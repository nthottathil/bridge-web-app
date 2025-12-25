import React, { useState } from 'react';
import { SplitLayout, TextInput, NavButton } from '../components';
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

      const response = await authAPI.login(email, password);

      // Store token
      localStorage.setItem('token', response.access_token);

      // Fetch user profile
      const profile = await authAPI.getProfile();

      onLoginSuccess(profile);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const canProceed = email && password && !loading;

  return (
    <SplitLayout
      progress={0}
      leftTitle="Welcome back to Bridge"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Log in to your account</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '28px',
            lineHeight: '1.5'
          }}>Enter your credentials to continue</p>

          <TextInput
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(v) => setEmail(v)}
          />

          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(v) => setPassword(v)}
          />

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee',
              borderRadius: '8px',
              color: '#c33',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '32px'
          }}>
            <button
              onClick={onSwitchToSignup}
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
              Create new account
            </button>

            <NavButton
              onClick={handleLogin}
              disabled={!canProceed}
              label={loading ? 'Logging in...' : 'Log in'}
            />
          </div>
        </div>
      }
    />
  );
}

export default LoginScreen;
