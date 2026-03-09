import React, { useState, useEffect, useRef } from 'react';
import { matchingAPI, groupsAPI } from '../services/api';
import { theme } from '../theme';
import BridgeLogo from '../components/BridgeLogo';
import ChatScreen from './ChatScreen';

function MatchingScreen({ data, onBack, onLogout, onProfile }) {
  const [matchState, setMatchState] = useState('searching');
  const [matches, setMatches] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadMatches();
    checkExistingGroup();
    loadIncomingRequests();
    const pollInterval = setInterval(() => loadIncomingRequests(), 5000);
    return () => clearInterval(pollInterval);
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const matchesData = await matchingAPI.getMatches();
      setMatches(matchesData);
      setTimeout(() => setMatchState('found'), 1500);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError(err.response?.data?.detail || 'Failed to load matches');
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

  const loadIncomingRequests = async () => {
    try {
      const requests = await matchingAPI.getMatchRequests();
      setIncomingRequests(requests);
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
    try {
      await matchingAPI.sendMatchRequest(match.user_id);
      setShowConfirm(true);

      // Poll for group creation
      const pollInterval = setInterval(async () => {
        try {
          const groupData = await groupsAPI.getMyGroup();
          if (groupData) {
            setGroup(groupData);
            clearInterval(pollInterval);
          }
        } catch (err) {}
      }, 2000);
      setTimeout(() => clearInterval(pollInterval), 30000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send match request');
    }
  };

  // If user is in a group, show chat
  if (group) {
    return <ChatScreen groupData={group} userData={data} onProfile={onProfile} />;
  }

  // Confirmation screen after bridging
  if (showConfirm) {
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
          textAlign: 'center',
          maxWidth: '400px',
          animation: 'fadeIn 0.5s ease',
        }}>
          <div style={{ marginBottom: '24px' }}><BridgeLogo /></div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: theme.colors.textDark,
            marginBottom: '12px',
          }}>Yay!!</h1>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '500',
            color: theme.colors.textDark,
            marginBottom: '8px',
          }}>The selection is done.</h2>
          <p style={{
            fontSize: '15px',
            color: theme.colors.textMedium,
            marginBottom: '32px',
            lineHeight: '1.5',
          }}>
            We've sent your bridge request to {selectedMatch?.first_name}. When they accept, your group will form!
          </p>
          <button
            onClick={() => {
              setShowConfirm(false);
              setMatchState('found');
            }}
            style={{
              padding: '14px 32px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: theme.colors.primary,
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Back to matches
          </button>
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
      padding: '20px 16px',
    }}>
      <div style={{ maxWidth: '430px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <BridgeLogo />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onProfile} style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.primary}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
            <button onClick={onLogout} style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={theme.colors.primary}>
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
            </button>
          </div>
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
        <h2 style={{
          fontSize: '22px', fontWeight: '600', color: theme.colors.textDark,
          marginBottom: '4px',
        }}>
          {matches.length > 0 ? 'Your Matches' : 'No matches yet'}
        </h2>
        <p style={{ fontSize: '14px', color: theme.colors.textMedium, marginBottom: '20px' }}>
          {matches.length > 0 ? 'Swipe through and bridge with someone' : 'Check back later as more people join'}
        </p>

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
            <MatchCard key={match.user_id} match={match} onBridge={() => handleBridge(match)} />
          ))}
        </div>
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
          fontWeight: '600', fontSize: '18px',
        }}>{from_user.first_name[0]}</div>
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

function MatchCard({ match, onBridge }) {
  return (
    <div style={{
      flex: '0 0 300px',
      scrollSnapAlign: 'center',
      backgroundColor: theme.colors.surfaceWhite,
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      animation: 'fadeIn 0.4s ease',
    }}>
      {/* Photo placeholder / gradient header */}
      <div style={{
        height: '160px',
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: '600',
        }}>
          {match.first_name[0]}
        </div>
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px',
          padding: '4px 10px', fontSize: '13px', color: '#fff', fontWeight: '600',
        }}>{match.compatibility_score}%</div>
      </div>

      {/* Card content */}
      <div style={{ padding: '18px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.textDark, margin: '0 0 2px' }}>
          {match.first_name}, {match.age}
        </h3>
        <p style={{ fontSize: '13px', color: theme.colors.textMedium, margin: '0 0 6px' }}>
          {match.profession} · {match.location}
        </p>
        {match.focus && (
          <span style={{
            display: 'inline-block', fontSize: '11px', padding: '4px 10px',
            backgroundColor: `rgba(45, 79, 92, 0.08)`, borderRadius: '10px',
            color: theme.colors.primary, fontWeight: '500', marginBottom: '10px',
          }}>{match.focus}</span>
        )}
        <p style={{
          fontSize: '13px', color: theme.colors.textMedium, lineHeight: '1.5',
          marginBottom: '14px',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {match.headline || match.statement || 'No bio yet'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {(match.interests || []).slice(0, 4).map(interest => (
            <span key={interest} style={{
              fontSize: '11px', padding: '4px 10px',
              backgroundColor: '#f0f4f5', borderRadius: '10px',
              color: theme.colors.textMedium, fontWeight: '500',
            }}>{interest}</span>
          ))}
        </div>
        <button onClick={onBridge} style={{
          width: '100%', padding: '12px', borderRadius: '25px',
          border: 'none', backgroundColor: theme.colors.primary,
          color: '#fff', fontSize: '15px', fontWeight: '600',
          cursor: 'pointer', letterSpacing: '1px',
        }}>
          BRIDGE
        </button>
      </div>
    </div>
  );
}

export default MatchingScreen;
