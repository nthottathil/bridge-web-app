/**
 * Canonical goal / interest / perspective options.
 *
 * Onboarding and the profile editor both read from here so the two can't
 * drift apart — a user editing their profile sees exactly the options they
 * were offered during onboarding.
 */

export const GOAL_CATEGORIES = [
  { key: 'build', label: 'Build', subtitle: 'I want to create something', goals: [
    'Launch a startup',
    'Build a side project/app',
    'Grow a brand/audience',
    'Launch a social enterprise',
  ]},
  { key: 'climb', label: 'Climb', subtitle: 'I want to advance my career', goals: [
    'Land my first graduate role',
    'Switch industries',
    'Get promoted/grow in my current role',
    'Build a professional skill set',
  ]},
  { key: 'grow', label: 'Grow', subtitle: 'I want to become a better version of myself', goals: [
    'Settling into a new city',
    'Mental health & emotional wellbeing',
    'Fitness & physical health',
    'Building better habits & self-improvement',
  ]},
  { key: 'passion', label: 'Passion', subtitle: 'I want to find my people', goals: [
    'Meet people with similar interests',
  ]},
];

export const ALL_GOALS = GOAL_CATEGORIES.flatMap(c => c.goals);

export const INTEREST_CATEGORIES = [
  { label: 'Active & Lifestyle', interests: [
    'Sport', 'Outdoor & Adventure', 'Wellbeing', 'Food & Drink', 'Travel', 'Nature & Animals',
  ]},
  { label: 'Knowledge & Ideas', interests: [
    'Technology', 'Business', 'Psychology', 'Science', 'Humanities', 'Law',
    'Politics', 'Social Impact', 'Environment', 'Languages', 'Architecture',
  ]},
  { label: 'Culture & Entertainment', interests: [
    'Music', 'Gaming', 'Media & Pop Culture', 'Film & Video', 'Photography',
    'Art & Design', 'Reading', 'Writing',
  ]},
];

export const ALL_INTERESTS = INTEREST_CATEGORIES.flatMap(c => c.interests);

export const MAX_INTERESTS = 5;

export const PERSPECTIVE_CATEGORIES = [
  {
    name: 'Ambition',
    tagline: 'What are you actually about?',
    blurb: 'What you\'re chasing right now, and what you\'re willing to bet on.',
    questions: [
      'What are you obsessed with right now?',
      'What\'s a bet you\'re making on yourself?',
      'What would you regret not trying?',
    ],
  },
  {
    name: 'Perspective',
    tagline: 'How do you actually think?',
    blurb: 'The opinions and ideas you\'ve arrived at yourself.',
    questions: [
      'What\'s a popular opinion you genuinely disagree with?',
      'What\'s something you changed your mind on?',
      'What belief do you hold that most people around you don\'t?',
    ],
  },
  {
    name: 'Character',
    tagline: 'What makes you, you?',
    blurb: 'The quirks your closest friends would recognise you by.',
    questions: [
      'What are you terrible at but love anyway?',
      'What do your closest friends always come to you for?',
      'What\'s your most chaotic quality?',
      'What\'s something you\'d only tell a stranger?',
    ],
  },
];

export const ALL_PERSPECTIVE_QUESTIONS = PERSPECTIVE_CATEGORIES.flatMap(c => c.questions);
