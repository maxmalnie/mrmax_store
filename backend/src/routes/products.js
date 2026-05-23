// backend/src/routes/products.js
const express = require('express');
const printful = require('../services/printful');

const router = express.Router();

// GET /api/products — lista sync products ze sklepu Printful
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const data = await printful.listProducts({ limit, offset });
    // Printful zwraca { code, result: [...], extra: [], paging: {...} }
    const raw = data.result || [];

    // Mapujemy do uproszczonego shape'a dla frontu.
    // Sync product na poziomie listy nie ma cen — żeby je dostać trzeba osobno
    // pociągnąć /store/products/{id}. Tu zostawiamy price: null i frontend albo robi
    // drugi request albo wyświetla "od ..." po lazy-loadzie.
    const products = raw.map((p) => ({
      id: p.id,
      title: p.name,
      description: '',
      tags: [],
      price: null,                     // wymaga /store/products/{id}
      currency: 'PLN',                 // TODO: konwersja waluty
      image: p.thumbnail_url || null,
      images: p.thumbnail_url ? [p.thumbnail_url] : [],
      variantsCount: p.variants ?? 0,
      synced: p.synced ?? 0,
      visible: p.is_ignored ? false : true,
    }));

    res.json({
      products,
      pagination: {
        limit,
        offset,
        total: data.paging?.total ?? products.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id — pojedynczy sync product (z wariantami i cenami)
router.get('/:id', async (req, res, next) => {
  try {
    const data = await printful.getProduct(req.params.id);
    // { result: { sync_product, sync_variants } }
    const sp = data.result?.sync_product || {};
    const variants = data.result?.sync_variants || [];

    res.json({
      id: sp.id,
      title: sp.name,
      description: '',
      tags: [],
      images: sp.thumbnail_url ? [{ src: sp.thumbnail_url, isDefault: true }] : [],
      variants: variants.map((v) => ({
        id: v.id,
        variantId: v.variant_id,        // Printful catalog variant id (różny od sync id)
        title: v.name,
        price: Math.round(Number(v.retail_price || 0) * 100), // konwersja do groszy/centów
        currency: v.currency,
        sku: v.sku,
        isEnabled: !v.is_ignored,
        isAvailable: !!v.synced,
        options: {
          size: v.size,
          color: v.color,
        },
        files: (v.files || []).map((f) => ({
          type: f.type,
          preview_url: f.preview_url,
          thumbnail_url: f.thumbnail_url,
        })),
      })),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
