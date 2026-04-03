import React, { useState } from 'react';
import { submitEvent } from '../api/localApi';

const CATEGORIES = ['Bars & Dives', 'Community'];

const EMPTY_FORM = {
  title: '',
  category: 'Community',
  venue: '',
  date: '',
  time: '',
  price: '',
  url: '',
};

function SubmitEventModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await submitEvent(form);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box submit-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>

        <div className="modal-header">
          <h2>Submit an Event</h2>
          <p>Know about a local event? Add it to the Dane County Events calendar.</p>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-field">
            <label>Event name *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Tuesday Trivia at Great Dane"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Price</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Free / $10 / $5–15"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Venue</label>
            <input
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="e.g. Majestic Theatre, Madison"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Event link</label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://facebook.com/events/..."
            />
          </div>

          {error && <p className="donate-error">{error}</p>}

          <div className="donate-form-actions">
            <button type="button" className="donate-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="donate-submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SubmitSuccessModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="donate-thanks">
          <div className="thanks-icon">✓</div>
          <h2>Event submitted!</h2>
          <p>Thanks for contributing to Dane County Events. Your event is now live on the calendar.</p>
          <button className="donate-submit-btn" onClick={onClose}>
            Back to events
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitEventModal;
