import React, { useState, useEffect, useRef } from 'react';
import { groupsAPI, collectionsAPI, meetupsAPI } from '../services/api';
import { theme } from '../theme';
import TaskPanel from '../components/TaskPanel';

/* ──────────────────────────────────────────────
   Inline creation modals
   ────────────────────────────────────────────── */

function GoalModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h3 style={modalTitle}>Goal of the week</h3>
        <input
          placeholder="Goal title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={modalInput}
        />
        <div style={modalActions}>
          <button onClick={onClose} style={modalCancelBtn}>Cancel</button>
          <button
            disabled={!title.trim()}
            onClick={() => onCreate(title.trim())}
            style={{ ...modalCreateBtn, opacity: title.trim() ? 1 : 0.5 }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function AskModal({ onClose, onCreate }) {
  const [question, setQuestion] = useState('');
  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h3 style={modalTitle}>Ask the group</h3>
        <textarea
          placeholder="Your question..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={3}
          style={{ ...modalInput, resize: 'vertical', fontFamily: 'inherit' }}
        />
        <div style={modalActions}>
          <button onClick={onClose} style={modalCancelBtn}>Cancel</button>
          <button
            disabled={!question.trim()}
            onClick={() => onCreate(question.trim())}
            style={{ ...modalCreateBtn, opacity: question.trim() ? 1 : 0.5 }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function PollModal({ onClose, onCreate }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const updateOption = (idx, val) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };
  const addOption = () => { if (options.length < 4) setOptions([...options, '']); };
  const canCreate = question.trim() && options.filter(o => o.trim()).length >= 2;

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h3 style={modalTitle}>Poll</h3>
        <input
          placeholder="Question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          style={modalInput}
        />
        {options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={e => updateOption(i, e.target.value)}
            style={{ ...modalInput, marginTop: '8px' }}
          />
        ))}
        {options.length < 4 && (
          <button onClick={addOption} style={{ ...modalCancelBtn, marginTop: '6px', fontSize: '13px' }}>
            + Add option
          </button>
        )}
        <div style={modalActions}>
          <button onClick={onClose} style={modalCancelBtn}>Cancel</button>
          <button
            disabled={!canCreate}
            onClick={() => onCreate(question.trim(), options.filter(o => o.trim()))}
            style={{ ...modalCreateBtn, opacity: canCreate ? 1 : 0.5 }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function NoteModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reminder, setReminder] = useState(false);
  const [repeat, setRepeat] = useState('None');

  const canCreate = title.trim();

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h3 style={modalTitle}>Note</h3>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={modalInput}
        />
        <textarea
          placeholder="Content..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
          style={{ ...modalInput, marginTop: '8px', resize: 'vertical', fontFamily: 'inherit' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <label style={{ fontSize: '14px', color: theme.colors.textDark }}>Reminder</label>
          <input type="checkbox" checked={reminder} onChange={e => setReminder(e.target.checked)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
          <label style={{ fontSize: '14px', color: theme.colors.textDark }}>Repeat</label>
          <select
            value={repeat}
            onChange={e => setRepeat(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
          >
            <option>None</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
        <div style={modalActions}>
          <button onClick={onClose} style={modalCancelBtn}>Cancel</button>
          <button
            disabled={!canCreate}
            onClick={() => onCreate({ title: title.trim(), content: content.trim(), reminder, repeat })}
            style={{ ...modalCreateBtn, opacity: canCreate ? 1 : 0.5 }}
          >
            Create note
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Shared modal styles
   ────────────────────────────────────────────── */

const modalOverlay = {
  position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
};
const modalBox = {
  backgroundColor: '#fff', borderRadius: '16px', padding: '24px',
  width: '90%', maxWidth: '380px', boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
};
const modalTitle = {
  margin: '0 0 16px', fontSize: '17px', fontWeight: '600', color: theme.colors.textDark,
};
const modalInput = {
  width: '100%', padding: '12px 14px', fontSize: '14px',
  border: '1.5px solid #e0e0e0', borderRadius: '10px', outline: 'none',
  boxSizing: 'border-box',
};
const modalActions = {
  display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px',
};
const modalCancelBtn = {
  padding: '10px 18px', borderRadius: '10px', border: 'none',
  backgroundColor: '#f0f0f0', color: theme.colors.textDark,
  fontSize: '14px', fontWeight: '500', cursor: 'pointer',
};
const modalCreateBtn = {
  padding: '10px 18px', borderRadius: '10px', border: 'none',
  backgroundColor: theme.colors.primary, color: '#fff',
  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
};

/* ──────────────────────────────────────────────
   Special message card renderers
   ────────────────────────────────────────────── */

const cardBase = {
  backgroundColor: '#fff', borderRadius: '14px', padding: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: '100%', maxWidth: '320px',
  boxSizing: 'border-box',
};
const cardLabel = {
  fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
  letterSpacing: '0.5px', marginBottom: '6px',
};
const cardTitle = {
  fontSize: '15px', fontWeight: '600', color: theme.colors.textDark, margin: '0 0 10px',
};

function GoalCard({ msg, groupId }) {
  const [personalGoal, setPersonalGoal] = useState('');

  const handleAdd = async () => {
    if (!personalGoal.trim() || !msg.collection_id) return;
    try {
      await collectionsAPI.addPersonalGoal(msg.collection_id, personalGoal.trim());
      setPersonalGoal('');
    } catch (err) { console.error('Error adding personal goal:', err); }
  };

  return (
    <div style={cardBase}>
      <div style={{ ...cardLabel, color: '#e8a735' }}>Goal of the week</div>
      <p style={cardTitle}>{msg.collection_title || msg.message_text}</p>
      <input
        placeholder="Your personal goal..."
        value={personalGoal}
        onChange={e => setPersonalGoal(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px', fontSize: '13px',
          border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none',
          boxSizing: 'border-box', marginBottom: '8px',
        }}
      />
      <button onClick={handleAdd} style={{
        background: 'none', border: 'none', color: theme.colors.primary,
        fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0,
      }}>
        + Add your personal goal
      </button>
    </div>
  );
}

function AskCard({ msg }) {
  return (
    <div style={cardBase}>
      <div style={{ ...cardLabel, color: '#5b8def' }}>Ask the group</div>
      <p style={cardTitle}>{msg.collection_title || msg.message_text}</p>
      <button style={{
        padding: '8px 20px', borderRadius: '20px',
        border: `1.5px solid ${theme.colors.primary}`, backgroundColor: 'transparent',
        color: theme.colors.primary, fontSize: '13px', fontWeight: '600', cursor: 'pointer',
      }}>
        Reply
      </button>
    </div>
  );
}

function PollCard({ msg, currentUserId }) {
  const isCreator = msg.user_id === currentUserId;
  const options = msg.poll_options || [];

  const handleVote = async (optionId) => {
    if (!msg.collection_id) return;
    try { await collectionsAPI.votePoll(msg.collection_id, optionId); }
    catch (err) { console.error('Error voting:', err); }
  };

  const handleEnd = async () => {
    if (!msg.collection_id) return;
    try { await collectionsAPI.endPoll(msg.collection_id); }
    catch (err) { console.error('Error ending poll:', err); }
  };

  return (
    <div style={cardBase}>
      <div style={{ ...cardLabel, color: '#9b59b6' }}>Poll</div>
      <p style={cardTitle}>{msg.collection_title || msg.message_text}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => handleVote(opt.id)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', borderRadius: '10px',
              border: '1px solid #e0e0e0', backgroundColor: '#fafafa',
              cursor: 'pointer', fontSize: '14px', color: theme.colors.textDark,
            }}
          >
            <span>{opt.text}</span>
            <span style={{ fontSize: '12px', color: theme.colors.textLight, fontWeight: '600' }}>
              {opt.vote_count || 0}
            </span>
          </button>
        ))}
      </div>
      {isCreator && (
        <button onClick={handleEnd} style={{
          marginTop: '10px', padding: '8px 18px', borderRadius: '20px',
          border: 'none', backgroundColor: theme.colors.primary,
          color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
        }}>
          End voting
        </button>
      )}
    </div>
  );
}

function NoteCard({ msg }) {
  return (
    <div style={cardBase}>
      <div style={{ ...cardLabel, color: '#27ae60' }}>Note</div>
      <p style={cardTitle}>{msg.collection_title || msg.message_text}</p>
    </div>
  );
}

function MeetupCard({ msg }) {
  const handleAttend = async () => {
    if (!msg.meetup_id) return;
    try { await meetupsAPI.attend(msg.meetup_id); }
    catch (err) { console.error('Error attending meetup:', err); }
  };

  return (
    <div style={{ ...cardBase, border: `1.5px solid ${theme.colors.primary}` }}>
      <div style={{ ...cardLabel, color: theme.colors.primary }}>Meetup</div>
      {msg.meetup_location && (
        <p style={{ margin: '0 0 4px', fontSize: '14px', color: theme.colors.textDark }}>
          {msg.meetup_location}
        </p>
      )}
      {msg.meetup_date && (
        <p style={{ margin: '0 0 4px', fontSize: '13px', color: theme.colors.textMedium }}>
          {msg.meetup_date}{msg.meetup_time ? ` at ${msg.meetup_time}` : ''}
        </p>
      )}
      {msg.meetup_attendee_count != null && (
        <p style={{ margin: '0 0 10px', fontSize: '12px', color: theme.colors.textLight }}>
          {msg.meetup_attendee_count} attending
        </p>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={handleAttend} style={{
          padding: '8px 20px', borderRadius: '20px', border: 'none',
          backgroundColor: theme.colors.primary, color: '#fff',
          fontSize: '13px', fontWeight: '600', cursor: 'pointer',
        }}>
          Attend
        </button>
        <button style={{
          padding: '8px 20px', borderRadius: '20px',
          border: `1.5px solid ${theme.colors.primary}`, backgroundColor: 'transparent',
          color: theme.colors.primary, fontSize: '13px', fontWeight: '600', cursor: 'pointer',
        }}>
          Suggest different time
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main ChatScreen component
   ────────────────────────────────────────────── */

function ChatScreen({ groupData, userData, onProfile, onBack, onGroupInfo }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'goal' | 'ask' | 'poll' | 'note'
  const messagesEndRef = useRef(null);
  const lastMessageTime = useRef(null);

  const currentUserId = groupData.members?.find(
    m => m.first_name === userData.firstName
  )?.user_id;

  /* --- message polling --- */
  useEffect(() => {
    loadMessages();
    const interval = setInterval(() => pollNewMessages(), 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData.group_id]);

  const loadMessages = async () => {
    try {
      const msgs = await groupsAPI.getMessages(groupData.group_id);
      setMessages(msgs);
      if (msgs.length > 0) lastMessageTime.current = msgs[msgs.length - 1].created_at;
      scrollToBottom();
    } catch (err) { console.error('Error loading messages:', err); }
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
    } catch (err) { console.error('Error polling messages:', err); }
  };

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  /* --- send text message --- */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const sent = await groupsAPI.sendMessage(groupData.group_id, newMessage);
      setMessages(prev => [...prev, sent]);
      setNewMessage('');
      lastMessageTime.current = sent.created_at;
      scrollToBottom();
    } catch (err) { console.error('Error sending message:', err); }
    finally { setLoading(false); }
  };

  /* --- collection creators --- */
  const handleCreateGoal = async (title) => {
    try {
      await collectionsAPI.createGoal(groupData.group_id, title);
      setActiveModal(null);
      await loadMessages();
    } catch (err) { console.error('Error creating goal:', err); }
  };

  const handleCreateAsk = async (question) => {
    try {
      await collectionsAPI.createAsk(groupData.group_id, question);
      setActiveModal(null);
      await loadMessages();
    } catch (err) { console.error('Error creating ask:', err); }
  };

  const handleCreatePoll = async (question, options) => {
    try {
      await collectionsAPI.createPoll(groupData.group_id, question, options);
      setActiveModal(null);
      await loadMessages();
    } catch (err) { console.error('Error creating poll:', err); }
  };

  const handleCreateNote = async ({ title, content, reminder, repeat }) => {
    try {
      await collectionsAPI.createNote({
        group_id: groupData.group_id,
        title,
        content,
        reminder,
        repeat,
      });
      setActiveModal(null);
      await loadMessages();
    } catch (err) { console.error('Error creating note:', err); }
  };

  /* --- plus menu handler --- */
  const openModal = (type) => {
    setShowPlusMenu(false);
    setActiveModal(type);
  };

  /* --- render a single message --- */
  const renderMessage = (msg) => {
    const isOwn = msg.user_first_name === userData.firstName;
    const isSpecial = msg.message_type && msg.message_type !== 'text';

    if (isSpecial) {
      return (
        <div key={msg.id} style={{
          display: 'flex', flexDirection: 'column',
          alignItems: isOwn ? 'flex-end' : 'flex-start',
          maxWidth: '85%', alignSelf: isOwn ? 'flex-end' : 'flex-start',
        }}>
          {!isOwn && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={avatarStyle}>{msg.user_first_name?.[0] || '?'}</div>
              <span style={senderName}>{msg.user_first_name}</span>
            </div>
          )}
          {msg.message_type === 'goal' && <GoalCard msg={msg} groupId={groupData.group_id} />}
          {msg.message_type === 'ask' && <AskCard msg={msg} />}
          {msg.message_type === 'poll' && <PollCard msg={msg} currentUserId={currentUserId} />}
          {msg.message_type === 'note' && <NoteCard msg={msg} />}
          {msg.message_type === 'meetup' && <MeetupCard msg={msg} />}
        </div>
      );
    }

    // Regular text message
    return (
      <div key={msg.id} style={{
        display: 'flex', gap: '8px',
        alignSelf: isOwn ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
        flexDirection: isOwn ? 'row-reverse' : 'row',
      }}>
        {!isOwn && <div style={avatarStyle}>{msg.user_first_name?.[0] || '?'}</div>}
        <div style={{
          padding: '10px 16px',
          borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          backgroundColor: isOwn ? theme.colors.primary : '#fff',
          color: isOwn ? '#fff' : theme.colors.textDark,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          {!isOwn && <span style={senderName}>{msg.user_first_name}</span>}
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.45' }}>{msg.message_text}</p>
        </div>
      </div>
    );
  };

  /* ── JSX ── */
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      backgroundColor: '#f2f4f6',
    }}>
      {/* ─── Header ─── */}
      <div style={{
        backgroundColor: '#2D4F5C', color: '#fff',
        padding: '0 12px', height: '56px',
        display: 'flex', alignItems: 'center', gap: '10px',
        flexShrink: 0,
      }}>
        {/* Back arrow */}
        <button onClick={onBack} style={headerIconBtn} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Group name */}
        <span style={{ flex: 1, fontSize: '16px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {groupData.group_name || 'Your Bridge Group'}
        </span>

        {/* Meetup pill */}
        <button style={{
          padding: '5px 14px', borderRadius: '20px',
          border: '1.5px solid rgba(255,255,255,0.45)', backgroundColor: 'transparent',
          color: '#fff', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
          flexShrink: 0,
        }}>
          Meetup
        </button>

        {/* Phone icon */}
        <button style={headerIconBtn} aria-label="Call">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.2 2.21z"/>
          </svg>
        </button>

        {/* Hamburger menu */}
        <button onClick={onGroupInfo} style={headerIconBtn} aria-label="Group info">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="5" width="18" height="2" rx="1"/>
            <rect x="3" y="11" width="18" height="2" rx="1"/>
            <rect x="3" y="17" width="18" height="2" rx="1"/>
          </svg>
        </button>
      </div>

      {/* ─── Task Panel ─── */}
      <div style={{ flexShrink: 0, paddingTop: '12px', backgroundColor: '#f2f4f6' }}>
        <TaskPanel groupId={groupData.group_id} currentUserId={currentUserId} />
      </div>

      {/* ─── Messages Area ─── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: theme.colors.textLight, padding: '40px 20px' }}>
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map(msg => renderMessage(msg))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input Area ─── */}
      <div style={{
        backgroundColor: '#fff', borderTop: '1px solid #eee',
        padding: '10px 12px 18px', display: 'flex', alignItems: 'center', gap: '8px',
        flexShrink: 0, position: 'relative',
      }}>
        {/* Plus button */}
        <button
          onClick={() => setShowPlusMenu(prev => !prev)}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            border: '1.5px solid #ccc', backgroundColor: 'transparent',
            color: theme.colors.textMedium, fontSize: '22px', lineHeight: '1',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          +
        </button>

        {/* Gallery / image icon */}
        <button style={{
          background: 'none', border: 'none', padding: '4px', cursor: 'pointer',
          color: theme.colors.textLight, flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </button>

        {/* Text input */}
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && !loading && sendMessage()}
          placeholder="Group chat"
          disabled={loading}
          style={{
            flex: 1, padding: '10px 16px', fontSize: '14px',
            border: '1.5px solid #e0e0e0', borderRadius: '25px',
            outline: 'none', backgroundColor: '#f8f8f8',
          }}
        />

        {/* Microphone icon */}
        <button style={{
          background: 'none', border: 'none', padding: '4px', cursor: 'pointer',
          color: theme.colors.textLight, flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="1" width="6" height="12" rx="3"/>
            <path d="M5 10a7 7 0 0014 0"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
          </svg>
        </button>

        {/* Plus menu overlay */}
        {showPlusMenu && (
          <>
            <div
              onClick={() => setShowPlusMenu(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 49 }}
            />
            <div style={{
              position: 'absolute', bottom: '60px', left: '12px',
              backgroundColor: '#fff', borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              padding: '6px 0', zIndex: 50, minWidth: '200px',
            }}>
              {[
                { label: 'Goal of the week', key: 'goal' },
                { label: 'Ask the group', key: 'ask' },
                { label: 'Poll', key: 'poll' },
                { label: 'Note', key: 'note' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => openModal(item.key)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '12px 20px', border: 'none', backgroundColor: 'transparent',
                    fontSize: '14px', color: theme.colors.textDark, cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ─── Creation Modals ─── */}
      {activeModal === 'goal' && (
        <GoalModal onClose={() => setActiveModal(null)} onCreate={handleCreateGoal} />
      )}
      {activeModal === 'ask' && (
        <AskModal onClose={() => setActiveModal(null)} onCreate={handleCreateAsk} />
      )}
      {activeModal === 'poll' && (
        <PollModal onClose={() => setActiveModal(null)} onCreate={handleCreatePoll} />
      )}
      {activeModal === 'note' && (
        <NoteModal onClose={() => setActiveModal(null)} onCreate={handleCreateNote} />
      )}
    </div>
  );
}

/* ── Reusable small styles ── */

const headerIconBtn = {
  width: '36px', height: '36px', borderRadius: '50%',
  border: 'none', backgroundColor: 'transparent',
  color: '#fff', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
};

const avatarStyle = {
  width: '32px', height: '32px', borderRadius: '50%',
  backgroundColor: theme.colors.primary, color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '13px', fontWeight: '600', flexShrink: 0,
};

const senderName = {
  fontSize: '11px', fontWeight: '600',
  color: theme.colors.primary, display: 'block', marginBottom: '2px',
};

export default ChatScreen;
