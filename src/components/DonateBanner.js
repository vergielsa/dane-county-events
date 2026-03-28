import React from 'react';

function DonateBanner({ onDismiss, onDonate }) {
  return (
    <div className="donate-banner">
      <p>
        Dane County Events is community-supported.{' '}
        <strong>Help keep it free</strong> with a small donation.
      </p>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button className="donate-btn" onClick={onDonate}>
          Donate $5 &rarr;
        </button>
        <button
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', color: '#a8d5be', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default DonateBanner;
