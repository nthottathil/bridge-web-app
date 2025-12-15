import React, { useState, useEffect } from 'react';
import BridgeLogo from './BridgeLogo';

function SplitLayout({ leftContent, rightContent, leftTitle, progress }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: '100vh'
    }}>
      {/* Left Panel */}
      <div style={{
        flex: isMobile ? 'none' : '0 0 38%',
        backgroundColor: '#1a5f5a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isMobile ? '28px 24px' : '48px 40px',
        minHeight: isMobile ? 'auto' : '100vh',
        position: 'relative'
      }}>
        <div style={{
          flex: isMobile ? 'none' : 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isMobile ? 'flex-start' : 'center'
        }}>
          <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
            <BridgeLogo />
          </div>
          <h1 style={{
            fontSize: isMobile ? '22px' : '30px',
            fontWeight: '500',
            lineHeight: '1.35',
            fontStyle: 'italic',
            maxWidth: '300px',
            letterSpacing: '-0.3px'
          }}>{leftTitle}</h1>
          {leftContent}
        </div>
        {progress !== undefined && (
          <div style={{ marginTop: isMobile ? '20px' : 'auto', paddingTop: '16px' }}>
            <div style={{
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                backgroundColor: '#fff',
                width: `${progress}%`,
                transition: 'width 0.4s ease',
                borderRadius: '2px'
              }} />
            </div>
            <div style={{
              fontSize: '12px',
              opacity: 0.7,
              marginTop: '8px',
              textAlign: 'right'
            }}>{Math.round(progress)}% complete</div>
          </div>
        )}
      </div>
      
      {/* Right Panel */}
      <div style={{
        flex: 1,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: isMobile ? '28px 24px 40px' : '48px 40px',
        overflowY: 'auto',
        minHeight: isMobile ? 'auto' : '100vh'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          animation: 'fadeIn 0.4s ease'
        }}>
          {rightContent}
        </div>
      </div>
    </div>
  );
}

export default SplitLayout;
