import React from 'react';
import { SplitLayout, TextInput, NavButton } from '../components';

function EmailScreen({ data, update, onNext, onBack }) {
  const isValidEmail = data.email.includes('@') && data.email.includes('.');
  
  return (
    <SplitLayout
      progress={41}
      leftTitle="Let's stay connected..."
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>What's your email?</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '28px',
            lineHeight: '1.5'
          }}>We'll use this to keep you updated on your matches.</p>
          <TextInput
            label="Email address"
            type="email"
            value={data.email}
            onChange={v => update('email', v)}
            placeholder="you@example.com"
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '40px'
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} disabled={!isValidEmail} />
          </div>
        </div>
      }
    />
  );
}

export default EmailScreen;
