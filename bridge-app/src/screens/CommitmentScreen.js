import React from 'react';
import { SplitLayout } from '../components';
import { theme } from '../theme';

const LEVELS = ['Just exploring', 'Semi serious', 'Fully committed', "Haven't decided"];

function CommitmentScreen({ data, update }) {
  return (
    <SplitLayout
      currentTab={3}
      leftTitle="Commitment"
      rightContent={
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {LEVELS.map(label => {
            const isSelected = data.commitmentLevel === label;
            return (
              <button
                key={label}
                onClick={() => update('commitmentLevel', label)}
                style={{
                  padding: '12px 18px',
                  borderRadius: '24px',
                  border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.borderLight}`,
                  backgroundColor: isSelected ? theme.colors.primary : '#fff',
                  color: isSelected ? '#fff' : theme.colors.textDark,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      }
    />
  );
}

export default CommitmentScreen;
