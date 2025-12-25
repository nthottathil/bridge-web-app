import React, { useState, useEffect } from 'react';
import { matchingAPI, groupsAPI } from '../services/api';
import ChatScreen from './ChatScreen';

function MatchingScreen({ data, onBack }) {
  const [matchState, setMatchState] = useState('searching');
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
    checkExistingGroup();
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
      if (groupData) {
        setGroup(groupData);
      }
    } catch (err) {
      console.error('Error checking group:', err);
    }
  };

  const handleSelectMatch = async (match) => {
    setSelectedMatch(match);
    setMatchState('sending');

    try {
      await matchingAPI.sendMatchRequest(match.user_id);
      setMatchState('waiting');

      // Poll for group creation every 2 seconds
      const pollInterval = setInterval(async () => {
        try {
          const groupData = await groupsAPI.getMyGroup();
          if (groupData) {
            setGroup(groupData);
            clearInterval(pollInterval);
          }
        } catch (err) {
          console.error('Error polling for group:', err);
        }
      }, 2000);

      // Stop polling after 30 seconds
      setTimeout(() => clearInterval(pollInterval), 30000);
    } catch (err) {
      console.error('Error sending match request:', err);
      setError(err.response?.data?.detail || 'Failed to send match request');
      setMatchState('found');
    }
  };

  if (group) {
    return <ChatScreen groupData={group} userData={data} />;
  }

  if (matchState === 'waiting') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a5f5a',
        padding: '24px'
      }}>
        <div style={{ textAlign: 'center', color: '#fff', maxWidth: '400px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTop: '3px solid #fff',
            borderRadius: '50%',
            margin: '0 auto 28px',
            animation: 'spin 1s linear infinite'
          }} />
          <h2 style={{
            fontSize: '24px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>Waiting for {selectedMatch.first_name} to accept...</h2>
          <p style={{
            fontSize: '16px',
            opacity: 0.8,
            marginBottom: '20px'
          }}>Your group will form when they accept your request</p>
          <button
            onClick={() => {
              setMatchState('found');
              setSelectedMatch(null);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: '2px solid #fff',
              backgroundColor: 'transparent',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            ← Back to matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a5f5a',
      padding: '24px'
    }}>
      {matchState === 'searching' || loading ? (
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTop: '3px solid #fff',
            borderRadius: '50%',
            margin: '0 auto 28px',
            animation: 'spin 1s linear infinite'
          }} />
          <h2 style={{
            fontSize: '24px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>Finding your perfect matches...</h2>
          <p style={{
            fontSize: '16px',
            opacity: 0.8
          }}>Analysing compatibility</p>
        </div>
      ) : (
        <div style={{ maxWidth: '520px', width: '100%' }}>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '500',
            color: '#fff',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {matches.length > 0 ? 'Your Top 3 Matches!' : 'No matches yet'}
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            {matches.length > 0
              ? 'Pick one to send them a match request'
              : 'Check back later as more people join Bridge'
            }
          </p>

          {error && (
            <div style={{
              padding: '14px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: '#fff',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {matches.map(match => (
              <MatchCard
                key={match.user_id}
                match={match}
                onClick={() => handleSelectMatch(match)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        animation: 'fadeIn 0.4s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 32px rgba(0,0,0,0.15)' : 'none'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '12px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#1a5f5a',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600',
          fontSize: '20px'
        }}>{match.first_name[0]}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: 0
          }}>{match.first_name}, {match.age}</h3>
          <p style={{
            fontSize: '13px',
            color: '#666',
            margin: '2px 0 0 0'
          }}>{match.profession} • {match.location}</p>
        </div>
        <span style={{
          fontSize: '16px',
          color: '#1a5f5a',
          fontWeight: '700'
        }}>{match.compatibility_score}%</span>
      </div>
      <p style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '14px',
        lineHeight: '1.5'
      }}>{match.statement || 'No bio yet'}</p>
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {match.interests.slice(0, 5).map(interest => (
          <span key={interest} style={{
            fontSize: '12px',
            padding: '6px 12px',
            backgroundColor: '#f0f7f6',
            borderRadius: '12px',
            color: '#1a5f5a',
            fontWeight: '500'
          }}>{interest}</span>
        ))}
      </div>
    </div>
  );
}

export default MatchingScreen;
