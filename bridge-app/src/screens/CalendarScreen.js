import React, { useState, useEffect, useCallback } from 'react';
import { eventsAPI, meetupsAPI } from '../services/api';
import { theme } from '../theme';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const EVENT_COLORS = [
  '#e07a3a', // orange
  '#4a90d9', // blue
  '#50b87a', // green
  '#d94a6e', // pink
  '#8a6fdb', // purple
  '#d4a63a', // gold
];

function CalendarScreen({ groupData, onBack }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const groupId = groupData?.group_id;

  const loadEvents = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const [events, meetups] = await Promise.all([
        eventsAPI.getEvents(groupId).catch(() => []),
        meetupsAPI.getMeetups(groupId).catch(() => []),
      ]);

      const normalizedEvents = (Array.isArray(events) ? events : []).map((e, i) => ({
        id: e.id || `event-${i}`,
        title: e.title || e.event_title || 'Event',
        date: e.date || e.event_date,
        time: e.time || e.event_time || '',
        location: e.location || '',
        color: EVENT_COLORS[i % EVENT_COLORS.length],
        type: 'event',
      }));

      const normalizedMeetups = (Array.isArray(meetups) ? meetups : []).map((m, i) => ({
        id: m.id || `meetup-${i}`,
        title: m.title || m.meetup_title || 'Meetup',
        date: m.date || m.meetup_date,
        time: m.time || m.meetup_time || '',
        location: m.location || '',
        color: EVENT_COLORS[(normalizedEvents.length + i) % EVENT_COLORS.length],
        type: 'meetup',
      }));

      setAllEvents([...normalizedEvents, ...normalizedMeetups]);
    } catch (err) {
      console.error('Error loading calendar events:', err);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const today = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Build calendar grid (6 rows x 7 cols)
  const calendarDays = [];
  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, currentMonth: false });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, currentMonth: true });
  }
  // Next month leading days
  const remaining = 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    calendarDays.push({ day: d, currentMonth: false });
  }

  const isToday = (day) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const isSelected = (day) => {
    return day === selectedDate.getDate()
      && currentMonth === selectedDate.getMonth()
      && currentYear === selectedDate.getFullYear();
  };

  const getEventsForDay = (day) => {
    return allEvents.filter((e) => {
      if (!e.date) return false;
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDayClick = (day, isCurrent) => {
    if (!isCurrent) return;
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  // Events for the selected date
  const selectedEvents = allEvents.filter((e) => {
    if (!e.date) return false;
    const d = new Date(e.date);
    return d.getDate() === selectedDate.getDate()
      && d.getMonth() === selectedDate.getMonth()
      && d.getFullYear() === selectedDate.getFullYear();
  });

  const formatSelectedDateHeader = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[selectedDate.getDay()]} ${selectedDate.getDate()} ${months[selectedDate.getMonth()]}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      padding: '20px 16px 80px',
    }}>
      <div style={{ maxWidth: '430px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '24px' }}>
          {onBack && (
            <button onClick={onBack} style={styles.backButton}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={theme.colors.textDark}>
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
          )}
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: theme.colors.textDark, margin: 0 }}>
            Calendar
          </h1>
        </div>

        {/* Calendar card */}
        <div style={styles.calendarCard}>
          {/* Month navigation */}
          <div style={styles.monthRow}>
            <button onClick={goToPrevMonth} style={styles.navArrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.textDark}>
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.textDark, margin: 0 }}>
              {monthName}
            </h2>
            <button onClick={goToNextMonth} style={styles.navArrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.textDark}>
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div style={styles.dayHeaderRow}>
            {DAY_LABELS.map((label, i) => {
              const isWeekend = i === 5 || i === 6;
              return (
                <div key={i} style={{
                  ...styles.dayHeaderCell,
                  color: isWeekend ? '#d4a63a' : theme.colors.textMedium,
                }}>
                  {label}
                </div>
              );
            })}
          </div>

          {/* Calendar grid */}
          <div style={styles.calendarGrid}>
            {calendarDays.map((cell, i) => {
              const isCurrent = cell.currentMonth;
              const dayEvents = isCurrent ? getEventsForDay(cell.day) : [];
              const isTodayCell = isCurrent && isToday(cell.day);
              const isSelectedCell = isCurrent && isSelected(cell.day);
              const colIndex = i % 7;
              const isWeekendCol = colIndex === 5 || colIndex === 6;

              return (
                <div
                  key={i}
                  onClick={() => handleDayClick(cell.day, isCurrent)}
                  style={{
                    ...styles.dayCell,
                    cursor: isCurrent ? 'pointer' : 'default',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isTodayCell ? theme.colors.primary : isSelectedCell ? 'rgba(45, 79, 92, 0.12)' : 'transparent',
                    color: isTodayCell
                      ? '#fff'
                      : !isCurrent
                        ? '#ccc'
                        : isWeekendCol
                          ? '#d4a63a'
                          : theme.colors.textDark,
                    fontSize: '14px',
                    fontWeight: isTodayCell || isSelectedCell ? '700' : '400',
                    transition: 'all 0.15s ease',
                  }}>
                    {cell.day}
                  </div>
                  {/* Event dots */}
                  <div style={styles.dotRow}>
                    {dayEvents.slice(0, 3).map((ev, di) => (
                      <div key={di} style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: ev.color,
                        margin: '0 1px',
                      }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events list */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{
            fontSize: '16px', fontWeight: '600', color: theme.colors.textDark,
            margin: '0 0 12px', paddingLeft: '4px',
          }}>
            {formatSelectedDateHeader()}
          </h3>

          {loading && (
            <p style={{ textAlign: 'center', color: theme.colors.textMedium }}>Loading events...</p>
          )}

          {!loading && selectedEvents.length === 0 && (
            <div style={styles.emptyState}>
              <p style={{ color: theme.colors.textMedium, fontSize: '14px', margin: 0 }}>
                No events on this day
              </p>
            </div>
          )}

          {selectedEvents.map((event) => (
            <div key={event.id} style={styles.eventCard}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: event.color,
                flexShrink: 0,
                marginTop: '5px',
              }} />
              <div style={{ flex: 1, marginLeft: '12px' }}>
                <p style={{
                  fontSize: '15px', fontWeight: '600', color: theme.colors.textDark,
                  margin: '0 0 4px',
                }}>
                  {event.title}
                </p>
                {event.time && (
                  <p style={{ fontSize: '13px', color: theme.colors.textMedium, margin: '0 0 4px' }}>
                    {event.time}
                  </p>
                )}
                {event.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={theme.colors.textLight}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span style={{ fontSize: '13px', color: theme.colors.textLight }}>
                      {event.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backButton: {
    position: 'absolute',
    left: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  calendarCard: {
    backgroundColor: theme.colors.surfaceCard,
    borderRadius: '16px',
    padding: '18px',
    backdropFilter: 'blur(10px)',
  },
  monthRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  navArrow: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '50%',
  },
  dayHeaderRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '8px',
  },
  dayHeaderCell: {
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600',
    padding: '4px 0',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    rowGap: '2px',
  },
  dayCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2px 0',
    minHeight: '48px',
  },
  dotRow: {
    display: 'flex',
    justifyContent: 'center',
    height: '7px',
    marginTop: '1px',
  },
  emptyState: {
    backgroundColor: theme.colors.surfaceCard,
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  eventCard: {
    backgroundColor: theme.colors.surfaceCard,
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'flex-start',
    backdropFilter: 'blur(10px)',
  },
};

export default CalendarScreen;
