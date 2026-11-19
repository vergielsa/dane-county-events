// Builds a downloadable .ics file for one event, entirely in the browser (no accounts, no server calls).
// Event times are Central wall-clock times, so they are converted to UTC for the file; that way every calendar
// app (Apple, Google, Outlook) shows the right moment regardless of the viewer's time zone.

function chicagoOffsetMs(utcMs) {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const g = t => parseInt(p.find(x => x.type === t).value, 10);
  return Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second')) - Math.floor(utcMs / 1000) * 1000;
}

function chicagoWallToUtcMs(y, mo, d, h, mi) {
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  let utc = wall - chicagoOffsetMs(wall);
  utc = wall - chicagoOffsetMs(utc);
  return utc;
}

const pad = n => String(n).padStart(2, '0');
function icsStamp(ms) {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}
const esc = s => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

function fold(line) {
  const out = [];
  let rest = line;
  while (rest.length > 74) { out.push(rest.slice(0, 74)); rest = ' ' + rest.slice(74); }
  out.push(rest);
  return out.join('\r\n');
}

export function buildIcs(event) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(event.date || '');
  if (!m) return null;
  const [y, mo, d] = [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
  const t = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(event.time || '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Dane County Events//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:${String(event.id || event.title).replace(/[^\w.-]/g, '')}@danecountyevents.com`,
    `DTSTAMP:${icsStamp(Date.now())}`];
  if (t) {
    let h = parseInt(t[1], 10) % 12;
    if (/pm/i.test(t[3])) h += 12;
    const start = chicagoWallToUtcMs(y, mo, d, h, parseInt(t[2], 10));
    lines.push(`DTSTART:${icsStamp(start)}`, `DTEND:${icsStamp(start + 2 * 3600000)}`); // end time is not published, so assume 2 hours
  } else {
    const next = new Date(Date.UTC(y, mo - 1, d + 1));
    lines.push(`DTSTART;VALUE=DATE:${y}${pad(mo)}${pad(d)}`,
      `DTEND;VALUE=DATE:${next.getUTCFullYear()}${pad(next.getUTCMonth() + 1)}${pad(next.getUTCDate())}`);
  }
  lines.push(`SUMMARY:${esc(event.title)}`);
  if (event.venue) lines.push(`LOCATION:${esc(event.venue)}`);
  lines.push(`DESCRIPTION:${esc((event.url ? event.url + '\n' : '') + 'Times may change. Confirm with the venue. Found on danecountyevents.com')}`);
  if (event.url) lines.push(`URL:${event.url}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function downloadIcs(event) {
  const ics = buildIcs(event);
  if (!ics) return;
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${String(event.title || 'event').replace(/[^\w]+/g, '-').slice(0, 40)}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
