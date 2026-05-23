import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, formatPrice } from '../contexts/CartContext.jsx';
import { api } from '../api/client.js';

const EMPTY_ADDRESS = {
  firstName: '', lastName: '', email: '', phone: '',
  country: 'PL', region: '',
  address1: '', address2: '', city: '', zip: '',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totals, clear } = useCart();
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (k) => (e) =>
    setAddress((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const order = await api.createOrder({
        items: items.map((it) => ({
          productId: it.productId,
          variantId: it.variantId,
          quantity: it.quantity,
        })),
        address,
      });
      clear();
      navigate('/sklep', {
        state: { orderId: order.id, success: true },
      });
      alert(`Zamówienie złożone! ID: ${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="center" style={{ padding: '60px 0' }}>
        <h1>Pusto</h1>
        <p className="muted">Dodaj coś do koszyka, zanim przejdziesz do zamówienia.</p>
      </div>
    );
  }

  return (
    <section>
      <h1 style={{ marginTop: 16 }}>Dostawa &amp; zamówienie</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32, marginTop: 24 }}>
        <div className="card stack-12">
          <h3>Adres dostawy</h3>
          <Row>
            <Field label="Imię" value={address.firstName} onChange={handleChange('firstName')} required />
            <Field label="Nazwisko" value={address.lastName} onChange={handleChange('lastName')} required />
          </Row>
          <Row>
            <Field label="Email" type="email" value={address.email} onChange={handleChange('email')} required />
            <Field label="Telefon" value={address.phone} onChange={handleChange('phone')} required />
          </Row>
          <Field label="Adres" value={address.address1} onChange={handleChange('address1')} required />
          <Row>
            <Field label="Kod" value={address.zip} onChange={handleChange('zip')} required />
            <Field label="Miasto" value={address.city} onChange={handleChange('city')} required />
          </Row>
          <Row>
            <Field label="Województwo" value={address.region} onChange={handleChange('region')} />
            <Field label="Kraj (ISO)" value={address.country} onChange={handleChange('country')} />
          </Row>
        </div>

        <div className="card stack-12" style={{ alignSelf: 'start', position: 'sticky', top: 'calc(var(--topbar-h) + 16px)' }}>
          <h3>Podsumowanie</h3>
          {items.map((it) => (
            <div key={it.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span>{it.title} × {it.quantity}</span>
              <span>{formatPrice(it.price * it.quantity, it.currency)}</span>
            </div>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid var(--c-line)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
            <span>Razem</span>
            <span style={{ color: 'var(--c-accent-hot)' }}>{formatPrice(totals.subtotal, 'PLN')}</span>
          </div>
          <small className="muted">Wysyłka liczona w następnym kroku (TODO).</small>

          {error && (
            <div style={{ color: '#b00', fontSize: 13 }}>{error}</div>
          )}

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Wysyłam…' : 'Złóż zamówienie'}
          </button>
        </div>
      </form>
    </section>
  );
}

function Row({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{children}</div>;
}

function Field({ label, ...rest }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>{label}</span>
      <input
        {...rest}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '1px solid var(--c-line)',
          borderRadius: 'var(--r-md)',
          fontFamily: 'inherit',
          fontSize: '0.95rem',
          background: '#fff',
        }}
      />
    </label>
  );
}
