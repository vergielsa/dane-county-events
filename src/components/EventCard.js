import React from 'react';

const CATEGORY_CLASS = {
  Music:          'music',
  Art:            'art',
  Social:         'social',
  Trivia:         'trivia',
  Festival:       'festival',
  Comedy:         'comedy',
  Sports:         'sports',
  Ticketmaster:   'ticketmaster',
  'Bars & Dives': 'bars',
  Community:      'community',
};

function formatDate(dateStr) {
  const dt = new Date(dateStr + 'T00:00:00');
  return dt.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function EventCard({ event }) {
  const cc = CATEGORY_CLASS[event.category] || 'art';

  function handleClick() {
    if (event.url) {
      window.open(event.url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div
      className={`event-card${event.url ? ' event-card-linked' : ''}`}
      onClick={handleClick}
      role={event.url ? 'link' : undefined}
      tabIndex={event.url ? 0 : undefined}
      onKeyDown={event.url ? (e) => { if (e.key === 'Enter') handleClick(); } : undefined}
    >
      <div className={`event-card-accent acc-${cc}`} />
      <div className="event-card-body">
        <div className="event-card-top">
          <span className={`event-cat-badge cat-${cc}`}>{event.category}</span>
          <span className="event-price">{event.price}</span>
        </div>
        <div className="event-title">{event.title}</div>
        <div className="event-venue">{event.venue}</div>
        <div className="event-meta">
          <span>📅 {formatDate(event.date)}</span>
          <span>🕐 {event.time}</span>
          {event.url && <span className="event-link-hint">↗ Visit site</span>}
        </div>
        <div className="event-disclaimer">Dates, times, and prices may change. Confirm details with the venue before attending.</div>
      </div>
    </div>
  );
}

export default EventCard;
