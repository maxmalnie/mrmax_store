import { useLocation, Link } from 'react-router-dom';
import { formatPrice } from '../contexts/CartContext.jsx';

export default function Success() {
  const location = useLocation();
  const orderId = location.state?.orderId || `MMX-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const total = location.state?.total;

  return (
    <section className="success">
      <div className="mono" style={{ color: 'var(--sticker)', marginBottom: 24 }}>
        ◉ Order placed
      </div>
      <h1>Thank<br/><span className="italic">you.</span></h1>
      <p>
        Twoje zamówienie <b style={{ color: 'var(--ink)' }}>{orderId}</b> trafiło do drukarni.
        Wysyłka w ciągu 3–5 dni roboczych. Mail z numerem trackingowym dostaniesz automatycznie.
      </p>
      {total != null && (
        <div className="mono" style={{ color: 'var(--mute)', marginBottom: 24 }}>
          Total paid · <b style={{ color: 'var(--ink)' }}>{formatPrice(total, 'PLN')}</b>
        </div>
      )}
      <Link to="/sklep" className="btn btn-fill">Continue browsing →</Link>
    </section>
  );
}
