import React from 'react';
import { SplitLayout, TextInput } from '../components';

function LocationScreen({ data, update, onNext, onBack }) {
  return (
    <SplitLayout
      currentTab={0}
      leftTitle="Your location"
      subtitle="Where should we find your people?"
      rightContent={
        <div>
          <TextInput
            label="City"
            value={data.location}
            onChange={v => update('location', v)}
            placeholder="e.g., London"
          />
          <TextInput
            label="Country"
            value={data.country || ''}
            onChange={v => update('country', v)}
            placeholder="e.g., United Kingdom"
          />
        </div>
      }
    />
  );
}

export default LocationScreen;
