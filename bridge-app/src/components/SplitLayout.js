import React from 'react';
import BridgeLogo from './BridgeLogo';
import { theme } from '../theme';

const TABS = ['Identity', 'Direction', 'Vibe', 'Commitment'];

function SplitLayout({ rightContent, leftTitle, currentTab, subtitle }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px 16px 80px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '430px',
        animation: 'fadeIn 0.4s ease',
      }}>
        {/* Tab Header */}
        {currentTab !== undefined && (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}>
            {TABS.map((tab, i) => (
              <span key={tab} style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: i === currentTab ? '600' : '400',
                backgroundColor: i === currentTab ? theme.colors.surfaceWhite : 'transparent',
                color: i === currentTab ? theme.colors.textDark : 'rgba(255,255,255,0.7)',
                transition: 'all 0.3s ease',
              }}>{tab}</span>
            ))}
          </div>
        )}

        {/* Logo */}
        <div style={{ marginBottom: '8px' }}>
          <BridgeLogo />
        </div>

        {/* Title */}
        {leftTitle && (
          <h1 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: theme.colors.textDark,
            marginBottom: subtitle ? '4px' : '20px',
            lineHeight: '1.3',
          }}>{leftTitle}</h1>
        )}

        {subtitle && (
          <p style={{
            fontSize: '14px',
            color: theme.colors.textMedium,
            marginBottom: '20px',
            lineHeight: '1.4',
          }}>{subtitle}</p>
        )}

        {/* Content Card */}
        <div style={{
          backgroundColor: theme.colors.surfaceCard,
          borderRadius: theme.borderRadius.card,
          padding: '28px 24px',
          backdropFilter: 'blur(10px)',
        }}>
          {rightContent}
        </div>
      </div>
    </div>
  );
}

export default SplitLayout;
