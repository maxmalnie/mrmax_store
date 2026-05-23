// frontend/src/api/client.js
// Cienki wrapper na fetch — w dev używamy proxy z vite.config (więc tylko /api).
// W produkcji Vercel hostuje frontend + funkcję na tym samym originie.

const BASE = import.meta.env.VITE_API_BASE || '';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let detail = '';
    try {
      const j = await res.json();
      detail = j.error || JSON.stringify(j);
    } catch {
      detail = await res.text();
    }
    const err = new Error(`API ${res.status}: ${detail}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

export const api = {
  health: () => request('/api/health'),

  listProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/products${qs ? `?${qs}` : ''}`);
  },
  getProduct: (id) => request(`/api/products/${id}`),

  createOrder: (payload) =>
    request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getOrder: (id) => request(`/api/orders/${id}`),
  shippingQuote: (payload) =>
    request('/api/orders/shipping', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
