# mrmax store

Sklep z koszulkami z drukiem na żądanie — Printify POD, Vite+React frontend, Express backend, deploy na Vercel.

## Stack

- **Frontend:** Vite + React 18 + react-router-dom v6 (`frontend/`)
- **Backend:** Express jako Vercel Function (`api/index.js` → `backend/src/server.js`)
- **POD:** Printful API (https://developers.printful.com/) — store: **Mr.Max Store** (id 18222128)
- **Hosting:** Vercel
- **Płatności (planowane):** Stripe

## Szybki start

```bash
# 1. Skopiuj env i wpisz tokeny
cp .env.example .env

# 2. Zainstaluj zależności (root + frontend + backend)
npm run install:all

# 3. Uruchom dev (równolegle frontend + backend)
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:4000

## Struktura

```
mrmax_store/
├── api/                    # Vercel function entry
│   └── index.js            # → przekazuje do backend/src/server.js
├── backend/
│   └── src/
│       ├── server.js       # Express app
│       ├── routes/
│       │   ├── products.js # GET /api/products, /api/products/:id
│       │   ├── orders.js   # POST /api/orders, /api/orders/:id/confirm
│       │   └── webhook.js  # POST /api/webhook (Printful callbacks)
│       └── services/
│           └── printful.js # Printful API client
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx         # Router
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Catalog.jsx
│   │   │   ├── Product.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── Checkout.jsx
│   │   ├── components/
│   │   │   ├── TopBar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── CartDrawer.jsx
│   │   ├── contexts/
│   │   │   ├── CartContext.jsx
│   │   │   └── ShopContext.jsx
│   │   ├── api/
│   │   │   └── client.js   # fetch wrapper
│   │   └── styles/
│   │       └── global.css  # claymorphism design tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── vercel.json
├── package.json
└── .env.example
```

## Deploy na Vercel

1. Push na GitHub
2. Import w Vercel
3. Ustaw env vars w Project Settings → Environment Variables (te z `.env.example`)
4. Auto-deploy na każdy push na main

> ⚠️ Vercel functions mają cold-start; Printful API ma rate-limit 120 req/min na token — w `backend/src/services/printful.js` jest cache 60s na listę produktów.

## Konwencje

- **Stan globalny:** `CartContext` (koszyk), `ShopContext` (lista produktów, currency)
- **Styl 3D:** Stylized Claymorphism — obłe kształty, żywe kolory, matowe tekstury (CSS variables w `global.css`)
- **Kolory bazowe:** `#4e4d76` zamiast czarnego
- **Czcionki:** Display = Baloo 2, Body = Nunito

## TODO (po podstawach)

- [ ] Mockup od użytkownika → ostateczny design Home/Product
- [ ] Stripe checkout integracja (płatność PRZED `POST /api/orders/:id/confirm`)
- [ ] Webhooks Printful → aktualizacja statusu zamówienia (skonfiguruj URL z `?token=...`)
- [ ] Admin panel (lista zamówień)
- [ ] i18n (PL/EN)
