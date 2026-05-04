import React, { useState } from 'react';
import { SplitLayout } from '../components';
import { theme } from '../theme';

const BULLETS = [
  { label: '18+ Only:', text: 'Bridge is a professional space for adults. By entering, you confirm you are 18 or older.' },
  { label: 'Zero Tolerance:', text: 'We have no room for hate speech, scams, harassment, or sexual content.' },
  { label: 'Privacy First:', text: 'Bridge is fully GDPR compliant under UK data privacy Laws.' },
  { label: 'High Intent:', text: 'Accountability is our currency. If you join a Circle, show up for your peers.' },
];

const FULL_TERMS = `Bridge Terms of Service
Effective Date: 19 April 2026

1. The Bridge Ethos
Bridge is designed for action, not engagement. By using this platform, you commit to moving from "Who do you know?" to "What are you building?" Our infrastructure is built on mutual accountability, and your participation should reflect that intent.

2. Eligibility & Age Requirement
To maintain a professional and accountable environment:
• Age: You must be at least 18 years of age to create an account. By using Bridge, you represent and warrant that you meet this requirement.
• Verification: Bridge reserves the right to request proof of age or identity to maintain the integrity of our Intentional Circles.

3. Intentional Circles & Community Conduct
Bridge matches you into curated groups of four based on shared goals. To ensure a safe and productive environment, you agree to:
• High-Intent Participation: Engage meaningfully with your circle. "Ghosting" or persistent inactivity may result in removal from a circle or the platform.
• Prohibited Content: You will not share content that is illegal, defamatory, promotes hate speech, or is sexually explicit. We have a zero-tolerance policy for any material that compromises the professional integrity of the platform.
• Safety & Harassment: Bridge has a zero-tolerance policy for harassment, bullying, harmful, or predatory behaviour. Because our groups are small and intimate, the impact of such behaviour is magnified.
• Scamming & Fraud: You will not use Bridge to solicit money, promote fraudulent schemes, or engage in deceptive practices. Any attempt to exploit members for financial gain will result in an immediate, permanent ban.
• Cooperation with Authorities (The Prosecution Clause): Bridge reserves the right to report any activities that we reasonably believe to be illegal to the relevant law enforcement authorities. This includes, but is not limited to, instances of fraud, credible threats of violence, or the distribution of prohibited content. We will cooperate fully with legal investigations under UK Jurisdiction.

4. Intellectual Property & Confidentiality
• Your Content: You retain ownership of the goals and ideas you post. However, you grant Bridge a license to host and display this content within your assigned circles.
• Circle Confidentiality: To foster true collaboration, you agree to respect the privacy of your circle members. Do not share a peer's proprietary ideas or personal information outside the circle without explicit consent. While we encourage circle confidentiality, Bridge is not responsible or liable for any misappropriation or theft of ideas, intellectual property, or proprietary information shared between users.

5. Data Privacy & Insights
• GDPR Compliance: Bridge conforms to all UK GDPR laws. Your identity is your own.
• Anonymized Trends: We may analyse and share aggregated, high-level trends (e.g., "70% of Bridge users are currently focused on AI startups") to improve our infrastructure and provide value to the ecosystem.
• No Individual Sale: We will never sell your personal contact details, specific goals, or private Circle conversations to third parties.

6. Algorithmic Matching
Bridge uses specific, time-bound data to match you into groups. While we strive for the highest quality of "Intentional Circles," we do not guarantee specific outcomes, partnerships, or the professional success of any given match.

7. Account Termination
We reserve the right to suspend or terminate accounts that:
• Violate the safety guidelines.
• Fall below a specific "Accountability Score" (if applicable).
• Provide false information regarding their identity or goals.
We reserve the right to suspend or terminate accounts at our sole discretion, with or without notice, for any behavior we deem contrary to the Bridge Ethos.

8. Limitation of Liability
• The Infrastructure Only: Bridge provides the digital infrastructure for connection. We are not responsible for the personal, professional, or financial conduct of users, whether online or offline. Bridge is not a financial or professional advisory service. Any information shared within Circles is for informational purposes only. Use of such information is at your own risk.
• No Guarantees: We do not guarantee the accuracy of information shared by users, the success of any ventures initiated within a Circle, or the achievement of any specific goals.
• User Responsibility: You are solely responsible for your interactions. Bridge is not liable for any loss, damage, or dispute arising from connections made on the platform.

9. Governing Law
These terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.

User Acknowledgment
By clicking "I Accept," you confirm you are over 18, agree to the terms above, and commit to being an active, high-intent member of the Bridge community.`;

function TermsScreen({ data, update }) {
  const [showFullTerms, setShowFullTerms] = useState(false);
  const accepted = !!data.termsAccepted;

  return (
    <>
      <SplitLayout
        leftTitle="The Bridge Code"
        rightContent={
          <div>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <p style={{ fontSize: '14px', color: theme.colors.textDark, lineHeight: '1.5', margin: '0 0 14px' }}>
                Before you join your first Circle, we have a few non-negotiables to keep our infrastructure high-signal and high-impact:
              </p>
              <ul style={{ margin: '0 0 14px', paddingLeft: '18px' }}>
                {BULLETS.map(b => (
                  <li key={b.label} style={{ fontSize: '13px', color: theme.colors.textDark, lineHeight: '1.5', marginBottom: '8px' }}>
                    <strong>{b.label}</strong> {b.text}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '14px', color: theme.colors.textDark, lineHeight: '1.5', margin: 0, fontWeight: '500' }}>
                Believe in your goals. We'll build the bridge.
              </p>
            </div>

            <button
              onClick={() => setShowFullTerms(true)}
              style={{
                background: 'none', border: 'none', padding: '8px 0',
                color: theme.colors.textDark, fontSize: '13px',
                cursor: 'pointer', textDecoration: 'underline',
                marginBottom: '16px', display: 'block',
              }}
            >
              Click here to read Terms &amp; Conditions before accept.
            </button>

            <label style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              cursor: 'pointer', padding: '8px 0',
            }}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={e => update('termsAccepted', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: theme.colors.primary, cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: theme.colors.textDark }}>I accept</span>
            </label>
          </div>
        }
      />

      {showFullTerms && (
        <div
          onClick={() => setShowFullTerms(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#fff', borderRadius: '14px',
              maxWidth: '600px', width: '100%',
              maxHeight: '80vh', display: 'flex', flexDirection: 'column',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowFullTerms(false)}
              aria-label="Close"
              style={{
                position: 'absolute', top: '12px', right: '12px',
                background: 'none', border: 'none', fontSize: '22px',
                cursor: 'pointer', color: theme.colors.textMedium,
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ×
            </button>
            <div style={{
              padding: '24px 24px 20px', overflowY: 'auto',
            }}>
              <pre style={{
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                fontFamily: 'inherit', fontSize: '13px',
                color: theme.colors.textDark, lineHeight: '1.55',
                margin: 0,
              }}>{FULL_TERMS}</pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TermsScreen;
