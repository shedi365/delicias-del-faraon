import { useEffect, useRef } from "react";
import { lineKey, money } from "../config.jsx";

function Stepper({ k, q, onInc, onDec }) {
  return (
    <div className="stepper">
      <button onClick={() => onDec(k)} aria-label="Quitar uno">−</button>
      <span>{q}</span>
      <button onClick={() => onInc(k)} aria-label="Agregar uno">+</button>
    </div>
  );
}

export function ProductCard({ p, ch, choice, setChoice, cart, onInc, onDec }) {
  const c = choice[p.id] || {};
  const k = lineKey(ch, p, choice);
  const price = Number(k.split("|")[2]);
  const q = cart[k] || 0;
  const pick = (field, value) => setChoice((prev) => ({ ...prev, [p.id]: { ...(prev[p.id] || {}), [field]: value } }));

  return (
    <article className="card">
      <div className={"ph" + (p.cut ? " cut" : "")}><img loading="lazy" src={p.img} alt={p.name} /></div>
      <div className="body">
        <h3>{p.name}</h3>
        {p.desc && <p className="desc">{p.desc}</p>}
        {Array.isArray(p.price) && (
          <div className="opt">
            <small>Presentación</small>
            <div className="sizes">
              {p.price.map((v) => (
                <button key={v} className={"size" + (v === price ? " on" : "")} onClick={() => pick("price", v)}>{money(v)}</button>
              ))}
            </div>
          </div>
        )}
        {(p.opts || []).map((o, i) => (
          <div className="opt" key={o[0]}>
            <small>{o[0]}</small>
            <div className="sizes">
              {o[1].map((v) => (
                <button key={v} className={"size" + ((c["o" + i] ?? o[1][0]) === v ? " on" : "")} onClick={() => pick("o" + i, v)}>{v}</button>
              ))}
            </div>
          </div>
        ))}
        <div className="row">
          <span className="price">{money(price)}</span>
          <span className="ctl">
            {q ? <Stepper k={k} q={q} onInc={onInc} onDec={onDec} /> : <button className="add" onClick={() => onInc(k, true)}>Agregar</button>}
          </span>
        </div>
      </div>
    </article>
  );
}

/* Una vista de la tienda (Dulces, Comida o Envío a Caracas) */
export default function ShopView({ id, title, intro, catsLabel, cats, items, ch, hidden, before, ...cardProps }) {
  const wrapRef = useRef(null);
  const mainRef = useRef(null);

  // resalta la categoría visible al hacer scroll
  useEffect(() => {
    const wrap = wrapRef.current;
    const chips = wrap.querySelectorAll(".chip");
    const io = new IntersectionObserver(
      (es) => es.forEach((en) => {
        if (!en.isIntersecting) return;
        const i = en.target.id.split("-").pop();
        chips.forEach((c) => {
          const on = c.dataset.i === i;
          c.classList.toggle("on", on);
          if (on) wrap.scrollTo({ left: wrap.scrollLeft + c.getBoundingClientRect().left - wrap.getBoundingClientRect().left - (wrap.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
        });
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    mainRef.current.querySelectorAll("section.cat").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="view" id={"v-" + id} hidden={hidden}>
      <div className="vhead"><h1>{title}</h1><p>{intro}</p></div>
      {before}
      <nav className="cats" aria-label={catsLabel}>
        <div className="cats-in" ref={wrapRef}>
          {cats.map((c, i) => <a key={c} className="chip" href={`#${id}/${i}`} data-i={i}>{c}</a>)}
        </div>
      </nav>
      <main ref={mainRef}>
        {cats.map((c, i) => (
          <section className="cat" id={`${id}-${i}`} key={c}>
            <div className="cat-head"><h2>{c}</h2></div>
            <div className="grid">
              {items.filter((p) => p.cat === c).map((p) => <ProductCard key={p.id} p={p} ch={ch} {...cardProps} />)}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
