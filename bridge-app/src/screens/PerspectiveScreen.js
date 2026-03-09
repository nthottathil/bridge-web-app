import React, { useState } from 'react';
import { SplitLayout } from '../components';

const CATEGORIES = [
  {
    name: 'Motivation',
    questions: [
      'What drives you to keep going when things get tough?',
      'What does success look like to you right now?',
      'What would you do if you knew you couldn\'t fail?',
    ],
  },
  {
    name: 'Struggles',
    questions: [
      'What\'s the biggest challenge you\'re facing right now?',
      'What skill do you wish you were better at?',
      'What\'s one thing you\'d change about your current path?',
    ],
  },
  {
    name: 'Mindset',
    questions: [
      'Do you believe talent matters more than hard work?',
      'How do you handle failure or rejection?',
      'What\'s one belief that changed how you see the world?',
    ],
  },
  {
    name: 'Work Style',
    questions: [
      'Do you prefer working alone or in a team?',
      'Are you more of a planner or a go-with-the-flow person?',
      'How do you stay productive on low-energy days?',
    ],
  },
  {
    name: 'Collaboration',
    questions: [
      'What do you value most in a collaborator?',
      'How do you handle disagreements in a team?',
      'What\'s one thing you can teach someone right now?',
    ],
  },
];

function PerspectiveScreen({ data, update, onNext, onBack }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].name);
  const answers = data.perspectiveAnswers || {};

  const handleSelect = (question) => {
    const catAnswers = answers[activeCategory] || [];
    let updated;
    if (catAnswers.includes(question)) {
      updated = catAnswers.filter(q => q !== question);
    } else {
      updated = [...catAnswers, question];
    }
    update('perspectiveAnswers', {
      ...answers,
      [activeCategory]: updated,
    });
  };

  const currentQuestions = CATEGORIES.find(c => c.name === activeCategory)?.questions || [];
  const catAnswers = answers[activeCategory] || [];

  return (
    <SplitLayout
      currentTab={1}
      leftTitle="Your perspective"
      subtitle="Tap questions that resonate with you in each category. These help us understand how you think."
      rightContent={
        <div>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: activeCategory === cat.name ? '1.5px solid #2D4F5C' : '1.5px solid #ccc',
                  backgroundColor: activeCategory === cat.name ? '#2D4F5C' : 'transparent',
                  color: activeCategory === cat.name ? '#fff' : '#555',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: activeCategory === cat.name ? '600' : '400',
                }}
              >
                {cat.name}
                {(answers[cat.name] || []).length > 0 && (
                  <span style={{
                    marginLeft: '6px',
                    backgroundColor: activeCategory === cat.name ? 'rgba(255,255,255,0.3)' : 'rgba(45,79,92,0.15)',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                  }}>
                    {(answers[cat.name] || []).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQuestions.map(q => {
              const isSelected = catAnswers.includes(q);
              return (
                <button
                  key={q}
                  onClick={() => handleSelect(q)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid #2D4F5C' : '1.5px solid #e0e0e0',
                    backgroundColor: isSelected ? 'rgba(45, 79, 92, 0.08)' : 'transparent',
                    color: '#1a1a1a',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    lineHeight: '1.4',
                    fontWeight: isSelected ? '500' : '400',
                  }}
                >
                  {q}
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
