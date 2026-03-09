import React, { useState } from 'react';
import { theme } from '../theme';
import { eventsAPI } from '../services/api';

function MeetupModal({ groupId, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title || !date || !time) {
      setError('Please fill in title, date, and time.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const eventDate = new Date(`${date}T${time}`).toISOString();
      await eventsAPI.createEvent({
        group_id: groupId,
        title,
        location: location || null,
        event_date: eventDate,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: theme.colors.surfaceWhite,
        borderRadius: '20px',
        padding: '28px 24px',
        width: '100%',
        maxWidth: '400px',
        animation: 'fadeIn 0.3s ease',
      }}>
        <h2 style={{
          fontSize: '20px', fontWeight: '600', color: theme.colors.textDark,
          marginBottom: '20px',
        }}>
          Plan a Meetup
        </h2>

        {error && (
          <p style={{
            fontSize: '13px', color: theme.colors.error,
            marginBottom: '12px',
          }}>{error}</p>
        )}

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', color: theme.colors.textMedium, display: 'block', marginBottom: '6px' }}>
            What's the plan?
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Coffee catch-up"
            style={{
              width: '100%', padding: '12px 14px', borderRadius: '12px',
              border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', color: theme.colors.textMedium, display: 'block', marginBottom: '6px' }}>
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g., Shoreditch, London"
            style={{
              width: '100%', padding: '12px 14px', borderRadius: '12px',
              border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '13px', color: theme.colors.textMedium, display: 'block', marginBottom: '6px' }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px',
                border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none',
                backgroundColor: 'transparent',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '13px', color: theme.colors.textMedium, display: 'block', marginBottom: '6px' }}>
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px',
                border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none',
                backgroundColor: 'transparent',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px', borderRadius: '25px',
              border: '1.5px solid #ccc', backgroundColor: 'transparent',
              color: theme.colors.textMedium, fontSize: '14px', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              flex: 1, padding: '12px', borderRadius: '25px',
              border: 'none', backgroundColor: theme.colors.primary,
              color: '#fff', fontSize: '14px', fontWeight: '600',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating...' : 'Create Meetup'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MeetupModal;
