import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../theme';
import BridgeLogo from '../components/BridgeLogo';
import { friendsAPI, collectionsAPI, groupSettingsAPI } from '../services/api';

function HomeScreen({ userData, groupData, setGroupData, onProfile, onChat, onCalendar, onGroupInfo }) {
  const [friends, setFriends] = useState([]);
  const [activeGoal, setActiveGoal] = useState(null);
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [groupNameDraft, setGroupNameDraft] = useState('');
  const groupNameInputRef = useRef(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData]);

  const loadData = async () => {
    try {
      if (groupData?.group_id) {
        const goalsData = await collectionsAPI.getGoals(groupData.group_id).catch(() => []);
        if (Array.isArray(goalsData) && goalsData.length > 0) {
          const active = goalsData.find(g => g.status === 'active') || goalsData[0];
          setActiveGoal(active);
        }
      }
      const friendsData = await friendsAPI.getFriends().catch(() => []);
      setFriends(Array.isArray(friendsData) ? friendsData : []);
    } catch (err) {
      console.error('Error loading home data:', err);
    }
  };

  const members = groupData?.members || [];

  const startEditGroupName = (e) => {
    e.stopPropagation();
    setGroupNameDraft(groupData.group_name || '');
    setEditingGroupName(true);
    setTimeout(() => groupNameInputRef.current?.focus(), 50);
  };

  const saveGroupName = async () => {
    const trimmed = groupNameDraft.trim();
    if (!trimmed || trimmed === (groupData.group_name || '')) {
      setEditingGroupName(false);
      return;
    }
    try {
      await groupSettingsAPI.updateGroupName(groupData.group_id, trimmed);
      setGroupData(prev => ({ ...prev, group_name: trimmed }));
    } catch (err) {
      console.error('Error updating group name:', err);
    }
    setEditingGroupName(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F4F6F8',
      padding: '20px var(--app-padding, 16px) 90px',
    }}>
      <div style={{ maxWidth: 'var(--app-max-width, 100%)', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <BridgeLogo size="small" />
          <button onClick={onProfile} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* Profile Card */}
        <div
          onClick={onProfile}
          style={{
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
          }}
        >
          {userData.profilePhoto ? (
            <img
              src={userData.profilePhoto}
              alt={userData.firstName}
              style={{
                width: '56px', height: '56px', borderRadius: '50%',
                objectFit: 'cover', flexShrink: 0,
              }}
            />
          ) : (
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              backgroundColor: theme.colors.primary, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: '700', flexShrink: 0,
            }}>
              {(userData.firstName || 'U')[0]}
            </div>
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2 style={{
              fontSize: '20px', fontWeight: '700',
              color: theme.colors.textDark, margin: 0,
              lineHeight: '1.2',
            }}>
              {userData.firstName} {userData.surname}
            </h2>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              marginTop: '6px', flexWrap: 'wrap',
            }}>
              {userData.location && (
                <span style={{ fontSize: '13px', color: theme.colors.textMedium }}>
                  {userData.location}
                </span>
              )}
              {userData.focus && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontSize: '12px', padding: '4px 10px',
                  border: `1px solid ${theme.colors.borderLight}`,
                  borderRadius: '14px',
                  color: theme.colors.textDark, fontWeight: '500',
                  backgroundColor: '#fff',
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  {userData.focus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Group Card */}
        {groupData && (
          <div
            onClick={onChat}
            style={{
              background: 'linear-gradient(135deg, #DCE5EC 0%, #C7D5DF 100%)',
              borderRadius: '20px',
              padding: '18px',
              marginBottom: '24px',
              cursor: 'pointer',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '14px',
            }}>
              {editingGroupName ? (
                <input
                  ref={groupNameInputRef}
                  value={groupNameDraft}
                  onChange={e => setGroupNameDraft(e.target.value)}
                  onBlur={saveGroupName}
                  onKeyDown={e => { if (e.key === 'Enter') saveGroupName(); if (e.key === 'Escape') setEditingGroupName(false); }}
                  onClick={e => e.stopPropagation()}
                  style={{
                    fontSize: '17px', fontWeight: '700',
                    color: theme.colors.textDark,
                    border: `1px solid ${theme.colors.primary}`,
                    borderRadius: '8px', padding: '4px 8px',
                    outline: 'none', flex: 1, minWidth: 0,
                    backgroundColor: '#fff',
                  }}
                />
              ) : (
                <h3
                  onClick={startEditGroupName}
                  style={{
                    fontSize: '17px', fontWeight: '700',
                    color: theme.colors.textDark, margin: 0,
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  {groupData.group_name || 'My Group'}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </h3>
              )}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', color: theme.colors.textDark, fontWeight: '500',
              }}>
                <svg width="18" height="14" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v3" />
                  <path d="M5.5 5l1.5 2" />
                  <path d="M18.5 5l-1.5 2" />
                  <path d="M3 13a9 9 0 0 1 18 0" />
                  <path d="M1 17h22" />
                </svg>
                <span>Weeks</span>
              </div>
            </div>

            {/* Member avatars */}
            <div style={{ display: 'flex', marginBottom: '14px' }}>
              {members.map((member, i) => (
                <div key={member.user_id || i} style={{
                  width: '46px', height: '46px', borderRadius: '50%',
                  backgroundColor: theme.colors.primary,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', fontWeight: '600',
                  border: '3px solid #fff',
                  marginLeft: i > 0 ? '-12px' : '0',
                  zIndex: members.length - i,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  {member.profile_photo_url ? (
                    <img src={member.profile_photo_url} alt="" style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                    }} />
                  ) : (
                    (member.first_name || 'U')[0]
                  )}
                </div>
              ))}
            </div>

            {/* Active goal pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '13px', padding: '8px 14px',
              backgroundColor: 'rgba(116, 153, 182, 0.25)',
              borderRadius: '14px',
              color: theme.colors.textDark, fontWeight: '500',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              {activeGoal?.title || 'each person ships 1 portfolio piece'}
            </div>
          </div>
        )}

        {/* Friends Section */}
        <h3 style={{
          fontSize: '17px', fontWeight: '700',
          color: theme.colors.textDark, margin: '0 0 12px',
        }}>
          Friends
        </h3>

        {friends.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {friends.map((friend, i) => (
              <div key={friend.friend_id || friend.user_id || i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px',
                backgroundColor: '#fff',
                borderRadius: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                {friend.profile_photo ? (
                  <img
                    src={friend.profile_photo}
                    alt={friend.first_name}
                    style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      objectFit: 'cover', flexShrink: 0,
                    }}
                  />
                ) : (
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    backgroundColor: theme.colors.primary, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: '600', flexShrink: 0,
                  }}>
                    {(friend.first_name || 'U')[0]}
                  </div>
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{
                    fontSize: '15px', fontWeight: '600',
                    color: theme.colors.textDark, margin: 0,
                  }}>
                    {friend.first_name} {friend.surname || friend.last_name || ''}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                    {friend.location && (
                      <span style={{ fontSize: '12px', color: theme.colors.textMedium }}>
                        {friend.location}
                      </span>
                    )}
                    {friend.focus && (
                      <span style={{
                        display: 'inline-block', fontSize: '11px', padding: '3px 9px',
                        border: `1px solid ${theme.colors.borderLight}`,
                        borderRadius: '12px',
                        color: theme.colors.textDark, fontWeight: '500',
                      }}>
                        {friend.focus}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{
            fontSize: '13px', color: theme.colors.textLight,
            margin: '0 0 24px', textAlign: 'center',
          }}>
            No friends yet
          </p>
        )}

        {/* Groups Section */}
        <h3 style={{
          fontSize: '17px', fontWeight: '700',
          color: theme.colors.textDark, margin: '0 0 12px',
        }}>
          Groups
        </h3>
        {/* Empty placeholder for now */}
      </div>
    </div>
  );
}

export default HomeScreen;
