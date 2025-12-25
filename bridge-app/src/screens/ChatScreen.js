import React, { useState, useEffect, useRef } from 'react';
import { groupsAPI } from '../services/api';

function ChatScreen({ groupData, userData }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const lastMessageTime = useRef(null);

  useEffect(() => {
    // Load initial messages
    loadMessages();

    // Set up polling for new messages every 5 seconds
    const pollInterval = setInterval(() => {
      pollNewMessages();
    }, 5000);

    return () => clearInterval(pollInterval);
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
    if (!window.confirm('Are you sure you want to leave this group? You can find new matches after leaving.')) {
      return;
    }

    try {
      await groupsAPI.leaveGroup(groupData.group_id);
      window.location.reload(); // Reload to go back to matching
    } catch (err) {
      console.error('Error leaving group:', err);
      alert('Failed to leave group. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa'
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
          }}>{groupData.member_count} members</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Member Avatars */}
          <div style={{
            display: 'flex',
            marginLeft: '-8px'
          }}>
            {groupData.members.map((member, i) => (
              <div
                key={member.user_id}
                title={member.first_name}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: member.first_name === userData.firstName ? '#fff' : 'rgba(255,255,255,0.25)',
                  color: member.first_name === userData.firstName ? '#1a5f5a' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginLeft: i > 0 ? '-8px' : '0',
                  border: '2px solid #1a5f5a',
                  zIndex: groupData.members.length - i
                }}
              >
                {member.first_name[0]}
              </div>
            ))}
          </div>

          {/* Leave Group Button */}
          <button
            onClick={handleLeaveGroup}
            style={{
              padding: '8px 16px',
              borderRadius: '16px',
              border: '2px solid rgba(255,255,255,0.3)',
              backgroundColor: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
            title="Leave Group"
          >
            Leave
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
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#888',
            padding: '40px 20px'
          }}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isYou = msg.user_first_name === userData.firstName;

            return (
              <div
                key={msg.id}
                style={{
                  maxWidth: '80%',
                  padding: '14px 18px',
                  borderRadius: isYou ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  backgroundColor: isYou ? '#1a5f5a' : '#fff',
                  color: isYou ? '#fff' : '#333',
                  alignSelf: isYou ? 'flex-end' : 'flex-start',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                {!isYou && (
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1a5f5a',
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    {msg.user_first_name}
                  </span>
                )}
                <p style={{
                  margin: 0,
                  fontSize: '15px',
                  lineHeight: '1.45'
                }}>
                  {msg.message_text}
                </p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
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
          onKeyPress={e => e.key === 'Enter' && !loading && sendMessage()}
          placeholder="Type a message..."
          disabled={loading}
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
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || loading}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: newMessage.trim() && !loading ? '#1a5f5a' : '#ccc',
            color: '#fff',
            border: 'none',
            cursor: newMessage.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: newMessage.trim() ? '0 4px 12px rgba(26, 95, 90, 0.25)' : 'none'
          }}
        >
          {loading ? (
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid #fff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatScreen;
