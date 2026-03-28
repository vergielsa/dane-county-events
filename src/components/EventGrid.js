import React from 'react';
import EventCard from './EventCard';

function EventGrid({ events }) {
  if (events.length === 0) {
    return (
      <div className="events-grid">
        <div className="empty-state">
          <p style={{ fontSize: '2rem' }}>🔍</p>
          <p>No events found. Try a different search or category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-grid">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventGrid;
