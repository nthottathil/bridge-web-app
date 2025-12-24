import React from 'react';
import { SplitLayout, NavButton } from '../components';

function ExplanationScreen({ onNext, onBack }) {
  return (
    <SplitLayout
      progress={12}
      leftTitle="Welcome to Bridge"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '16px'
          }}>How Bridge Works</h2>

          <div style={{
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            <div style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              borderLeft: '4px solid #1a5f5a'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a5f5a',
                marginBottom: '8px'
              }}>Goal-Based Matching</h3>
              <p style={{
                fontSize: '15px',
                color: '#666',
                margin: 0
              }}>
                We match you with people based on your primary goal. Whether it's making friends,
                networking, or finding activity partners, your goal comes first.
              </p>
            </div>

            <div style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              borderLeft: '4px solid #1a5f5a'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a5f5a',
                marginBottom: '8px'
              }}>3-Profile Selection</h3>
              <p style={{
                fontSize: '15px',
                color: '#666',
                margin: 0
              }}>
                You'll see 3 profiles at a time. Pick the one you'd like to connect with.
                Once they pick you back from their 3, you'll both enter a chat room together.
              </p>
            </div>

            <div style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              borderLeft: '4px solid #1a5f5a'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a5f5a',
                marginBottom: '8px'
              }}>Build Real Connections</h3>
              <p style={{
                fontSize: '15px',
                color: '#666',
                margin: 0
              }}>
                Each bridge lasts 5 days. You can have up to 3 active bridges at any time.
                Quality over quantity.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '32px'
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} label="Let's begin →" />
          </div>
        </div>
      }
    />
  );
}

export default ExplanationScreen;