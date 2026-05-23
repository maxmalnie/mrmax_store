// backend/src/services/printful.js
// Klient Printful API v2 (legacy v1 też wspierany) — https://developers.printful.com/docs/

const API_BASE = process.env.PRINTFUL_API_BASE || 'https://api.printful.com';
const TOKEN = process.env.PRINTFUL_API_TOKEN;
const STORE_ID = process.env.PRINTFUL_STORE_ID; // opcjonalne — token może być przypisany do konkretnego store

// Prosty cache w pamięci (per-instance)
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.t > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.v;
}

function cacheSet(key, value) {
  cache.set(key, { v: value, t: Date.now() });
}

async function printfulFetch(endpoint, options = {}) {
  if (!TOKEN) {
    throw new Error('PRINTFUL_API_TOKEN not set in env');
  }

  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'mrmax-store/0.1',
    ...(options.headers || {}),
  };
  // Printful pozwala określić store przez header X-PF-Store-Id (gdy token ma dostęp do kilku)
  if (STORE_ID) headers['X-PF-Store-Id'] = STORE_ID;

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Printful ${res.status}: ${text || res.statusText}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// --- Produkty (sync products to to co masz w swoim Printful store) ---

async function listProducts({ limit = 50, offset = 0 } = {}) {
  const key = `products:${limit}:${offset}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  // /store/products — lista sync products z aktualnego store
  const data = await printfulFetch(
    `/store/products?limit=${limit}&offset=${offset}`
  );
  cacheSet(key, data);
  return data;
}

async function getProduct(productId) {
  const key = `product:${productId}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  // /store/products/{id} — zwraca {sync_product, sync_variants}
  const data = await printfulFetch(`/store/products/${productId}`);
  cacheSet(key, data);
  return data;
}

// --- Zamówienia ---

async function createOrder(orderPayload) {
  // POST /orders — body: { recipient, items, retail_costs }
  return printfulFetch(`/orders`, {
    method: 'POST',
    body: JSON.stringify(orderPayload),
  });
}

async function getOrder(orderId) {
  return printfulFetch(`/orders/${orderId}`);
}

async function confirmOrder(orderId) {
  // POST /orders/{id}/confirm — przenosi z draft do fulfillment
  return printfulFetch(`/orders/${orderId}/confirm`, { method: 'POST' });
}

// --- Shipping ---

async function calcShipping({ recipient, items }) {
  return printfulFetch(`/shipping/rates`, {
    method: 'POST',
    body: JSON.stringify({ recipient, items }),
  });
}

// --- Tax (Printful liczy podatek tylko dla US/CA — w EU używa się retail_costs) ---

async function calcTax({ recipient }) {
  return printfulFetch(`/tax/rates`, {
    method: 'POST',
    body: JSON.stringify({ recipient }),
  });
}

// --- Webhook config (read) ---

async function getWebhookConfig() {
  return printfulFetch(`/webhooks`);
}

module.exports = {
  listProducts,
  getProduct,
  createOrder,
  getOrder,
  confirmOrder,
  calcShipping,
  calcTax,
  getWebhookConfig,
  _internal: { cache, printfulFetch },
};
