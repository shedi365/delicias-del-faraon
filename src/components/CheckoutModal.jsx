import { useEffect, useRef } from "react";
import { ICONS, PAY, money } from "../config.jsx";

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
);

function CopyButton({ value, copy }) {
  return (
    <button
      className="copy"
      onClick={async (e) => {
        const btn = e.currentTarget;
        const ok = await copy(value);
        btn.textContent = ok ? "Copiado" : "Copia manual";
        btn.classList.toggle("done", ok);
        setTimeout(() => { btn.textContent = "Copiar"; btn.classList.remove("done"); }, 1600);
      }}
    >Copiar</button>
  );
}

/* Pasos de compra: 1 = método de pago, 2 = enviar comprobante, "thanks" = gracias */
export default function CheckoutModal({ step, setStep, summary, method, setMethod, buyer, setBuyer, address, setAddress, orderText, copy, onBackToCart, onDone, onClose, onOpenWa }) {
  const s = summary;
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [step]);
  let content = null;

  if (step === 1) {
    const m = method && PAY[method];
    content = (
      <>
        <div className="steps"><span className="on">1. Método de pago</span><span>2. Enviar comprobante</span></div>
        <h2 id="mTitle">¿Cómo quieres pagar?</h2>
        <div className="methods">
          {Object.keys(PAY).map((k) => (
            <button key={k} className={"method" + (method === k ? " on" : "")} onClick={() => setMethod(k)}>{ICONS[k]}{PAY[k].name}</button>
          ))}
        </div>
        <div>
          {m ? (
            <>
              <div className="pay">
                {m.fields.map(([l, v]) => (
                  <div className="f" key={l}><div><small>{l}</small><strong>{v}</strong></div><CopyButton value={v} copy={copy} /></div>
                ))}
              </div>
              <p className="hint" style={{ marginTop: 10 }}>{m.hint}</p>
            </>
          ) : (
            <p className="hint">Elige un método para ver los datos de pago.</p>
          )}
        </div>
        <div className="amount"><span>Total a pagar</span><b>{money(s.t)}</b></div>
        {s.ccs.length > 0 && <p className="hint">Tu pedido incluye envío a Caracas. El costo del envío se confirma por WhatsApp.</p>}
        <label className="fld">Tu nombre<input value={buyer} onChange={(e) => setBuyer(e.target.value)} autoComplete="name" /></label>
        {s.ccs.length > 0 && (
          <label className="fld">Dirección de entrega en Caracas<input value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" /></label>
        )}
        <button className="btn block" disabled={!method} style={method ? undefined : { opacity: 0.5 }} onClick={() => method && setStep(2)}>Ya pagué</button>
        <button className="btn ghost block" onClick={onBackToCart}>Volver al carrito</button>
      </>
    );
  } else if (step === 2) {
    const txt = orderText();
    content = (
      <>
        <div className="steps"><span className="on">1. Método de pago</span><span className="on">2. Enviar comprobante</span></div>
        <h2 id="mTitle">Envía tu comprobante</h2>
        <p className="hint">Copia el resumen de tu pedido, abre WhatsApp, pégalo en el chat y adjunta el capture del pago. Te confirmamos por ahí.</p>
        <div className="pay" style={{ padding: "14px 16px", whiteSpace: "pre-wrap", fontSize: 16, lineHeight: 1.45 }}>{txt}</div>
        <button className="btn wa block" onClick={() => onOpenWa(txt)}>{WA_ICON}Copiar pedido y abrir WhatsApp</button>
        <button className="btn ghost block" onClick={onDone}>Listo, ya lo envié</button>
        <button className="btn ghost block" onClick={() => setStep(1)}>Volver a los datos de pago</button>
      </>
    );
  } else if (step === "thanks") {
    content = (
      <>
        <h2 id="mTitle">¡Gracias por tu compra!</h2>
        <p className="hint">Revisaremos tu comprobante y te escribiremos por WhatsApp para coordinar la entrega.</p>
        <button className="btn block" onClick={onClose}>Seguir viendo</button>
      </>
    );
  }

  return (
    <div ref={ref} className={"modal" + (step ? " open" : "")} role="dialog" aria-modal="true" aria-labelledby="mTitle">
      <div className="m-in">{content}</div>
    </div>
  );
}
