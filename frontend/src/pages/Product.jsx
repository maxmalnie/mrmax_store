import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useCart, formatPrice } from '../contexts/CartContext.jsx';
import { useShop } from '../contexts/ShopContext.jsx';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { products } = useShop();

  const [data, setData] = useState(null);
  const [variantId, setVariantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.getProduct(id)
      .then((d) => { if (alive) { setData(d); setVariantId(d.variants?.[0]?.id ?? null); } })
      .catch((e) => {
        // fallback do listy z ShopContext (np. dla demo-1, demo-2…)
        const local = products.find((p) => String(p.id) === String(id));
        if (local) {
          setData({
            id: local.id,
            title: local.title,
            description: local.description,
            images: (local.images || []).map((src) => ({ src })),
            variants: [{ id: 'demo-v', title: 'Standard', price: local.price, isAvailable: true }],
          });
          setVariantId('demo-v');
        } else {
          setError(e.message);
        }
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id, products]);

  if (loading) return <div className="center muted" style={{ padding: 40 }}>Ładuję…</div>;
  if (error)   return <div className="card">Nie udało się załadować produktu. {error}</div>;
  if (!data)   return null;

  const selected = data.variants?.find((v) => v.id === variantId) || data.variants?.[0];
  const img = data.images?.[0]?.src;

  const handleAdd = () => {
    add(
      {
        id: data.id,
        title: data.title,
        image: img,
        price: selected.price,
        currency: 'PLN',
      },
      selected.id,
      1
    );
    navigate('/koszyk');
  };

  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, paddingTop: 16 }}>
      <div>
        <img
          src={img || 'https://placehold.co/800x800/efd8b8/4e4d76?text=tshirt'}
          alt={data.title}
          style={{ width: '100%', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-clay)' }}
        />
      </div>
      <div className="stack-20">
        <h1>{data.title}</h1>
        <div style={{ fontSize: '1.6rem', color: 'var(--c-accent-hot)', fontWeight: 800 }}>
          {selected ? formatPrice(selected.price, 'PLN') : '—'}
        </div>
        {data.description && (
          <div
            className="muted"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        )}

        {data.variants && data.variants.length > 1 && (
          <div>
            <label style={{ fontWeight: 700, marginBottom: 8, display: 'block' }}>Wariant</label>
            <select
              value={variantId || ''}
              onChange={(e) => setVariantId(Number(e.target.value) || e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--r-pill)',
                border: '1px solid var(--c-line)',
                background: '#fff',
                fontFamily: 'inherit',
              }}
            >
              {data.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} — {formatPrice(v.price, 'PLN')}
                </option>
              ))}
            </select>
          </div>
        )}

        <button className="btn" onClick={handleAdd}>Dodaj do koszyka</button>
      </div>
    </section>
  );
}
