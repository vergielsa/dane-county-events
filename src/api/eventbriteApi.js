const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

function mapEventbriteCategory(categoryId) {
  const map = {
    '103': 'Music',
    '105': 'Art',
    '104': 'Festival',
    '110': 'Social',
    '113': 'Social',
    '108': 'Sports',
    '111': 'Comedy',
    '116': 'Social',
    '199': 'Social',
  };
  return map[categoryId] || 'Social';
}

function formatTime(dateStr) {
  if (!dateStr) return 'TBA';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return dateStr.slice(0, 10);
}

export async function fetchEventbriteEvents() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/events/eventbrite`);
    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const data = await res.json();
    const ebEvents = data.events || [];

    return ebEvents.map(e => ({
      id: `eb_${e.id}`,
      title: e.name?.text || 'Untitled Event',
      category: mapEventbriteCategory(e.category_id),
      venue: e.venue?.name || 'Venue TBA',
      date: formatDate(e.start?.local),
      time: formatTime(e.start?.local),
      price: e.is_free
        ? 'Free'
        : e.ticket_availability?.minimum_ticket_price
        ? `From $${Math.round(e.ticket_availability.minimum_ticket_price.major_value)}`
        : 'See site',
      url: e.url,
      source: 'Eventbrite',
    }));
  } catch (err) {
    console.error('Eventbrite fetch failed:', err);
    return [];
  }
}
