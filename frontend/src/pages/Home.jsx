import { Link } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const { products, loading } = useShop();
  const featured = products.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div>
          <h1 className="hero__title">
            Koszulki z <em>charakterem</em><br />— bez kompromisów.
          </h1>
          <p className="hero__sub">
            Drukujemy na żądanie z najlepszych baw&shy;ełen. Każdy egzemplarz
            powstaje dopiero gdy złożysz zamówienie — zero magazynu, zero marnotrawstwa.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/sklep" className="btn">Zobacz sklep →</Link>
            <Link to="/" className="btn btn-ghost">Jak to działa</Link>
          </div>
        </div>
        <div className="hero__blob" aria-hidden="true" />
      </section>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Świeżo z drukarki</h2>
        {loading ? (
          <div className="center muted">Ładuję wzory…</div>
        ) : (
          <div className="grid grid--products">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <div className="center" style={{ marginTop: 28 }}>
          <Link to="/sklep" className="btn btn-ghost">Wszystkie koszulki</Link>
        </div>
      </section>
    </>
  );
}
