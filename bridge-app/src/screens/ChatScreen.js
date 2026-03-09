import React, { useState, useEffect, useRef } from 'react';
import { groupsAPI } from '../services/api';
import { theme } from '../theme';
import TaskPanel from '../components/TaskPanel';
import MeetupModal from '../components/MeetupModal';

function ChatScreen({ groupData, userData, onProfile }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMeetup, setShowMeetup] = useState(false);
  const messagesEndRef = useRef(null);
  const lastMessageTime = useRef(null);

  useEffect(() => {
    loadMessages();
    const pollInterval = setInterval(() => pollNewMessages(), 5000);
    return () => clearInterval(pollInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData.group_id]);

  const loadMessages = async () => {
    try {
      const msgs = await groupsAPI.getMessages(groupData.group_id);
      setMessages(msgs);
      if (msgs.length > 0) {
        lastMessageTime.current = msgs[msgs.length - 1].created_at;
      }
      scrollToBottom();
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const pollNewMessages = async () => {
    try {
      const since = lastMessageTime.current;
      const newMsgs = await groupsAPI.getMessages(groupData.group_id, since);
      if (newMsgs.length > 0) {
        setMessages(prev => [...prev, ...newMsgs]);
        lastMessageTime.current = newMsgs[newMsgs.length - 1].created_at;
        scrollToBottom();
      }
    } catch (err) {
      console.error('Error polling messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const sentMessage = await groupsAPI.sendMessage(groupData.group_id, newMessage);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      lastMessageTime.current = sentMessage.created_at;
      scrollToBottom();
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    try {
      await groupsAPI.leaveGroup(groupData.group_id);
      window.location.reload();
    } catch (err) {
      console.error('Error leaving group:', err);
    }
  };

  const currentUserId = groupData.members?.find(
    m => m.first_name === userData.firstName
  )?.user_id;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: theme.colors.primary,
        color: '#fff',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: '600', margin: 0 }}>Your Bridge Group</h2>
          <p style={{ fontSize: '12px', opacity: 0.7, margin: '2px 0 0' }}>
            {groupData.member_count} members
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setShowMeetup(true)} style={{
            padding: '7px 14px', borderRadius: '16px',
            border: '1.5px solid rgba(255,255,255,0.3)',
            backgroundColor: 'transparent', color: '#fff',
            fontSize: '12px', fontWeight: '500', cursor: 'pointer',
          }}>
            Meetup
          </button>
          <button onClick={onProfile} style={{
            width: '34px', height: '34px', borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.3)',
            backgroundColor: 'transparent', color: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>
          <button onClick={handleLeaveGroup} style={{
            width: '34px', height: '34px', borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.3)',
            backgroundColor: 'transparent', color: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>
            &#8943;
          </button>
        </div>
      </div>

      {/* Task Panel */}
      <div style={{ paddingTop: '12px' }}>
        <TaskPanel groupId={groupData.group_id} currentUserId={currentUserId} />
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '12px 16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: theme.colors.textLight, padding: '40px 20px' }}>
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isYou = msg.user_first_name === userData.firstName;
            return (
              <div key={msg.id} style={{
                display: 'flex',
                gap: '8px',
                alignSelf: isYou ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                flexDirection: isYou ? 'row-reverse' : 'row',
              }}>
                {!isYou && (
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    backgroundColor: theme.colors.primary, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '600', flexShrink: 0,
                  }}>
                    {msg.user_first_name?.[0] || '?'}
                  </div>
                )}
                <div style={{
                  padding: '10px 16px',
                  borderRadius: isYou ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  backgroundColor: isYou ? theme.colors.primary : theme.colors.surfaceWhite,
                  color: isYou ? '#fff' : theme.colors.textDark,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}>
                  {!isYou && (
                    <span style={{
                      fontSize: '11px', fontWeight: '600',
                      color: theme.colors.primary, display: 'block', marginBottom: '2px',
                    }}>
                      {msg.user_first_name}
                    </span>
                  )}
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                    {msg.message_text}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: '12px 16px 20px',
        backgroundColor: theme.colors.surfaceWhite,
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && !loading && sendMessage()}
          placeholder="Type a message..."
          disabled={loading}
          style={{
            flex: 1, padding: '12px 18px', fontSize: '14px',
            border: '1.5px solid #e0e0e0', borderRadius: '25px',
            outline: 'none', backgroundColor: 'transparent',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || loading}
          style={{
            width: '44px', height: '44px', borderRadius: '50%',
            backgroundColor: newMessage.trim() && !loading ? theme.colors.primary : '#ccc',
            color: '#fff', border: 'none',
            cursor: newMessage.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {loading ? (
            <div style={{
              width: '18px', height: '18px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid #fff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>

      {showMeetup && (
        <MeetupModal
          groupId={groupData.group_id}
          onClose={() => setShowMeetup(false)}
          onCreated={() => {}}
        />
      )}
    </div>
  );
}

export default ChatScreen;
