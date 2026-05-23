import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api/client.js';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.listProducts({ limit: 50 });
      const list = (data.products || []).map(decorate);
      setProducts(list);
      setError(null);
    } catch (e) {
      console.warn('[ShopContext] failed to load products', e);
      setError(e.message);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <ShopContext.Provider value={{ products, loading, error, reload: load }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside ShopProvider');
  return ctx;
}

// Dekoracja: dodaje pola wymagane przez UI (code, edition info, city, year)
// W docelowym setupie te dane przychodzą z tagów Printful albo z osobnego CMS-a.
// Tu wstawiamy sensowne defaulty na podstawie indeksu.
function decorate(p, i) {
  return {
    ...p,
    code: p.code || `MM-${String(i + 1).padStart(3, '0')} / ${new Date().getFullYear()}`,
    city: p.city || 'Costa da Caparica, PL',
    year: p.year || new Date().getFullYear(),
    edition: p.edition ?? 50,
    editionTotal: p.editionTotal ?? 50,
    editionRemaining: p.editionRemaining ?? Math.floor(Math.random() * 30) + 10,
    muralImg: p.muralImg || '/assets/murals/bubbles.jpg',
    palette: p.palette || ['#93a7c8', '#c5443a', '#d4a82c', '#2f7264'],
    stock: p.stock || (p.visible ? 'live' : 'soon'),
    story: p.story || p.description || 'Drop story TBA.',
  };
}

// fallback gdy backend / Printful nie odpowiadają (sklep dopiero się napełnia)
const MOCK_PRODUCTS = [
  {
    id: 'demo-1',
    title: 'Bubble Boss',
    code: 'MM-001 / 2024',
    description: 'The first wall of the «Heavy Sundays» series. A round man in a bowler hat, blowing soap bubbles toward a punctured post-Soviet concrete fence.',
    story: 'The first wall of the «Heavy Sundays» series. A round man in a bowler hat, blowing soap bubbles toward a punctured post-Soviet concrete fence — the bubbles fall straight into the holes in the wall, and nobody can tell anymore which ones are painted.',
    city: 'Costa da Caparica, PL',
    year: 2024,
    price: 18900,
    currency: 'PLN',
    image: '/assets/uploads/Fat1.jpg',
    images: ['/assets/uploads/Fat1.jpg'],
    edition: 50,
    editionTotal: 50,
    editionRemaining: 17,
    stock: 'live',
    muralImg: '/assets/murals/bubbles.jpg',
    palette: ['#93a7c8', '#c5443a', '#d4a82c', '#2f7264', '#3a2a1c'],
    visible: true,
  },
  {
    id: 'demo-2',
    title: 'Wall #02',
    code: 'MM-002 / 2025',
    description: 'Drop 02 · Spring 2026.',
    story: 'Drop 02 · Spring 2026 — coming soon.',
    city: 'Lisbon, PT',
    year: 2025,
    price: null,
    currency: 'PLN',
    image: null,
    images: [],
    edition: null,
    editionTotal: 50,
    editionRemaining: null,
    stock: 'soon',
    muralImg: null,
    palette: ['#caa472', '#3d2c1f', '#8a7355', '#d8b692'],
    visible: false,
  },
  {
    id: 'demo-3',
    title: 'Wall #03',
    code: 'MM-003 / 2026',
    description: 'Drop 03 · TBA.',
    story: 'Drop 03 · location and date TBA.',
    city: '???',
    year: 2026,
    price: null,
    currency: 'PLN',
    image: null,
    images: [],
    edition: null,
    editionTotal: 50,
    editionRemaining: null,
    stock: 'soon',
    muralImg: null,
    palette: ['#e1d6a8', '#234c70', '#b54a2d', '#f6efd6'],
    visible: false,
  },
];
