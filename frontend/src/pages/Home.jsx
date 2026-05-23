import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext.jsx';
import { useCart, formatPrice } from '../contexts/CartContext.jsx';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const FITS = [
  { id: 'regular', label: 'Regular', sub: 'Boxy · 220gsm' },
  { id: 'oversize', label: 'Oversize', sub: 'Drop-shoulder · 240gsm' },
];

export default function Home() {
  const { products, loading } = useShop();
  const { add } = useCart();
  const navigate = useNavigate();

  const hero = products?.[0];
  const comingNext = products.slice(1, 4);

  // Selektor — kolor, rozmiar, fit, qty
  const [color, setColor] = useState(0);
  const [size, setSize] = useState('M');
  const [fit, setFit] = useState('regular');
  const [qty, setQty] = useState(1);

  const palette = hero?.palette || ['#f4efe6', '#14110d', '#93a7c8', '#c5443a'];
  const colorName = useMemo(() => {
    const map = ['bone', 'ink', 'sky', 'sticker', 'pine'];
    return map[color] || 'custom';
  }, [color]);

  const handleAdd = () => {
    if (!hero) return;
    add(
      { id: hero.id, code: hero.code, title: hero.title, image: hero.image, price: hero.price, currency: hero.currency },
      {
        id: `${hero.id}__${colorName}__${size}__${fit}`,
        syncVariantId: hero.id, // dla mocka — w real-time wybieramy z hero.variants
        size, color: colorName, colorHex: palette[color], fit,
        price: hero.price,
      },
      qty
    );
    navigate('/koszyk');
  };

  if (loading || !hero) {
    return <div className="display" style={{ padding: 120, textAlign: 'center' }}>Ładowanie…</div>;
  }

  const editionSold = (hero.editionTotal || 50) - (hero.editionRemaining ?? 0);

  return (
    <>
      {/* DROP STAMP */}
      <div className="drop-stamp">
        Limited<b>{hero.editionRemaining ?? 0}/{hero.editionTotal ?? 50}</b>
      </div>

      {/* HERO */}
      <section className="drop-hero" id="drop-hero">
        <div className="drop-hero-grid">
          <div className="drop-hero-left">
            <div>
              <div className="drop-hero-eyebrow">
                <span className="pulse" /> Drop 01 · Live now
              </div>
              <h1 className="drop-hero-title">
                Wearable<br/><span className="italic">walls.</span>
              </h1>
            </div>
            <div className="drop-hero-meta">
              <div><b>{hero.code}</b></div>
              <div>{hero.city} · {hero.year}</div>
              <div>Edition of <b>{hero.editionTotal ?? 50}</b></div>
            </div>
          </div>

          <div className="drop-hero-center">
            <div className="drop-hero-mural-strip" style={{ backgroundImage: `url(${hero.muralImg || '/assets/murals/bubbles.jpg'})` }} />
            <div className="drop-hero-edition-number">{String(hero.editionTotal ?? 50).padStart(2, '0')}</div>
            <div className="drop-hero-edition-counter">
              <b>{hero.editionRemaining ?? 0}</b>
              of {hero.editionTotal ?? 50} left
            </div>
            <Link to={`/produkt/${hero.id}`} className="drop-hero-tee-stage">
              <img
                src={hero.image || '/assets/uploads/Fat1.jpg'}
                alt={hero.title}
                style={{ width: '100%', borderRadius: 4 }}
              />
            </Link>
          </div>

          <div className="drop-hero-right">
            <div className="drop-hero-sub">
              <b>One mural. One shirt.</b> Print-on-demand, made in EU,
              numerowana edycja 50 sztuk. Po wyczerpaniu — koniec.
            </div>
            <div className="drop-hero-stats">
              <div className="drop-hero-stat">
                <span className="l">From</span>
                <span className="v">{formatPrice(hero.price || 0, hero.currency)}</span>
              </div>
              <div className="drop-hero-stat">
                <span className="l">Edition</span>
                <span className="v">{hero.edition || 50}/{hero.editionTotal || 50}</span>
              </div>
            </div>
            <div className="supply">
              <div className="supply-bar"><div className="fill" style={{ width: `${(editionSold / (hero.editionTotal || 50)) * 100}%` }} /></div>
              <div className="supply-marks">
                <span><b>{editionSold}</b> sold</span>
                <span>{hero.editionRemaining ?? 0} left</span>
              </div>
            </div>
            <div className="drop-hero-cta" style={{ marginTop: 24 }}>
              <a href="#drop-card" className="btn btn-fill btn-block">Claim yours →</a>
              <Link to={`/produkt/${hero.id}`} className="btn btn-block">View details</Link>
            </div>
          </div>
        </div>
      </section>

      {/* DROP CARD (inline purchase) */}
      <section className="drop-card" id="drop-card">
        <div className="drop-card-l">
          <h3>{hero.title}<br/><span className="italic">— the story.</span></h3>
          <p className="lead">{hero.story}</p>
          <div className="signature">
            „Heavy Sundays".
            <span className="who">— Mr.Max, {hero.year}</span>
          </div>
        </div>
        <div className="drop-card-r">
          <div className="price-block">
            <span className="big">{formatPrice(hero.price || 0, hero.currency).replace(/\s*[a-zł]*$/i, '')}</span>
            <span className="small">{hero.currency || 'PLN'} · vat incl.</span>
          </div>

          <div className="pdp-section">
            <div className="pdp-section-label"><span>Color</span><b>{colorName}</b></div>
            <div className="color-row">
              {palette.slice(0, 5).map((hex, i) => (
                <button
                  key={i}
                  className={'color-swatch' + (color === i ? ' on' : '')}
                  style={{ background: hex }}
                  onClick={() => setColor(i)}
                  aria-label={`Color ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="pdp-section">
            <div className="pdp-section-label"><span>Size</span><b>{size}</b></div>
            <div className="size-row">
              {SIZES.map((s) => (
                <button key={s} className={'size' + (size === s ? ' on' : '')} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="pdp-section">
            <div className="pdp-section-label"><span>Fit</span><b>{FITS.find(f => f.id === fit)?.label}</b></div>
            <div className="fit-row">
              {FITS.map((f) => (
                <button key={f.id} className={'fit' + (fit === f.id ? ' on' : '')} onClick={() => setFit(f.id)}>
                  <span>{f.sub}</span>
                  <b>{f.label}</b>
                </button>
              ))}
            </div>
          </div>

          <div className="add-row">
            <div className="qty-input">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="btn btn-fill" style={{ width: '100%' }} onClick={handleAdd}>Add to cart</button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature">
          <span className="num">/01</span>
          <b>Print<br/>on demand</b>
          <p>Każdy egzemplarz powstaje dopiero gdy zamówisz. Zero magazynu, zero marnotrawstwa.</p>
        </div>
        <div className="feature">
          <span className="num">/02</span>
          <b>Edition<br/>of 50</b>
          <p>Po wydrukowaniu 50 sztuk — wzór znika na zawsze. Każda koszulka ma numer.</p>
        </div>
        <div className="feature">
          <span className="num">/03</span>
          <b>Made<br/>in EU</b>
          <p>Druk i wysyłka z magazynów Printful w Europie. Krótszy czas, mniej cła.</p>
        </div>
        <div className="feature">
          <span className="num">/04</span>
          <b>Artist<br/>owned</b>
          <p>Bez resellerów, bez pośredników. Bezpośrednio od artysty do Ciebie.</p>
        </div>
      </section>

      {/* COMING NEXT */}
      {comingNext.length > 0 && (
        <section style={{ padding: '80px 0 0' }}>
          <div className="section-head">
            <h2>Coming<br/><span className="italic">next.</span></h2>
            <div className="meta">
              <span>Drops 02 — 04</span>
              <span>·</span>
              <span>Spring 2026</span>
            </div>
          </div>
          <div className="grid cols-3">
            {comingNext.map((p, i) => (
              <Link key={p.id} to={`/produkt/${p.id}`} className="card">
                <span className="card-num">/{String(i + 2).padStart(2, '0')}</span>
                <span className="card-status">{p.stock === 'live' ? 'Live' : 'Soon'}</span>
                <div className="card-tee">
                  {p.image ? (
                    <img src={p.image} alt={p.title} />
                  ) : (
                    <div style={{
                      width: '70%', aspectRatio: '4/5',
                      background: `linear-gradient(135deg, ${p.palette?.[0] || '#caa472'}, ${p.palette?.[1] || '#3d2c1f'})`,
                      opacity: 0.4
                    }} />
                  )}
                </div>
                <h3 className="card-title">{p.title}</h3>
                <div className="card-sub">{p.code}</div>
                <div className="card-row">
                  <span className="card-price">{p.price ? formatPrice(p.price, p.currency) : 'TBA'}</span>
                  <span className="card-cta">{p.stock === 'live' ? 'Buy' : 'Notify me'}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
