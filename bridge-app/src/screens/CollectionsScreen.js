import React, { useState, useEffect, useCallback } from 'react';
import { collectionsAPI } from '../services/api';
import { theme } from '../theme';

const TABS = [
  { key: 'asks', label: 'Ask the group' },
  { key: 'goals', label: 'Goal of the week' },
  { key: 'notes', label: 'Note' },
  { key: 'polls', label: 'Poll' },
];

function CollectionsScreen({ groupData, onBack }) {
  const [activeTab, setActiveTab] = useState('asks');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const groupId = groupData?.group_id;
  const groupName = groupData?.group_name || 'Your Group';

  const loadData = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      let data = [];
      switch (activeTab) {
        case 'asks':
          data = await collectionsAPI.getAsks(groupId);
          break;
        case 'goals':
          data = await collectionsAPI.getGoals(groupId);
          break;
        case 'notes':
          data = await collectionsAPI.getNotes(groupId);
          break;
        case 'polls':
          data = await collectionsAPI.getPolls(groupId);
          break;
        default:
          break;
      }
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading collections:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [groupId, activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const renderAskCard = (item, index) => (
    <div key={item.id || index} style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardGroupName}>{groupName}</span>
        <span style={styles.cardDate}>{formatDate(item.created_at)} {formatTime(item.created_at)}</span>
      </div>
      <div style={styles.cardLabel}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.colors.primary} style={{ marginRight: '6px', flexShrink: 0 }}>
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM11 5h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
        Ask the group
      </div>
      <p style={styles.cardQuestion}>{item.question}</p>
      <div style={styles.cardActions}>
        <button style={styles.actionButton}>reply</button>
        <button style={{ ...styles.actionButton, ...styles.viewButton }}>View</button>
      </div>
    </div>
  );

  const renderGoalCard = (item, index) => (
    <div key={item.id || index} style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardGroupName}>{groupName}</span>
        <span style={styles.cardDate}>{formatDate(item.created_at)}</span>
      </div>
      <div style={styles.cardLabel}>Goal of the week review</div>
      <p style={{ ...styles.cardQuestion, color: theme.colors.primary }}>{item.title}</p>
      <div style={styles.cardActions}>
        <button style={styles.actionButton}>reply</button>
        <button style={{ ...styles.actionButton, ...styles.viewButton }}>View</button>
      </div>
    </div>
  );

  const renderNoteCard = (item, index) => (
    <div key={item.id || index} style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardGroupName}>{groupName}</span>
        <span style={styles.cardDate}>{formatDate(item.created_at)}</span>
      </div>
      <div style={styles.cardLabel}>Note</div>
      <p style={styles.cardQuestion}>{item.title || item.content}</p>
      {item.content && item.title && (
        <p style={{ fontSize: '13px', color: theme.colors.textMedium, margin: '0 0 12px' }}>
          {item.content}
        </p>
      )}
      <div style={styles.cardActions}>
        <button style={styles.actionButton}>reply</button>
        <button style={{ ...styles.actionButton, ...styles.viewButton }}>View</button>
      </div>
    </div>
  );

  const renderPollCard = (item, index) => {
    const options = item.options || [];
    const totalVotes = options.reduce((sum, opt) => sum + (opt.vote_count || 0), 0);

    return (
      <div key={item.id || index} style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardGroupName}>{groupName}</span>
          <span style={styles.cardDate}>{formatDate(item.created_at)}</span>
        </div>
        <div style={styles.cardLabel}>Poll</div>
        <p style={styles.cardQuestion}>{item.question}</p>
        <div style={{ marginBottom: '12px' }}>
          {options.map((opt, oi) => {
            const pct = totalVotes > 0 ? Math.round((opt.vote_count || 0) / totalVotes * 100) : 0;
            return (
              <div key={opt.id || oi} style={styles.pollOption}>
                <div style={{ ...styles.pollBar, width: `${pct}%` }} />
                <span style={styles.pollOptionText}>{opt.text || opt.option_text}</span>
                <span style={styles.pollVoteCount}>{opt.vote_count || 0}</span>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: '12px', color: theme.colors.textLight, margin: '0 0 12px' }}>
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
        </p>
        <div style={styles.cardActions}>
          <button style={styles.actionButton}>reply</button>
          <button style={{ ...styles.actionButton, ...styles.viewButton }}>View</button>
        </div>
      </div>
    );
  };

  const renderItems = () => {
    if (loading) {
      return <p style={{ textAlign: 'center', color: theme.colors.textMedium, marginTop: '40px' }}>Loading...</p>;
    }
    if (items.length === 0) {
      return (
        <p style={{ textAlign: 'center', color: theme.colors.textMedium, marginTop: '40px' }}>
          No items yet
        </p>
      );
    }
    switch (activeTab) {
      case 'asks':
        return items.map((item, i) => renderAskCard(item, i));
      case 'goals':
        return items.map((item, i) => renderGoalCard(item, i));
      case 'notes':
        return items.map((item, i) => renderNoteCard(item, i));
      case 'polls':
        return items.map((item, i) => renderPollCard(item, i));
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.colors.gradientTop} 0%, ${theme.colors.gradientBottom} 100%)`,
      padding: '20px 16px 80px',
    }}>
      <div style={{ maxWidth: '430px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          {onBack && (
            <button onClick={onBack} style={styles.backButton}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={theme.colors.textDark}>
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
          )}
          <h1 style={{
            fontSize: '28px', fontWeight: '700', color: theme.colors.textDark, margin: 0,
          }}>
            Collections
          </h1>
        </div>

        {/* Tab row */}
        <div style={styles.tabRow}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  ...styles.tabPill,
                  backgroundColor: isActive ? theme.colors.primary : 'transparent',
                  color: isActive ? theme.colors.textWhite : theme.colors.textDark,
                  border: isActive ? `1.5px solid ${theme.colors.primary}` : `1.5px solid ${theme.colors.borderLight}`,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ marginTop: '16px' }}>
          {renderItems()}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  tabRow: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  tabPill: {
    padding: '8px 18px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },
  card: {
    backgroundColor: theme.colors.surfaceCard,
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '14px',
    backdropFilter: 'blur(10px)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  cardGroupName: {
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  cardDate: {
    fontSize: '12px',
    color: theme.colors.textLight,
  },
  cardLabel: {
    fontSize: '13px',
    color: theme.colors.primary,
    fontWeight: '500',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  cardQuestion: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.textDark,
    margin: '0 0 14px',
    lineHeight: '1.4',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    padding: '8px 20px',
    borderRadius: '25px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    border: `1.5px solid ${theme.colors.borderLight}`,
    backgroundColor: 'transparent',
    color: theme.colors.textDark,
    transition: 'all 0.2s ease',
  },
  viewButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.textWhite,
    border: `1.5px solid ${theme.colors.primary}`,
  },
  pollOption: {
    position: 'relative',
    backgroundColor: 'rgba(45, 79, 92, 0.06)',
    borderRadius: '10px',
    padding: '10px 14px',
    marginBottom: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pollBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(45, 79, 92, 0.12)',
    borderRadius: '10px',
    transition: 'width 0.3s ease',
  },
  pollOptionText: {
    fontSize: '14px',
    color: theme.colors.textDark,
    position: 'relative',
    zIndex: 1,
  },
  pollVoteCount: {
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.primary,
    position: 'relative',
    zIndex: 1,
  },
};

export default CollectionsScreen;
