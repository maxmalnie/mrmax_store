import { Link } from 'react-router-dom';
import { useCart, formatPrice } from '../contexts/CartContext.jsx';

export default function Cart() {
  const { items, remove, updateQty, totals } = useCart();

  if (items.length === 0) {
    return (
      <div className="center" style={{ padding: '60px 0' }}>
        <h1>Koszyk jest pusty</h1>
        <p className="muted" style={{ marginBottom: 24 }}>Wpadnij do sklepu i wybierz coś dla siebie.</p>
        <Link to="/sklep" className="btn">Do sklepu →</Link>
      </div>
    );
  }

  return (
    <section>
      <h1 style={{ marginTop: 16 }}>Koszyk</h1>

      <div className="stack-12" style={{ marginTop: 24 }}>
        {items.map((it) => (
          <div
            key={it.key}
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <img
              src={it.image || 'https://placehold.co/120x120/efd8b8/4e4d76?text=t'}
              alt=""
              style={{ width: 80, height: 80, borderRadius: 'var(--r-md)', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{it.title}</div>
              <div className="muted" style={{ fontSize: 13 }}>
                {formatPrice(it.price, it.currency)} / szt
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className="btn-ghost btn"
                style={{ padding: '4px 12px' }}
                onClick={() => updateQty(it.key, it.quantity - 1)}
              >–</button>
              <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{it.quantity}</span>
              <button
                className="btn-ghost btn"
                style={{ padding: '4px 12px' }}
                onClick={() => updateQty(it.key, it.quantity + 1)}
              >+</button>
            </div>
            <div style={{ fontWeight: 800, minWidth: 90, textAlign: 'right' }}>
              {formatPrice(it.price * it.quantity, it.currency)}
            </div>
            <button
              className="btn-ghost btn"
              style={{ padding: '6px 12px', fontSize: 13 }}
              onClick={() => remove(it.key)}
            >
              Usuń
            </button>
          </div>
        ))}
      </div>

      <div
        className="card"
        style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <div className="muted">Razem ({totals.count} szt)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--c-accent-hot)' }}>
            {formatPrice(totals.subtotal, 'PLN')}
          </div>
        </div>
        <Link to="/zamowienie" className="btn">Do zamówienia →</Link>
      </div>
    </section>
  );
}
