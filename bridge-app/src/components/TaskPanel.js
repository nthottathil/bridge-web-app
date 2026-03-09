import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import { tasksAPI } from '../services/api';

function TaskPanel({ groupId, currentUserId }) {
  const [tasks, setTasks] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const loadTasks = async () => {
    try {
      const data = await tasksAPI.getTasks(groupId);
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  const handleComplete = async (taskId) => {
    setLoading(true);
    try {
      await tasksAPI.completeTask(taskId);
      await loadTasks();
    } catch (err) {
      console.error('Error completing task:', err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = tasks.filter(t =>
    t.completed_by.some(c => c.user_id === currentUserId)
  ).length;

  return (
    <div style={{
      backgroundColor: theme.colors.surfaceWhite,
      borderRadius: '16px',
      margin: '0 16px 12px',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      {/* Header toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
        }}
      >
        <div>
          <span style={{ fontSize: '15px', fontWeight: '600', color: theme.colors.textDark }}>
            Let's Get to Know Each Other
          </span>
          <span style={{
            fontSize: '12px', color: theme.colors.textMedium, marginLeft: '8px',
          }}>
            {completedCount}/{tasks.length} done
          </span>
        </div>
        <span style={{
          fontSize: '18px', color: theme.colors.textMedium,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
        }}>
          &#9660;
        </span>
      </button>

      {/* Task list */}
      {expanded && (
        <div style={{ padding: '0 18px 14px' }}>
          {tasks.map(task => {
            const isCompletedByMe = task.completed_by.some(c => c.user_id === currentUserId);
            return (
              <div key={task.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 0',
                borderTop: '1px solid #f0f0f0',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '14px',
                    color: isCompletedByMe ? theme.colors.textLight : theme.colors.textDark,
                    textDecoration: isCompletedByMe ? 'line-through' : 'none',
                    margin: 0,
                  }}>
                    {task.title}
                  </p>
                  {task.completed_by.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {task.completed_by.map(c => (
                        <span key={c.user_id} style={{
                          width: '20px', height: '20px', borderRadius: '50%',
                          backgroundColor: theme.colors.primary, color: '#fff',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: '600',
                        }}>
                          {c.first_name[0]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {!isCompletedByMe && (
                  <button
                    onClick={() => handleComplete(task.id)}
                    disabled={loading}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '14px',
                      border: `1px solid ${theme.colors.primary}`,
                      backgroundColor: 'transparent',
                      color: theme.colors.primary,
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: loading ? 'default' : 'pointer',
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    Done
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TaskPanel;
