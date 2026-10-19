import { money, parseKey } from "../config.jsx";

export default function CartDrawer({ open, cart, summary, ccsLabel, onInc, onDec, onRemove, onClose, onBuy }) {
  const s = summary;
  const both = s.tienda.length && s.ccs.length;

  const row = (k) => {
    const { p, price, opts } = parseKey(k);
    return (
      <div className="line" key={k}>
        <img className={p.cut ? "cut" : ""} src={p.img} alt="" />
        <div>
          <h4>{p.name}</h4>
          <small>{opts && <>{opts}<br /></>}{money(price)} c/u · {money(price * cart[k])}</small>
          <br />
          <button className="rm" onClick={() => onRemove(k)}>Quitar</button>
        </div>
        <div className="stepper">
          <button onClick={() => onDec(k)} aria-label="Quitar uno">−</button>
          <span>{cart[k]}</span>
          <button onClick={() => onInc(k)} aria-label="Agregar uno">+</button>
        </div>
      </div>
    );
  };

  return (
    <aside className={"drawer" + (open ? " open" : "")} aria-label="Carrito" aria-hidden={!open}>
      <div className="d-head"><h2>Tu pedido</h2><button className="x" onClick={onClose} aria-label="Cerrar">×</button></div>
      <div className="d-body">
        {s.n ? (
          <>
            {s.tienda.length > 0 && <>{both ? <div className="group">Retiro en CC La Vela</div> : null}{s.tienda.map(row)}</>}
            {s.ccs.length > 0 && <><div className="group">{ccsLabel}</div>{s.ccs.map(row)}</>}
          </>
        ) : (
          <div className="empty"><p>Tu carrito está vacío.</p><button className="btn ghost" onClick={onClose}>Seguir viendo</button></div>
        )}
      </div>
      <div className="d-foot" style={{ display: s.n ? "" : "none" }}>
        <div className="total"><span>Total</span><b>{money(s.t)}</b></div>
        <button className="btn block" onClick={onBuy}>Comprar</button>
      </div>
    </aside>
  );
}
