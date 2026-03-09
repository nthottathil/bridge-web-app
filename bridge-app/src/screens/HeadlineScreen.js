import React from 'react';
import { SplitLayout } from '../components';

function HeadlineScreen({ data, update, onNext, onBack }) {
  const maxLen = 200;

  return (
    <SplitLayout
      currentTab={0}
      leftTitle="A Short Headline"
      rightContent={
        <div>
          <textarea
            value={data.headline || data.statement || ''}
            onChange={e => {
              if (e.target.value.length <= maxLen) {
                update('headline', e.target.value);
                update('statement', e.target.value);
              }
            }}
            placeholder="Write down where you're headed + what you're actively building."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '16px',
              fontSize: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              backgroundColor: 'transparent',
              transition: 'border-color 0.2s',
            }}
          />
          <div style={{
            textAlign: 'right',
            fontSize: '12px',
            color: (data.headline || '').length > maxLen - 20 ? '#c33' : '#888',
            marginTop: '8px',
          }}>
            {(data.headline || data.statement || '').length}/{maxLen}
          </div>
        </div>
      }
    />
  );
}

export default HeadlineScreen;
