# Portal de Dotaciones (Angular)

Migración de la página HTML "Portal de Dotaciones" a Angular 22 (standalone components + signals).

## Cómo correrlo
Requiere **Node 22.22.3 o superior** (`node -v`).

```bash
npm install
npm start          # http://localhost:4200
npm run build      # build de producción en dist/
```

## Estructura
```
src/app/
├── models/        # Interfaces: Product, Addon, CartItem, ClientData, ExchangeRateResponse
├── services/
│   ├── product.service.ts        # MOCK: lee public/data/products.json con HttpClient
│   ├── cart.service.ts           # Estado de la cotización (signals)
│   ├── quote-pdf.service.ts      # Genera el PDF (jsPDF, carga lazy)
│   └── exchange-rate.service.ts  # API EXTERNA (bonus): USD/COP de open.er-api.com
├── pipes/cop.pipe.ts             # 65000 -> $65.000
├── components/    # header, footer, hero, process, product-card, garment-svg
└── pages/         # home, product-detail (ruta dinámica), quote, not-found
```

## Rutas
| Ruta | Componente |
|---|---|
| `/` | Home (hero + catálogo + proceso) |
| `/producto/:id` | ProductDetail — **ruta dinámica** (`camisa`, `pantalon`) |
| `/cotizador` | Quote |
| `**` | NotFound |
