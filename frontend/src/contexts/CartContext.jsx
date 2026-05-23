import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'mrmax_cart_v2';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [ship, setShip] = useState('standard'); // standard | express | pickup
  const [promo, setPromo] = useState(null);     // { code, discount }

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  /**
   * @param product { id, title, image, price, currency }
   * @param variant { id, syncVariantId, size, color, colorHex, fit }
   */
  const add = useCallback((product, variant, quantity = 1) => {
    setItems((prev) => {
      const key = `${product.id}_${variant.id}`;
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
          variantId: variant.id,
          syncVariantId: variant.syncVariantId || variant.id,
          title: product.title,
          code: product.code,
          image: product.image,
          price: variant.price ?? product.price,
          currency: variant.currency || product.currency || 'PLN',
          size: variant.size || null,
          color: variant.color || null,
          colorHex: variant.colorHex || null,
          fit: variant.fit || null,
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
      prev.map((it) => (it.key === key ? { ...it, quantity } : it))
          .filter((it) => it.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const count = items.reduce((s, it) => s + it.quantity, 0);
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shipPrice = { standard: 0, express: 1900, pickup: 0 }[ship] ?? 0;
    const discount = promo ? Math.round(subtotal * (promo.discount || 0)) : 0;
    const total = Math.max(0, subtotal + shipPrice - discount);
    return { count, subtotal, shipPrice, discount, total };
  }, [items, ship, promo]);

  return (
    <CartContext.Provider
      value={{ items, add, remove, updateQty, clear, totals, ship, setShip, promo, setPromo }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

// formatowanie ceny — Printful zwraca w głównej jednostce (np. "29.50"), my trzymamy w centach/groszach
export function formatPrice(cents, currency = 'PLN') {
  const value = (cents || 0) / 100;
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(value);
}
