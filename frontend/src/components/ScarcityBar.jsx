import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext.jsx';

// Czerwony pasek "almost gone" pokazujący się gdy mamy <=25 sztuk z edition of 50
// Edition data pochodzi z Printful product tags (TODO: konfiguracja) — na razie stała
export default function ScarcityBar() {
  const { products } = useShop();
  const location = useLocation();
  const hero = products?.[0];

  if (!hero) return null;
  // tymczasowo: edition data demo
  const editionRemaining = hero.editionRemaining ?? 17;
  const editionTotal = hero.editionTotal ?? 50;
  if (editionRemaining > 25) return null;
  if (location.pathname === '/sukces') return null;

  return (
    <div className="scarcity-bar">
      <span className="blink" />
      <span>
        Drop 01 · Almost gone — <b>only {editionRemaining} of {editionTotal} left</b>
      </span>
      <span className="sep">·</span>
      <span>{Math.floor((editionTotal - editionRemaining) / 7)} sold in the last 24h</span>
      <Link to={`/produkt/${hero.id}`} className="cta">Claim yours →</Link>
    </div>
  );
}
