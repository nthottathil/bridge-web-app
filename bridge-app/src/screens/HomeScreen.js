import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import BridgeLogo from '../components/BridgeLogo';
import CalendarWeekView from '../components/CalendarWeekView';
import { groupsAPI } from '../services/api';

function HomeScreen({ userData, groupData, onProfile, onChat }) {
  const [lastMessage, setLastMessage] = useState(null);
  const [events] = useState([]);

  useEffect(() => {
    if (groupData?.group_id) {
      loadLastMessage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData]);

  const loadLastMessage = async () => {
    try {
      const messages = await groupsAPI.getMessages(groupData.group_id);
      if (messages && messages.length > 0) {
        setLastMessage(messages[messages.length - 1]);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const members = groupData?.members || [];
  const daysActive = groupData?.created_at
    ? Math.max(1, Math.ceil((Date.now() - new Date(groupData.created_at).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      padding: '20px 16px 80px',
    }}>
      <div style={{ maxWidth: '430px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <BridgeLogo />
          <button onClick={onProfile} style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.primary}>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>
        </div>

        {/* Profile card */}
        <div style={{
          backgroundColor: theme.colors.surfaceCard,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              backgroundColor: theme.colors.primary, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: '600',
            }}>
              {(userData.firstName || 'U')[0]}
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: theme.colors.textDark, margin: 0 }}>
                {userData.firstName} {userData.surname}
              </h2>
              <p style={{ fontSize: '14px', color: theme.colors.textMedium, margin: '2px 0 0' }}>
                {userData.profession || 'No profession set'}
              </p>
              {userData.focus && (
                <span style={{
                  display: 'inline-block', fontSize: '11px', padding: '3px 8px',
                  backgroundColor: 'rgba(45, 79, 92, 0.1)', borderRadius: '8px',
                  color: theme.colors.primary, fontWeight: '500', marginTop: '4px',
                }}>{userData.focus}</span>
              )}
            </div>
          </div>
          {userData.headline && (
            <p style={{
              fontSize: '13px', color: theme.colors.textMedium,
              marginTop: '12px', lineHeight: '1.5',
            }}>{userData.headline}</p>
          )}
        </div>

        {/* Group section */}
        {groupData && (
          <div
            onClick={onChat}
            style={{
              backgroundColor: theme.colors.surfaceCard,
              borderRadius: '16px',
              padding: '18px',
              marginBottom: '16px',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.textDark, margin: 0 }}>
                Your Group
              </h3>
              <span style={{ fontSize: '12px', color: theme.colors.textMedium }}>
                Day {daysActive}
              </span>
            </div>

            {/* Member avatars */}
            <div style={{ display: 'flex', marginBottom: '10px' }}>
              {members.map((member, i) => (
                <div key={member.user_id || i} style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  backgroundColor: theme.colors.primary,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '600', border: '2px solid #fff',
                  marginLeft: i > 0 ? '-8px' : '0',
                  zIndex: members.length - i,
                }}>
                  {(member.first_name || 'U')[0]}
                </div>
              ))}
            </div>

            {/* Last message */}
            {lastMessage ? (
              <p style={{
                fontSize: '13px', color: theme.colors.textMedium,
                margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {lastMessage.user_name || 'Someone'}: {lastMessage.message_text}
              </p>
            ) : (
              <p style={{ fontSize: '13px', color: theme.colors.textLight, margin: 0 }}>
                No messages yet — say hello!
              </p>
            )}
          </div>
        )}

        {/* Calendar */}
        <div style={{
          backgroundColor: theme.colors.surfaceCard,
          borderRadius: '16px',
          padding: '18px',
          backdropFilter: 'blur(10px)',
        }}>
          <CalendarWeekView events={events} />
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
