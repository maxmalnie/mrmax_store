import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';

export default function Nav() {
  const { totals } = useCart();

  return (
    <nav className="nav">
      <div className="nav-left">
        <NavLink to="/sklep" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          Shop
        </NavLink>
        <NavLink to="/lookbook" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          Lookbook
        </NavLink>
        <NavLink to="/story" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          Story
        </NavLink>
      </div>

      <Link to="/" className="logo">
        Mr.Max <span className="dot" />
      </Link>

      <div className="nav-right">
        <NavLink to="/sklep" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          Drops
        </NavLink>
        <Link to="/koszyk" className="cart-btn" aria-label="Otwórz koszyk">
          Cart <span className="count">{totals.count}</span>
        </Link>
      </div>
    </nav>
  );
}
