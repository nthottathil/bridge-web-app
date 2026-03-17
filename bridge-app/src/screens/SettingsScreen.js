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
        width: '50px',
        height: '30px',
        borderRadius: '15px',
        border: 'none',
        backgroundColor: value ? theme.colors.primary : '#ddd',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.25s ease',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <div style={{
        width: '26px',
        height: '26px',
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
    group_goal_created: true,
    ask_the_group: true,
    vote_member_changes: true,
  });
  const [loading, setLoading] = useState(true);

  const groupName = groupData?.name || 'Your Group';

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
      // Revert on failure
      setSettings(prev => ({ ...prev, [key]: !value }));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: theme.colors.primary,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <button onClick={onBack} style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div>
          <h1 style={{
            fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0,
          }}>Settings</h1>
          <p style={{
            fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '2px 0 0',
          }}>{groupName}</p>
        </div>
      </div>

      <div style={{ maxWidth: '430px', margin: '0 auto', padding: '20px 16px 80px' }}>

        {/* Notifications section */}
        <div style={{
          backgroundColor: theme.colors.surfaceWhite,
          borderRadius: theme.borderRadius.card,
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{
            fontSize: '16px', fontWeight: '600', color: theme.colors.textDark,
            margin: '0 0 6px',
          }}>Notifications</h3>
          <p style={{
            fontSize: '13px', color: theme.colors.textMedium,
            margin: '0 0 18px', lineHeight: '1.4',
          }}>Choose what notifications you want to receive from this group</p>

          {loading ? (
            <p style={{ fontSize: '13px', color: theme.colors.textLight }}>Loading...</p>
          ) : (
            NOTIFICATION_OPTIONS.map((option, i) => (
              <div
                key={option.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderTop: i > 0 ? `1px solid ${theme.colors.borderLight}` : 'none',
                }}
              >
                <span style={{
                  fontSize: '15px', color: theme.colors.textDark, fontWeight: '400',
                }}>{option.label}</span>
                <ToggleSwitch
                  value={settings[option.key]}
                  onChange={(val) => handleToggle(option.key, val)}
                />
              </div>
            ))
          )}
        </div>

        {/* Group Actions section */}
        <div style={{
          backgroundColor: theme.colors.surfaceWhite,
          borderRadius: theme.borderRadius.card,
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {/* Manage Members */}
          <div style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${theme.colors.borderLight}`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{
                fontSize: '15px', fontWeight: '500', color: theme.colors.textDark,
                margin: 0,
              }}>Manage Members</p>
              <p style={{
                fontSize: '12px', color: theme.colors.textMedium, margin: '2px 0 0',
              }}>Vote to remove group members</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.colors.textLight}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </div>

          {/* Leave Group */}
          <div
            onClick={onLeaveGroup}
            style={{
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div>
              <p style={{
                fontSize: '15px', fontWeight: '500', color: '#c33',
                margin: 0,
              }}>Leave Group</p>
              <p style={{
                fontSize: '12px', color: theme.colors.textMedium, margin: '2px 0 0',
              }}>Remove yourself from this group</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.colors.textLight}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsScreen;
