import { useEffect, useRef, useState } from "react";
import { LOGO } from "../config.jsx";

/* Animación de entrada: desierto con pirámides */
export default function Intro() {
  const [show, setShow] = useState(true);
  const [go, setGo] = useState(false);
  const [particles, setParticles] = useState({ stars: [], sand: [] });
  const ref = useRef(null);
  const svgRef = useRef(null);
  const gone = useRef(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("skip-intro")) {
      setShow(false);
      return;
    }
    document.body.classList.add("locked");
    setParticles({
      stars: Array.from({ length: 90 }, () => ({
        cx: Math.random() * 3000 - 1000, cy: Math.random() * 560 - 200, r: Math.random() * 1.6 + 0.4, delay: Math.random() * 3,
      })),
      sand: Array.from({ length: 60 }, () => ({
        cx: -900 - Math.random() * 300, cy: 780 + Math.random() * 210, r: Math.random() * 2 + 0.6, dur: 7 + Math.random() * 7, delay: -Math.random() * 12,
      })),
    });
    const svg = svgRef.current;
    const fit = () => {
      const ar = innerWidth / innerHeight;
      if (ar > 0.9) {
        const h = 1200, w = h * ar;
        svg.setAttribute("viewBox", `${500 - w / 2} -200 ${w} ${h}`);
      } else svg.setAttribute("viewBox", "0 0 1000 1000");
    };
    fit();
    addEventListener("resize", fit);
    ref.current?.focus({ preventScroll: true });
    return () => removeEventListener("resize", fit);
  }, []);

  function enter() {
    if (gone.current) return;
    gone.current = true;
    const svg = svgRef.current;
    try {
      const pt = svg.createSVGPoint();
      pt.x = 520; pt.y = 600;
      const q = pt.matrixTransform(svg.getScreenCTM());
      svg.style.transformOrigin = `${q.x}px ${q.y}px`;
    } catch (e) {}
    setGo(true);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      setShow(false);
      document.body.classList.remove("locked");
    }, reduce ? 50 : 1500);
  }

  if (!show) return null;

  return (
    <div
      id="intro"
      ref={ref}
      className={go ? "go" : ""}
      role="button"
      tabIndex={0}
      aria-label="Entrar a Delicias del Faraón"
      onClick={enter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(); }
      }}
    >
      <svg ref={svgRef} className="scene" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky" gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="800">
            <stop offset="0" stopColor="#2A2142" /><stop offset=".38" stopColor="#6E3F63" />
            <stop offset=".6" stopColor="#D2784F" /><stop offset=".76" stopColor="#F3B866" /><stop offset="1" stopColor="#F7D58E" />
          </linearGradient>
          <radialGradient id="sunGlow"><stop offset="0" stopColor="#FFE7A6" stopOpacity=".95" /><stop offset=".35" stopColor="#FFC56B" stopOpacity=".55" /><stop offset="1" stopColor="#FF9E5A" stopOpacity="0" /></radialGradient>
          <linearGradient id="lit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F2C57A" /><stop offset="1" stopColor="#C98F45" /></linearGradient>
          <linearGradient id="shade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8E5A33" /><stop offset="1" stopColor="#5E3A24" /></linearGradient>
          <linearGradient id="dune1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E2A865" /><stop offset="1" stopColor="#C98B4C" /></linearGradient>
          <linearGradient id="dune2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0C482" /><stop offset="1" stopColor="#D9A160" /></linearGradient>
          <linearGradient id="dune3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6D9A2" /><stop offset="1" stopColor="#E7B977" /></linearGradient>
        </defs>
        <rect x="-1500" y="-700" width="4000" height="1800" fill="url(#sky)" />
        <g className="stars" fill="#FFF4DA">
          {particles.stars.map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r={s.r} style={{ animationDelay: s.delay + "s" }} />)}
        </g>
        <g className="sun"><circle cx="668" cy="640" r="250" fill="url(#sunGlow)" /><circle cx="668" cy="640" r="66" fill="#FFE2A0" /></g>
        <g className="far">
          <path d="M-1500 735 L0 735 C150 715 260 728 420 722 S760 712 1000 728 L2500 728 V1200 H-1500Z" fill="#D49456" opacity=".75" />
        </g>
        <g className="pyr">
          <polygon points="250,575 130,760 285,760" fill="url(#lit)" /><polygon points="250,575 285,760 372,760" fill="url(#shade)" />
          <polygon points="835,640 772,760 848,760" fill="url(#lit)" /><polygon points="835,640 848,760 905,760" fill="url(#shade)" />
          <polygon points="520,400 290,770 575,770" fill="url(#lit)" /><polygon points="520,400 575,770 770,770" fill="url(#shade)" />
          <g stroke="#7A4B2A" strokeOpacity=".22" strokeWidth="2">
            <line x1="482" y1="461" x2="532" y2="461" /><line x1="447" y1="517" x2="537" y2="517" /><line x1="412" y1="573" x2="543" y2="573" /><line x1="377" y1="629" x2="549" y2="629" /><line x1="342" y1="686" x2="562" y2="686" />
          </g>
          <polygon className="cap" points="520,400 503,428 525,428" fill="#FFF0B8" />
          <circle className="glint" cx="520" cy="402" r="5" fill="#FFFBE8" />
        </g>
        <g className="mid"><path d="M-1500 790 L-40 790 C120 745 260 770 380 785 S640 760 760 772 S940 790 1040 770 L2500 770 V1200 H-1500Z" fill="url(#dune1)" /></g>
        <g className="near">
          <path d="M-1500 865 L-60 865 C100 815 260 830 430 860 S760 820 1060 850 L2500 850 V1200 H-1500Z" fill="url(#dune2)" />
          <path d="M-60 865 C100 815 260 830 430 860" fill="none" stroke="#FBE3B4" strokeWidth="3" opacity=".7" />
        </g>
        <g className="front"><path d="M-1500 950 L-60 950 C140 900 360 915 520 940 S840 905 1060 930 L2500 930 V1200 H-1500Z" fill="url(#dune3)" /></g>
        <g className="wind" stroke="#FFF1D2" strokeLinecap="round" fill="none" opacity=".55">
          <path d="M-900 820 h180" /><path d="M-960 880 h120" /><path d="M-860 905 h220" />
        </g>
        <g className="sand" fill="#FFF0CF">
          {particles.sand.map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r={s.r} style={{ animationDuration: s.dur + "s", animationDelay: s.delay + "s" }} />)}
        </g>
      </svg>
      <div className="intro-ui">
        <img className="intro-logo" src={LOGO} alt="" />
        <h2>DELICIAS<br />DEL FARAÓN</h2>
        <div className="tap"><span className="pulse"></span>Toca para entrar</div>
      </div>
    </div>
  );
}
