import React from 'react';
import { SplitLayout } from '../components';
import { theme } from '../theme';

function HeadlineScreen({ data, update }) {
  const maxLen = 280;
  const value = data.headline || data.statement || '';

  return (
    <SplitLayout
      currentTab={1}
      leftTitle="Headline"
      titleExtra={
        data.primaryGoal ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px',
            backgroundColor: '#fff',
            border: `1px solid ${theme.colors.borderLight}`,
            fontSize: '13px', color: theme.colors.textDark, fontWeight: '500',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            {data.primaryGoal}
          </span>
        ) : null
      }
      rightContent={
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '20px',
          minHeight: '220px',
        }}>
          <textarea
            value={value}
            onChange={e => {
              if (e.target.value.length <= maxLen) {
                update('headline', e.target.value);
                update('statement', e.target.value);
              }
            }}
            placeholder="Write a headline to clarify your goal"
            style={{
              width: '100%',
              minHeight: '180px',
              padding: 0,
              fontSize: '15px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              backgroundColor: 'transparent',
              color: theme.colors.textDark,
              boxSizing: 'border-box',
            }}
          />
          <div style={{
            textAlign: 'right',
            fontSize: '12px',
            color: value.length > maxLen - 20 ? '#c33' : theme.colors.textLight,
            marginTop: '8px',
          }}>
            {value.length}/{maxLen}
          </div>
        </div>
      }
    />
  );
}

export default HeadlineScreen;
