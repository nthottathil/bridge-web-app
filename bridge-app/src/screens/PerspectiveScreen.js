import React, { useState } from 'react';
import { SplitLayout } from '../components';
import { theme } from '../theme';

const PROMPTS = [
  'What drives you to keep going when things get tough?',
  'What does success look like to you right now?',
  'What\'s the biggest challenge you\'re facing right now?',
  'What skill do you wish you were better at?',
  'How do you handle failure or rejection?',
  'Do you prefer working alone or in a team?',
  'What do you value most in a collaborator?',
  'What\'s one thing you can teach someone right now?',
  'What would you do if you knew you couldn\'t fail?',
  'What\'s one belief that changed how you see the world?',
];

function PerspectiveScreen({ data, update }) {
  const [activePrompt, setActivePrompt] = useState(null);
  const answers = data.perspectiveAnswers || {};
  const answeredCount = Object.values(answers).filter(v => v.trim()).length;

  const handleAnswerChange = (prompt, value) => {
    const updated = { ...answers };
    if (value.trim()) {
      updated[prompt] = value;
    } else {
      delete updated[prompt];
    }
    update('perspectiveAnswers', updated);
  };

  const handlePromptClick = (prompt) => {
    setActivePrompt(activePrompt === prompt ? null : prompt);
  };

  return (
    <SplitLayout
      currentTab={1}
      leftTitle="Your perspective"
      subtitle="Pick prompts and write your answers. These show others how you think."
      rightContent={
        <div>
          <div style={{
            fontSize: '13px',
            color: theme.colors.textMedium,
            marginBottom: '16px',
            fontWeight: '500',
          }}>
            {answeredCount} of {PROMPTS.length} answered
            {answeredCount < 2 && (
              <span style={{ color: theme.colors.textLight }}> (min 2)</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PROMPTS.map(prompt => {
              const hasAnswer = answers[prompt]?.trim();
              const isActive = activePrompt === prompt;

              return (
                <div
                  key={prompt}
                  style={{
                    borderRadius: '14px',
                    border: `1.5px solid ${hasAnswer ? theme.colors.primary : '#e0e0e0'}`,
                    backgroundColor: hasAnswer ? 'rgba(45, 79, 92, 0.06)' : 'transparent',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Prompt header */}
                  <button
                    onClick={() => handlePromptClick(prompt)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${hasAnswer ? theme.colors.primary : '#ccc'}`,
                      backgroundColor: hasAnswer ? theme.colors.primary : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px',
                    }}>
                      {hasAnswer && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      )}
                    </span>
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: hasAnswer ? '500' : '400',
                        color: theme.colors.textDark,
                        lineHeight: '1.4',
                      }}>
                        {prompt}
                      </span>
                      {/* Show answer preview when collapsed */}
                      {hasAnswer && !isActive && (
                        <p style={{
                          margin: '6px 0 0',
                          fontSize: '13px',
                          color: theme.colors.textMedium,
                          lineHeight: '1.4',
                          fontStyle: 'italic',
                        }}>
                          "{answers[prompt]}"
                        </p>
                      )}
                    </div>
                    <span style={{
                      fontSize: '16px',
                      color: theme.colors.textLight,
                      transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}>
                      &#9662;
                    </span>
                  </button>

                  {/* Answer textarea (expanded) */}
                  {isActive && (
                    <div style={{ padding: '0 16px 14px' }}>
                      <textarea
                        value={answers[prompt] || ''}
                        onChange={e => handleAnswerChange(prompt, e.target.value)}
                        placeholder="Write your answer..."
                        rows={3}
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '12px',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          border: `1.5px solid ${theme.colors.borderLight}`,
                          borderRadius: '10px',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          backgroundColor: '#fff',
                        }}
                        onFocus={e => e.target.style.borderColor = theme.colors.primary}
                        onBlur={e => e.target.style.borderColor = theme.colors.borderLight}
                      />
                      {answers[prompt]?.trim() && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnswerChange(prompt, '');
                          }}
                          style={{
                            marginTop: '6px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            color: theme.colors.error,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Clear answer
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      }
    />
  );
}

export default PerspectiveScreen;
