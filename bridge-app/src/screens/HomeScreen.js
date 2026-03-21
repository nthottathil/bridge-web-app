import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import BridgeLogo from '../components/BridgeLogo';
import { eventsAPI, friendsAPI, collectionsAPI } from '../services/api';

function HomeScreen({ userData, groupData, onProfile, onChat, onCalendar, onGroupInfo }) {
  const [events, setEvents] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeGoal, setActiveGoal] = useState(null);

  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const currentDay = today.getDay(); // 0=Sun
  const currentDate = today.getDate();

  // Get the week's dates (Sun-Sat)
  const weekDates = [];
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDates.push(d.getDate());
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData]);

  const loadData = async () => {
    try {
      if (groupData?.group_id) {
        const [eventsData, goalsData] = await Promise.all([
          eventsAPI.getEvents(groupData.group_id).catch(() => []),
          collectionsAPI.getGoals(groupData.group_id).catch(() => []),
        ]);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
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

  const formatEventTime = (event) => {
    if (!event.event_date) return '';
    try {
      const d = new Date(event.event_date);
      return d.toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const eventColors = ['#4A90D9', '#E67E22', '#27AE60', '#8E44AD', '#E74C3C'];

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      padding: '20px var(--app-padding, 16px) 90px',
    }}>
      <div style={{ maxWidth: 'var(--app-max-width, 100%)', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <BridgeLogo />
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
        <div style={{
          backgroundColor: theme.colors.surfaceWhite,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {userData.profilePhoto ? (
              <img
                src={userData.profilePhoto}
                alt={userData.firstName}
                style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                backgroundColor: theme.colors.primary, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: '600',
                flexShrink: 0,
              }}>
                {(userData.firstName || 'U')[0]}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <h2 style={{
                fontSize: '20px', fontWeight: '700',
                color: theme.colors.textDark, margin: 0,
              }}>
                {userData.firstName} {userData.surname}
              </h2>
              {userData.location && (
                <p style={{
                  fontSize: '13px', color: theme.colors.textMedium,
                  margin: '2px 0 0',
                }}>
                  {userData.location}
                </p>
              )}
              <span style={{
                display: 'inline-block', fontSize: '11px', padding: '3px 10px',
                backgroundColor: 'rgba(45, 79, 92, 0.1)', borderRadius: '10px',
                color: theme.colors.primary, fontWeight: '600', marginTop: '6px',
              }}>
                {userData.focus || 'Portfolio builder'}
              </span>
            </div>
          </div>
          {userData.headline && (
            <p style={{
              fontSize: '13px', color: theme.colors.textMedium,
              marginTop: '14px', marginBottom: 0, lineHeight: '1.5',
            }}>
              {userData.headline}
            </p>
          )}
        </div>

        {/* Group Card */}
        {groupData && (
          <div
            onClick={onChat}
            style={{
              backgroundColor: theme.colors.surfaceWhite,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              cursor: 'pointer',
            }}
          >
            <h3 style={{
              fontSize: '18px', fontWeight: '700',
              color: theme.colors.textDark, margin: '0 0 12px',
            }}>
              Group
            </h3>

            {/* Group name bordered card */}
            <div style={{
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={theme.colors.primary}>
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <span style={{
                  fontSize: '15px', fontWeight: '600',
                  color: theme.colors.textDark,
                }}>
                  {groupData.group_name || 'My Group'}
                </span>
              </div>
              <span style={{
                fontSize: '12px', color: theme.colors.textLight,
                fontWeight: '500',
              }}>
                {groupData.weeks || ''} Weeks
              </span>
            </div>

            {/* Member avatars */}
            <div style={{ display: 'flex', marginBottom: '12px' }}>
              {members.map((member, i) => (
                <div key={member.user_id || i} style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  backgroundColor: theme.colors.primary,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '600', border: '2px solid #fff',
                  marginLeft: i > 0 ? '-10px' : '0',
                  zIndex: members.length - i,
                  overflow: 'hidden',
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

            {/* Active goal tag */}
            {activeGoal && (
              <div style={{
                display: 'inline-block',
                fontSize: '12px', padding: '5px 12px',
                backgroundColor: 'rgba(45, 79, 92, 0.08)',
                borderRadius: '10px',
                color: theme.colors.primary, fontWeight: '500',
              }}>
                {activeGoal.title || 'each person ships 1 portfolio piece'}
              </div>
            )}
          </div>
        )}

        {/* Calendar Section */}
        <div
          onClick={onCalendar}
          style={{
            backgroundColor: theme.colors.surfaceWhite,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {/* Calendar header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '16px',
          }}>
            <h3 style={{
              fontSize: '18px', fontWeight: '700',
              color: theme.colors.textDark, margin: 0,
              cursor: 'pointer',
            }}>
              Calendar{' '}
              <span style={{ fontSize: '16px', color: theme.colors.textLight }}>{'>'}</span>
            </h3>
            <span style={{
              fontSize: '13px', color: theme.colors.textMedium, fontWeight: '500',
            }}>
              {currentMonth} {currentYear}
            </span>
          </div>

          {/* Week days row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center', marginBottom: '8px',
          }}>
            {dayLabels.map((label, i) => (
              <span key={i} style={{
                fontSize: '12px', color: theme.colors.textLight,
                fontWeight: '600',
              }}>
                {label}
              </span>
            ))}
          </div>

          {/* Week dates row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center', marginBottom: '16px',
          }}>
            {weekDates.map((date, i) => {
              const isToday = date === currentDate;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '6px 0',
                }}>
                  <span style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: isToday ? '700' : '500',
                    backgroundColor: isToday ? theme.colors.primary : 'transparent',
                    color: isToday ? '#fff' : theme.colors.textDark,
                  }}>
                    {date}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Events list */}
          {events.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {events.slice(0, 4).map((event, i) => (
                <div key={event.event_id || i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: eventColors[i % eventColors.length],
                    marginTop: '5px', flexShrink: 0,
                  }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{
                      fontSize: '14px', fontWeight: '600',
                      color: theme.colors.textDark, margin: 0,
                    }}>
                      {event.title}
                    </p>
                    <p style={{
                      fontSize: '12px', color: theme.colors.textLight,
                      margin: '2px 0 0',
                    }}>
                      {formatEventTime(event)}
                      {event.location ? ` \u00B7 ${event.location}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{
              fontSize: '13px', color: theme.colors.textLight,
              margin: 0, textAlign: 'center',
            }}>
              No upcoming events
            </p>
          )}
        </div>

        {/* Friends Section */}
        {friends.length > 0 && (
          <div style={{
            backgroundColor: theme.colors.surfaceWhite,
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{
              fontSize: '18px', fontWeight: '700',
              color: theme.colors.textDark, margin: '0 0 14px',
            }}>
              Friends
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {friends.map((friend, i) => (
                <div key={friend.friend_id || friend.user_id || i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px',
                  backgroundColor: 'rgba(45, 79, 92, 0.03)',
                  borderRadius: '12px',
                }}>
                  {friend.profile_photo ? (
                    <img
                      src={friend.profile_photo}
                      alt={friend.first_name}
                      style={{
                        width: '42px', height: '42px', borderRadius: '50%',
                        objectFit: 'cover', flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
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
                    {friend.location && (
                      <p style={{
                        fontSize: '12px', color: theme.colors.textMedium,
                        margin: '2px 0 0',
                      }}>
                        {friend.location}
                      </p>
                    )}
                    {friend.focus && (
                      <span style={{
                        display: 'inline-block', fontSize: '10px', padding: '2px 8px',
                        backgroundColor: 'rgba(45, 79, 92, 0.1)', borderRadius: '8px',
                        color: theme.colors.primary, fontWeight: '500', marginTop: '4px',
                      }}>
                        {friend.focus}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
