// backend/src/routes/orders.js
const express = require('express');
const printful = require('../services/printful');

const router = express.Router();

// POST /api/orders — utwórz zamówienie w Printful (draft, do potwierdzenia osobno)
// Body: { items: [{ syncVariantId, quantity }], address: {...}, confirm: boolean }
router.post('/', async (req, res, next) => {
  try {
    const { items, address, confirm = false, retailCosts } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items[] required' });
    }
    if (!address) {
      return res.status(400).json({ error: 'address required' });
    }

    const payload = {
      external_id: `mrmax_${Date.now()}`,
      shipping: 'STANDARD',
      recipient: {
        name: `${address.firstName || ''} ${address.lastName || ''}`.trim(),
        email: address.email,
        phone: address.phone,
        country_code: address.country || 'PL',
        state_code: address.region || '',
        address1: address.address1,
        address2: address.address2 || '',
        city: address.city,
        zip: address.zip,
      },
      items: items.map((it) => ({
        sync_variant_id: it.syncVariantId || it.variantId,
        quantity: it.quantity || 1,
      })),
      ...(retailCosts ? { retail_costs: retailCosts } : {}),
    };

    let order = await printful.createOrder(payload);

    if (confirm && order.result?.id) {
      order = await printful.confirmOrder(order.result.id);
    }

    res.status(201).json(order.result || order);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id — status zamówienia
router.get('/:id', async (req, res, next) => {
  try {
    const order = await printful.getOrder(req.params.id);
    res.json(order.result || order);
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/:id/confirm — potwierdza draft i wysyła do produkcji
router.post('/:id/confirm', async (req, res, next) => {
  try {
    const order = await printful.confirmOrder(req.params.id);
    res.json(order.result || order);
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/shipping — koszt wysyłki dla koszyka
router.post('/shipping', async (req, res, next) => {
  try {
    const { items, address } = req.body || {};
    const recipient = {
      country_code: address.country || 'PL',
      state_code: address.region || '',
      address1: address.address1,
      city: address.city,
      zip: address.zip,
    };
    const result = await printful.calcShipping({
      recipient,
      items: items.map((it) => ({
        sync_variant_id: it.syncVariantId || it.variantId,
        quantity: it.quantity || 1,
      })),
    });
    res.json(result.result || result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
