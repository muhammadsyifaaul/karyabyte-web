/**
 * ProjectPreviews — crisp SVG architectural / UI wireframe previews
 * One per case study, rendered at 100% width inside the card thumbnail.
 */

/* ── 1. Enterprise ERP — distributed microservice node graph ── */
export function ErpPreview() {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="400" height="220" fill="#0a0a0d" />
      {/* Grid */}
      {[0,40,80,120,160,200].map(y => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      ))}
      {[0,50,100,150,200,250,300,350,400].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="220" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      ))}
      {/* Nodes */}
      {[
        {x:60,  y:60,  label:"API GW",  color:"#E4E4E7"},
        {x:200, y:40,  label:"Auth",    color:"#A1A1AA"},
        {x:340, y:60,  label:"CDN",     color:"#A1A1AA"},
        {x:60,  y:150, label:"Orders",  color:"#E4E4E7"},
        {x:200, y:130, label:"Inventory",color:"#E4E4E7"},
        {x:340, y:150, label:"Reports", color:"#A1A1AA"},
        {x:200, y:200, label:"DB Pool", color:"#636369"},
      ].map(n => (
        <g key={n.label}>
          <rect x={n.x-32} y={n.y-16} width="64" height="32" rx="6"
            fill="rgba(255,255,255,0.04)" stroke={n.color} strokeWidth="1" strokeOpacity="0.4"/>
          <text x={n.x} y={n.y+5} textAnchor="middle" fill={n.color}
            fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.9">{n.label}</text>
        </g>
      ))}
      {/* Edges */}
      {[
        [60,60, 200,40],[60,60, 60,150],[200,40, 340,60],
        [200,40, 200,130],[340,60, 340,150],[60,150, 200,130],
        [200,130, 340,150],[60,150, 200,200],[200,130, 200,200],[340,150, 200,200],
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(228,228,231,0.12)" strokeWidth="1" strokeDasharray="3 4"/>
      ))}
      {/* SQS event bus indicator */}
      <ellipse cx="200" cy="200" rx="18" ry="8" fill="none" stroke="#E4E4E7" strokeWidth="0.5" strokeOpacity="0.3"/>
      {/* Labels */}
      <text x="8" y="12" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="JetBrains Mono, monospace">
        MICROSERVICE TOPOLOGY · AWS ECS
      </text>
    </svg>
  );
}

/* ── 2. Fintech — mobile UI frame + yield curve ── */
export function FintechPreview() {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="400" height="220" fill="#09090c"/>
      {/* Mobile frame */}
      <rect x="140" y="15" width="120" height="195" rx="14"
        fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      {/* Notch */}
      <rect x="175" y="20" width="50" height="8" rx="4" fill="rgba(255,255,255,0.08)"/>
      {/* Screen content */}
      <rect x="150" y="38" width="100" height="14" rx="3" fill="rgba(255,255,255,0.06)"/>
      <rect x="155" y="58" width="90" height="28" rx="6" fill="rgba(228,228,231,0.07)" stroke="rgba(228,228,231,0.1)" strokeWidth="0.5"/>
      <text x="200" y="68" textAnchor="middle" fill="#E4E4E7" fontSize="8" fontFamily="JetBrains Mono, monospace">IDR 128,450,000</text>
      <text x="200" y="80" textAnchor="middle" fill="#A1A1AA" fontSize="7" fontFamily="JetBrains Mono, monospace">+12.4% this month</text>
      {/* Mini chart in screen */}
      <polyline points="152,130 165,118 178,122 191,108 204,112 217,100 230,104 243,96 248,98"
        stroke="#E4E4E7" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M152,130 165,118 178,122 191,108 204,112 217,100 230,104 243,96 248,98 248,135 152,135Z"
        fill="rgba(228,228,231,0.04)"/>
      {/* Nav pills */}
      {[155,175,195,215,235].map((x,i) => (
        <rect key={i} x={x} y="175" width="12" height="4" rx="2"
          fill={i===2 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)"}/>
      ))}
      {/* KYC flow steps on left */}
      {["Research","Wireframe","Prototype","Test","Ship"].map((s,i) => (
        <g key={s}>
          <circle cx="40" cy={40+i*34} r="10" fill="rgba(255,255,255,0.04)"
            stroke={i<3 ? "rgba(228,228,231,0.5)":"rgba(255,255,255,0.1)"} strokeWidth="1"/>
          <text x="40" y={40+i*34+4} textAnchor="middle" fill={i<3?"#E4E4E7":"#636369"}
            fontSize="7" fontFamily="JetBrains Mono, monospace">{String(i+1).padStart(2,"0")}</text>
          <text x="58" y={40+i*34+4} fill={i<3?"#A1A1AA":"#636369"}
            fontSize="8" fontFamily="Plus Jakarta Sans, sans-serif">{s}</text>
          {i < 4 && <line x1="40" y1={50+i*34} x2="40" y2={62+i*34} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>}
        </g>
      ))}
      <text x="8" y="12" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="JetBrains Mono, monospace">
        MOBILE UI · ONBOARDING FLOW
      </text>
    </svg>
  );
}

/* ── 3. PPOB — 3-tier approval workflow diagram ── */
export function PpobPreview() {
  /*
   * Layout: left-to-right workflow chain across the top 72% of canvas.
   * Bottom 28% (y ≥ 158) intentionally empty — reserved for card badges.
   *
   * Tiers:
   *   Field Agent  →  Supervisor Gate  →  Finance Ledger  →  Audit Log
   *   x=46          x=142               x=238               x=334
   * All tier boxes: y=48, height=44  (bottom edge y=92 — well clear of 158)
   */
  const tiers = [
    { x: 46,  label: "Field Agent",    sub: "Sales Entry",   color: "#A1A1AA", icon: "FA" },
    { x: 142, label: "Supervisor",     sub: "Gate Review",   color: "#E4E4E7", icon: "SG" },
    { x: 238, label: "Finance Ledger", sub: "Settlement",    color: "#E4E4E7", icon: "FL" },
    { x: 334, label: "Audit Log",      sub: "Immutable",     color: "#6ee7b7", icon: "AL" },
  ];
  const boxW = 72; const boxH = 44; const boxY = 48;

  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="400" height="220" fill="#09090c" />

      {/* Subtle grid — full canvas */}
      {[0, 40, 80, 120].map(y => (
        <line key={`gy${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
      ))}
      {[0, 80, 160, 240, 320, 400].map(x => (
        <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="155" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
      ))}

      {/* ── State-transition connector line ── */}
      {tiers.slice(0, 3).map((t, i) => {
        const x1 = t.x + boxW;
        const x2 = tiers[i + 1].x;
        const cy = boxY + boxH / 2;
        return (
          <g key={`conn${i}`}>
            <line x1={x1} y1={cy} x2={x2} y2={cy}
              stroke="rgba(228,228,231,0.18)" strokeWidth="1" strokeDasharray="4 3" />
            {/* Arrowhead */}
            <polygon
              points={`${x2},${cy} ${x2 - 5},${cy - 3} ${x2 - 5},${cy + 3}`}
              fill="rgba(228,228,231,0.35)" />
          </g>
        );
      })}

      {/* ── Tier boxes ── */}
      {tiers.map((t) => (
        <g key={t.label}>
          <rect x={t.x} y={boxY} width={boxW} height={boxH} rx="7"
            fill="rgba(255,255,255,0.04)"
            stroke={t.color} strokeWidth={t.label === "Audit Log" ? "1.2" : "0.8"}
            strokeOpacity="0.5" />
          {/* Monogram badge */}
          <rect x={t.x + 6} y={boxY + 6} width={16} height={16} rx="4"
            fill={`${t.color}18`} stroke={t.color} strokeWidth="0.5" strokeOpacity="0.4" />
          <text x={t.x + 14} y={boxY + 18} textAnchor="middle"
            fill={t.color} fontSize="7" fontFamily="JetBrains Mono, monospace" opacity="0.9">
            {t.icon}
          </text>
          {/* Title */}
          <text x={t.x + boxW / 2} y={boxY + 22} textAnchor="middle"
            fill={t.color} fontSize="8" fontFamily="JetBrains Mono, monospace" opacity="0.95">
            {t.label}
          </text>
          {/* Subtitle */}
          <text x={t.x + boxW / 2} y={boxY + 34} textAnchor="middle"
            fill={t.color} fontSize="7" fontFamily="JetBrains Mono, monospace" opacity="0.5">
            {t.sub}
          </text>
        </g>
      ))}

      {/* ── RBAC role-line annotations (below boxes, above 158px boundary) ── */}
      {tiers.map((t) => (
        <g key={`ann${t.label}`}>
          <line x1={t.x + boxW / 2} y1={boxY + boxH} x2={t.x + boxW / 2} y2={boxY + boxH + 16}
            stroke={t.color} strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2 2" />
          <rect x={t.x + 4} y={boxY + boxH + 16} width={boxW - 8} height={14} rx="4"
            fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
          <text x={t.x + boxW / 2} y={boxY + boxH + 26} textAnchor="middle"
            fill="rgba(255,255,255,0.3)" fontSize="6.5" fontFamily="JetBrains Mono, monospace">
            {t.label === "Field Agent" ? "RBAC: agent"
              : t.label === "Supervisor" ? "RBAC: supervisor"
              : t.label === "Finance Ledger" ? "RBAC: finance"
              : "IMMUTABLE"}
          </text>
        </g>
      ))}

      {/* ── Idempotency loop arrow (bottom of diagram) ── */}
      <path d="M 334 134 Q 190 148 46 134" stroke="rgba(110,231,183,0.18)"
        strokeWidth="1" strokeDasharray="3 4" fill="none" />
      <text x="190" y="152" textAnchor="middle"
        fill="rgba(110,231,183,0.35)" fontSize="6.5" fontFamily="JetBrains Mono, monospace">
        idempotent tx log
      </text>

      {/* ── Title label ── */}
      <text x="8" y="12" fill="rgba(255,255,255,0.22)" fontSize="8"
        fontFamily="JetBrains Mono, monospace">
        3-TIER APPROVAL · RBAC · AUDIT TRAIL
      </text>
    </svg>
  );
}

/* ── 4. Healthcare — HL7 FHIR R4 clinical routing schematic ── */
export function HealthcarePreview() {
  /*
   * Layout: left-to-right clinical pipeline across top 72% of canvas.
   * Bottom 28% (y ≥ 158) intentionally empty — reserved for card badges.
   *
   * Pipeline nodes (y=44, h=40 → bottom edge y=84):
   *   HL7 FHIR R4  →  DWS Triage Engine  →  AI Copilot  →  Zero-PII Pass
   *   x=16           x=112                 x=224          x=320
   */
  const nodes = [
    { x: 16,  w: 88, label: "HL7 FHIR R4",   sub: "Data Exchange",   color: "#93c5fd", accent: "0.55" },
    { x: 118, w: 96, label: "DWS Engine",     sub: "Dynamic Routing", color: "#E4E4E7", accent: "0.60" },
    { x: 228, w: 80, label: "AI Copilot",     sub: "Triage Support",  color: "#c4b5fd", accent: "0.55" },
    { x: 320, w: 72, label: "Zero-PII Pass",  sub: "Cryptographic",   color: "#6ee7b7", accent: "0.80" },
  ];
  const boxH = 40; const boxY = 44;

  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="400" height="220" fill="#09090c" />

      {/* Grid */}
      {[0, 40, 80, 120].map(y => (
        <line key={`gy${y}`} x1="0" y1={y} x2="400" y2={y}
          stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
      ))}
      {[0, 100, 200, 300, 400].map(x => (
        <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="155"
          stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
      ))}

      {/* ── Pipeline connectors with arrows ── */}
      {nodes.slice(0, 3).map((n, i) => {
        const x1 = n.x + n.w;
        const x2 = nodes[i + 1].x;
        const cy = boxY + boxH / 2;
        return (
          <g key={`conn${i}`}>
            <line x1={x1} y1={cy} x2={x2 - 1} y2={cy}
              stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="4 3" />
            <polygon points={`${x2},${cy} ${x2 - 5},${cy - 3} ${x2 - 5},${cy + 3}`}
              fill="rgba(255,255,255,0.28)" />
          </g>
        );
      })}

      {/* ── Pipeline nodes ── */}
      {nodes.map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={boxY} width={n.w} height={boxH} rx="7"
            fill="rgba(255,255,255,0.03)"
            stroke={n.color} strokeWidth="0.9"
            strokeOpacity={n.accent} />
          <text x={n.x + n.w / 2} y={boxY + 17} textAnchor="middle"
            fill={n.color} fontSize="8" fontFamily="JetBrains Mono, monospace"
            opacity="0.95" fontWeight="500">
            {n.label}
          </text>
          <text x={n.x + n.w / 2} y={boxY + 29} textAnchor="middle"
            fill={n.color} fontSize="6.5" fontFamily="JetBrains Mono, monospace"
            opacity="0.45">
            {n.sub}
          </text>
        </g>
      ))}

      {/* ── Facility scoring mini-chart (below nodes, capped at y=135) ── */}
      {/* Bar chart showing facility capacity scores */}
      {[
        { x: 32,  h: 28, label: "RS-A", score: "92%" },
        { x: 60,  h: 18, label: "RS-B", score: "58%" },
        { x: 88,  h: 36, label: "RS-C", score: "100%"},
      ].map(b => (
        <g key={b.label}>
          <rect x={b.x} y={130 - b.h} width={18} height={b.h} rx="2"
            fill="rgba(147,197,253,0.12)" stroke="rgba(147,197,253,0.3)" strokeWidth="0.5" />
          <text x={b.x + 9} y={135} textAnchor="middle"
            fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="JetBrains Mono, monospace">
            {b.label}
          </text>
        </g>
      ))}
      <text x="16" y="106" fill="rgba(147,197,253,0.3)"
        fontSize="6.5" fontFamily="JetBrains Mono, monospace">
        DWS FACILITY SCORES
      </text>

      {/* ── Safeguard lock icon (simple padlock on Zero-PII node) ── */}
      <rect x="336" y="92" width="12" height="10" rx="2"
        fill="rgba(110,231,183,0.12)" stroke="rgba(110,231,183,0.4)" strokeWidth="0.6" />
      <path d="M339 92 V89 Q342 86 345 89 V92"
        stroke="rgba(110,231,183,0.4)" strokeWidth="0.7" fill="none" />
      <text x="354" y="100" fill="rgba(110,231,183,0.4)"
        fontSize="6.5" fontFamily="JetBrains Mono, monospace">LOCKED</text>

      {/* ── Safeguard annotation line (above 158px boundary) ── */}
      <line x1="118" y1={boxY + boxH} x2="118" y2="130"
        stroke="rgba(228,228,231,0.1)" strokeWidth="0.5" strokeDasharray="2 3" />
      <text x="122" y="128" fill="rgba(228,228,231,0.25)"
        fontSize="6.5" fontFamily="JetBrains Mono, monospace">
        Safeguard Locks active
      </text>

      {/* ── Title label ── */}
      <text x="8" y="12" fill="rgba(255,255,255,0.22)" fontSize="8"
        fontFamily="JetBrains Mono, monospace">
        HL7 FHIR R4 · DWS ROUTING · ZERO-PII
      </text>
    </svg>
  );
}

export const previewMap: Record<string, React.FC> = {
  "1": ErpPreview,
  "2": FintechPreview,
  "3": PpobPreview,
  "4": HealthcarePreview,
};
