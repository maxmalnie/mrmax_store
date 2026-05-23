import { NavLink } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';

export default function TopBar() {
  const { totals } = useCart();

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <NavLink to="/" className="topbar__brand">
          mrmax<span>.</span>
        </NavLink>

        <nav className="topbar__nav">
          <NavLink to="/sklep">Sklep</NavLink>
          <NavLink to="/" end>O nas</NavLink>
        </nav>

        <NavLink to="/koszyk" className="topbar__cart">
          Koszyk
          {totals.count > 0 && (
            <span className="topbar__cart-badge">{totals.count}</span>
          )}
        </NavLink>
      </div>
    </header>
  );
}
