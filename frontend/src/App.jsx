import { Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <main className="screen-scroll">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sklep" element={<Catalog />} />
          <Route path="/produkt/:id" element={<Product />} />
          <Route path="/koszyk" element={<Cart />} />
          <Route path="/zamowienie" element={<Checkout />} />
          <Route path="*" element={<div style={{ padding: 32 }}>404 — nic tu nie ma</div>} />
        </Routes>
      </main>
    </div>
  );
}
