import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import TermsScreen from './screens/TermsScreen';
import MockVerificationScreen from './screens/MockVerificationScreen';
import IntroducingScreen from './screens/IntroducingScreen';
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
import ChatScreen from './screens/ChatScreen';
import GroupInfoScreen from './screens/GroupInfoScreen';
import SettingsScreen from './screens/SettingsScreen';
import CollectionsScreen from './screens/CollectionsScreen';
import CalendarScreen from './screens/CalendarScreen';
import { FloatingNav, NavButton, BottomNav } from './components';
import { authAPI, groupsAPI } from './services/api';

/*
  Onboarding flow (9 steps):
  0 Terms (Bridge Code)
  Tab 0 - Identity:    1 Introducing (incl location) | 2 Focus | 3 Headline
  Tab 1 - Direction:   4 Goals       | 5 Perspective
  Tab 2 - Vibe:        6 Interests
  Tab 3 - Commitment:  7 Commitment  | 8 DealBreakers
*/

const TOTAL_STEPS = 9;

const EMPTY_USER_DATA = {
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
  profilePhoto: '',
  primaryGoal: '',
  perspectiveAnswers: {},
  interests: [],
  commitmentLevel: '',
  dealBreakers: [],
  personality: {
    extroversion: 50,
    openness: 50,
    agreeableness: 50,
    conscientiousness: 50,
  },
  genderPreference: ['Any'],
  agePreference: { min: 18, max: 99 },
  termsAccepted: false,
};

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  // postView: 'matching' | 'home' | 'chat' | 'groupInfo' | 'settings' | 'collections' | 'calendar'
  const [postView, setPostView] = useState('matching');
  const [hideFloatingNav, setHideFloatingNav] = useState(false);
  const [groupData, setGroupData] = useState(null);
  const [userData, setUserData] = useState(EMPTY_USER_DATA);
  const [replayMode, setReplayMode] = useState(false);

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
      id: profile.id || prev.id,
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
      profilePhoto: profile.profile_photo_url || prev.profilePhoto,
    }));
    // If profile is incomplete (reset or new), restart onboarding; otherwise skip to app
    const hasProfile = profile.first_name && profile.primary_goal && profile.interests?.length > 0;
    setCurrentStep(hasProfile ? TOTAL_STEPS : 0);
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setShowLogin(true);
    setCurrentStep(0);
    setGroupData(null);
    setPostView('matching');
  };

  const handleLeaveGroup = async () => {
    if (!groupData) return;
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    try {
      await groupsAPI.leaveGroup(groupData.group_id);
      setGroupData(null);
      setPostView('matching');
    } catch (err) {
      console.error('Error leaving group:', err);
    }
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
        profile_photo_url: userData.profilePhoto || '',
      });
    } catch (err) {
      console.error('Failed to save onboarding data:', err);
    }
  };

  // Check for group when authenticated and onboarding is done
  useEffect(() => {
    if (isAuthenticated && currentStep >= TOTAL_STEPS + (replayMode ? 1 : 0)) {
      groupsAPI.getMyGroup()
        .then(data => {
          if (data) {
            setGroupData(data);
            setPostView('home');
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, currentStep, replayMode]);

  const refreshGroupData = async () => {
    try {
      const data = await groupsAPI.getMyGroup();
      if (data) setGroupData(data);
    } catch (err) { /* ignore */ }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const canProceed = () => {
    // In replay mode, step 0 is the mock verification screen (always passable)
    const offset = replayMode ? 1 : 0;
    const step = currentStep - offset;
    switch (step) {
      case -1: return true; // mock verification (replay only)
      case 0: return !!userData.termsAccepted;
      case 1: return userData.firstName && userData.surname && userData.profession && userData.age >= 18 && !!userData.location;
      case 2: return !!userData.focus;
      case 3: return !!userData.primaryGoal;
      case 4: return !!(userData.headline || userData.statement);
      case 5: return true;
      case 6: return userData.interests.length >= 3;
      case 7: return !!userData.commitmentLevel;
      case 8: return true;
      default: return true;
    }
  };

  // Bottom nav handler
  const handleTabChange = (tab) => {
    if (tab === 'home') setPostView('home');
    else if (tab === 'chat') setPostView('chat');
    else if (tab === 'collections') setPostView('collections');
  };

  // Auth screens
  if (!isAuthenticated) {
    if (showLogin) {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setShowLogin(false)} />;
    }
    return (
      <SignupScreen
        data={userData}
        update={updateUserData}
        onNext={() => { setIsAuthenticated(true); setCurrentStep(0); }}
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
          onReplayOnboarding={async () => {
            setShowProfile(false);
            setReplayMode(true);
            try {
              const profile = await authAPI.getProfile();
              setUserData(prev => ({
                ...prev,
                id: profile.id || prev.id,
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
                country: profile.country || prev.country,
                profilePhoto: profile.profile_photo_url || prev.profilePhoto,
                termsAccepted: false,
              }));
            } catch (err) {
              console.error('Failed to refresh profile for replay:', err);
            }
            setCurrentStep(0);
          }}
        />
      </div>
    );
  }

  // Post-onboarding views
  if (currentStep >= TOTAL_STEPS + (replayMode ? 1 : 0)) {
    // Calendar view
    if (postView === 'calendar' && groupData) {
      return (
        <div style={{ minHeight: '100vh' }}>
          <CalendarScreen groupData={groupData} onBack={() => setPostView('home')} />
        </div>
      );
    }

    // Settings view
    if (postView === 'settings' && groupData) {
      return (
        <div style={{ minHeight: '100vh' }}>
          <SettingsScreen groupData={groupData} onBack={() => setPostView('groupInfo')} onLeaveGroup={handleLeaveGroup} />
        </div>
      );
    }

    // Group info view
    if (postView === 'groupInfo' && groupData) {
      return (
        <div style={{ minHeight: '100vh' }}>
          <GroupInfoScreen
            groupData={groupData}
            setGroupData={setGroupData}
            userData={userData}
            onBack={() => setPostView('chat')}
            onChat={() => setPostView('chat')}
            onSettings={() => setPostView('settings')}
            onCollections={() => setPostView('collections')}
          />
        </div>
      );
    }

    // Collections view
    if (postView === 'collections' && groupData) {
      return (
        <div style={{ minHeight: '100vh' }}>
          <CollectionsScreen groupData={groupData} onBack={() => setPostView('home')} />
          <BottomNav activeTab="collections" onTabChange={handleTabChange} />
        </div>
      );
    }

    // Chat view (when in group)
    if (postView === 'chat' && groupData) {
      return (
        <div style={{ minHeight: '100vh' }}>
          <ChatScreen
            groupData={groupData}
            userData={userData}
            onProfile={() => setShowProfile(true)}
            onBack={() => setPostView('home')}
            onGroupInfo={() => setPostView('groupInfo')}
          />
        </div>
      );
    }

    // Home view (shown when user has a group)
    if (postView === 'home' && groupData) {
      return (
        <div style={{ minHeight: '100vh' }}>
          <HomeScreen
            userData={userData}
            groupData={groupData}
            setGroupData={setGroupData}
            onProfile={() => setShowProfile(true)}
            onChat={() => setPostView('chat')}
            onCalendar={() => setPostView('calendar')}
            onGroupInfo={() => setPostView('groupInfo')}
          />
          <BottomNav activeTab="home" onTabChange={handleTabChange} />
        </div>
      );
    }

    // Matching view (no group yet) - MatchingScreen handles matching + group creation internally
    return (
      <div style={{ minHeight: '100vh' }}>
        <MatchingScreen
          data={userData}
          onBack={() => setCurrentStep(TOTAL_STEPS - 1)}
          onLogout={handleLogout}
          onProfile={() => setShowProfile(true)}
          onGroupFormed={() => refreshGroupData().then(() => setPostView('home'))}
        />
      </div>
    );
  }

  // Onboarding screens
  const effectiveTotal = TOTAL_STEPS + (replayMode ? 1 : 0);
  const isLastStep = currentStep === effectiveTotal - 1;
  const handleNext = isLastStep
    ? () => { saveOnboardingData(); setReplayMode(false); nextStep(); }
    : nextStep;

  const onboardingScreens = [
    ...(replayMode ? [<MockVerificationScreen key="verify" />] : []),
    <TermsScreen key="terms" data={userData} update={updateUserData} />,
    <IntroducingScreen key="intro" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <FocusScreen key="focus" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <GoalsPrimaryScreen key="goals" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <HeadlineScreen key="headline" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <PerspectiveScreen key="perspective" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} onHideNav={setHideFloatingNav} />,
    <InterestsScreen key="interests" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <CommitmentScreen key="commitment" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
    <DealBreakersScreen key="dealbreakers" data={userData} update={updateUserData} onNext={handleNext} onBack={prevStep} />,
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {onboardingScreens[currentStep]}
      {!hideFloatingNav && (
        <FloatingNav>
          {currentStep > 0 && (
            <NavButton onClick={prevStep} direction="back" />
          )}
          <NavButton
            onClick={handleNext}
            disabled={!canProceed()}
            label={isLastStep ? 'Find my group \u2192' : undefined}
          />
        </FloatingNav>
      )}
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
