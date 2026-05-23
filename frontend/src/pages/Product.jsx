import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useShop } from '../contexts/ShopContext.jsx';
import { useCart, formatPrice } from '../contexts/CartContext.jsx';

const FALLBACK_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const FITS = [
  { id: 'regular', label: 'Regular', sub: 'Boxy · 220gsm' },
  { id: 'oversize', label: 'Oversize', sub: 'Drop-shoulder · 240gsm' },
];

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useShop();
  const { add } = useCart();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [zoom, setZoom] = useState(false);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState('M');
  const [fit, setFit] = useState('regular');
  const [qty, setQty] = useState(1);

  // base product (z ShopContext jako fallback dla obrazka/palette gdy backend offline)
  const baseProduct = useMemo(
    () => products.find((p) => String(p.id) === String(id)),
    [products, id]
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.getProduct(id)
      .then((d) => {
        if (!alive) return;
        setData(d);
        // dobierz domyślny rozmiar z pierwszego dostępnego wariantu
        if (d.variants?.[0]?.options?.size) setSize(d.variants[0].options.size);
      })
      .catch((e) => {
        if (!alive) return;
        // fallback gdy backend nie odpowiada
        if (baseProduct) {
          setData({
            id: baseProduct.id,
            title: baseProduct.title,
            description: baseProduct.story || baseProduct.description,
            images: (baseProduct.images || []).map((src) => ({ src })),
            variants: [{
              id: 'demo-v', price: baseProduct.price, currency: baseProduct.currency || 'PLN',
              options: { size: 'M', color: 'bone' },
            }],
          });
        } else {
          setError(e.message);
        }
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id, baseProduct]);

  if (loading) return <div className="display" style={{ padding: 120, textAlign: 'center' }}>Loading…</div>;
  if (error || !data) return <div style={{ padding: 80 }} className="mono">Product not found. {error}</div>;

  const palette = baseProduct?.palette || ['#f4efe6', '#14110d', '#93a7c8', '#c5443a'];
  const colorName = ['bone', 'ink', 'sky', 'sticker', 'pine'][color] || 'custom';
  const mainImg = data.images?.[0]?.src || baseProduct?.image || '/assets/uploads/Fat1.jpg';
  const muralImg = baseProduct?.muralImg || '/assets/murals/bubbles.jpg';
  const price = data.variants?.[0]?.price || baseProduct?.price || 0;

  // Z Printful sync_variants weź unikalne rozmiary; gdy brak — fallback
  const availableSizes = useMemo(() => {
    const fromVariants = (data.variants || [])
      .map((v) => v.options?.size)
      .filter(Boolean);
    return Array.from(new Set(fromVariants)).length ? Array.from(new Set(fromVariants)) : FALLBACK_SIZES;
  }, [data.variants]);

  const selectedVariant = useMemo(() => {
    // Znajdź wariant pasujący do size (color w Printful jest osobnym wariantem)
    return (data.variants || []).find((v) => v.options?.size === size) || data.variants?.[0];
  }, [data.variants, size]);

  const handleAdd = () => {
    add(
      {
        id: data.id,
        code: baseProduct?.code,
        title: data.title,
        image: mainImg,
        price: selectedVariant?.price || price,
        currency: selectedVariant?.currency || 'PLN',
      },
      {
        id: `${data.id}__${colorName}__${size}__${fit}`,
        syncVariantId: selectedVariant?.id,
        size, color: colorName, colorHex: palette[color], fit,
        price: selectedVariant?.price || price,
      },
      qty
    );
    navigate('/koszyk');
  };

  return (
    <section className="pdp">
      <div className="pdp-media">
        <span className="pdp-corner tl">{baseProduct?.code || `MM-${data.id}`}</span>
        <span className="pdp-corner tr">EDITION {baseProduct?.editionRemaining ?? '—'}/{baseProduct?.editionTotal ?? 50}</span>
        <span className="pdp-corner bl">{baseProduct?.city || 'Made in EU'}</span>
        <span className="pdp-corner br">{baseProduct?.year || new Date().getFullYear()}</span>

        <div
          className={`pdp-stage zoomable`}
          onClick={() => setZoom((z) => !z)}
        >
          <div className="pdp-stage-bg" style={{ backgroundImage: `url(${muralImg})` }} />
          <div className="pdp-stage-ink" />
          <img src={mainImg} alt={data.title} className={`pdp-tee${zoom ? ' zoom' : ''}`} />
        </div>
      </div>

      <div className="pdp-info">
        <div className="pdp-eyebrow">
          <span>{baseProduct?.code || `MM-${data.id}`}</span>
          <span>EDITION OF {baseProduct?.editionTotal ?? 50}</span>
        </div>

        <h1 className="pdp-name">{data.title}<br/><span className="italic">— wearable.</span></h1>

        <div className="pdp-price">
          {formatPrice(price, 'PLN')}
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
              />
            ))}
          </div>
        </div>

        <div className="pdp-section">
          <div className="pdp-section-label"><span>Size</span><b>{size}</b></div>
          <div className="size-row">
            {availableSizes.map((s) => (
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
          <button className="btn btn-fill" onClick={handleAdd}>Add to cart</button>
        </div>

        {baseProduct?.story && (
          <div className="story-card">
            <h4>The story.</h4>
            <p>{baseProduct.story}</p>
            <div className="meta-row">
              <span><b>City</b>{baseProduct.city}</span>
              <span><b>Year</b>{baseProduct.year}</span>
              <span><b>Edition</b>{baseProduct.editionTotal}/{baseProduct.editionTotal}</span>
            </div>
          </div>
        )}

        <Link to="/sklep" className="mono" style={{ color: 'var(--mute)', marginTop: 16 }}>← Back to lookbook</Link>
      </div>
    </section>
  );
}
