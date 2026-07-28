import React, { useState, useEffect, useRef } from 'react';
import { groupsAPI, collectionsAPI, meetupsAPI, tasksAPI } from '../services/api';
import { theme } from '../theme';

/* ──────────────────────────────────────────────
   Inline creation modals
   ────────────────────────────────────────────── */

function GoalModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h3 style={modalTitle}>Goal of the week</h3>
        <input placeholder="Goal title" value={title} onChange={e => setTitle(e.target.value)} style={modalInput} />
        <div style={modalActions}>
          <button onClick={onClose} style={modalCancelBtn}>Cancel</button>
          <button disabled={!title.trim()} onClick={() => onCreate(title.trim())} style={{ ...modalCreateBtn, opacity: title.trim() ? 1 : 0.5 }}>Create</button>
        </div>
      </div>
    </div>
  );
}

function PollModal({ onClose, onCreate }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const updateOption = (idx, val) => { const next = [...options]; next[idx] = val; setOptions(next); };
  const addOption = () => { if (options.length < 4) setOptions([...options, '']); };
  const canCreate = question.trim() && options.filter(o => o.trim()).length >= 2;
  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h3 style={modalTitle}>Poll</h3>
        <input placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} style={modalInput} />
        {options.map((opt, i) => (
          <input key={i} placeholder={`Option ${i + 1}`} value={opt} onChange={e => updateOption(i, e.target.value)} style={{ ...modalInput, marginTop: '8px' }} />
        ))}
        {options.length < 4 && (
          <button onClick={addOption} style={{ ...modalCancelBtn, marginTop: '6px', fontSize: '13px' }}>+ Add option</button>
        )}
        <div style={modalActions}>
          <button onClick={onClose} style={modalCancelBtn}>Cancel</button>
          <button disabled={!canCreate} onClick={() => onCreate(question.trim(), options.filter(o => o.trim()))} style={{ ...modalCreateBtn, opacity: canCreate ? 1 : 0.5 }}>Create</button>
        </div>
      </div>
    </div>
  );
}

/* ── Shared modal styles ── */
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const modalBox = { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '380px', boxShadow: '0 8px 30px rgba(0,0,0,0.18)' };
const modalTitle = { margin: '0 0 16px', fontSize: '17px', fontWeight: '600', color: theme.colors.textDark };
const modalInput = { width: '100%', padding: '12px 14px', fontSize: '14px', border: '1.5px solid #e0e0e0', borderRadius: '10px', outline: 'none', boxSizing: 'border-box' };
const modalActions = { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' };
const modalCancelBtn = { padding: '10px 18px', borderRadius: '10px', border: 'none', backgroundColor: '#f0f0f0', color: theme.colors.textDark, fontSize: '14px', fontWeight: '500', cursor: 'pointer' };
const modalCreateBtn = { padding: '10px 18px', borderRadius: '10px', border: 'none', backgroundColor: theme.colors.primary, color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };

/* ──────────────────────────────────────────────
   Special message card renderers
   ────────────────────────────────────────────── */

const cardBase = {
  backgroundColor: '#fff', borderRadius: '14px', padding: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: '100%', maxWidth: '320px',
  boxSizing: 'border-box',
};
const cardLabel = { fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' };
const cardTitle = { fontSize: '15px', fontWeight: '600', color: theme.colors.textDark, margin: '0 0 10px' };

function GoalCard({ msg }) {
  const [personalGoal, setPersonalGoal] = useState('');
  const handleAdd = async () => {
    if (!personalGoal.trim() || !msg.collection_id) return;
    try { await collectionsAPI.addPersonalGoal(msg.collection_id, personalGoal.trim()); setPersonalGoal(''); }
    catch (err) { console.error('Error adding personal goal:', err); }
  };
  return (
    <div style={cardBase}>
      <div style={{ ...cardLabel, color: '#e8a735' }}>Goal of the week</div>
      <p style={cardTitle}>{msg.collection_title || msg.message_text}</p>
      <input placeholder="Your personal goal..." value={personalGoal} onChange={e => setPersonalGoal(e.target.value)} style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', marginBottom: '8px' }} />
      <button onClick={handleAdd} style={{ background: 'none', border: 'none', color: theme.colors.primary, fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0 }}>+ Add your personal goal</button>
    </div>
  );
}

function AskCard({ msg }) {
  return (
    <div style={cardBase}>
      <div style={{ ...cardLabel, color: '#5b8def' }}>Ask the group</div>
      <p style={cardTitle}>{msg.collection_title || msg.message_text}</p>
      <button style={{ padding: '8px 20px', borderRadius: '20px', border: `1.5px solid ${theme.colors.primary}`, backgroundColor: 'transparent', color: theme.colors.primary, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Reply</button>
    </div>
  );
}

function PollCard({ msg, currentUserId, onRefresh }) {
  const isCreator = msg.user_id === currentUserId;
  const [options, setOptions] = useState(msg.poll_options || []);
  const [hasVoted, setHasVoted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [voting, setVoting] = useState(false);

  const totalVotes = options.reduce((sum, o) => sum + (o.vote_count || 0), 0);

  const handleVote = async (optionId) => {
    if (!msg.collection_id || hasVoted || voting) return;
    setVoting(true);
    try {
      await collectionsAPI.votePoll(msg.collection_id, optionId);
      setOptions(prev => prev.map(o =>
        o.id === optionId ? { ...o, vote_count: (o.vote_count || 0) + 1 } : o
      ));
      setHasVoted(true);
      if (onRefresh) onRefresh();
    } catch (err) {
      const detail = err.response?.data?.detail || '';
      if (detail.includes('already voted')) setHasVoted(true);
      else console.error('Error voting:', err);
    } finally { setVoting(false); }
  };

  const handleEnd = async () => {
    if (!msg.collection_id) return;
    try {
      await collectionsAPI.endPoll(msg.collection_id);
      setEnded(true);
      if (onRefresh) onRefresh();
    } catch (err) { console.error('Error ending poll:', err); }
  };

  return (
    <div style={cardBase}>
      <div style={{ ...cardLabel, color: '#9b59b6' }}>{ended ? 'Poll (ended)' : 'Poll'}</div>
      <p style={cardTitle}>{msg.collection_title || msg.message_text}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {options.map(opt => {
          const pct = totalVotes > 0 ? Math.round((opt.vote_count || 0) / totalVotes * 100) : 0;
          const showBar = hasVoted || ended;
          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              disabled={hasVoted || ended || voting}
              style={{
                position: 'relative', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '10px 14px', borderRadius: '10px',
                border: '1px solid #e0e0e0', backgroundColor: '#fafafa',
                cursor: hasVoted || ended ? 'default' : 'pointer',
                fontSize: '14px', color: theme.colors.textDark, overflow: 'hidden',
                opacity: voting ? 0.6 : 1,
              }}
            >
              {showBar && (
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${pct}%`, backgroundColor: 'rgba(116, 153, 182, 0.15)',
                  borderRadius: '10px', transition: 'width 0.3s',
                }} />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{opt.text}</span>
              <span style={{
                position: 'relative', zIndex: 1,
                fontSize: '12px', color: theme.colors.textMedium, fontWeight: '600',
              }}>
                {showBar ? `${pct}%` : ''} {opt.vote_count || 0}
              </span>
            </button>
          );
        })}
      </div>
      {totalVotes > 0 && (
        <p style={{ fontSize: '12px', color: theme.colors.textLight, margin: '6px 0 0' }}>
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
        </p>
      )}
      {isCreator && !ended && (
        <button onClick={handleEnd} style={{
          marginTop: '10px', padding: '8px 18px', borderRadius: '20px', border: 'none',
          backgroundColor: theme.colors.primary, color: '#fff', fontSize: '13px',
          fontWeight: '600', cursor: 'pointer',
        }}>End voting</button>
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
    try { await meetupsAPI.attend(msg.meetup_id); } catch (err) { console.error('Error attending meetup:', err); }
  };
  return (
    <div style={{ ...cardBase, border: `1.5px solid ${theme.colors.primary}` }}>
      <div style={{ ...cardLabel, color: theme.colors.primary }}>Meetup</div>
      {msg.meetup_location && <p style={{ margin: '0 0 4px', fontSize: '14px', color: theme.colors.textDark }}>{msg.meetup_location}</p>}
      {msg.meetup_date && <p style={{ margin: '0 0 10px', fontSize: '13px', color: theme.colors.textMedium }}>{msg.meetup_date}{msg.meetup_time ? ` at ${msg.meetup_time}` : ''}</p>}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={handleAttend} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', backgroundColor: theme.colors.primary, color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Attend</button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Task Panel (inline, crash-safe)
   ────────────────────────────────────────────── */

function ChatTaskPanel({ groupId, currentUserId }) {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;
    setLoading(true);
    tasksAPI.getTasks(groupId)
      .then(data => { if (!cancelled) setTasks(Array.isArray(data) ? data : []); })
      .catch(err => console.error('Error loading tasks:', err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [groupId]);

  const isDoneByMe = (task) =>
    (task.completed_by || []).some(u => u.user_id === currentUserId);

  const handleComplete = async (task) => {
    if (isDoneByMe(task)) return;
    try {
      await tasksAPI.completeTask(task.id);
      const data = await tasksAPI.getTasks(groupId);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) { console.error('Error completing task:', err); }
  };

  const doneCount = tasks.filter(isDoneByMe).length;

  return (
    <div style={{
      backgroundColor: '#fff',
      margin: '0 12px',
      borderRadius: '14px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: theme.colors.primary, lineHeight: '1.3' }}>
            Let's Get to Know Each Other
          </div>
          <div style={{ fontSize: '12px', color: theme.colors.textLight, marginTop: '2px' }}>
            {tasks.length > 0
              ? `${doneCount} of ${tasks.length} done — tap to ${expanded ? 'hide' : 'see them'}`
              : 'Complete these tasks to get to know the group better'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.primary }}>
            {doneCount}/{tasks.length || '–'}
          </span>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid #f0f0f0' }}>
          {loading && (
            <p style={{ fontSize: '13px', color: theme.colors.textMedium, margin: '12px 0 0' }}>
              Loading tasks...
            </p>
          )}
          {!loading && tasks.length === 0 && (
            <p style={{ fontSize: '13px', color: theme.colors.textMedium, margin: '12px 0 0' }}>
              No tasks yet — they'll appear here as your group progresses.
            </p>
          )}
          {!loading && tasks.map(task => {
            const done = isDoneByMe(task);
            const others = (task.completed_by || []).filter(u => u.user_id !== currentUserId);
            return (
              <div key={task.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '10px 0', borderBottom: '1px solid #f5f5f5',
              }}>
                <button
                  onClick={() => handleComplete(task)}
                  disabled={done}
                  aria-label={done ? 'Completed' : 'Mark as done'}
                  style={{
                    width: '20px', height: '20px', borderRadius: '50%', marginTop: '1px',
                    border: `1.5px solid ${done ? theme.colors.primary : '#ccc'}`,
                    backgroundColor: done ? theme.colors.primary : 'transparent',
                    cursor: done ? 'default' : 'pointer', flexShrink: 0, padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {done && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '13px', lineHeight: '1.4',
                    color: done ? theme.colors.textLight : theme.colors.textDark,
                    textDecoration: done ? 'line-through' : 'none',
                  }}>
                    {task.title}
                  </div>
                  {others.length > 0 && (
                    <div style={{ fontSize: '11px', color: theme.colors.textLight, marginTop: '2px' }}>
                      Done by {others.map(u => u.first_name).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* Keep one entry per message id, preserving order. Polling and the
   create/send paths can both deliver the same message. */
function dedupeById(msgs) {
  const seen = new Set();
  return msgs.filter(m => {
    if (m?.id == null || seen.has(m.id)) return m?.id == null;
    seen.add(m.id);
    return true;
  });
}

/* ──────────────────────────────────────────────
   Main ChatScreen component
   ────────────────────────────────────────────── */

function ChatScreen({ groupData, userData, onBack, onGroupInfo }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showFeatureHint, setShowFeatureHint] = useState(false);
  const messagesEndRef = useRef(null);
  const lastMessageTime = useRef(null);
  const imageInputRef = useRef(null);
  const pollInFlight = useRef(false);

  const currentUserId = userData?.id || userData?.user_id;

  /* --- one-time nudge so the + menu features get discovered --- */
  useEffect(() => {
    if (!localStorage.getItem('bridge_chat_hint_seen')) setShowFeatureHint(true);
  }, []);

  const dismissFeatureHint = () => {
    localStorage.setItem('bridge_chat_hint_seen', '1');
    setShowFeatureHint(false);
  };

  /* --- message polling --- */
  useEffect(() => {
    if (!groupData?.group_id) return;
    loadMessages();
    const interval = setInterval(() => pollNewMessages(), 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData?.group_id]);

  const loadMessages = async () => {
    try {
      const msgs = await groupsAPI.getMessages(groupData.group_id);
      setMessages(dedupeById(msgs));
      if (msgs.length > 0) lastMessageTime.current = msgs[msgs.length - 1].created_at;
      scrollToBottom();
    } catch (err) { console.error('Error loading messages:', err); }
  };

  const pollNewMessages = async () => {
    // A poll started before a create/send lands returns that same message
    // again; without this guard it gets appended a second time.
    if (pollInFlight.current) return;
    pollInFlight.current = true;
    try {
      const since = lastMessageTime.current;
      const newMsgs = await groupsAPI.getMessages(groupData.group_id, since);
      if (newMsgs.length > 0) {
        setMessages(prev => dedupeById([...prev, ...newMsgs]));
        lastMessageTime.current = newMsgs[newMsgs.length - 1].created_at;
        scrollToBottom();
      }
    } catch (err) { console.error('Error polling messages:', err); }
    finally { pollInFlight.current = false; }
  };

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  /* --- send text message --- */
  const sendMessage = async () => {
    if (!newMessage.trim() || loading) return;
    setLoading(true);
    try {
      const sent = await groupsAPI.sendMessage(groupData.group_id, newMessage.trim());
      setMessages(prev => dedupeById([...prev, sent]));
      setNewMessage('');
      lastMessageTime.current = sent.created_at;
      scrollToBottom();
    } catch (err) { console.error('Error sending message:', err); }
    finally { setLoading(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* --- image upload --- */
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = (h / w) * maxDim; w = maxDim; }
          else { w = (w / h) * maxDim; h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        try {
          const sent = await groupsAPI.sendMessage(groupData.group_id, dataUrl);
          setMessages(prev => dedupeById([...prev, sent]));
          lastMessageTime.current = sent.created_at;
          scrollToBottom();
        } catch (err) { console.error('Error sending image:', err); }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  /* --- collection creators --- */
  const handleCreateGoal = async (title) => {
    try { await collectionsAPI.createGoal(groupData.group_id, title); setActiveModal(null); await loadMessages(); }
    catch (err) { console.error('Error creating goal:', err); }
  };
  const handleCreatePoll = async (question, options) => {
    try { await collectionsAPI.createPoll(groupData.group_id, question, options); setActiveModal(null); await loadMessages(); }
    catch (err) { console.error('Error creating poll:', err); }
  };
  const openModal = (type) => { setShowPlusMenu(false); setActiveModal(type); };

  /* --- group messages by sender for consecutive runs --- */
  const groupMessages = (msgs) => {
    const groups = [];
    let current = null;

    msgs.forEach((msg) => {
      const isSpecial = msg.message_type && msg.message_type !== 'text';
      if (current && !isSpecial && current.userId === msg.user_id && !current.isSpecial) {
        current.messages.push(msg);
      } else {
        current = { userId: msg.user_id, userName: msg.user_first_name, messages: [msg], isSpecial };
        groups.push(current);
      }
    });

    return groups;
  };

  /* --- find member photo --- */
  const getMemberPhoto = (userName) => {
    const member = groupData?.members?.find(m => m.first_name === userName);
    return member?.profile_photo_url || null;
  };

  /* --- render grouped messages --- */
  const renderMessageGroup = (group) => {
    const isOwn = group.userId === currentUserId;

    // Keyed by the first message's id, not the array index — an index key
    // makes React reuse a group's DOM when the list shifts, which showed up
    // as an older card morphing into a newly created one.
    return (
      <div key={group.messages[0]?.id ?? group.key} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
      }}>
        {/* Sender info (other people only) */}
        {!isOwn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', paddingLeft: '4px' }}>
            {getMemberPhoto(group.userName) ? (
              <img
                src={getMemberPhoto(group.userName)}
                alt={group.userName}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: theme.colors.primary, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '600',
              }}>
                {group.userName?.[0] || '?'}
              </div>
            )}
            <span style={{ fontSize: '13px', fontWeight: '600', color: theme.colors.textDark }}>
              {group.userName}
            </span>
          </div>
        )}

        {/* Message bubbles */}
        {group.messages.map((msg, msgIdx) => {
          const isSpecial = msg.message_type && msg.message_type !== 'text';

          if (isSpecial) {
            return (
              <div key={msg.id} style={{ maxWidth: '85%', marginBottom: '4px', marginLeft: isOwn ? 0 : '36px' }}>
                {msg.message_type === 'goal' && <GoalCard msg={msg} />}
                {msg.message_type === 'ask' && <AskCard msg={msg} />}
                {msg.message_type === 'poll' && <PollCard msg={msg} currentUserId={currentUserId} onRefresh={loadMessages} />}
                {msg.message_type === 'note' && <NoteCard msg={msg} />}
                {msg.message_type === 'meetup' && <MeetupCard msg={msg} />}
              </div>
            );
          }

          const isFirst = msgIdx === 0;
          const isLast = msgIdx === group.messages.length - 1;

          return (
            <div key={msg.id} style={{
              maxWidth: '75%',
              marginBottom: '3px',
              marginLeft: isOwn ? 0 : '36px',
            }}>
              <div style={{
                padding: msg.message_text?.startsWith('data:image') ? '4px' : '10px 16px',
                borderRadius: isOwn
                  ? (isFirst && isLast ? '20px' : isFirst ? '20px 20px 6px 20px' : isLast ? '20px 6px 20px 20px' : '20px 6px 6px 20px')
                  : (isFirst && isLast ? '20px' : isFirst ? '20px 20px 20px 6px' : isLast ? '6px 20px 20px 20px' : '6px 20px 20px 6px'),
                backgroundColor: isOwn ? '#7499B6' : '#fff',
                color: isOwn ? '#fff' : theme.colors.textDark,
                boxShadow: isOwn ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                fontSize: '15px',
                lineHeight: '1.4',
                overflow: 'hidden',
              }}>
                {msg.message_text?.startsWith('data:image') ? (
                  <img src={msg.message_text} alt="Shared" style={{
                    maxWidth: '100%', borderRadius: '16px', display: 'block',
                  }} />
                ) : msg.message_text}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const messageGroups = groupMessages(messages);

  /* ── JSX ── */
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      backgroundColor: '#EDF1F5',
      width: '100%', maxWidth: '100vw', overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* ─── Header ─── */}
      <div style={{
        background: 'linear-gradient(135deg, #7499B6 0%, #3a6a7a 100%)',
        color: '#fff',
        padding: '0 8px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexShrink: 0,
        boxSizing: 'border-box',
        width: '100%',
      }}>
        <button onClick={onBack} style={headerIconBtn} aria-label="Back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <span style={{
          flex: 1, fontSize: '17px', fontWeight: '700',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {groupData?.name || 'Your Bridge Group'}
        </span>

        <button onClick={onGroupInfo} style={headerIconBtn} aria-label="Group info">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {/* ─── Task Panel ─── */}
      <div style={{ flexShrink: 0, paddingTop: '10px', paddingBottom: '4px' }}>
        <ChatTaskPanel groupId={groupData?.group_id} currentUserId={currentUserId} />
      </div>

      {/* ─── Messages Area ─── */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '12px 12px 0',
        display: 'flex', flexDirection: 'column',
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: theme.colors.textLight, padding: '40px 20px' }}>
            <p style={{ fontSize: '15px' }}>No messages yet. Say hello!</p>
          </div>
        ) : (
          messageGroups.map(g => renderMessageGroup(g))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input Area ─── */}
      <div style={{
        padding: '8px 8px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        flexShrink: 0,
        position: 'relative',
        backgroundColor: '#EDF1F5',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '30px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          boxSizing: 'border-box',
          width: '100%',
          minWidth: 0,
        }}>
          {/* Plus button */}
          <button
            onClick={() => setShowPlusMenu(prev => !prev)}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              border: 'none', backgroundColor: 'transparent',
              color: '#555', fontSize: '28px', lineHeight: '1',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, padding: 0, fontWeight: '300',
            }}
          >
            +
          </button>

          {/* Gallery / image icon */}
          <button onClick={() => imageInputRef.current?.click()} style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            color: '#555', flexShrink: 0, display: 'flex', alignItems: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />

          {/* Text input */}
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Group chat"
            style={{
              flex: 1,
              minWidth: 0,
              padding: '10px 12px',
              fontSize: '16px',
              border: '1px solid #e0e0e0',
              borderRadius: '22px',
              outline: 'none',
              backgroundColor: '#f4f4f4',
              color: theme.colors.textDark,
              WebkitAppearance: 'none',
              boxSizing: 'border-box',
            }}
          />

          {/* Send */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || loading}
            aria-label="Send"
            style={{
              background: 'none', border: 'none', padding: 0,
              cursor: newMessage.trim() && !loading ? 'pointer' : 'default',
              color: newMessage.trim() && !loading ? theme.colors.primary : '#bbb',
              flexShrink: 0, display: 'flex', alignItems: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>

        {/* First-visit hint pointing at the + menu */}
        {showFeatureHint && !showPlusMenu && (
          <div style={{
            position: 'absolute', bottom: '62px', left: '12px', right: '12px',
            backgroundColor: theme.colors.primary, color: '#fff',
            borderRadius: '14px', padding: '12px 14px', zIndex: 48,
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            display: 'flex', alignItems: 'flex-start', gap: '12px',
          }}>
            <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.5' }}>
              Tap <strong>+</strong> to set a Goal of the week or start a Poll for the group.
            </div>
            <button onClick={dismissFeatureHint} style={{
              border: 'none', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff',
              borderRadius: '14px', padding: '6px 12px', fontSize: '12px',
              fontWeight: '600', cursor: 'pointer', flexShrink: 0,
            }}>Got it</button>
            <span style={{
              position: 'absolute', bottom: '-6px', left: '22px',
              width: '12px', height: '12px', backgroundColor: theme.colors.primary,
              transform: 'rotate(45deg)',
            }} />
          </div>
        )}

        {/* Plus menu overlay */}
        {showPlusMenu && (
          <>
            <div onClick={() => setShowPlusMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
            <div style={{
              position: 'absolute', bottom: '64px', left: '14px',
              backgroundColor: '#fff', borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              padding: '6px 0', zIndex: 50, minWidth: '200px',
            }}>
              {[
                { label: 'Goal of the week', key: 'goal' },
                { label: 'Poll', key: 'poll' },
              ].map(item => (
                <button key={item.key} onClick={() => openModal(item.key)} style={{
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
      {activeModal === 'goal' && <GoalModal onClose={() => setActiveModal(null)} onCreate={handleCreateGoal} />}
      {activeModal === 'poll' && <PollModal onClose={() => setActiveModal(null)} onCreate={handleCreatePoll} />}
    </div>
  );
}

/* ── Reusable small styles ── */
const headerIconBtn = {
  width: '36px', height: '36px', borderRadius: '50%',
  border: 'none', backgroundColor: 'transparent',
  color: '#fff', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0, padding: 0,
};

export default ChatScreen;
