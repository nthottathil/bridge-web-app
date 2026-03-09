import React from 'react';
import { SplitLayout, SelectionChip } from '../components';

const DEAL_BREAKERS = [
  'No negativity',
  'No flakiness',
  'No ghosting',
  'No political talk',
  'No romantic intent',
];

function DealBreakersScreen({ data, update, onNext, onBack }) {
  const selected = data.dealBreakers || [];

  const toggle = (item) => {
    if (selected.includes(item)) {
      update('dealBreakers', selected.filter(d => d !== item));
    } else {
      update('dealBreakers', [...selected, item]);
    }
  };

  return (
    <SplitLayout
      currentTab={3}
      leftTitle="Deal breakers"
      subtitle="Select anything that's a hard no for you. We'll factor this into your matches."
      rightContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {DEAL_BREAKERS.map(item => (
            <SelectionChip
              key={item}
              label={item}
              selected={selected.includes(item)}
              onClick={() => toggle(item)}
            />
          ))}
        </div>
      }
    />
  );
}

export default DealBreakersScreen;
