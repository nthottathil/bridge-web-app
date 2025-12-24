import React, { useState, useEffect } from 'react';

function MatchingScreen({ data, onBack }) {
  const [matchState, setMatchState] = useState('searching');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showChat, setShowChat] = useState(false);
  
  const fakeMatches = [
    {
      id: 1,
      name: 'Alex Chen',
      bio: 'Product designer who loves hiking and board games. Always up for a coffee and creative brainstorms.',
      interests: ['Design', 'Hiking', 'Gaming'],
      compatibility: 94
    },
    {
      id: 2,
      name: 'Jordan Williams',
      bio: 'Startup founder, coffee enthusiast, amateur chef. Building something brilliant and looking for collaborators.',
      interests: ['Startups', 'Cooking', 'Networking'],
      compatibility: 89
    },
    {
      id: 3,
      name: 'Sam Patel',
      bio: 'Software engineer exploring AI and creative writing. Weekend musician and bookworm.',
      interests: ['AI/ML', 'Writing', 'Music'],
      compatibility: 87
    }
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => setMatchState('found'), 2500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setMatchState('waiting');
    setTimeout(() => setShowChat(true), 3500);
  };
  
  if (showChat) {
    return <ChatRoomScreen data={data} />;
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
          }}>Waiting for your friends to bridge...</h2>
          <p style={{
            fontSize: '16px',
            opacity: 0.8,
            marginBottom: '40px'
          }}>Your group is being formed</p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              color: '#1a5f5a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '18px'
            }}>{data.firstName[0]}</div>
            <div style={{ width: '32px', height: '2px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              color: '#1a5f5a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '18px'
            }}>{selectedMatch.name[0]}</div>
            <div style={{ width: '32px', height: '2px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              animation: 'pulse 1.5s infinite'
            }}>?</div>
            <div style={{ width: '32px', height: '2px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              animation: 'pulse 1.5s infinite 0.5s'
            }}>?</div>
          </div>
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
      {matchState === 'searching' ? (
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
          }}>Finding your perfect group...</h2>
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
          }}>We found some brilliant matches!</h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            marginBottom: '32px'
          }}>Select someone to start your group of 4</p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {fakeMatches.map(match => (
              <MatchCard 
                key={match.id} 
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
        }}>{match.name[0]}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: 0
          }}>{match.name}</h3>
          <span style={{
            fontSize: '14px',
            color: '#1a5f5a',
            fontWeight: '600'
          }}>{match.compatibility}% match</span>
        </div>
      </div>
      <p style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '14px',
        lineHeight: '1.5'
      }}>{match.bio}</p>
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {match.interests.map(int => (
          <span key={int} style={{
            fontSize: '12px',
            padding: '6px 12px',
            backgroundColor: '#f0f7f6',
            borderRadius: '12px',
            color: '#1a5f5a',
            fontWeight: '500'
          }}>{int}</span>
        ))}
      </div>
    </div>
  );
}

function ChatRoomScreen({ data }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'Welcome to your Bridge group! 🎉' },
    { id: 2, sender: 'Alex Chen', text: 'Hiya everyone! Excited to meet you all!' },
    { id: 3, sender: 'Jordan Williams', text: 'Hi! Anyone free for a coffee this weekend?' },
    { id: 4, sender: 'Sam Patel', text: 'Count me in! I know a cracking spot in Shoreditch 🤙' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({ ...data });
  const [isEditing, setIsEditing] = useState(false);
  
  const groupMembers = [
    { name: data.firstName, isYou: true },
    { name: 'Alex Chen' },
    { name: 'Jordan Williams' },
    { name: 'Sam Patel' }
  ];
  
  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: data.firstName,
        text: newMessage,
        isYou: true
      }]);
      setNewMessage('');
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1a5f5a',
        color: '#fff',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: 0
          }}>Your Bridge Group</h2>
          <p style={{
            fontSize: '13px',
            opacity: 0.8,
            margin: '4px 0 0 0'
          }}>4 members</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            marginLeft: '-8px'
          }}>
            {groupMembers.map((member, i) => (
              <div key={i} style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: member.isYou ? '#fff' : 'rgba(255,255,255,0.25)',
                color: member.isYou ? '#1a5f5a' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                marginLeft: i > 0 ? '-8px' : '0',
                border: '2px solid #1a5f5a',
                zIndex: groupMembers.length - i
              }} title={member.name}>
                {member.name[0]}
              </div>
            ))}
          </div>
          {/* Profile Button */}
          <button
            onClick={() => setShowProfile(true)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              backgroundColor: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="View Profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              maxWidth: '80%',
              padding: msg.sender === 'system' ? '10px 16px' : '14px 18px',
              borderRadius: msg.sender === 'system' ? '20px' : msg.isYou ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              backgroundColor: msg.sender === 'system' ? '#e8f5f4' : msg.isYou ? '#1a5f5a' : '#fff',
              color: msg.sender === 'system' ? '#1a5f5a' : msg.isYou ? '#fff' : '#333',
              alignSelf: msg.sender === 'system' ? 'center' : msg.isYou ? 'flex-end' : 'flex-start',
              boxShadow: msg.sender !== 'system' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            {msg.sender !== 'system' && !msg.isYou && (
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#1a5f5a',
                marginBottom: '4px',
                display: 'block'
              }}>{msg.sender}</span>
            )}
            <p style={{
              margin: 0,
              fontSize: '15px',
              lineHeight: '1.45'
            }}>{msg.text}</p>
          </div>
        ))}
      </div>
      
      {/* Input */}
      <div style={{
        padding: '16px 20px 24px',
        backgroundColor: '#fff',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '14px 20px',
            fontSize: '15px',
            border: '2px solid #e0e0e0',
            borderRadius: '28px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
        <button onClick={sendMessage} style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#1a5f5a',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(26, 95, 90, 0.25)'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      {/* Profile Panel */}
      {showProfile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => { setShowProfile(false); setIsEditing(false); }}>
          <div 
            style={{
              backgroundColor: '#fff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'fadeIn 0.3s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Profile Header */}
            <div style={{
              backgroundColor: '#1a5f5a',
              padding: '32px 24px',
              borderRadius: '20px 20px 0 0',
              textAlign: 'center',
              color: '#fff'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                color: '#1a5f5a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: '600',
                margin: '0 auto 16px'
              }}>
                {profileData.firstName[0]}{profileData.surname?.[0] || ''}
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
                {profileData.preferredName || profileData.firstName} {profileData.surname || ''}
              </h2>
              <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
                {profileData.profession} • {profileData.location}
              </p>
            </div>

            {/* Profile Content */}
            <div style={{ padding: '24px' }}>
              {/* Bio Section */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>About</h3>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={e => setProfileData({ ...profileData, bio: e.target.value.slice(0, 300) })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      resize: 'vertical',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.6', margin: 0 }}>{profileData.bio}</p>
                )}
              </div>

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <ProfileField label="Email" value={profileData.email} isEditing={isEditing} onChange={v => setProfileData({ ...profileData, email: v })} />
                <ProfileField label="Gender" value={profileData.gender} isEditing={isEditing} onChange={v => setProfileData({ ...profileData, gender: v })} />
                <ProfileField label="Nationality" value={profileData.nationality} isEditing={isEditing} onChange={v => setProfileData({ ...profileData, nationality: v })} />
                <ProfileField label="Ethnicity" value={profileData.ethnicity} isEditing={isEditing} onChange={v => setProfileData({ ...profileData, ethnicity: v })} />
              </div>

              {/* Goals */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Goals</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profileData.goals.map((goal, i) => (
                    <span key={goal} style={{
                      fontSize: '13px',
                      padding: '6px 14px',
                      backgroundColor: i === 0 ? '#1a5f5a' : '#f0f7f6',
                      borderRadius: '16px',
                      color: i === 0 ? '#fff' : '#1a5f5a',
                      fontWeight: '500'
                    }}>{goal}</span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Interests</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profileData.interests.slice(0, 8).map((interest, i) => (
                    <span key={interest} style={{
                      fontSize: '13px',
                      padding: '6px 14px',
                      backgroundColor: '#f0f7f6',
                      borderRadius: '16px',
                      color: '#1a5f5a',
                      fontWeight: '500'
                    }}>{interest}</span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profileData.skills.map(skill => (
                    <span key={skill} style={{
                      fontSize: '13px',
                      padding: '6px 14px',
                      backgroundColor: '#fff3e0',
                      borderRadius: '16px',
                      color: '#e65100',
                      fontWeight: '500'
                    }}>{skill}</span>
                  ))}
                </div>
              </div>

              {/* Personality */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Personality</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <PersonalityBar label="Extroversion" value={profileData.personality.extroversion} leftLabel="Introvert" rightLabel="Extrovert" />
                  <PersonalityBar label="Openness" value={profileData.personality.openness} leftLabel="Traditional" rightLabel="Adventurous" />
                  <PersonalityBar label="Agreeableness" value={profileData.personality.agreeableness} leftLabel="Challenger" rightLabel="Harmoniser" />
                  <PersonalityBar label="Conscientiousness" value={profileData.personality.conscientiousness} leftLabel="Spontaneous" rightLabel="Organised" />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {isEditing ? (
                  <>
                    <button
                      onClick={() => { setIsEditing(false); setProfileData({ ...data }); }}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        border: '2px solid #e0e0e0',
                        backgroundColor: '#fff',
                        color: '#666',
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#1a5f5a',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowProfile(false)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        border: '2px solid #e0e0e0',
                        backgroundColor: '#fff',
                        color: '#666',
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Close
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#1a5f5a',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileField({ label, value, isEditing, onChange }) {
  return (
    <div>
      <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</h4>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            boxSizing: 'border-box'
          }}
        />
      ) : (
        <p style={{ fontSize: '14px', color: '#333', margin: 0 }}>{value}</p>
      )}
    </div>
  );
}

function PersonalityBar({ label, value, leftLabel, rightLabel }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: '#888' }}>{leftLabel}</span>
        <span style={{ fontSize: '11px', color: '#888' }}>{rightLabel}</span>
      </div>
      <div style={{
        height: '8px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${value}%`,
          backgroundColor: '#1a5f5a',
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}

export default MatchingScreen;
