// backend/src/server.js
// Główny Express app — odpalany standalone w dev (port 4000) lub przez api/index.js na Vercel.

const path = require('path');
const express = require('express');
const cors = require('cors');

// dotenv tylko w dev — na Vercel env vars wstrzykiwane są natywnie
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const webhookRoute = require('./routes/webhook');

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? true // ten sam origin na Vercel
    : ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}));

// Webhook musi mieć raw body do weryfikacji podpisu — przed express.json()
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoute);

app.use(express.json({ limit: '1mb' }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'mrmax-store',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);

// Catch-all 404 dla /api
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Globalny error handler
app.use((err, req, res, next) => {
  console.error('[server error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Standalone dev mode
if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`[mrmax-store] backend running on http://localhost:${port}`);
  });
}

module.exports = app;
