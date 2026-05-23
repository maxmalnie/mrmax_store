import { Link } from 'react-router-dom';
import { useCart, formatPrice } from '../contexts/CartContext.jsx';

const SHIPS = [
  { id: 'standard', label: 'Standard', span: '5–8 dni · EU', price: 0 },
  { id: 'express',  label: 'Express',  span: '2–3 dni · DHL',  price: 1900 },
  { id: 'pickup',   label: 'Pickup',   span: 'Warszawa · 1 dzień', price: 0 },
];

export default function Bag() {
  const { items, remove, updateQty, totals, ship, setShip, promo, setPromo } = useCart();

  if (items.length === 0) {
    return (
      <div className="bag">
        <div className="bag-main">
          <div className="bag-head">
            <div>
              <div className="crumbs"><b>Cart</b> <span>·</span> <span>Empty</span></div>
              <h1>The bag<br/><span className="italic">— empty.</span></h1>
            </div>
          </div>
          <div className="bag-empty">
            <h2>Nothing<br/>inside.</h2>
            <p>Wpadnij do sklepu i wybierz coś dla siebie.</p>
            <Link to="/sklep" className="btn btn-fill">Browse drops →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bag">
      <div className="bag-main">
        <div className="bag-head">
          <div>
            <div className="crumbs">
              <span className="step on">1 / Cart</span>
              <span>·</span>
              <span>2 / Shipping</span>
              <span>·</span>
              <span>3 / Pay</span>
            </div>
            <h1>The bag<br/><span className="italic">— ready.</span></h1>
          </div>
          <div className="mono" style={{ color: 'var(--mute)' }}>
            {totals.count} item{totals.count > 1 ? 's' : ''}
          </div>
        </div>

        {items.map((it) => (
          <div key={it.key} className="bag-line">
            <div className="bag-line-img">
              <span className="corner-code">{it.code || it.productId}</span>
              {it.image && <img src={it.image} alt={it.title} />}
            </div>
            <div className="bag-line-info">
              <h4>{it.title}</h4>
              <div className="meta">{it.code} · made to order</div>
              <div className="opts">
                {it.size && <span className="opt">Size <b>{it.size}</b></span>}
                {it.color && (
                  <span className="opt">
                    <span className="sw" style={{ background: it.colorHex || '#f4efe6' }} />
                    {it.color}
                  </span>
                )}
                {it.fit && <span className="opt">{it.fit}</span>}
              </div>
            </div>
            <div className="bag-line-actions">
              <div>
                <div className="price">{formatPrice(it.price * it.quantity, it.currency)}</div>
                <div className="unit">{formatPrice(it.price, it.currency)} / pc</div>
              </div>
              <div className="stepper">
                <button onClick={() => updateQty(it.key, it.quantity - 1)}>−</button>
                <span>{it.quantity}</span>
                <button onClick={() => updateQty(it.key, it.quantity + 1)}>+</button>
              </div>
              <span className="remove" onClick={() => remove(it.key)}>Remove</span>
            </div>
          </div>
        ))}

        {/* Shipping selector */}
        <h3 style={{ marginTop: 48, fontFamily: 'var(--f-display)', fontSize: 32, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 0.9 }}>
          Shipping<br/><span className="italic">method.</span>
        </h3>
        <div className="ship-options">
          {SHIPS.map((s) => (
            <div key={s.id} className={'ship-opt' + (ship === s.id ? ' on' : '')} onClick={() => setShip(s.id)}>
              <b>{s.label}</b>
              <span className="span">{s.span}</span>
              <span className="price">{s.price ? formatPrice(s.price, 'PLN') : 'Free'}</span>
            </div>
          ))}
        </div>
      </div>

      <aside className="bag-sum">
        <h3>Summary</h3>
        <div className="bag-sum-row">
          <span className="label">Subtotal</span>
          <span className="value">{formatPrice(totals.subtotal, 'PLN')}</span>
        </div>
        <div className="bag-sum-row subtle">
          <span className="label">Shipping</span>
          <span className="value">{totals.shipPrice ? formatPrice(totals.shipPrice, 'PLN') : 'Free'}</span>
        </div>
        {promo && (
          <div className="bag-sum-row">
            <span className="label">Promo {promo.code}</span>
            <span className="value">− {formatPrice(totals.discount, 'PLN')}</span>
          </div>
        )}
        <div className="bag-sum-divider" />
        <div className="bag-sum-total">
          <span className="label">Total</span>
          <span><b>{formatPrice(totals.total, 'PLN').replace(/\s*[a-zł]*$/i, '')}</b><span className="currency">PLN</span></span>
        </div>

        {/* Promo code */}
        <div className="promo-row" style={{ display: 'flex', marginTop: 24, marginBottom: 16, border: '1px solid var(--ink)' }}>
          <input
            placeholder="Promo code"
            style={{ flex: 1, border: 0, background: 'transparent', padding: '14px 16px', fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', outline: 0, color: 'var(--ink)' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPromo({ code: e.target.value.toUpperCase(), discount: 0.1 });
                e.target.value = '';
              }
            }}
          />
          <button style={{ padding: '0 22px', background: 'var(--ink)', color: 'var(--bg)', fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Apply
          </button>
        </div>

        <Link to="/zamowienie" className="bag-cta">Checkout →</Link>
        <Link to="/sklep" className="bag-cta-secondary">Continue browsing</Link>
      </aside>
    </div>
  );
}
