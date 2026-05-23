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
      setProducts(data.products || []);
      setError(null);
    } catch (e) {
      console.warn('[ShopContext] failed to load products', e);
      setError(e.message);
      // Mock fallback gdy backend / Printify nie odpowiadają — żeby UI dało się testować
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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

// --- mock do offline / dev ---
const MOCK_PRODUCTS = [
  {
    id: 'demo-1',
    title: 'Koszulka „Pomarańczowy gigant"',
    description: 'Demo produkt — wymień po podpięciu Printify.',
    price: 8900,
    currency: 'PLN',
    image: 'https://placehold.co/600x600/ff8a5c/fff?text=mrmax',
    images: ['https://placehold.co/600x600/ff8a5c/fff?text=mrmax'],
    variantsCount: 4,
    visible: true,
  },
  {
    id: 'demo-2',
    title: 'Koszulka „Miętowy chmurek"',
    description: 'Demo produkt.',
    price: 7900,
    currency: 'PLN',
    image: 'https://placehold.co/600x600/8fd9a8/4e4d76?text=mint',
    images: ['https://placehold.co/600x600/8fd9a8/4e4d76?text=mint'],
    variantsCount: 4,
    visible: true,
  },
  {
    id: 'demo-3',
    title: 'Koszulka „Różowy obłok"',
    description: 'Demo produkt.',
    price: 8500,
    currency: 'PLN',
    image: 'https://placehold.co/600x600/ffb1c1/4e4d76?text=rose',
    images: ['https://placehold.co/600x600/ffb1c1/4e4d76?text=rose'],
    variantsCount: 4,
    visible: true,
  },
];
