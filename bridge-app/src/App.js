import React, { useState } from 'react';
import SignupScreen from './screens/SignupScreen';
import ExplanationScreen from './screens/ExplanationScreen';
import GoalsScreen from './screens/GoalsScreen';
import InterestsScreen from './screens/InterestsScreen';
import PersonalityScreen from './screens/PersonalityScreen';
import PreferencesScreen from './screens/PreferencesScreen';
import StatementScreen from './screens/StatementScreen';
import LocationScreen from './screens/LocationScreen';
import MatchingScreen from './screens/MatchingScreen';

function App() {
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

  const updateUserData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const screens = [
    <SignupScreen key="signup" data={userData} update={updateUserData} onNext={nextStep} />,
    <ExplanationScreen key="explanation" onNext={nextStep} onBack={prevStep} />,
    <GoalsScreen key="goals" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <InterestsScreen key="interests" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <PersonalityScreen key="personality" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <PreferencesScreen key="preferences" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <StatementScreen key="statement" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <LocationScreen key="location" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <MatchingScreen key="matching" data={userData} onBack={prevStep} />,
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {screens[currentStep]}
    </div>
  );
}

export default App;
