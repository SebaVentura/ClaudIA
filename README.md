# ClaudIA Educación Digital

Landing, catálogo por API, carrito y checkout Mercado Pago (Fase 4).

## Variables de entorno

**Backend** — copiar `api/.env.example` → `api/.env` (no commitear):

```env
APP_URL=http://localhost:5173
API_URL=http://localhost:8000
CORS_ORIGINS=http://localhost:5173
MP_ACCESS_TOKEN=TU_TOKEN_DE_PRUEBA
MP_ENV=sandbox
```

**Frontend** — copiar `web/.env.example` → `web/.env`:

```env
VITE_API_URL=http://localhost:8000
```

El catálogo y los precios salen solo de `api/data/products.json`.

---

## Fase 4 — Prueba local

### Backend

```bash
cd C:\proyectos\ClaudIA\api
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --log-level debug
```

Al arrancar debe verse en consola (sin mostrar el token):

```
INFO MP_ACCESS_TOKEN loaded: yes
INFO APP_URL: http://localhost:5173
INFO MP_ENV: sandbox
```

### Frontend

```bash
cd C:\proyectos\ClaudIA\web
npm run dev
```

http://localhost:5173

### Health y catálogo

```bash
curl.exe -v --max-time 5 http://127.0.0.1:8000/api/health
curl.exe -v --max-time 5 http://127.0.0.1:8000/api/products
```

### Create-preference (con token en api/.env)

```bash
curl.exe -X POST http://127.0.0.1:8000/api/checkout/create-preference ^
  -H "Content-Type: application/json" ^
  -d "{\"items\":[{\"productId\":\"geo-tangram-inicial\",\"quantity\":1}]}"
```

Respuesta esperada: `orderId`, `preferenceId`, `initPoint`.

### Si el puerto 8000 está ocupado

```bash
netstat -ano | findstr :8000
taskkill /PID NUMERO_PID /F
```

### Flujo manual

1. Crear `api/.env` con `MP_ACCESS_TOKEN` de prueba (sandbox).
2. Reiniciar backend.
3. Agregar ebook al carrito → **Pagar con Mercado Pago**.
4. Redirección a Checkout Pro de Mercado Pago.
5. Al volver: `/gracias?orderId=...&status=...`

Sin `MP_ACCESS_TOKEN` → error: *Mercado Pago no está configurado en el backend*.

---

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Healthcheck |
| GET | `/api/products` | Catálogo activo |
| POST | `/api/checkout/create-preference` | Checkout MP |

Pedidos pending: `api/storage/orders.json` (gitignored).

---

## Pendiente Fase 5

Webhook MP, confirmación de pago, email, descarga segura de PDFs.
