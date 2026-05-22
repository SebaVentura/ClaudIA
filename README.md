# ClaudIA Educación Digital

Landing React/Vite + API Node.js/Express. Catálogo, carrito y checkout Mercado Pago (sandbox).

## Estructura

- `web/` — frontend
- `server/` — backend (único)

## Variables de entorno

**Backend** — copiar `server/.env.example` → `server/.env` (no commitear):

```env
PORT=3000
APP_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
PRODUCTS_PATH=./data/products.json
ORDERS_PATH=./storage/orders.json
MP_ACCESS_TOKEN=TU_TOKEN_DE_PRUEBA
MP_ENV=sandbox
```

**Frontend** — copiar `web/.env.example` → `web/.env` o `web/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

Catálogo y precios: `server/data/products.json`. Órdenes: `server/storage/orders.json` (gitignored).

---

## Desarrollo local

### Backend (Node)

```bash
cd server
npm install
npm run dev
```

http://127.0.0.1:3000

Health debe responder `"runtime": "node"`.

### Frontend

```bash
cd web
npm install
npm run dev
```

http://localhost:5173

### Pruebas rápidas

```bash
curl http://127.0.0.1:3000/api/health
curl http://127.0.0.1:3000/api/products
curl -X POST http://127.0.0.1:3000/api/webhooks/mercadopago
```

### Checkout

1. `MP_ACCESS_TOKEN` en `server/.env` (sandbox).
2. Carrito → **Pagar con Mercado Pago** → redirección a Checkout Pro.
3. Vuelta: `/gracias?orderId=...&status=...`

---

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Healthcheck |
| GET | `/api/products` | Catálogo activo |
| POST | `/api/checkout/create-preference` | Checkout MP |
| POST/GET | `/api/webhooks/mercadopago` | Webhook pagos |
| GET | `/api/orders/:orderId/status` | Estado del pedido |

---

## Pendiente

Email post-pago, descarga segura de PDFs, verificación firma webhook MP en producción.
