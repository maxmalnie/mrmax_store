import { useShop } from '../contexts/ShopContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Catalog() {
  const { products, loading, error } = useShop();

  return (
    <section>
      <h1 style={{ marginTop: 16 }}>Sklep</h1>
      <p className="muted" style={{ marginBottom: 24 }}>
        Wszystkie wzory dostępne aktualnie.
      </p>

      {error && (
        <div className="card" style={{ marginBottom: 20, background: '#fff3e0' }}>
          <strong>Backend nie odpowiada</strong> — pokazuję demo produkty.
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            Sprawdź <code>PRINTIFY_API_TOKEN</code> i <code>PRINTIFY_SHOP_ID</code> w <code>.env</code>.
          </div>
        </div>
      )}

      {loading ? (
        <div className="center muted">Ładuję wzory…</div>
      ) : (
        <div className="grid grid--products">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
