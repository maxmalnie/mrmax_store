import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext.jsx';
import { formatPrice } from '../contexts/CartContext.jsx';

const LAYOUTS = [
  { id: 'cols-3', label: 'Grid' },
  { id: 'mason', label: 'Editorial' },
  { id: 'cols-2', label: 'Large' },
];

export default function Catalog() {
  const { products, loading, error } = useShop();
  const [layout, setLayout] = useState('mason');

  return (
    <>
      <div className="section-head">
        <h2>The <span className="italic">lookbook.</span></h2>
        <div className="meta">
          <span>{products.length} drops</span>
          <span>·</span>
          <span>Updated weekly</span>
        </div>
      </div>

      <div className="filter-bar">
        {LAYOUTS.map((l) => (
          <button
            key={l.id}
            className={'chip' + (layout === l.id ? ' on' : '')}
            onClick={() => setLayout(l.id)}
          >
            {l.label}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        {error && <span className="mono" style={{ color: 'var(--sticker)' }}>Backend offline — mock data</span>}
      </div>

      {loading ? (
        <div className="display" style={{ padding: 120, textAlign: 'center' }}>Ładowanie…</div>
      ) : products.length === 0 ? (
        <div style={{ padding: 120, textAlign: 'center' }} className="mono">
          Empty store · add products in Printful dashboard
        </div>
      ) : (
        <div className={`grid ${layout}`}>
          {products.map((p, i) => (
            <Link key={p.id} to={`/produkt/${p.id}`} className="card">
              <span className="card-num">/{String(i + 1).padStart(2, '0')}</span>
              <span className="card-status">{p.stock === 'live' ? 'Live' : 'Soon'}</span>
              <div className="card-tee">
                {p.image ? (
                  <img src={p.image} alt={p.title} />
                ) : (
                  <div style={{
                    width: '70%', aspectRatio: '4/5',
                    background: `linear-gradient(135deg, ${p.palette?.[0] || '#caa472'}, ${p.palette?.[1] || '#3d2c1f'})`,
                    opacity: 0.4,
                  }} />
                )}
              </div>
              <h3 className="card-title">{p.title}</h3>
              <div className="card-sub">{p.code}</div>
              <div className="card-row">
                <span className="card-price">{p.price ? formatPrice(p.price, p.currency) : 'TBA'}</span>
                <span className="card-cta">{p.stock === 'live' ? 'Buy' : 'Notify'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
