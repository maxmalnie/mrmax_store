import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'mrmax_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = useCallback((product, variantId, quantity = 1) => {
    setItems((prev) => {
      const key = `${product.id}_${variantId}`;
      const existing = prev.find((it) => it.key === key);
      if (existing) {
        return prev.map((it) =>
          it.key === key ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          variantId,
          title: product.title,
          image: product.image,
          price: product.price,
          currency: product.currency || 'PLN',
          quantity,
        },
      ];
    });
  }, []);

  const remove = useCallback((key) => {
    setItems((prev) => prev.filter((it) => it.key !== key));
  }, []);

  const updateQty = useCallback((key, quantity) => {
    setItems((prev) =>
      prev
        .map((it) => (it.key === key ? { ...it, quantity } : it))
        .filter((it) => it.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const count = items.reduce((s, it) => s + it.quantity, 0);
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    return { count, subtotal };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, totals }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

// Helper formatowania ceny (Printify zwraca w centach)
export function formatPrice(cents, currency = 'PLN') {
  const value = (cents || 0) / 100;
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency,
  }).format(value);
}
