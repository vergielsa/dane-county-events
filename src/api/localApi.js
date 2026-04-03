const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export async function fetchAllEvents({ page = 1, limit = 50, search = '', sort = 'date', category = 'All' } = {}) {
  try {
    const params = new URLSearchParams({ page, limit, sort });
    if (search) params.set('search', search);
    if (category && category !== 'All') params.set('category', category);

    const res = await fetch(`${BACKEND_URL}/api/events/all?${params}`);
    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const data = await res.json();
    return {
      events: data.events || [],
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
      pageSize: data.pageSize || 50,
    };
  } catch (err) {
    console.error('All events fetch failed:', err);
    return { events: [], total: 0, page: 1, totalPages: 1, pageSize: 50 };
  }
}

export async function fetchLocalEvents({ page = 1, limit = 50, category = 'All', search = '', sort = 'date' } = {}) {
  try {
    const params = new URLSearchParams({ page, limit, sort });
    if (category && category !== 'All') params.set('category', category);
    if (search) params.set('search', search);

    const res = await fetch(`${BACKEND_URL}/api/events/submitted?${params}`);
    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const data = await res.json();
    return {
      events: data.events || [],
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
      pageSize: data.pageSize || 50,
    };
  } catch (err) {
    console.error('Local events fetch failed:', err);
    return { events: [], total: 0, page: 1, totalPages: 1, pageSize: 50 };
  }
}

export async function submitEvent(eventData) {
  const res = await fetch(`${BACKEND_URL}/api/events/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Submission failed');
  return data;
}
