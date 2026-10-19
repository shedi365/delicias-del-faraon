import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CARACAS_DATES, FCATS, FOODS, LOGO, PAY, SCATS, SWEETS, WA, money, parseKey } from "../config.jsx";
import Intro from "./Intro.jsx";
import Portal from "./Portal.jsx";
import ShopView from "./ShopView.jsx";
import CartDrawer from "./CartDrawer.jsx";
import CheckoutModal from "./CheckoutModal.jsx";

const VIEWS = ["dulces", "comida", "caracas"];
const STORAGE_KEY = "ddf-cart2";

function readHash() {
  const [view, sec] = location.hash.slice(1).split("/");
  return { view, sec, n: Date.now() };
}

async function copy(v) {
  try {
    await navigator.clipboard.writeText(v);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement("textarea");
      ta.value = v;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e2) {
      return false;
    }
  }
}

export default function App() {
  const [route, setRoute] = useState({ view: "", sec: undefined, n: 0 });
  const [cart, setCart] = useState({});
  const [ccsDate, setCcsDate] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [choice, setChoice] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState(null);
  const [method, setMethod] = useState(null);
  const [buyer, setBuyer] = useState("");
  const [address, setAddress] = useState("");
  const [toastMsg, setToastMsg] = useState({ text: "", show: false });
  const toastTimer = useRef();
  const badgeRef = useRef(null);
  const prevCount = useRef(null);

  const inShop = VIEWS.includes(route.view);

  /* ---- estado guardado ---- */
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      setCart(s.cart || {});
      if (s.date && CARACAS_DATES.includes(s.date)) setCcsDate(s.date);
    } catch (e) {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, date: ccsDate })); } catch (e) {}
  }, [cart, ccsDate, loaded]);

  const closeAll = useCallback(() => { setDrawerOpen(false); setStep(null); }, []);

  /* ---- navegación ---- */
  useEffect(() => {
    const onHash = () => setRoute(readHash());
    onHash();
    addEventListener("hashchange", onHash);
    const onKey = (e) => { if (e.key === "Escape") closeAll(); };
    addEventListener("keydown", onKey);
    return () => { removeEventListener("hashchange", onHash); removeEventListener("keydown", onKey); };
  }, [closeAll]);

  useEffect(() => {
    if (!route.n) return;
    closeAll();
    if (inShop && route.sec !== undefined) {
      const el = document.getElementById(route.view + "-" + route.sec);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else window.scrollTo(0, 0);
  }, [route]);

  /* ---- carrito ---- */
  const summary = useMemo(() => {
    const keys = Object.keys(cart).filter((k) => cart[k] > 0 && parseKey(k));
    let n = 0, t = 0;
    keys.forEach((k) => { n += cart[k]; t += cart[k] * parseKey(k).price; });
    return { keys, n, t, tienda: keys.filter((k) => k.startsWith("tienda|")), ccs: keys.filter((k) => k.startsWith("caracas|")) };
  }, [cart]);

  useEffect(() => {
    const b = badgeRef.current;
    if (prevCount.current !== null && prevCount.current !== summary.n && b) {
      b.classList.remove("bump");
      void b.offsetWidth;
      b.classList.add("bump");
    }
    prevCount.current = summary.n;
  }, [summary.n]);

  const toast = (text) => {
    setToastMsg({ text, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg((m) => ({ ...m, show: false })), 1600);
  };

  const onInc = (k, fromAdd) => {
    if (k.startsWith("caracas|") && CARACAS_DATES.length && !ccsDate) {
      toast("Primero elige la fecha de envío");
      document.getElementById("dates")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setCart((c) => ({ ...c, [k]: (c[k] || 0) + 1 }));
    if (fromAdd) toast("Agregado al carrito");
  };
  const onDec = (k) => setCart((c) => {
    const next = { ...c, [k]: Math.max(0, (c[k] || 0) - 1) };
    if (!next[k]) delete next[k];
    return next;
  });
  const onRemove = (k) => setCart((c) => { const next = { ...c }; delete next[k]; return next; });

  const ccsLabel = "Envío a Caracas" + (ccsDate ? ", " + ccsDate : ", fecha por confirmar");

  function orderText() {
    const s = summary;
    const ln = (k) => {
      const { p, price, opts } = parseKey(k);
      return `• ${cart[k]} × ${p.name}${opts ? " (" + opts + ")" : ""}${Array.isArray(p.price) ? " (" + money(price) + ")" : ""} = ${money(price * cart[k])}\n`;
    };
    let o = "Hola, Delicias del Faraón. Acabo de hacer este pedido:\n";
    if (s.tienda.length) o += `\nRetiro en CC La Vela:\n` + s.tienda.map(ln).join("");
    if (s.ccs.length) o += `\n${ccsLabel}:\n` + s.ccs.map(ln).join("");
    o += `\nTotal: ${money(s.t)}\nMétodo de pago: ${PAY[method].name}`;
    if (buyer.trim()) o += `\nNombre: ${buyer.trim()}`;
    if (s.ccs.length && address.trim()) o += `\nDirección en Caracas: ${address.trim()}`;
    return o + "\n\nTe envío el capture del comprobante.";
  }

  const cardProps = { choice, setChoice, cart, onInc, onDec };

  const datesBox = (
    <div className="ccs">
      <div className="ccs-box">
        <h2>Fecha de envío</h2>
        <div className="dates" id="dates">
          {CARACAS_DATES.map((d) => (
            <button key={d} className={"date" + (d === ccsDate ? " on" : "")} onClick={() => setCcsDate(d)}>{d}</button>
          ))}
        </div>
        <p className="muted">
          {CARACAS_DATES.length
            ? ccsDate ? "El costo del envío se confirma por WhatsApp." : "Elige una fecha para agregar dulces al envío."
            : "Las próximas fechas se anuncian por Instagram. Puedes armar tu pedido y confirmamos la fecha por WhatsApp."}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Intro />
      <Portal hidden={inShop} />

      <div id="shop" hidden={!inShop}>
        <header className="top">
          <div className="top-in">
            <a className="home" href="#inicio" aria-label="Volver al inicio"><img src={LOGO} alt="" /><span>DELICIAS<br />DEL FARAÓN</span></a>
            <nav className="tabs" aria-label="Secciones">
              <a href="#dulces" className={route.view === "dulces" ? "on" : ""}>Dulces</a>
              <a href="#comida" className={route.view === "comida" ? "on" : ""}>Comida</a>
              <a href="#caracas" className={route.view === "caracas" ? "on" : ""}>Envío a Caracas</a>
            </nav>
            <button className="cart-btn" aria-label="Abrir carrito" onClick={() => setDrawerOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
              <span className="lbl">Carrito</span> <span className="badge" ref={badgeRef}>{summary.n}</span>
            </button>
          </div>
        </header>

        <ShopView id="dulces" title="Dulces" intro="Para comer en la tienda o retirar en CC La Vela, Nivel Sol." catsLabel="Categorías de dulces"
          cats={SCATS} items={SWEETS} ch="tienda" hidden={route.view !== "dulces"} {...cardProps} />
        <ShopView id="comida" title="Comida" intro="Shawarmas, combos y platos árabes." catsLabel="Categorías de comida"
          cats={FCATS} items={FOODS} ch="tienda" hidden={route.view !== "comida"} {...cardProps} />
        <ShopView id="caracas" title="Envío a Caracas" intro="Enviamos dulces a Caracas solo en fechas específicas. Elige la fecha y arma tu pedido." catsLabel="Categorías de dulces para Caracas"
          cats={SCATS} items={SWEETS} ch="caracas" hidden={route.view !== "caracas"} before={datesBox} {...cardProps} />

        <footer>
          <img src={LOGO} alt="" />
          <div>Delicias del Faraón, CC La Vela, Nivel Sol</div>
          <div><a href="https://instagram.com/deliciasdelfaraon_" target="_blank" rel="noopener">Instagram @deliciasdelfaraon_</a> · <a href="tel:+584222223002">0422-2223002</a></div>
          <div><a href="#inicio">Volver al inicio</a></div>
        </footer>
      </div>

      <div className={"float" + (summary.n > 0 && inShop ? " show" : "")}>
        <button className="btn" onClick={() => setDrawerOpen(true)}>
          <span>{summary.n ? `Ver carrito (${summary.n})` : "Ver carrito"}</span><span>{money(summary.t)}</span>
        </button>
      </div>
      <div className={"scrim" + (drawerOpen || step ? " open" : "")} onClick={closeAll}></div>

      <CartDrawer open={drawerOpen} cart={cart} summary={summary} ccsLabel={ccsLabel}
        onInc={onInc} onDec={onDec} onRemove={onRemove} onClose={closeAll}
        onBuy={() => { setDrawerOpen(false); setMethod(null); setStep(1); }} />

      <CheckoutModal step={step} setStep={setStep} summary={summary} method={method} setMethod={setMethod}
        buyer={buyer} setBuyer={setBuyer} address={address} setAddress={setAddress} orderText={orderText} copy={copy}
        onBackToCart={() => { setStep(null); setDrawerOpen(true); }}
        onDone={() => { setCart({}); setMethod(null); setStep("thanks"); }}
        onClose={closeAll}
        onOpenWa={async (txt) => {
          const ok = await copy(txt);
          toast(ok ? "Pedido copiado" : "No se pudo copiar; escríbelo en el chat");
          window.open(WA, "_blank", "noopener");
        }} />

      <div className={"toast" + (toastMsg.show ? " show" : "")}>{toastMsg.text}</div>
    </>
  );
}
