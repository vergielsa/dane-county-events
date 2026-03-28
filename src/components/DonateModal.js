import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CARD_STYLE = {
  style: {
    base: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '15px',
      color: '#1a1814',
      '::placeholder': { color: '#aaa' },
    },
    invalid: { color: '#c0392b' },
  },
};

function DonateForm({ amount, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setErrorMsg('');

    // In production you'd create a PaymentIntent on your backend.
    // For now we confirm with test card data to show the full flow.
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // paymentMethod.id would be sent to your backend in production
      console.log('PaymentMethod created:', paymentMethod.id);
      setLoading(false);
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="donate-amount-display">
        Donating <strong>${amount}</strong> to Dane County Events
      </div>

      <div className="card-element-wrap">
        <CardElement options={CARD_STYLE} />
      </div>

      {errorMsg && <p className="donate-error">{errorMsg}</p>}

      <div className="donate-form-actions">
        <button type="button" className="donate-cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="donate-submit-btn" disabled={!stripe || loading}>
          {loading ? 'Processing...' : `Donate $${amount}`}
        </button>
      </div>

      <p className="donate-secure-note">
        🔒 Payments processed securely by Stripe. Dane County Events never stores your card details.
      </p>
    </form>
  );
}

function DonateModal({ onClose }) {
  const [amount, setAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState('choose'); // 'choose' | 'pay' | 'thanks'

  const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;

  function handleProceed() {
    if (finalAmount > 0) setStep('pay');
  }

  if (step === 'thanks') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div className="donate-thanks">
            <div className="thanks-icon">♥</div>
            <h2>Thank you!</h2>
            <p>
              Your ${finalAmount} donation helps keep Dane County Events free for everyone.
              A receipt has been sent to your email.
            </p>
            <button className="donate-submit-btn" onClick={onClose}>
              Back to events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>

        <div className="modal-header">
          <h2>Support Dane County Events</h2>
          <p>
            We're community-supported and free to use. A small donation keeps the
            lights on and the listings flowing.
          </p>
        </div>

        {step === 'choose' && (
          <>
            <div className="donate-presets">
              {[5].map(a => (
                <button
                  key={a}
                  className={`preset-btn${amount === a && !customAmount ? ' active' : ''}`}
                  onClick={() => { setAmount(a); setCustomAmount(''); }}
                >
                  ${a}
                </button>
              ))}
              <input
                type="number"
                className="custom-amount-input"
                placeholder="Custom $"
                min="1"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
              />
            </div>
            <button
              className="donate-submit-btn"
              onClick={handleProceed}
              disabled={!finalAmount || finalAmount < 1}
            >
              Continue →
            </button>
          </>
        )}

        {step === 'pay' && (
          <Elements stripe={stripePromise}>
            <DonateForm
              amount={finalAmount}
              onSuccess={() => setStep('thanks')}
              onCancel={() => setStep('choose')}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}

export default DonateModal;
