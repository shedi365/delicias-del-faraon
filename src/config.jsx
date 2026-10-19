import data from "./data/products.json";

/* ====== CONFIGURACIÓN ====== */
/* Fechas de envío a Caracas: agrega o quita fechas aquí, por ejemplo "Viernes 6 de noviembre" */
export const CARACAS_DATES = [];
export const WA = "https://wa.me/message/NK7U2NGWV533M1";
export const PAY = {
  pm: { name: "Pago Móvil", fields: [["Banco", "Banesco"], ["Cédula", "V-30548067"], ["Teléfono", "0412-1806320"]], hint: "Paga el equivalente en bolívares a la tasa del día." },
  zelle: { name: "Zelle", fields: [["Correo Zelle", "amerwafe05@gmail.com"]], hint: "Envía el monto exacto en dólares." },
  bin: { name: "Binance", fields: [["Correo Binance Pay", "shedinasam05@gmail.com"]], hint: "Envía el monto en USDT por Binance Pay." },
};
/* =========================== */

export const SWEETS = data.sweets;
export const FOODS = data.foods;
export const SCATS = data.sweetCats;
export const FCATS = data.foodCats;
export const ALL = [...SWEETS, ...FOODS];
export const LOGO = "/images/logo.webp";

export const ICONS = {
  pm: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></svg>
  ),
  zelle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 6h10L7 18h10" /><path d="M12 3.5v2.5M12 18v2.5" /></svg>
  ),
  bin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="m12 3 3 3-3 3-3-3 3-3ZM6 9l3 3-3 3-3-3 3-3Zm12 0 3 3-3 3-3-3 3-3Zm-6 6 3 3-3 3-3-3 3-3Z" /></svg>
  ),
};

export const money = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2).replace(".", ","));

/* clave de línea del carrito: canal|id|precio|opciones */
export function lineKey(ch, p, choice) {
  const c = choice[p.id] || {};
  const price = Array.isArray(p.price) ? (c.price ?? p.price[0]) : p.price;
  const opts = (p.opts || []).map((o, i) => c["o" + i] ?? o[1][0]);
  return [ch, p.id, price, opts.join(" / ")].join("|");
}

export function parseKey(k) {
  const [ch, id, price, opts] = k.split("|");
  const p = ALL.find((x) => x.id === id);
  return p ? { ch, p, price: Number(price), opts } : null;
}
