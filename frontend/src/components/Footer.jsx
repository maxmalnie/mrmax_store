import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div>
          <h5>Mr.Max</h5>
          <div className="foot-big">Wearable<br />walls.</div>
          <p style={{ opacity: 0.7, maxWidth: 420, fontSize: 14, lineHeight: 1.5 }}>
            Limitowane drops koszulek z muralami z różnych miast. Każdy projekt — edition of 50, numerowana, druk na żądanie.
          </p>
        </div>
        <div>
          <h5>Shop</h5>
          <Link to="/sklep">All drops</Link>
          <Link to="/lookbook">Lookbook</Link>
          <a>Size guide</a>
          <a>Shipping</a>
        </div>
        <div>
          <h5>About</h5>
          <Link to="/story">The story</Link>
          <a>Artist statement</a>
          <a>Contact</a>
          <a>Press</a>
        </div>
        <div>
          <h5>Follow</h5>
          <a>Instagram</a>
          <a>Substack</a>
          <a>Email newsletter</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© {new Date().getFullYear()} Mr.Max Store</span>
        <span>Made to order · Printed in EU</span>
        <span>Terms · Privacy</span>
      </div>
    </footer>
  );
}
