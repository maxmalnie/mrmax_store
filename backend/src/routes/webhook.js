// backend/src/routes/webhook.js
// Printful webhooks: package_shipped, package_returned, order_updated, etc.
// Doc: https://developers.printful.com/docs/#section/Webhook-API
//
// Printful nie podpisuje webhooków HMAC-em — zabezpieczenie polega na konfiguracji
// "secret" w URL webhooka (np. /api/webhook?token=...). Sprawdzamy ten token.

const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  const expected = process.env.PRINTFUL_WEBHOOK_SECRET;
  if (expected) {
    const token = req.query.token || req.header('X-Webhook-Token');
    if (token !== expected) {
      console.warn('[webhook] invalid token');
      return res.status(401).json({ error: 'invalid token' });
    }
  }

  // req.body to Buffer (raw) — patrz server.js
  let event;
  try {
    event = JSON.parse(req.body.toString('utf8'));
  } catch (e) {
    return res.status(400).json({ error: 'invalid json' });
  }

  console.log('[webhook]', event.type, event.data?.order?.id || event.data?.id);

  // TODO: zapisać do DB / wysłać mail / odświeżyć status zamówienia
  // switch (event.type) {
  //   case 'package_shipped': ...
  //   case 'order_updated': ...
  //   case 'order_failed': ...
  // }

  res.json({ received: true });
});

module.exports = router;
