import React from 'react';
import { theme } from '../theme';

function CalendarWeekView({ events = [] }) {
  const today = new Date();
  const days = [];

  // Generate 7 days starting from today
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getEventsForDate = (date) => {
    return events.filter(e => {
      const eventDate = new Date(e.event_date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: theme.colors.textDark,
        marginBottom: '4px',
      }}>
        {monthNames[today.getMonth()]} {today.getFullYear()}
      </h3>

      {/* Week strip */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '16px',
        overflowX: 'auto',
      }}>
        {days.map((day, i) => {
          const isToday = i === 0;
          const hasEvents = getEventsForDate(day).length > 0;
          return (
            <div key={i} style={{
              flex: '1 0 0',
              minWidth: '44px',
              textAlign: 'center',
              padding: '8px 4px',
              borderRadius: '12px',
              backgroundColor: isToday ? theme.colors.primary : 'transparent',
              color: isToday ? '#fff' : theme.colors.textDark,
            }}>
              <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>
                {dayNames[day.getDay()]}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>
                {day.getDate()}
              </div>
              {hasEvents && (
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  backgroundColor: isToday ? '#fff' : theme.colors.primary,
                  margin: '4px auto 0',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Events list */}
      {events.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {events.map((event, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'rgba(45, 79, 92, 0.05)',
              borderRadius: '12px',
              alignItems: 'center',
            }}>
              <div style={{
                width: '4px',
                height: '36px',
                borderRadius: '2px',
                backgroundColor: theme.colors.primary,
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: theme.colors.textDark, margin: 0 }}>
                  {event.title}
                </p>
                <p style={{ fontSize: '12px', color: theme.colors.textMedium, margin: '2px 0 0' }}>
                  {event.location || 'No location set'}
                </p>
              </div>
              <span style={{ fontSize: '12px', color: theme.colors.textMedium }}>
                {new Date(event.event_date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '13px', color: theme.colors.textLight, textAlign: 'center', padding: '12px 0' }}>
          No upcoming events
        </p>
      )}
    </div>
  );
}

export default CalendarWeekView;
