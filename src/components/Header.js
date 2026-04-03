import React from 'react';

function Header({ onSubmitClick, onRequestVenue }) {
  return (
    <header className="app-header">
      <div className="app-logo">
        Dane County <span>Events</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="header-meta">Madison, WI &bull; Free to use</div>
        <button className="submit-event-btn" onClick={onSubmitClick}>
          + Submit Event
        </button>
        <button className="request-venue-btn" onClick={onRequestVenue}>
          + Request a Venue
        </button>
      </div>
    </header>
  );
}

export default Header;
