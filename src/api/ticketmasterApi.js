const TM_KEY = process.env.REACT_APP_TICKETMASTER_KEY;

function mapTicketmasterCategory(event) {
  const seg = event.classifications?.[0]?.segment?.name || '';
  const genre = event.classifications?.[0]?.genre?.name || '';
  const combined = (seg + ' ' + genre).toLowerCase();

  if (combined.includes('music')) return 'Music';
  if (combined.includes('comedy')) return 'Comedy';
  if (combined.includes('sport')) return 'Sports';
  if (combined.includes('art') || combined.includes('theatre') || combined.includes('theater') || combined.includes('film')) return 'Art';
  if (combined.includes('festival') || combined.includes('fair')) return 'Festival';
  if (combined.includes('family') || combined.includes('community')) return 'Social';
  return 'Music';
}

export async function fetchTicketmasterEvents() {
  try {
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
    url.searchParams.set('apikey', TM_KEY);
    url.searchParams.set('city', 'Madison');
    url.searchParams.set('stateCode', 'WI');
    url.searchParams.set('countryCode', 'US');
    url.searchParams.set('size', '50');
    url.searchParams.set('sort', 'date,asc');

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Ticketmaster API error: ${res.status}`);
    const data = await res.json();
    const tmEvents = data._embedded?.events || [];

    return tmEvents.map(e => ({
      id: `tm_${e.id}`,
      title: e.name,
      category: 'Ticketmaster',
      venue: e._embedded?.venues?.[0]?.name || 'Venue TBA',
      date: e.dates?.start?.localDate || '',
      time: e.dates?.start?.localTime
        ? e.dates.start.localTime.slice(0, 5).replace(/^0/, '')
        : 'TBA',
      price: e.priceRanges
        ? `$${Math.round(e.priceRanges[0].min)}–${Math.round(e.priceRanges[0].max)}`
        : 'See site',
      url: e.url,
      source: 'Ticketmaster',
    }));
  } catch (err) {
    console.error('Ticketmaster fetch failed:', err);
    return [];
  }
}
