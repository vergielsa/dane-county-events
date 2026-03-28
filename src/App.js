import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DonateBanner from './components/DonateBanner';
import FilterBar from './components/FilterBar';
import EventGrid from './components/EventGrid';
import DonateModal from './components/DonateModal';
import './App.css';

const CATEGORIES = ['All', 'Music', 'Art', 'Social', 'Trivia', 'Festival', 'Comedy', 'Sports'];

const TM_KEY = process.env.REACT_APP_TICKETMASTER_KEY;

function mapCategory(event) {
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

function parseEvents(tmEvents) {
  return tmEvents.map(e => ({
    id: e.id,
    title: e.name,
    category: mapCategory(e),
    venue: e._embedded?.venues?.[0]?.name || 'Venue TBA',
    date: e.dates?.start?.localDate || '',
    time: e.dates?.start?.localTime
      ? e.dates.start.localTime.slice(0, 5).replace(/^0/, '')
      : 'TBA',
    price: e.priceRanges
      ? `$${Math.round(e.priceRanges[0].min)}–${Math.round(e.priceRanges[0].max)}`
      : 'See site',
    url: e.url,
  }));
}

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showBanner, setShowBanner] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
      url.searchParams.set('apikey', TM_KEY);
      url.searchParams.set('city', 'Madison');
      url.searchParams.set('stateCode', 'WI');
      url.searchParams.set('countryCode', 'US');
      url.searchParams.set('size', '50');
      url.searchParams.set('sort', 'date,asc');

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const tmEvents = data._embedded?.events || [];
      setEvents(parseEvents(tmEvents));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    let results = events.filter(event => {
      const matchesCat = activeCategory === 'All' || event.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        event.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });

    if (sortBy === 'date') results.sort((a, b) => a.date.localeCompare(b.date));
    else if (sortBy === 'name') results.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'category') results.sort((a, b) => a.category.localeCompare(b.category));

    return results;
  }, [events, activeCategory, searchQuery, sortBy]);

  return (
    <div className="app">
      <Header />
      {showBanner && <DonateBanner onDismiss={() => setShowBanner(false)} onDonate={() => setShowModal(true)} />}
      {showModal && <DonateModal onClose={() => setShowModal(false)} />}
      <FilterBar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <main className="main">
        {loading && <p className="status-msg">Loading events from Ticketmaster...</p>}
        {error && (
          <p className="status-msg error">
            Could not load events: {error}.{' '}
            <button onClick={fetchEvents} className="retry-btn">Retry</button>
          </p>
        )}
        {!loading && !error && (
          <>
            <p className="results-bar">
              Showing <strong>{filteredEvents.length}</strong> event
              {filteredEvents.length !== 1 ? 's' : ''} in{' '}
              <strong>{activeCategory === 'All' ? 'all categories' : activeCategory}</strong>
              {' '}near Madison, WI
            </p>
            <EventGrid events={filteredEvents} />
          </>
        )}
      </main>
      <footer className="footer-note">
        Powered by Ticketmaster &bull; Dane County Events &bull; Free to use
      </footer>
    </div>
  );
}

export default App;
