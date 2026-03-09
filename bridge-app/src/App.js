import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import IntroducingScreen from './screens/IntroducingScreen';
import LocationScreen from './screens/LocationScreen';
import FocusScreen from './screens/FocusScreen';
import HeadlineScreen from './screens/HeadlineScreen';
import GoalsPrimaryScreen from './screens/GoalsPrimaryScreen';
import PerspectiveScreen from './screens/PerspectiveScreen';
import InterestsScreen from './screens/InterestsScreen';
import CommitmentScreen from './screens/CommitmentScreen';
import DealBreakersScreen from './screens/DealBreakersScreen';
import MatchingScreen from './screens/MatchingScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import { FloatingNav, NavButton, BottomNav } from './components';
import { authAPI, groupsAPI } from './services/api';

/*
  Onboarding flow (9 steps across 4 tabs):
  ─────────────────────────────────────────
  Tab 0 – Identity:    0 Introducing  │ 1 Location  │ 2 Focus  │ 3 Headline
  Tab 1 – Direction:   4 Goals        │ 5 Perspective
  Tab 2 – Vibe:        6 Interests
  Tab 3 – Commitment:  7 Commitment   │ 8 DealBreakers
*/

const TOTAL_STEPS = 9;

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [postView, setPostView] = useState('matching'); // 'matching' | 'home' | 'chat'
  const [groupData, setGroupData] = useState(null);
  const [userData, setUserData] = useState({
    firstName: '',
    surname: '',
    email: '',
    age: 0,
    profession: '',
    gender: '',
    ageCollabOnly: false,
    genderCollabOnly: false,

    location: '',
    country: '',
    maxDistance: 5,

    focus: '',
    headline: '',
    statement: '',

    primaryGoal: '',

    perspectiveAnswers: {},

    interests: [],

    commitmentLevel: '',
    dealBreakers: [],

    // Legacy fields kept for backend compatibility
    personality: {
      extroversion: 50,
      openness: 50,
      agreeableness: 50,
      conscientiousness: 50,
    },
    genderPreference: ['Any'],
    agePreference: { min: 18, max: 99 },
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (authAPI.isAuthenticated()) {
        try {
          const profile = await authAPI.getProfile();
          handleLoginSuccess(profile);
        } catch (err) {
          console.error('Failed to load profile:', err);
          authAPI.logout();
        }
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (profile) => {
    setIsAuthenticated(true);
    setUserData(prev => ({
      ...prev,
      firstName: profile.first_name || prev.firstName,
      surname: profile.surname || prev.surname,
      email: profile.email || prev.email,
      age: profile.age || prev.age,
      profession: profile.profession || prev.profession,
      gender: profile.gender || prev.gender,
      primaryGoal: profile.primary_goal || prev.primaryGoal,
      interests: profile.interests || prev.interests,
      personality: profile.personality || prev.personality,
      genderPreference: profile.gender_preference || prev.genderPreference,
      agePreference: profile.age_preference || prev.agePreference,
      statement: profile.statement || prev.statement,
      location: profile.location || prev.location,
      maxDistance: profile.max_distance || prev.maxDistance,
      focus: profile.focus || prev.focus,
      headline: profile.headline || prev.headline,
      commitmentLevel: profile.commitment_level || prev.commitmentLevel,
      dealBreakers: profile.deal_breakers || prev.dealBreakers,
      perspectiveAnswers: profile.perspective_answers || prev.perspectiveAnswers,
      ageCollabOnly: profile.age_collab_only || prev.ageCollabOnly,
      genderCollabOnly: profile.gender_collab_only || prev.genderCollabOnly,
      country: profile.country || prev.country,
    }));
    setCurrentStep(TOTAL_STEPS); // Go to matching
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setShowLogin(true);
    setCurrentStep(0);
  };

  const updateUserData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const saveOnboardingData = async () => {
    try {
      await authAPI.updateProfile({
        first_name: userData.firstName,
        surname: userData.surname,
        age: userData.age,
        profession: userData.profession,
        gender: userData.gender || '',
        primary_goal: userData.primaryGoal || 'networking',
        interests: userData.interests || [],
        personality: {
          extroversion: Math.round(userData.personality.extroversion / 10),
          openness: Math.round(userData.personality.openness / 10),
          agreeableness: Math.round(userData.personality.agreeableness / 10),
          conscientiousness: Math.round(userData.personality.conscientiousness / 10),
        },
        gender_preference: userData.genderPreference || ['any'],
        age_preference: userData.agePreference || { min: 18, max: 99 },
        statement: userData.headline || userData.statement || '',
        location: userData.location || 'London',
        max_distance: userData.maxDistance || 5,
        focus: userData.focus || '',
        headline: userData.headline || '',
        commitment_level: userData.commitmentLevel || '',
        deal_breakers: userData.dealBreakers || [],
        perspective_answers: userData.perspectiveAnswers || {},
        age_collab_only: userData.ageCollabOnly || false,
        gender_collab_only: userData.genderCollabOnly || false,
        country: userData.country || '',
      });
      console.log('Onboarding data saved successfully');
    } catch (err) {
      console.error('Failed to save onboarding data:', err);
    }
  };

  // Check for group on post-onboarding load
  useEffect(() => {
    if (currentStep >= TOTAL_STEPS && isAuthenticated) {
      groupsAPI.getMyGroup()
        .then(data => { if (data) { setGroupData(data); setPostView('home'); } })
        .catch(() => {});
    }
  }, [currentStep, isAuthenticated]);

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  // Validation per step
  const canProceed = () => {
    switch (currentStep) {
      case 0: return userData.firstName && userData.surname && userData.profession && userData.age >= 18;
      case 1: return !!userData.location;
      case 2: return !!userData.focus;
      case 3: return !!(userData.headline || userData.statement);
      case 4: return !!userData.primaryGoal;
      case 5: return true;
      case 6: return userData.interests.length >= 3;
      case 7: return !!userData.commitmentLevel;
      case 8: return true;
      default: return true;
    }
  };

  // Auth screens
  if (!isAuthenticated) {
    if (showLogin) {
      return (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setShowLogin(false)}
        />
      );
    }
    return (
      <SignupScreen
        data={userData}
        update={updateUserData}
        onNext={() => {
          setIsAuthenticated(true);
          setCurrentStep(0);
        }}
        onSwitchToLogin={() => setShowLogin(true)}
      />
    );
  }

  // Profile overlay
  if (showProfile) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <ProfileScreen
          onBack={() => setShowProfile(false)}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // Post-onboarding views
  if (currentStep >= TOTAL_STEPS) {
    // Home view (shown when user has a group)
    if (postView === 'home' && groupData) {
      return (
        <div style={{ minHeight: '100vh' }}>
          <HomeScreen
            userData={userData}
            groupData={groupData}
            onProfile={() => setShowProfile(true)}
            onChat={() => setPostView('chat')}
          />
          <BottomNav activeTab="home" onTabChange={(tab) => setPostView(tab === 'chat' ? 'chat' : 'home')} />
        </div>
      );
    }

    // Chat view (MatchingScreen handles both matching and chat internally)
    return (
      <div style={{ minHeight: '100vh' }}>
        <MatchingScreen
          data={userData}
          onBack={() => setCurrentStep(TOTAL_STEPS - 1)}
          onLogout={handleLogout}
          onProfile={() => setShowProfile(true)}
        />
        {groupData && (
          <BottomNav activeTab="chat" onTabChange={(tab) => setPostView(tab === 'home' ? 'home' : 'chat')} />
        )}
      </div>
    );
  }

  // Onboarding screens (steps 0-8)
  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const handleNext = isLastStep
    ? () => { saveOnboardingData(); nextStep(); }
    : nextStep;

  const onboardingScreens = [
    <IntroducingScreen key="intro" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <LocationScreen key="location" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <FocusScreen key="focus" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <HeadlineScreen key="headline" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <GoalsPrimaryScreen key="goals" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <PerspectiveScreen key="perspective" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <InterestsScreen key="interests" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <CommitmentScreen key="commitment" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <DealBreakersScreen key="dealbreakers" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {onboardingScreens[currentStep]}
      <FloatingNav>
        {currentStep > 0 && (
          <NavButton onClick={prevStep} direction="back" />
        )}
        <NavButton
          onClick={handleNext}
          disabled={!canProceed()}
          label={isLastStep ? 'Find my group →' : undefined}
        />
      </FloatingNav>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
