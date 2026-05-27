import React, { useState, useEffect, useRef } from 'react';
import { groupsAPI, groupSettingsAPI, collectionsAPI } from '../services/api';
import { theme } from '../theme';

function GroupInfoScreen({ groupData, setGroupData, userData, onBack, onChat, onSettings, onCollections }) {
  const [lastMessage, setLastMessage] = useState(null);
  const [latestAsk, setLatestAsk] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const nameInputRef = useRef(null);

  const members = groupData?.members || [];
  const groupName = groupData?.group_name || 'The four builders';
  const createdDate = groupData?.created_at
    ? new Date(groupData.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '10 March 2025';

  useEffect(() => {
    if (groupData?.group_id) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData?.group_id]);

  const loadData = async () => {
    try {
      const [messages, asks] = await Promise.all([
        groupsAPI.getMessages(groupData.group_id).catch(() => []),
        collectionsAPI.getAsks(groupData.group_id).catch(() => []),
      ]);
      if (messages && messages.length > 0) {
        setLastMessage(messages[messages.length - 1]);
      }
      if (asks && asks.length > 0) {
        setLatestAsk(asks[asks.length - 1]);
      }
    } catch (err) {
      console.error('Error loading group info:', err);
    }
  };

  const startEditName = () => {
    setNameDraft(groupName);
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  const saveName = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === groupName) {
      setEditingName(false);
      return;
    }
    try {
      await groupSettingsAPI.updateGroupName(groupData.group_id, trimmed);
      setGroupData(prev => ({ ...prev, group_name: trimmed }));
    } catch (err) {
      console.error('Error updating group name:', err);
    }
    setEditingName(false);
  };

  const SectionHeader = ({ icon, title, onClick }) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon}
        <h3 style={{ fontSize: '17px', fontWeight: '700', color: theme.colors.textDark, margin: 0 }}>
          {title}
        </h3>
      </div>
      {onClick && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={theme.colors.textMedium}>
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
        </svg>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      paddingBottom: '90px',
    }}>
      <div style={{ maxWidth: 'var(--app-max-width, 100%)', margin: '0 auto', padding: '16px 20px 0' }}>

        {/* Header: back, title, settings */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '4px',
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
            {editingName ? (
              <input
                ref={nameInputRef}
                value={nameDraft}
                onChange={e => setNameDraft(e.target.value)}
                onBlur={saveName}
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                style={{
                  fontSize: '22px', fontWeight: '700', color: theme.colors.textDark,
                  background: '#f5f7fa', border: `1px solid ${theme.colors.borderLight}`,
                  borderRadius: '8px', padding: '4px 12px',
                  outline: 'none', textAlign: 'center',
                  width: '100%', boxSizing: 'border-box',
                }}
              />
            ) : (
              <h1
                onClick={startEditName}
                style={{
                  fontSize: '22px', fontWeight: '700', color: theme.colors.textDark, margin: 0,
                  cursor: 'pointer',
                }}
              >
                {groupName}
              </h1>
            )}
          </div>

          <button onClick={onSettings} aria-label="Settings" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.colors.textDark,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {/* Created date */}
        <p style={{
          textAlign: 'center', fontSize: '12px', color: theme.colors.textLight,
          margin: '0 0 22px',
        }}>Group created {createdDate}</p>

        {/* Member avatars */}
        <div style={{
          display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
          marginBottom: '28px', gap: '8px',
        }}>
          {members.map((member, i) => (
            <div key={member.user_id || i} style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                backgroundColor: '#e8e8e8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: '600', color: theme.colors.textMedium,
                margin: '0 auto', overflow: 'hidden',
              }}>
                {member.profile_photo_url ? (
                  <img src={member.profile_photo_url} alt={member.first_name} style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                  }} />
                ) : (
                  (member.first_name || 'U')[0]
                )}
              </div>
              <p style={{
                fontSize: '13px', color: theme.colors.textDark,
                margin: '8px 0 0', fontWeight: '500',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {[member.first_name, member.surname].filter(Boolean).join(' ') || 'User'}
              </p>
            </div>
          ))}
        </div>

        {/* ─── Chat section ─── */}
        <div style={{ paddingBottom: '20px' }}>
          <SectionHeader
            onClick={onChat}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            }
            title="Chat"
          />
          {lastMessage ? (
            <div style={{
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: '12px', padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: theme.colors.textDark }}>
                  {lastMessage.user_first_name || lastMessage.user_name || 'Someone'}
                </span>
                <span style={{ fontSize: '12px', color: theme.colors.textLight }}>
                  {lastMessage.created_at ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <p style={{
                fontSize: '13px', color: theme.colors.textMedium, margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{lastMessage.message_text}</p>
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: theme.colors.textLight, margin: 0 }}>
              No messages yet
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${theme.colors.borderLight}` }} />

        {/* ─── Archive section ─── */}
        <div style={{ padding: '20px 0' }}>
          <SectionHeader
            onClick={onCollections}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            }
            title="Archive"
          />
          {latestAsk ? (
            <div style={{
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: '12px', padding: '12px 14px',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '3px 10px', borderRadius: '12px',
                border: `1px solid ${theme.colors.borderLight}`,
                marginBottom: '6px',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill={theme.colors.textMedium}>
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
                <span style={{ fontSize: '11px', fontWeight: '500', color: theme.colors.textMedium }}>
                  Ask the group
                </span>
              </div>
              <p style={{
                fontSize: '13px', color: theme.colors.textMedium, margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{latestAsk.question}</p>
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: theme.colors.textLight, margin: 0 }}>
              Nothing in the archive yet
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${theme.colors.borderLight}` }} />

        {/* ─── Photos & video section ─── */}
        <div style={{ paddingTop: '20px' }}>
          <SectionHeader
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            }
            title="Photos & video"
          />
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {[
              'linear-gradient(135deg, #c8a882, #8b6f47)',
              'linear-gradient(135deg, #87a8b8, #5a7d8c)',
              'linear-gradient(135deg, #6b8e9e, #3d5a6b)',
              'linear-gradient(135deg, #b8956b, #6e5535)',
            ].map((bg, i) => (
              <div key={i} style={{
                flex: 1, aspectRatio: '1 / 1', borderRadius: '10px',
                background: bg, minWidth: 0,
              }} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default GroupInfoScreen;
