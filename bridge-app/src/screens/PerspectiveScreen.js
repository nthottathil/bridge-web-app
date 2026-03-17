import React, { useState } from 'react';
import { SplitLayout } from '../components';
import { theme } from '../theme';

const CATEGORIES = {
  'Motivation': [
    'Why does this goal matter to you right now?',
    'What changed that made you take this seriously?',
    'What would happen if you don\'t pursue this?',
    'What does success look like in 6 months?',
    'Who are you doing this for \u2014 yourself or others?',
  ],
  'Struggles': [
    'What\'s the biggest challenge you\'re facing right now?',
    'How do you handle failure or rejection?',
    'What skill do you wish you were better at?',
    'What drives you to keep going when things get tough?',
    'What\'s one thing you\'d change about your current situation?',
  ],
  'Mindset': [
    'Do you prefer working alone or in a team?',
    'What do you value most in a collaborator?',
    'What\'s one thing you can teach someone right now?',
    'What would you do if you knew you couldn\'t fail?',
    'What\'s one belief that changed how you see the world?',
  ],
};

const CATEGORY_NAMES = Object.keys(CATEGORIES);

function PerspectiveScreen({ data, update }) {
  const [activeCategory, setActiveCategory] = useState('Motivation');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const answers = data.perspectiveAnswers || {};

  // Check if a category has any answered questions
  const categoryHasAnswer = (cat) => {
    return CATEGORIES[cat].some(q => answers[q]?.trim());
  };

  // Handle selecting a question to answer
  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setCurrentAnswer(answers[question] || '');
  };

  // Handle saving the answer
  const handleSaveAnswer = () => {
    if (currentAnswer.trim()) {
      const updated = { ...answers, [selectedQuestion]: currentAnswer.trim() };
      update('perspectiveAnswers', updated);
    }
    setSelectedQuestion(null);
    setCurrentAnswer('');
  };

  // Handle "Pick another"
  const handlePickAnother = () => {
    if (currentAnswer.trim()) {
      const updated = { ...answers, [selectedQuestion]: currentAnswer.trim() };
      update('perspectiveAnswers', updated);
    }
    setSelectedQuestion(null);
    setCurrentAnswer('');
  };

  // Answer view
  if (selectedQuestion) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <SplitLayout
          currentTab={1}
          leftTitle={selectedQuestion}
          rightContent={
            <div>
              <textarea
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                placeholder="Answer your question in short"
                rows={5}
                autoFocus
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  border: 'none',
                  borderRadius: '12px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  backgroundColor: 'rgba(245, 245, 245, 0.8)',
                  color: theme.colors.textDark,
                }}
              />
            </div>
          }
        />
        {/* Bottom action bar */}
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <button
            onClick={handlePickAnother}
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: `1.5px solid ${theme.colors.textDark}`,
              backgroundColor: theme.colors.surfaceWhite,
              color: theme.colors.textDark,
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Pick another
          </button>
          <button
            onClick={handleSaveAnswer}
            disabled={!currentAnswer.trim()}
            style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: 'none',
              backgroundColor: currentAnswer.trim()
                ? theme.colors.primary : 'rgba(45, 79, 92, 0.3)',
              color: '#fff',
              cursor: currentAnswer.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Question list view
  return (
    <SplitLayout
      currentTab={1}
      leftTitle="Perspective question"
      rightContent={
        <div>
          {/* Category tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}>
            {CATEGORY_NAMES.map(cat => {
              const isActive = activeCategory === cat;
              const hasAnswer = categoryHasAnswer(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: isActive ? 'none' : '1.5px solid #ccc',
                    backgroundColor: isActive ? theme.colors.primary : 'transparent',
                    color: isActive ? '#fff' : theme.colors.textMedium,
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '400',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {hasAnswer && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={isActive ? '#fff' : theme.colors.primary}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  )}
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Instruction */}
          <p style={{
            fontSize: '13px',
            color: theme.colors.textLight,
            marginBottom: '20px',
          }}>
            Select to answer
          </p>

          {/* Question list */}
          <div>
            {CATEGORIES[activeCategory].map((question, i) => {
              const hasAnswer = answers[question]?.trim();
              return (
                <button
                  key={question}
                  onClick={() => handleQuestionSelect(question)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '16px 0',
                    border: 'none',
                    borderBottom: i < CATEGORIES[activeCategory].length - 1
                      ? '1px solid #e8e8e8' : 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: hasAnswer ? theme.colors.primary : theme.colors.textDark,
                    fontWeight: hasAnswer ? '500' : '400',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {question}
                </button>
              );
            })}
          </div>
        </div>
      }
    />
  );
}

export default PerspectiveScreen;
