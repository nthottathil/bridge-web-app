import React, { useState, useEffect, useRef } from 'react';
import { matchingAPI, groupsAPI } from '../services/api';
import { theme } from '../theme';
import BridgeLogo from '../components/BridgeLogo';
import ChatScreen from './ChatScreen';

function MatchingScreen({ data, onBack, onLogout, onProfile, onGroupFormed }) {
  const [matchState, setMatchState] = useState('searching');
  const [matches, setMatches] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequest, setSentRequest] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('carousel'); // 'carousel' | 'profile'
  const [selectedMatch, setSelectedMatch] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadMatches();
    checkExistingGroup();
    loadRequests();
    // One interval covers incoming requests, outgoing requests and group
    // creation, so a user waiting on someone else's answer gets moved on
    // automatically.
    const pollInterval = setInterval(() => {
      loadRequests();
      checkExistingGroup();
    }, 5000);
    return () => clearInterval(pollInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hand off to the app shell (home + bottom nav) once a group exists.
  useEffect(() => {
    if (group && onGroupFormed) onGroupFormed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const matchesData = await matchingAPI.getMatches();
      setMatches(matchesData);
      setTimeout(() => setMatchState('found'), 1500);
    } catch (err) {
      console.error('Error loading matches:', err);
      // Don't show error if user is already in a group — that's expected
      const detail = err.response?.data?.detail || '';
      if (!detail.toLowerCase().includes('already in a group')) {
        setError(detail || 'Failed to load matches');
      }
      setMatchState('found');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingGroup = async () => {
    try {
      const groupData = await groupsAPI.getMyGroup();
      if (groupData) setGroup(groupData);
    } catch (err) {
      console.error('Error checking group:', err);
    }
  };

  const loadRequests = async () => {
    try {
      const [incoming, sent] = await Promise.all([
        matchingAPI.getMatchRequests().catch(() => []),
        matchingAPI.getSentMatchRequests().catch(() => []),
      ]);
      setIncomingRequests(incoming || []);
      setSentRequest((sent && sent[0]) || null);
    } catch (err) {
      console.error('Error loading match requests:', err);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const result = await matchingAPI.acceptMatchRequest(requestId);
      if (result.group_id) {
        const groupData = await groupsAPI.getMyGroup();
        if (groupData) setGroup(groupData);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await matchingAPI.rejectMatchRequest(requestId);
      setIncomingRequests(prev => prev.filter(r => r.request_id !== requestId));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reject request');
    }
  };

  const handleBridge = async (match) => {
    setSelectedMatch(match);
    const waitingOn = {
      to_user: { user_id: match.user_id, first_name: match.first_name },
    };
    try {
      await matchingAPI.sendMatchRequest(match.user_id);
      setSentRequest(waitingOn);
      loadRequests();
    } catch (err) {
      const detail = err.response?.data?.detail || '';
      // Already bridged with this person — show the waiting state rather
      // than an error, which is what the user actually wants to see.
      if (detail.toLowerCase().includes('already exists')) {
        setSentRequest(waitingOn);
        loadRequests();
      } else {
        setError(detail || 'Failed to send match request');
      }
    }
  };

  const handleViewProfile = (match) => {
    setSelectedMatch(match);
    setView('profile');
  };

  // Group exists: the app shell takes over (home + bottom nav) via
  // onGroupFormed. Only fall back to rendering chat inline if no handler.
  if (group) {
    if (onGroupFormed) {
      return (
        <div style={{
          minHeight: '100vh',
          background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px',
              border: `3px solid ${theme.colors.borderLight}`,
              borderTop: `3px solid ${theme.colors.primary}`,
              borderRadius: '50%', margin: '0 auto 16px',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ fontSize: '16px', color: theme.colors.textDark }}>
              Your group is ready — opening it now...
            </p>
          </div>
        </div>
      );
    }
    return <ChatScreen groupData={group} userData={data} onProfile={onProfile} />;
  }

  // "You're in!! Waiting on the squad." — the home screen for someone whose
  // bridge request hasn't been answered yet. Shown instead of the carousel so
  // they can't re-bridge with someone they've already requested.
  if (sentRequest) {
    const waitingOnName = sentRequest.to_user?.first_name;
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          backgroundColor: theme.colors.surfaceWhite,
          borderRadius: '20px',
          padding: '32px 28px',
          maxWidth: '360px',
          width: '100%',
          textAlign: 'left',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={theme.colors.primary}>
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: theme.colors.textDark, margin: 0 }}>
                You're in !!
              </h2>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.textDark, margin: 0 }}>
                Waiting on the squad.
              </h3>
            </div>
          </div>
          <p style={{
            fontSize: '14px', color: theme.colors.textMedium,
            margin: '0 0 20px', lineHeight: '1.5',
          }}>
            {waitingOnName
              ? `We've sent your bridge request to ${waitingOnName}. As soon as they accept, your group chat opens automatically — you'll get an email too.`
              : 'Once everyone says yes, your group chat will be created.'}
          </p>

          {incomingRequests.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.textDark, margin: '0 0 10px' }}>
                Someone bridged with you
              </h4>
              {incomingRequests.map(req => (
                <IncomingRequestCard
                  key={req.request_id}
                  request={req}
                  onAccept={() => handleAcceptRequest(req.request_id)}
                  onReject={() => handleRejectRequest(req.request_id)}
                />
              ))}
            </div>
          )}

          {error && (
            <div style={{
              padding: '10px 14px', backgroundColor: theme.colors.errorBg,
              borderRadius: '10px', color: theme.colors.error, marginBottom: '16px',
              fontSize: '13px',
            }}>{error}</div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '16px', height: '16px',
              border: `2px solid ${theme.colors.borderLight}`,
              borderTop: `2px solid ${theme.colors.primary}`,
              borderRadius: '50%', animation: 'spin 1s linear infinite',
            }} />
            <span style={{ fontSize: '13px', color: theme.colors.textLight }}>
              Checking for updates...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Collaborator profile view
  if (view === 'profile' && selectedMatch) {
    const matchAnswers = selectedMatch.perspective_answers || {};
    const answeredPrompts = Object.entries(matchAnswers).filter(([, v]) => v && v.trim());

    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
        padding: '0 0 40px',
      }}>
        <div style={{ maxWidth: 'var(--app-max-width, 100%)', margin: '0 auto' }}>
          {/* Back button */}
          <div style={{ padding: '16px' }}>
            <button onClick={() => setView('carousel')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: theme.colors.textDark, display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '15px', fontWeight: '500', padding: '4px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
          </div>

          {/* Profile photo */}
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: '0',
          }}>
            <div style={{
              width: '180px', height: '200px', borderRadius: '20px',
              backgroundColor: '#e8e8e8', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            }}>
              {selectedMatch.profile_photo_url ? (
                <img src={selectedMatch.profile_photo_url} alt={selectedMatch.first_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '56px', fontWeight: '600',
                }}>
                  {selectedMatch.first_name[0]}
                </div>
              )}
            </div>
          </div>

          {/* Info card */}
          <div style={{
            backgroundColor: theme.colors.surfaceCard,
            borderRadius: '20px',
            margin: '-20px 16px 0',
            padding: '36px 20px 20px',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            zIndex: 1,
          }}>
            <h2 style={{
              fontSize: '22px', fontWeight: '600', color: theme.colors.textDark,
              textAlign: 'center', margin: '0 0 8px',
            }}>
              {selectedMatch.first_name} {selectedMatch.surname || ''}
            </h2>

            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: '10px', marginBottom: '12px',
            }}>
              {selectedMatch.location && (
                <span style={{ fontSize: '14px', color: theme.colors.textMedium }}>
                  {selectedMatch.location}
                </span>
              )}
              {selectedMatch.location && selectedMatch.focus && (
                <span style={{ color: theme.colors.borderLight }}>|</span>
              )}
              {selectedMatch.focus && (
                <span style={{
                  fontSize: '13px', padding: '4px 12px',
                  border: `1px solid ${theme.colors.textMedium}`,
                  borderRadius: '20px', color: theme.colors.textDark,
                  fontWeight: '500',
                }}>
                  {selectedMatch.focus}
                </span>
              )}
            </div>

            {(selectedMatch.headline || selectedMatch.statement) && (
              <p style={{
                fontSize: '14px', color: theme.colors.textDark,
                textAlign: 'center', lineHeight: '1.5', margin: '0 0 4px',
              }}>
                {selectedMatch.headline || selectedMatch.statement}
              </p>
            )}
          </div>

          {/* Goal section */}
          {selectedMatch.primary_goal && (
            <div style={{
              backgroundColor: theme.colors.surfaceCard,
              borderRadius: '20px',
              margin: '14px 16px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.primary}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.textDark, margin: 0 }}>
                  Goal
                </h3>
              </div>
              <p style={{ fontSize: '15px', fontWeight: '600', color: theme.colors.textDark, margin: 0, lineHeight: '1.4' }}>
                {selectedMatch.primary_goal}
              </p>
            </div>
          )}

          {/* Perspective section */}
          {answeredPrompts.length > 0 && (
            <div style={{
              backgroundColor: theme.colors.surfaceCard,
              borderRadius: '20px',
              margin: '0 16px 14px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.primary}>
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
                </svg>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.textDark, margin: 0 }}>
                  Perspective question
                </h3>
              </div>
              {answeredPrompts.map(([prompt, answer]) => (
                <div key={prompt} style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.textDark, margin: '0 0 4px', lineHeight: '1.4' }}>
                    {prompt}
                  </p>
                  <p style={{ fontSize: '13px', color: theme.colors.textMedium, margin: 0, lineHeight: '1.5' }}>
                    {answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Interests */}
          {selectedMatch.interests && selectedMatch.interests.length > 0 && (
            <div style={{
              backgroundColor: theme.colors.surfaceCard,
              borderRadius: '20px',
              margin: '0 16px 14px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedMatch.interests.map(interest => (
                  <span key={interest} style={{
                    padding: '6px 14px', borderRadius: '20px',
                    border: '1px solid #ccc',
                    color: theme.colors.textDark, fontSize: '13px', fontWeight: '500',
                  }}>
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* BRIDGE button */}
          <div style={{ padding: '0 16px' }}>
            <button
              onClick={() => handleBridge(selectedMatch)}
              style={{
                width: '100%', padding: '14px', borderRadius: '16px',
                border: 'none',
                backgroundColor: theme.colors.surfaceWhite,
                color: theme.colors.textDark,
                fontSize: '16px', fontWeight: '700',
                cursor: 'pointer',
                letterSpacing: '2px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              BRIDGE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading / searching state
  if (matchState === 'searching' || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px',
            border: `3px solid ${theme.colors.borderLight}`,
            borderTop: `3px solid ${theme.colors.primary}`,
            borderRadius: '50%',
            margin: '0 auto 24px',
            animation: 'spin 1s linear infinite',
          }} />
          <h2 style={{ fontSize: '22px', fontWeight: '500', color: theme.colors.textDark, marginBottom: '8px' }}>
            Finding your perfect matches...
          </h2>
          <p style={{ fontSize: '15px', color: theme.colors.textMedium }}>Analysing compatibility</p>
        </div>
      </div>
    );
  }

  // Main matching screen with card carousel
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      padding: '20px var(--app-padding, 16px)',
    }}>
      <div style={{ maxWidth: 'var(--app-max-width, 100%)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '20px',
        }}>
          <BridgeLogo />
          <button onClick={onProfile} style={{
            width: '42px', height: '42px', borderRadius: '50%',
            backgroundColor: theme.colors.primary, overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff',
            padding: 0, cursor: 'pointer',
          }}>
            {data.profilePhoto ? (
              <img src={data.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>
                {(data.firstName || 'U')[0]}
              </span>
            )}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', backgroundColor: theme.colors.errorBg,
            borderRadius: '12px', color: theme.colors.error, marginBottom: '16px',
            fontSize: '14px', textAlign: 'center',
          }}>{error}</div>
        )}

        {/* Incoming match requests */}
        {incomingRequests.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.textDark, marginBottom: '12px' }}>
              Match Requests ({incomingRequests.length})
            </h3>
            {incomingRequests.map(req => (
              <IncomingRequestCard
                key={req.request_id}
                request={req}
                onAccept={() => handleAcceptRequest(req.request_id)}
                onReject={() => handleRejectRequest(req.request_id)}
              />
            ))}
          </div>
        )}

        {/* Match cards carousel */}
        {matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '600', color: theme.colors.textDark, marginBottom: '8px' }}>
              No matches yet
            </h2>
            <p style={{ fontSize: '14px', color: theme.colors.textMedium }}>
              Check back later as more people join
            </p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: '12px',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {matches.map(match => (
              <MatchCard
                key={match.user_id}
                match={match}
                onBridge={() => handleBridge(match)}
                onViewProfile={() => handleViewProfile(match)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IncomingRequestCard({ request, onAccept, onReject }) {
  const { from_user } = request;
  const [accepting, setAccepting] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);
    await onAccept();
  };

  return (
    <div style={{
      backgroundColor: theme.colors.surfaceWhite,
      borderRadius: '16px',
      padding: '18px',
      border: `2px solid ${theme.colors.gold}`,
      marginBottom: '12px',
      animation: 'fadeIn 0.4s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          backgroundColor: theme.colors.primary, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '600', fontSize: '18px', overflow: 'hidden',
        }}>
          {from_user.profile_photo_url ? (
            <img src={from_user.profile_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : from_user.first_name[0]}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.textDark, margin: 0 }}>
            {from_user.first_name}, {from_user.age}
          </h3>
          <p style={{ fontSize: '13px', color: theme.colors.textMedium, margin: '2px 0 0' }}>
            {from_user.profession} · {from_user.location}
          </p>
        </div>
        <span style={{ fontSize: '15px', color: theme.colors.primary, fontWeight: '700' }}>
          {from_user.compatibility_score}%
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button onClick={onReject} style={{
          padding: '8px 18px', borderRadius: '20px', border: '1px solid #ccc',
          backgroundColor: '#fff', color: '#666', fontSize: '13px', cursor: 'pointer',
        }}>Decline</button>
        <button onClick={handleAccept} disabled={accepting} style={{
          padding: '8px 20px', borderRadius: '20px', border: 'none',
          backgroundColor: theme.colors.primary, color: '#fff', fontSize: '13px',
          cursor: accepting ? 'default' : 'pointer', fontWeight: '600',
          opacity: accepting ? 0.7 : 1,
        }}>{accepting ? 'Accepting...' : 'Accept'}</button>
      </div>
    </div>
  );
}

function MatchCard({ match, onBridge, onViewProfile }) {
  const answered = Object.entries(match.perspective_answers || {})
    .filter(([, v]) => v && v.trim());
  const topInterests = (match.interests || []).slice(0, 4);
  const extraInterests = (match.interests || []).length - topInterests.length;

  return (
    <div
      style={{
        flex: '0 0 85%',
        maxWidth: '360px',
        scrollSnapAlign: 'center',
        backgroundColor: theme.colors.surfaceWhite,
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        animation: 'fadeIn 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '16px' }}>
        {/* Header row: small photo + identity */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '72px', height: '84px', borderRadius: '14px',
            backgroundColor: '#e8e8e8', overflow: 'hidden', flexShrink: 0,
          }}>
            {match.profile_photo_url ? (
              <img src={match.profile_photo_url} alt={match.first_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '28px', fontWeight: '600',
              }}>
                {match.first_name[0]}
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '600', color: theme.colors.textDark, margin: 0 }}>
                {match.first_name} {match.surname || ''}{match.age ? `, ${match.age}` : ''}
              </h3>
              {match.compatibility_score != null && (
                <span style={{ fontSize: '13px', fontWeight: '700', color: theme.colors.primary, flexShrink: 0 }}>
                  {match.compatibility_score}%
                </span>
              )}
            </div>
            {match.profession && (
              <p style={{ fontSize: '13px', color: theme.colors.textMedium, margin: '2px 0 0' }}>
                {match.profession}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              {match.location && (
                <span style={{ fontSize: '12px', color: theme.colors.textMedium }}>{match.location}</span>
              )}
              {match.location && match.focus && <span style={{ color: '#ddd' }}>|</span>}
              {match.focus && (
                <span style={{
                  fontSize: '11px', padding: '2px 9px',
                  border: `1px solid ${theme.colors.textMedium}`,
                  borderRadius: '16px', color: theme.colors.textDark, fontWeight: '500',
                }}>
                  {match.focus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Headline */}
        <p style={{
          fontSize: '13px', color: theme.colors.textDark, lineHeight: '1.5',
          margin: '0 0 12px',
        }}>
          {match.headline || match.statement || 'No bio yet'}
        </p>

        {/* Goal */}
        {match.primary_goal && (
          <div style={{
            backgroundColor: '#f5f7fa', borderRadius: '12px',
            padding: '10px 12px', marginBottom: '10px',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: '700', letterSpacing: '1px',
              color: theme.colors.textLight, marginBottom: '2px',
            }}>GOAL</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: theme.colors.textDark }}>
              {match.primary_goal}
            </div>
          </div>
        )}

        {/* Perspective answer — one, as a taster */}
        {answered.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.textDark, lineHeight: '1.4' }}>
              {answered[0][0]}
            </div>
            <p style={{
              fontSize: '12px', color: theme.colors.textMedium, margin: '2px 0 0', lineHeight: '1.5',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {answered[0][1]}
            </p>
          </div>
        )}

        {/* Interests */}
        {topInterests.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {topInterests.map(interest => (
              <span key={interest} style={{
                padding: '4px 10px', borderRadius: '14px', border: '1px solid #ddd',
                fontSize: '11px', color: theme.colors.textDark,
              }}>{interest}</span>
            ))}
            {extraInterests > 0 && (
              <span style={{ padding: '4px 4px', fontSize: '11px', color: theme.colors.textLight }}>
                +{extraInterests}
              </span>
            )}
          </div>
        )}

        {/* Actions — explicit, so nothing depends on guessing the card is tappable */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onViewProfile}
            style={{
              flex: 1, padding: '10px', borderRadius: '14px',
              border: `1.5px solid ${theme.colors.borderLight}`,
              backgroundColor: 'transparent', color: theme.colors.textMedium,
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            Full profile
          </button>
          <button
            onClick={onBridge}
            style={{
              flex: 1, padding: '10px', borderRadius: '14px',
              border: 'none', backgroundColor: theme.colors.primary,
              color: '#fff', fontSize: '13px', fontWeight: '700',
              cursor: 'pointer', letterSpacing: '2px',
            }}
          >
            BRIDGE
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchingScreen;
