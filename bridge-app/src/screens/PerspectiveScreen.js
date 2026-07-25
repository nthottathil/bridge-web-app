import React, { useEffect, useState } from 'react';
import { SplitLayout } from '../components';
import { theme } from '../theme';

const CATEGORIES = [
  {
    name: 'Ambition',
    tagline: 'What are you actually about?',
    questions: [
      'What are you obsessed with right now?',
      'What\'s a bet you\'re making on yourself?',
      'What would you regret not trying?',
    ],
  },
  {
    name: 'Perspective',
    tagline: 'How do you actually think?',
    questions: [
      'What\'s a popular opinion you genuinely disagree with?',
      'What\'s something you changed your mind on?',
      'What belief do you hold that most people around you don\'t?',
    ],
  },
  {
    name: 'Character',
    tagline: 'What makes you, you?',
    questions: [
      'What are you terrible at but love anyway?',
      'What do your closest friends always come to you for?',
      'What\'s your most chaotic quality?',
      'What\'s something you\'d only tell a stranger?',
    ],
  },
];

const VALID_QUESTIONS = new Set(CATEGORIES.flatMap(c => c.questions));

function PerspectiveScreen({ data, update, onHideNav }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].name);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const answers = data.perspectiveAnswers || {};
  const activeCategoryData = CATEGORIES.find(c => c.name === activeCategory) || CATEGORIES[0];

  // Drop answers to questions that are no longer in the current set, so
  // retired prompts don't linger on the profile.
  useEffect(() => {
    const kept = Object.fromEntries(
      Object.entries(answers).filter(([q]) => VALID_QUESTIONS.has(q))
    );
    if (Object.keys(kept).length !== Object.keys(answers).length) {
      update('perspectiveAnswers', kept);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if a category has any answered questions
  const categoryHasAnswer = (cat) => {
    return cat.questions.some(q => answers[q]?.trim());
  };

  // Handle selecting a question to answer
  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setCurrentAnswer(answers[question] || '');
    if (onHideNav) onHideNav(true);
  };

  // Handle saving the answer
  const handleSaveAnswer = () => {
    if (currentAnswer.trim()) {
      const updated = { ...answers, [selectedQuestion]: currentAnswer.trim() };
      update('perspectiveAnswers', updated);
    }
    setSelectedQuestion(null);
    setCurrentAnswer('');
    if (onHideNav) onHideNav(false);
  };

  // Handle "Pick another"
  const handlePickAnother = () => {
    if (currentAnswer.trim()) {
      const updated = { ...answers, [selectedQuestion]: currentAnswer.trim() };
      update('perspectiveAnswers', updated);
    }
    setSelectedQuestion(null);
    setCurrentAnswer('');
    if (onHideNav) onHideNav(false);
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
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.name;
              const hasAnswer = categoryHasAnswer(cat);
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
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
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Category tagline + instruction */}
          <p style={{
            fontSize: '15px',
            fontWeight: '600',
            color: theme.colors.textDark,
            marginBottom: '4px',
          }}>
            {activeCategoryData.tagline}
          </p>
          <p style={{
            fontSize: '13px',
            color: theme.colors.textLight,
            marginBottom: '20px',
          }}>
            Select to answer
          </p>

          {/* Question list */}
          <div>
            {activeCategoryData.questions.map((question, i) => {
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
                    borderBottom: i < activeCategoryData.questions.length - 1
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
