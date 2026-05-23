import { Link } from 'react-router-dom';
import { formatPrice } from '../contexts/CartContext.jsx';

export default function ProductCard({ product }) {
  return (
    <Link to={`/produkt/${product.id}`} className="product-card">
      <img
        className="product-card__img"
        src={product.image || 'https://placehold.co/600x600/efd8b8/4e4d76?text=tshirt'}
        alt={product.title}
        loading="lazy"
      />
      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>
        <div className="product-card__price">
          {formatPrice(product.price, product.currency)}
        </div>
      </div>
    </Link>
  );
}
