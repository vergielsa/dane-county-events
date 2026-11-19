// Quick date windows for the "When" filter. All dates are America/Chicago calendar dates (YYYY-MM-DD),
// matching how the backend stores and compares event dates.
export const WHEN_OPTIONS = ['All dates', 'Today', 'Tomorrow', 'This weekend', 'Next 7 days'];

function chicagoToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date());
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Returns { from, to } (inclusive) or null for "All dates".
export function getDateRange(option, today = chicagoToday()) {
  const dow = new Date(today + 'T12:00:00Z').getUTCDay(); // 0 Sun .. 6 Sat
  switch (option) {
    case 'Today':
      return { from: today, to: today };
    case 'Tomorrow': {
      const t = addDays(today, 1);
      return { from: t, to: t };
    }
    case 'This weekend': {
      // Weekend = Fri-Sun. Already in it: today through Sunday. Otherwise: the coming Friday through Sunday.
      if (dow === 0) return { from: today, to: today };
      if (dow >= 5) return { from: today, to: addDays(today, 7 - dow) };
      const fri = addDays(today, 5 - dow);
      return { from: fri, to: addDays(fri, 2) };
    }
    case 'Next 7 days':
      return { from: today, to: addDays(today, 6) };
    default:
      return null;
  }
}
