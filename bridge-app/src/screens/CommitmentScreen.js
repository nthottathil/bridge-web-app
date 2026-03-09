import React from 'react';
import { SplitLayout, SelectionChip } from '../components';

const LEVELS = [
  { label: 'Just exploring', desc: 'Curious about what Bridge offers — no pressure.' },
  { label: 'Semi serious', desc: 'Open to connecting but keeping things flexible.' },
  { label: 'Fully committed', desc: 'Ready to invest time and energy into real connections.' },
  { label: 'Haven\'t decided', desc: 'Still figuring out my level of commitment.' },
];

function CommitmentScreen({ data, update, onNext, onBack }) {
  return (
    <SplitLayout
      currentTab={3}
      leftTitle="Your commitment level"
      subtitle="How serious are you about finding your people? Be honest — it helps us match you better."
      rightContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {LEVELS.map(level => (
            <div key={level.label}>
              <SelectionChip
                label={level.label}
                selected={data.commitmentLevel === level.label}
                onClick={() => update('commitmentLevel', level.label)}
              />
              {data.commitmentLevel === level.label && (
                <p style={{
                  fontSize: '13px',
                  color: '#555',
                  marginTop: '8px',
                  marginLeft: '4px',
                  lineHeight: '1.4',
                }}>{level.desc}</p>
              )}
            </div>
          ))}
        </div>
      }
    />
  );
}

export default CommitmentScreen;
