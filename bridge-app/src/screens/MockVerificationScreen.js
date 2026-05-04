import React, { useState } from 'react';
import { theme } from '../theme';
import BridgeLogo from '../components/BridgeLogo';

function MockVerificationScreen() {
  const [codeDigits] = useState(['1', '2', '3', '4', '5', '6']);

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

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '32px',
        }}>
          {codeDigits.map((digit, i) => (
            <div
              key={i}
              style={{
                width: '48px',
                height: '60px',
                textAlign: 'center',
                fontSize: '22px',
                fontWeight: '600',
                borderRadius: '12px',
                backgroundColor: theme.colors.surfaceWhite,
                color: theme.colors.textDark,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {digit}
            </div>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: theme.colors.textLight, textAlign: 'center' }}>
          Didn't receive it?{' '}
          <span style={{
            color: theme.colors.primary,
            textDecoration: 'underline', fontSize: '13px',
          }}>Resend code</span>
        </p>
      </div>
    </div>
  );
}

export default MockVerificationScreen;
