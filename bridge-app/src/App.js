import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ExplanationScreen from './screens/ExplanationScreen';
import GoalsScreen from './screens/GoalsScreen';
import InterestsScreen from './screens/InterestsScreen';
import PersonalityScreen from './screens/PersonalityScreen';
import PreferencesScreen from './screens/PreferencesScreen';
import StatementScreen from './screens/StatementScreen';
import LocationScreen from './screens/LocationScreen';
import MatchingScreen from './screens/MatchingScreen';
import { authAPI } from './services/api';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    // Sign up details
    firstName: '',
    surname: '',
    email: '',
    age: 0,
    profession: '',

    // Primary goal
    primaryGoal: '',

    // Interests (ranked)
    interests: [],

    // Personality traits
    personality: {
      extroversion: 50,
      openness: 50,
      agreeableness: 50,
      conscientiousness: 50
    },

    // Preferences for matching
    genderPreference: ['Any'],
    agePreference: {
      min: 18,
      max: 99
    },

    // Combined bio and ideal connection statement
    statement: '',

    // Location
    location: '',
    maxDistance: 5
  });

  // Check if user is already logged in on app load
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
      ...profile
    }));
    // Skip to matching screen for returning users
    setCurrentStep(7);
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

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  // If not authenticated, show login or signup
  if (!isAuthenticated) {
    if (showLogin) {
      return (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setShowLogin(false)}
        />
      );
    } else {
      return (
        <SignupScreen
          data={userData}
          update={updateUserData}
          onNext={() => {
            setIsAuthenticated(true);
            nextStep();
          }}
          onSwitchToLogin={() => setShowLogin(true)}
        />
      );
    }
  }

  // Authenticated user screens
  const screens = [
    <ExplanationScreen key="explanation" onNext={nextStep} onBack={prevStep} />,
    <GoalsScreen key="goals" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <InterestsScreen key="interests" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <PersonalityScreen key="personality" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <PreferencesScreen key="preferences" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <StatementScreen key="statement" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <LocationScreen key="location" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <MatchingScreen key="matching" data={userData} onBack={prevStep} onLogout={handleLogout} />,
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {screens[currentStep]}
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
