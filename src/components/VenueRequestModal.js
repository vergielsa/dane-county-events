import React, { useState } from 'react';

const EMPTY_FORM = {
  venueName: '',
  venueWebsite: '',
};

function VenueRequestModal({ onClose, onSuccess }) {
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
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'}/api/venue-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed');
      }
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
          <h2>Request a Venue</h2>
          <p>Know a local bar or venue we're missing? Let us know and we'll look into adding it.</p>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-field">
            <label>Venue name *</label>
            <input
              name="venueName"
              value={form.venueName}
              onChange={handleChange}
              placeholder="e.g. The Wisco"
              required
            />
          </div>

          <div className="form-field">
            <label>Venue website</label>
            <input
              name="venueWebsite"
              value={form.venueWebsite}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          {error && <p className="donate-error">{error}</p>}

          <div className="donate-form-actions">
            <button type="button" className="donate-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="donate-submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Request Venue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function VenueRequestSuccessModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="donate-thanks">
          <div className="thanks-icon">✓</div>
          <h2>Request received!</h2>
          <p>Thanks for the tip! We'll check it out and try to get them added soon.</p>
          <button className="donate-submit-btn" onClick={onClose}>
            Back to events
          </button>
        </div>
      </div>
    </div>
  );
}

export default VenueRequestModal;
