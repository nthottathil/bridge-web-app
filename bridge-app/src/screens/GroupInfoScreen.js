import React, { useState, useEffect, useRef } from 'react';
import { groupsAPI, groupSettingsAPI, collectionsAPI } from '../services/api';
import { theme } from '../theme';

function GroupInfoScreen({ groupData, setGroupData, userData, onBack, onChat, onSettings, onCollections }) {
  const [timeline, setTimeline] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [latestAsk, setLatestAsk] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(null);
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
      const [timelineData, messages, asks] = await Promise.all([
        groupSettingsAPI.getTimeline(groupData.group_id).catch(() => []),
        groupsAPI.getMessages(groupData.group_id).catch(() => []),
        collectionsAPI.getAsks(groupData.group_id).catch(() => []),
      ]);
      setTimeline(timelineData || []);
      if (messages && messages.length > 0) {
        setLastMessage(messages[messages.length - 1]);
      }
      if (asks && asks.length > 0) {
        setLatestAsk(asks[asks.length - 1]);
      }
      // Auto-expand current week
      const current = (timelineData || []).find(w => w.status === 'current');
      if (current) setExpandedWeek(current.week);
    } catch (err) {
      console.error('Error loading group info:', err);
    }
  };

  const getWeekStatus = (item) => {
    if (item.status) return item.status;
    return 'future';
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

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(180deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
        padding: '16px 16px 28px',
        borderRadius: '0 0 24px 24px',
      }}>
        <div style={{
          maxWidth: 'var(--app-max-width, 100%)', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Back arrow */}
          <button onClick={onBack} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>

          {/* Group title */}
          <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
            {editingName ? (
              <input
                ref={nameInputRef}
                value={nameDraft}
                onChange={e => setNameDraft(e.target.value)}
                onBlur={saveName}
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                style={{
                  fontSize: '20px', fontWeight: '700', color: '#fff',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  borderRadius: '8px', padding: '4px 12px',
                  outline: 'none', textAlign: 'center',
                  width: '100%', boxSizing: 'border-box',
                }}
              />
            ) : (
              <h1
                onClick={startEditName}
                style={{
                  fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}
              >
                {groupName}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </h1>
            )}
            <p style={{
              fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '4px 0 0',
            }}>Group created {createdDate}</p>
          </div>

          {/* Settings gear */}
          <button onClick={onSettings} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.6 3.6 0 0112 15.6z"/>
            </svg>
          </button>
        </div>

        {/* Member avatars row */}
        <div style={{
          maxWidth: 'var(--app-max-width, 100%)', margin: '20px auto 0',
          display: 'flex', justifyContent: 'center', gap: '20px',
        }}>
          {members.map((member, i) => (
            <div key={member.user_id || i} style={{ textAlign: 'center' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.25)',
                border: '2.5px solid rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: '600', color: '#fff',
                margin: '0 auto',
                overflow: 'hidden',
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
                fontSize: '11px', color: 'rgba(255,255,255,0.85)',
                margin: '6px 0 0', fontWeight: '500',
              }}>{member.first_name || 'User'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content sections */}
      <div style={{ maxWidth: 'var(--app-max-width, 100%)', margin: '0 auto', padding: '16px 16px 80px' }}>

        {/* Chat section */}
        <div
          onClick={onChat}
          style={{
            backgroundColor: theme.colors.surfaceWhite,
            borderRadius: theme.borderRadius.card,
            padding: '16px',
            marginBottom: '12px',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: 'rgba(45, 79, 92, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.colors.primary}>
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '15px', fontWeight: '600', color: theme.colors.textDark, margin: 0,
              }}>Chat</h3>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.colors.textLight}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </div>
          {lastMessage ? (
            <div style={{
              backgroundColor: '#f7f8f9', borderRadius: '10px', padding: '10px 12px',
            }}>
              <p style={{
                fontSize: '12px', fontWeight: '600', color: theme.colors.textDark,
                margin: '0 0 2px',
              }}>{lastMessage.user_first_name || lastMessage.user_name || 'Someone'}</p>
              <p style={{
                fontSize: '13px', color: theme.colors.textMedium, margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{lastMessage.message_text}</p>
              <p style={{
                fontSize: '11px', color: theme.colors.textLight, margin: '4px 0 0',
                textAlign: 'right',
              }}>{lastMessage.created_at ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: theme.colors.textLight, margin: 0 }}>
              No messages yet
            </p>
          )}
        </div>

        {/* Collection section */}
        <div
          onClick={onCollections}
          style={{
            backgroundColor: theme.colors.surfaceWhite,
            borderRadius: theme.borderRadius.card,
            padding: '16px',
            marginBottom: '12px',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: 'rgba(45, 79, 92, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.colors.primary}>
                  <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '15px', fontWeight: '600', color: theme.colors.textDark, margin: 0,
              }}>Collection</h3>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.colors.textLight}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '11px', fontWeight: '500', color: theme.colors.primary,
              backgroundColor: 'rgba(45, 79, 92, 0.1)',
              padding: '3px 10px', borderRadius: '12px',
            }}>Ask the group</span>
          </div>
          {latestAsk ? (
            <p style={{
              fontSize: '13px', color: theme.colors.textMedium, margin: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{latestAsk.question}</p>
          ) : (
            <p style={{ fontSize: '13px', color: theme.colors.textLight, margin: 0 }}>
              No asks yet
            </p>
          )}
        </div>

        {/* Photos & video section */}
        <div style={{
          backgroundColor: theme.colors.surfaceWhite,
          borderRadius: theme.borderRadius.card,
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: 'rgba(45, 79, 92, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.colors.primary}>
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '15px', fontWeight: '600', color: theme.colors.textDark, margin: 0,
              }}>Photos & video</h3>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.colors.textLight}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </div>
          {/* Thumbnail placeholders */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                width: '72px', height: '72px', borderRadius: '10px',
                backgroundColor: '#e8eaed', flexShrink: 0,
              }} />
            ))}
          </div>
        </div>

        {/* Timeline section */}
        <div style={{
          backgroundColor: theme.colors.surfaceWhite,
          borderRadius: theme.borderRadius.card,
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: 'rgba(45, 79, 92, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.colors.primary}>
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '15px', fontWeight: '600', color: theme.colors.textDark, margin: 0,
            }}>Timeline</h3>
          </div>

          {/* Weekly focuses */}
          <div style={{ position: 'relative', paddingLeft: '20px' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: '7px', top: '4px', bottom: '4px',
              width: '2px', backgroundColor: '#e0e0e0',
            }} />

            {timeline.length > 0 ? timeline.map((item, i) => {
              const status = getWeekStatus(item);
              const isCurrent = status === 'current';
              const isPast = status === 'past' || status === 'completed';
              const isFuture = status === 'future';
              const isExpanded = expandedWeek === item.week;

              return (
                <div
                  key={item.week || i}
                  onClick={() => setExpandedWeek(isExpanded ? null : item.week)}
                  style={{
                    marginBottom: i < timeline.length - 1 ? '16px' : '0',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: '-17px', top: '3px',
                    width: '12px', height: '12px', borderRadius: '50%',
                    backgroundColor: (isPast || isCurrent) ? theme.colors.primary : 'transparent',
                    border: `2px solid ${(isPast || isCurrent) ? theme.colors.primary : '#ccc'}`,
                    zIndex: 1,
                  }} />

                  <p style={{
                    fontSize: '11px', fontWeight: '600',
                    color: isFuture ? theme.colors.textLight : theme.colors.primary,
                    margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>Week {item.week}</p>

                  <p style={{
                    fontSize: '14px', fontWeight: '600',
                    color: isFuture ? theme.colors.textLight : theme.colors.textDark,
                    margin: 0,
                  }}>{item.title || item.focus || 'Untitled'}</p>

                  {isExpanded && item.description && (
                    <p style={{
                      fontSize: '13px', color: theme.colors.textMedium,
                      margin: '6px 0 0', lineHeight: '1.5',
                    }}>{item.description}</p>
                  )}
                </div>
              );
            }) : (
              <p style={{ fontSize: '13px', color: theme.colors.textLight, margin: 0 }}>
                No timeline set up yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupInfoScreen;
