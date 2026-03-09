import React from 'react';
import { SplitLayout, SelectionChip } from '../components';

const FOCUS_OPTIONS = [
  { label: 'Portfolio builder', desc: 'Building real-world projects to strengthen my CV and break into the industry.' },
  { label: 'Career transition', desc: 'Shifting from one field to another and learning new skills along the way.' },
  { label: 'Start-up founder', desc: 'Launching my own project or business and looking for like-minded builders.' },
  { label: 'Skills refiner', desc: 'Leveling up specific skills through practice, feedback, and collaboration.' },
  { label: 'Side hustler', desc: 'Working on a side project alongside my main job or studies.' },
  { label: 'Explorer', desc: 'Still figuring things out and open to discovering new paths.' },
];

function FocusScreen({ data, update, onNext, onBack }) {

  return (
    <SplitLayout
      currentTab={0}
      leftTitle="Your current focus"
      rightContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FOCUS_OPTIONS.map(opt => (
            <div key={opt.label}>
              <SelectionChip
                label={opt.label}
                selected={data.focus === opt.label}
                onClick={() => update('focus', opt.label)}
              />
              {data.focus === opt.label && (
                <p style={{
                  fontSize: '13px',
                  color: '#555',
                  marginTop: '8px',
                  marginLeft: '4px',
                  lineHeight: '1.4',
                }}>{opt.desc}</p>
              )}
            </div>
          ))}
        </div>
      }
    />
  );
}

export default FocusScreen;
