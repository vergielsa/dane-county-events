import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import DonateBanner from './components/DonateBanner';
import FilterBar from './components/FilterBar';
import EventGrid from './components/EventGrid';
import Pagination from './components/Pagination';
import DonateModal from './components/DonateModal';
import SubmitEventModal, { SubmitSuccessModal } from './components/SubmitEventModal';
import VenueRequestModal, { VenueRequestSuccessModal } from './components/VenueRequestModal';
import { fetchAllEvents, fetchLocalEvents } from './api/localApi';
import { WHEN_OPTIONS, getDateRange } from './utils/dateRanges';
import './App.css';

const CATEGORIES = ['All', 'Ticketmaster', 'Bars & Dives', 'Community'];
const PAGE_SIZE = 50;

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [when, setWhen] = useState('All dates');
  const [currentPage, setCurrentPage] = useState(1);

  const [showBanner, setShowBanner] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVenueRequestModal, setShowVenueRequestModal] = useState(false);
  const [showVenueRequestSuccessModal, setShowVenueRequestSuccessModal] = useState(false);

  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayTotalPages, setDisplayTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const searchTimer = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(searchTimer.current);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, sortBy, when]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setErrors([]);

    const range = getDateRange(when) || {};
    let result;

    // All and Ticketmaster both use /api/events/all (which includes TM events)
    if (activeCategory === 'All' || activeCategory === 'Ticketmaster') {
      result = await fetchAllEvents({
        page: currentPage,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        sort: sortBy,
        category: activeCategory,
        from: range.from,
        to: range.to,
      });
    } else {
      // Bars & Dives and Community use /api/events/submitted (local only)
      result = await fetchLocalEvents({
        page: currentPage,
        limit: PAGE_SIZE,
        category: activeCategory,
        search: debouncedSearch,
        sort: sortBy,
        from: range.from,
        to: range.to,
      });
    }

    setDisplayedEvents(result.events);
    setDisplayTotal(result.total);
    setDisplayTotalPages(result.totalPages);
    setLoading(false);
  }, [currentPage, activeCategory, debouncedSearch, sortBy, when]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function handleSubmitSuccess() {
    setShowSubmitModal(false);
    setShowSuccessModal(true);
    fetchEvents();
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app">
      <Header onSubmitClick={() => setShowSubmitModal(true)} onRequestVenue={() => setShowVenueRequestModal(true)} />
      {showBanner && (
        <DonateBanner
          onDismiss={() => setShowBanner(false)}
          onDonate={() => setShowDonateModal(true)}
        />
      )}
      {showDonateModal && <DonateModal onClose={() => setShowDonateModal(false)} />}
      {showSubmitModal && (
        <SubmitEventModal
          onClose={() => setShowSubmitModal(false)}
          onSuccess={handleSubmitSuccess}
        />
      )}
      {showSuccessModal && (
        <SubmitSuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
      {showVenueRequestModal && (
        <VenueRequestModal
          onClose={() => setShowVenueRequestModal(false)}
          onSuccess={() => { setShowVenueRequestModal(false); setShowVenueRequestSuccessModal(true); }}
        />
      )}
      {showVenueRequestSuccessModal && (
        <VenueRequestSuccessModal onClose={() => setShowVenueRequestSuccessModal(false)} />
      )}
      <FilterBar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        whenOptions={WHEN_OPTIONS}
        when={when}
        onWhenChange={setWhen}
      />
      <main className="main">
        {loading && <p className="status-msg">Loading events...</p>}
        {!loading && errors.length > 0 && (
          <p className="status-msg error">
            Could not load events.{' '}
            <button onClick={fetchEvents} className="retry-btn">Retry</button>
          </p>
        )}
        {!loading && (
          <>
            <p className="results-bar">
              <strong>{displayTotal}</strong> event{displayTotal !== 1 ? 's' : ''} in{' '}
              <strong>{activeCategory === 'All' ? 'all categories' : activeCategory}</strong>
              {' '}near Madison, WI
              {when !== 'All dates' && <> &middot; <strong>{when.toLowerCase()}</strong></>}
            </p>
            <EventGrid events={displayedEvents} />
            <Pagination
              page={currentPage}
              totalPages={displayTotalPages}
              total={displayTotal}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
      <footer className="footer-note">
        Powered by Ticketmaster + Local Venues &bull; Dane County Events &bull; Free to use
      </footer>
    </div>
  );
}

export default App;
