import React, { useState } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import ProfessionScreen from './screens/ProfessionScreen';
import GoalsScreen from './screens/GoalsScreen';
import GenderScreen from './screens/GenderScreen';
import NationalityScreen from './screens/NationalityScreen';
import EthnicityScreen from './screens/EthnicityScreen';
import EmailScreen from './screens/EmailScreen';
import PersonalityScreen1 from './screens/PersonalityScreen1';
import PersonalityScreen2 from './screens/PersonalityScreen2';
import PersonalityScreen3 from './screens/PersonalityScreen3';
import PersonalityScreen4 from './screens/PersonalityScreen4';
import InterestsScreen from './screens/InterestsScreen';
import ConnectionGoalScreen from './screens/ConnectionGoalScreen';
import SkillsScreen from './screens/SkillsScreen';
import BioScreen from './screens/BioScreen';
import LocationScreen from './screens/LocationScreen';
import MatchingScreen from './screens/MatchingScreen';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    preferredName: '',
    hasPreferredName: false,
    profession: '',
    professionCategory: '',
    goals: [],
    gender: '',
    genderCategory: '',
    nationality: '',
    nationalityCategory: '',
    ethnicity: '',
    ethnicityCategory: '',
    email: '',
    personality: {
      extroversion: 50,
      openness: 50,
      agreeableness: 50,
      conscientiousness: 50
    },
    interests: [],
    interestRankings: {},
    connectionGoal: '',
    skills: [],
    bio: '',
    location: '',
    maxDistance: 25
  });

  const updateUserData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const screens = [
    <WelcomeScreen key="welcome" data={userData} update={updateUserData} onNext={nextStep} />,
    <ProfessionScreen key="profession" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <GoalsScreen key="goals" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <GenderScreen key="gender" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <NationalityScreen key="nationality" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <EthnicityScreen key="ethnicity" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <EmailScreen key="email" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <PersonalityScreen1 key="p1" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <PersonalityScreen2 key="p2" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <PersonalityScreen3 key="p3" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <PersonalityScreen4 key="p4" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <InterestsScreen key="interests" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <ConnectionGoalScreen key="connection" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <SkillsScreen key="skills" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
    <BioScreen key="bio" data={userData} update={updateUserData} onNext={nextStep} onBack={prevStep} />,
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
