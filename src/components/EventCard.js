import React from 'react';

const CATEGORY_CLASS = {
  Music:   'music',
  Art:     'art',
  Social:  'social',
  Trivia:  'trivia',
  Festival:'festival',
  Comedy:  'comedy',
  Sports:  'sports',
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

  return (
    <div className="event-card">
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
        </div>
      </div>
    </div>
  );
}

export default EventCard;
