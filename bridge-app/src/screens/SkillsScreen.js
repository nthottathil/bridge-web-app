import React from 'react';
import { SplitLayout, SelectionChip, NavButton } from '../components';

function SkillsScreen({ data, update, onNext, onBack }) {
  const skills = [
    'Leadership', 'Public Speaking', 'Design', 'Marketing', 'Sales',
    'Finance', 'Engineering', 'Data Analysis', 'Project Management',
    'Writing', 'Research', 'Teaching', 'Consulting', 'Product Management'
  ];
  
  const toggleSkill = (skill) => {
    const current = [...data.skills];
    const index = current.indexOf(skill);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(skill);
    }
    update('skills', current);
  };
  
  return (
    <SplitLayout
      progress={82}
      leftTitle="What can you bring to the table?"
      rightContent={
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Select your skills</h2>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>What are you good at?</p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px'
          }}>
            {skills.map(skill => (
              <SelectionChip
                key={skill}
                label={skill}
                selected={data.skills.includes(skill)}
                onClick={() => toggleSkill(skill)}
              />
            ))}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '40px'
          }}>
            <NavButton onClick={onBack} direction="back" />
            <NavButton onClick={onNext} disabled={data.skills.length === 0} />
          </div>
        </div>
      }
    />
  );
}

export default SkillsScreen;
