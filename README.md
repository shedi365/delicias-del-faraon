# Delicias del Faraón · Tienda online

Página web de **Delicias del Faraón**, dulces y comida árabe en el CC La Vela, Nivel Sol.

- Animación de entrada con el desierto y las pirámides
- Tres secciones: Dulces, Comida y Envío a Caracas
- Carrito de compras (se guarda en el navegador)
- Pagos por Pago Móvil, Zelle y Binance
- Envío del comprobante de pago por WhatsApp

Instagram: [@deliciasdelfaraon_](https://instagram.com/deliciasdelfaraon_)

## Tecnología

Hecha con [Astro](https://astro.build) y [React](https://react.dev). Se publica en Vercel.

## Estructura

| Ruta | Qué contiene |
| --- | --- |
| `src/config.jsx` | Fechas de envío a Caracas, enlace de WhatsApp y datos de pago |
| `src/data/products.json` | Dulces, comidas y categorías (nombre, precio, foto, opciones) |
| `public/images/` | Fotos de los productos y el logo |
| `src/components/` | Componentes de React (intro, portada, tienda, carrito, pago) |
| `src/styles/global.css` | Estilos |

## Cambiar precios, productos o fechas

- **Precios y productos:** edita `src/data/products.json`.
- **Fechas de envío a Caracas:** edita `CARACAS_DATES` en `src/config.jsx`, por ejemplo `["Viernes 6 de noviembre"]`.
- **Datos de pago o WhatsApp:** edita `PAY` y `WA` en `src/config.jsx`.

Cada vez que subes cambios a GitHub, Vercel publica la nueva versión automáticamente.

## Correr en tu computadora

```bash
npm install
npm run dev
```

Abre http://localhost:4321
