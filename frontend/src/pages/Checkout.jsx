import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart, formatPrice } from '../contexts/CartContext.jsx';
import { api } from '../api/client.js';

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '',
  address1: '', address2: '', city: '', zip: '',
  country: 'PL', region: '',
};

const PAYS = [
  { id: 'card',   label: 'Card',   sub: 'Stripe · Visa/MC' },
  { id: 'p24',    label: 'P24',    sub: 'Przelewy24 · BLIK' },
  { id: 'paypal', label: 'PayPal', sub: 'Express checkout' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totals, ship, promo, clear } = useCart();
  const [addr, setAddr] = useState(EMPTY);
  const [pay, setPay] = useState('card');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (k) => (e) => setAddr((p) => ({ ...p, [k]: e.target.value }));

  if (items.length === 0) {
    return (
      <div className="bag-empty" style={{ margin: '60px var(--pad)' }}>
        <h2>Empty cart.</h2>
        <p>Nie ma czego wysłać.</p>
        <Link to="/sklep" className="btn btn-fill">Browse drops</Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const order = await api.createOrder({
        items: items.map((it) => ({
          syncVariantId: it.syncVariantId || it.variantId,
          quantity: it.quantity,
        })),
        address: addr,
      });
      const orderId = order.id || order.result?.id || `MMX-${Date.now()}`;
      clear();
      navigate('/sukces', { state: { orderId, total: totals.total } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout">
      <form className="checkout-form" onSubmit={submit}>
        <h1>Checkout<br/><span className="italic">— almost.</span></h1>
        <div className="checkout-step-label"><span className="dot" /> Step 2 / 3 · Shipping & payment</div>

        <h3 className="display" style={{ fontSize: 28, margin: '16px 0' }}>Where to ship?</h3>
        <div className="form-grid cols-2">
          <div className="field"><label>First name</label><input value={addr.firstName} onChange={onChange('firstName')} required /></div>
          <div className="field"><label>Last name</label><input value={addr.lastName} onChange={onChange('lastName')} required /></div>
          <div className="field"><label>Email</label><input type="email" value={addr.email} onChange={onChange('email')} required /></div>
          <div className="field"><label>Phone</label><input value={addr.phone} onChange={onChange('phone')} required /></div>
        </div>

        <div className="form-grid">
          <div className="field"><label>Address line 1</label><input value={addr.address1} onChange={onChange('address1')} required /></div>
          <div className="field"><label>Address line 2 <span style={{ opacity: 0.5 }}>(optional)</span></label><input value={addr.address2} onChange={onChange('address2')} /></div>
        </div>

        <div className="form-grid cols-2">
          <div className="field"><label>ZIP</label><input value={addr.zip} onChange={onChange('zip')} required /></div>
          <div className="field"><label>City</label><input value={addr.city} onChange={onChange('city')} required /></div>
          <div className="field"><label>Region / state</label><input value={addr.region} onChange={onChange('region')} /></div>
          <div className="field"><label>Country (ISO)</label><input value={addr.country} onChange={onChange('country')} required /></div>
        </div>

        <h3 className="display" style={{ fontSize: 28, margin: '24px 0 16px' }}>Pay with</h3>
        <div className="pay-options">
          {PAYS.map((p) => (
            <div key={p.id} className={'pay' + (pay === p.id ? ' on' : '')} onClick={() => setPay(p.id)}>
              <b>{p.label}</b>
              <span>{p.sub}</span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(197,68,58,0.1)', color: 'var(--sticker)', padding: 14, fontFamily: 'var(--f-mono)', fontSize: 12, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <Link to="/koszyk" className="btn btn-ghost">← Back to bag</Link>
          <button type="submit" className="btn btn-fill" disabled={submitting} style={{ flex: 1, minWidth: 200 }}>
            {submitting ? 'Placing order…' : `Place order · ${formatPrice(totals.total, 'PLN')}`}
          </button>
        </div>
      </form>

      <aside className="checkout-summary">
        <h3>Your bag</h3>
        {items.map((it) => (
          <div key={it.key} className="sum-line">
            <div className="thumb">{it.image && <img src={it.image} alt="" />}</div>
            <div>
              <h5>{it.title}</h5>
              <div className="opts">{[it.size, it.color, it.fit].filter(Boolean).join(' · ')} · ×{it.quantity}</div>
            </div>
            <div className="price">{formatPrice(it.price * it.quantity, it.currency)}</div>
          </div>
        ))}

        <div className="sum-totals">
          <div className="row"><span>Subtotal</span><span>{formatPrice(totals.subtotal, 'PLN')}</span></div>
          <div className="row"><span>Shipping ({ship})</span><span>{totals.shipPrice ? formatPrice(totals.shipPrice, 'PLN') : 'Free'}</span></div>
          {promo && <div className="row"><span>Promo {promo.code}</span><span>−{formatPrice(totals.discount, 'PLN')}</span></div>}
          <div className="row total"><span>Total</span><span>{formatPrice(totals.total, 'PLN')}</span></div>
        </div>
      </aside>
    </div>
  );
}
