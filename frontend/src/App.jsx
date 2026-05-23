import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Ticker from './components/Ticker.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import ScarcityBar from './components/ScarcityBar.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Bag from './pages/Bag.jsx';
import Checkout from './pages/Checkout.jsx';
import Success from './pages/Success.jsx';
import About from './pages/About.jsx';

export default function App() {
  const location = useLocation();

  // Scroll-to-top na zmianę route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="app">
      <Ticker />
      <ScarcityBar />
      <Nav />
      <main key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sklep" element={<Catalog />} />
          <Route path="/lookbook" element={<Catalog />} />
          <Route path="/produkt/:id" element={<Product />} />
          <Route path="/koszyk" element={<Bag />} />
          <Route path="/zamowienie" element={<Checkout />} />
          <Route path="/sukces" element={<Success />} />
          <Route path="/story" element={<About />} />
          <Route path="*" element={<div style={{ padding: 80, textAlign: 'center' }} className="display">404 / nothing here</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
