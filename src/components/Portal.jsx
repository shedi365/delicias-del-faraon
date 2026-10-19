import { LOGO, SWEETS } from "../config.jsx";

const rays = Array.from({ length: 72 }, (_, i) => {
  const a = (i * 5 * Math.PI) / 180, l = i % 2 ? 6 : 12, r1 = 86, r2 = r1 + l;
  return { x1: 100 + r1 * Math.cos(a), y1: 100 + r1 * Math.sin(a), x2: 100 + r2 * Math.cos(a), y2: 100 + r2 * Math.sin(a), w: i % 2 ? 0.5 : 0.8 };
});

/* Portada con las tres puertas */
export default function Portal({ hidden }) {
  return (
    <section className="portal" id="portal" hidden={hidden}>
      <div className="medal">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          {rays.map((r, i) => <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="currentColor" strokeWidth={r.w} />)}
          <circle cx="100" cy="100" r="99" fill="none" stroke="currentColor" strokeWidth=".4" />
        </svg>
        <div className="ring"><img src={LOGO} alt="Delicias del Faraón" /></div>
      </div>
      <h1>DELICIAS<br />DEL FARAÓN</h1>
      <p className="lead">Dulces y comida árabe hechos en casa</p>
      <div className="tri" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <nav className="doors" aria-label="Elige una opción">
        <a className="door" href="#dulces"><div className="pic"><img src={SWEETS[0].img} alt="" /></div><b>Dulces</b><small>Baklawa, nidos, canolis y más</small></a>
        <a className="door" href="#comida"><div className="pic"><img src="/images/door-comida.webp" alt="" /></div><b>Comida</b><small>Shawarmas, combos y platos</small></a>
        <a className="door" href="#caracas"><div className="pic"><img src={SWEETS[SWEETS.length - 1].img} alt="" /></div><b>Envío a Caracas</b><small>Dulces en fechas específicas</small></a>
      </nav>
      <div className="where">
        <span>CC La Vela, Nivel Sol</span>
        <a href="https://instagram.com/deliciasdelfaraon_" target="_blank" rel="noopener">@deliciasdelfaraon_</a>
        <a href="tel:+584222223002">0422-2223002</a>
      </div>
    </section>
  );
}
