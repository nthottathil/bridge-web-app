import React, { useState, useEffect } from 'react';
import { groupSettingsAPI } from '../services/api';
import { theme } from '../theme';

const NOTIFICATION_OPTIONS = [
  { key: 'note_created', label: 'Note Created' },
  { key: 'poll_created', label: 'Poll Created' },
  { key: 'group_goal_created', label: 'Group Goal Created' },
  { key: 'ask_the_group', label: 'Ask the Group' },
  { key: 'vote_member_changes', label: 'Vote on Member Changes' },
];

function ToggleSwitch({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: '46px',
        height: '26px',
        borderRadius: '13px',
        border: 'none',
        backgroundColor: value ? theme.colors.primary : '#c9ccd0',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.25s ease',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <div style={{
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        position: 'absolute',
        top: '2px',
        left: value ? '22px' : '2px',
        transition: 'left 0.25s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

function SettingsScreen({ groupData, onBack, onLeaveGroup }) {
  const [settings, setSettings] = useState({
    note_created: true,
    poll_created: true,
    group_goal_created: false,
    ask_the_group: true,
    vote_member_changes: true,
  });
  const [loading, setLoading] = useState(true);

  const groupName = groupData?.group_name || groupData?.name || 'The four builders';

  useEffect(() => {
    if (groupData?.group_id) {
      loadSettings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData?.group_id]);

  const loadSettings = async () => {
    try {
      const data = await groupSettingsAPI.getSettings(groupData.group_id);
      if (data && data.notifications) {
        setSettings(prev => ({ ...prev, ...data.notifications }));
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    try {
      await groupSettingsAPI.updateSettings(groupData.group_id, {
        notifications: updated,
      });
    } catch (err) {
      console.error('Error updating setting:', err);
      setSettings(prev => ({ ...prev, [key]: !value }));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      paddingBottom: '40px',
    }}>
      <div style={{ maxWidth: 'var(--app-max-width, 100%)', margin: '0 auto', padding: '16px 20px 0' }}>

        {/* Header: back chevron + centered title/subtitle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <button onClick={onBack} aria-label="Back" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.colors.textDark,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: '20px', fontWeight: '700', color: theme.colors.textDark, margin: 0,
            }}>Setting</h1>
            <p style={{
              fontSize: '12px', color: theme.colors.textLight, margin: '2px 0 0',
            }}>{groupName}</p>
          </div>

          {/* Spacer to keep title centered */}
          <div style={{ width: '34px' }} />
        </div>

        {/* Notifications section */}
        <h2 style={{
          fontSize: '17px', fontWeight: '700', color: theme.colors.textDark,
          margin: '0 0 6px',
        }}>Notifications</h2>
        <p style={{
          fontSize: '13px', color: theme.colors.textMedium,
          margin: '0 0 14px', lineHeight: '1.4',
        }}>Choose what notifications you want to receive from this group</p>

        <div style={{
          border: `1px solid ${theme.colors.borderLight}`,
          borderRadius: '16px',
          padding: '4px 18px',
          marginBottom: '28px',
        }}>
          {loading ? (
            <p style={{ fontSize: '13px', color: theme.colors.textLight, padding: '14px 0' }}>Loading...</p>
          ) : (
            NOTIFICATION_OPTIONS.map((option, i) => (
              <div
                key={option.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 0',
                  borderTop: i > 0 ? `1px solid ${theme.colors.borderLight}` : 'none',
                }}
              >
                <span style={{
                  fontSize: '15px', color: theme.colors.textDark, fontWeight: '400',
                }}>{option.label}</span>
                <ToggleSwitch
                  value={!!settings[option.key]}
                  onChange={(val) => handleToggle(option.key, val)}
                />
              </div>
            ))
          )}
        </div>

        {/* Group Actions section */}
        <h2 style={{
          fontSize: '17px', fontWeight: '700', color: theme.colors.textDark,
          margin: '0 0 14px',
        }}>Group Actions</h2>

        <div style={{
          border: `1px solid ${theme.colors.borderLight}`,
          borderRadius: '16px',
          padding: '4px 18px',
        }}>
          {/* Manage Members */}
          <div style={{
            padding: '16px 0',
            cursor: 'pointer',
          }}>
            <p style={{
              fontSize: '15px', fontWeight: '600', color: theme.colors.textDark,
              margin: '0 0 2px',
            }}>Manage Members</p>
            <p style={{
              fontSize: '12px', color: theme.colors.textMedium, margin: 0,
            }}>Vote to remove group members</p>
          </div>

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${theme.colors.borderLight}` }} />

          {/* Leave Group */}
          <div
            onClick={onLeaveGroup}
            style={{
              padding: '16px 0',
              cursor: 'pointer',
            }}
          >
            <p style={{
              fontSize: '15px', fontWeight: '600', color: '#d9534f',
              margin: '0 0 2px',
            }}>Leave Group</p>
            <p style={{
              fontSize: '12px', color: theme.colors.textMedium, margin: 0,
            }}>remove yourself from this group</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SettingsScreen;
