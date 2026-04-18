import { useMemo } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// SVG Math Helpers
// ─────────────────────────────────────────────────────────────────────────────
const d2r = deg => (deg * Math.PI) / 180;

const ellipsePt = (cx, cy, rx, ry, deg) => [
  +(cx + rx * Math.cos(d2r(deg))).toFixed(2),
  +(cy + ry * Math.sin(d2r(deg))).toFixed(2),
];

/** Ring-sector arc path (clockwise, outer then inner reversed) */
const ringArc = (cx, cy, rxO, ryO, rxI, ryI, a1, a2) => {
  const [ox1, oy1] = ellipsePt(cx, cy, rxO, ryO, a1);
  const [ox2, oy2] = ellipsePt(cx, cy, rxO, ryO, a2);
  const [ix1, iy1] = ellipsePt(cx, cy, rxI, ryI, a1);
  const [ix2, iy2] = ellipsePt(cx, cy, rxI, ryI, a2);
  const span = ((a2 - a1) % 360 + 360) % 360;
  const lg = span > 180 ? 1 : 0;
  return `M ${ox1} ${oy1} A ${rxO} ${ryO} 0 ${lg} 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${rxI} ${ryI} 0 ${lg} 0 ${ix1} ${iy1} Z`;
};

/** Mid-angle of a section (SVG degrees) */
const midAngle = (a1, a2) => {
  const span = ((a2 - a1) % 360 + 360) % 360;
  return a1 + span / 2;
};

/** Center point of a section on the concourse mid-ellipse */
const sectionCenter = (cx, cy, rxM, ryM, a1, a2) =>
  ellipsePt(cx, cy, rxM, ryM, midAngle(a1, a2));

/** Shortest concourse arc path between two angles */
const concourseArc = (cx, cy, rxM, ryM, fromDeg, toDeg) => {
  const [x1, y1] = ellipsePt(cx, cy, rxM, ryM, fromDeg);
  const [x2, y2] = ellipsePt(cx, cy, rxM, ryM, toDeg);
  const cw  = ((toDeg - fromDeg) % 360 + 360) % 360;
  const ccw = ((fromDeg - toDeg) % 360 + 360) % 360;
  const goClockwise = cw <= ccw;
  const span = goClockwise ? cw : ccw;
  const lg = span > 180 ? 1 : 0;
  const sw = goClockwise ? 1 : 0;
  return `M ${x1} ${y1} A ${rxM} ${ryM} 0 ${lg} ${sw} ${x2} ${y2}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Destination colour palette
// ─────────────────────────────────────────────────────────────────────────────
export const DEST_COLORS = {
  seat:     '#22d3ee',
  food:     '#fb923c',
  restroom: '#60a5fa',
  exit:     '#4ade80',
};

// ─────────────────────────────────────────────────────────────────────────────
// Oval Map  (Cricket)
// ─────────────────────────────────────────────────────────────────────────────
const CX = 200, CY = 150;
const RX_OUT = 182, RY_OUT = 133;
const RX_IN  = 113, RY_IN  = 83;
const RX_MID = (RX_OUT + RX_IN) / 2;  // ≈ 147.5
const RY_MID = (RY_OUT + RY_IN) / 2;  // ≈ 108

const OvalMap = ({ sections, userSectionId, destSectionId, destType, onSectionClick }) => {
  const built = useMemo(() =>
    sections.map(s => ({
      ...s,
      path:   ringArc(CX, CY, RX_OUT, RY_OUT, RX_IN, RY_IN, s.a1, s.a2),
      center: sectionCenter(CX, CY, RX_MID, RY_MID, s.a1, s.a2),
    })),
    [sections]
  );

  const userSec = built.find(s => s.id === userSectionId);
  const destSec = built.find(s => s.id === destSectionId);
  const destColor = DEST_COLORS[destType] || '#22d3ee';

  const pathD = useMemo(() => {
    if (!userSec || !destSec || userSec.id === destSec.id) return null;
    const from = midAngle(userSec.a1, userSec.a2);
    const to   = midAngle(destSec.a1, destSec.a2);
    return concourseArc(CX, CY, RX_MID, RY_MID, from, to);
  }, [userSec, destSec]);

  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto rounded-2xl" style={{ background: '#0a1628' }}>
      {/* ── Sections ── */}
      {built.map(s => {
        const isUser = s.id === userSectionId;
        const isDest = s.id === destSectionId;
        const fill = isUser ? '#0e7490' : isDest ? '#7c2d12' : '#1e293b';
        return (
          <path
            key={s.id}
            d={s.path}
            fill={fill}
            stroke="#0a1628"
            strokeWidth="2.5"
            className="cursor-pointer transition-all duration-200 hover:brightness-125"
            onClick={() => onSectionClick?.(s.id)}
          />
        );
      })}

      {/* ── Field ── */}
      <ellipse cx={CX} cy={CY} rx={RX_IN} ry={RY_IN} fill="#0a1628" stroke="#1e293b" strokeWidth="1.5" />
      <ellipse cx={CX} cy={CY} rx={RX_IN - 6} ry={RY_IN - 6} fill="#052e16" stroke="#15803d" strokeWidth="1" />
      {/* Pitch */}
      <rect x={CX - 5} y={CY - 32} width="10" height="64" rx="3" fill="none" stroke="#16a34a" strokeWidth="1" opacity="0.7" />
      <circle cx={CX} cy={CY - 26} r="2" fill="#16a34a" opacity="0.6" />
      <circle cx={CX} cy={CY + 26} r="2" fill="#16a34a" opacity="0.6" />
      {/* 30-yard circle */}
      <ellipse cx={CX} cy={CY} rx="52" ry="40" fill="none" stroke="#16a34a" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />

      {/* ── Section labels ── */}
      {built.map(s => {
        const [lx, ly] = s.center;
        const isUser = s.id === userSectionId;
        const isDest = s.id === destSectionId;
        const lines = (s.shortName || s.name).split('\n');
        return (
          <text key={`lbl-${s.id}`} textAnchor="middle" dominantBaseline="middle" className="pointer-events-none select-none">
            {lines.map((ln, i) => (
              <tspan key={i} x={lx} dy={i === 0 ? (-(lines.length - 1) * 5) : 10} fontSize="7" fontWeight="700" fill={isUser || isDest ? '#fff' : '#64748b'}>
                {ln}
              </tspan>
            ))}
          </text>
        );
      })}

      {/* ── Concourse path ── */}
      {pathD && (
        <path d={pathD} fill="none" stroke={destColor} strokeWidth="2.5" strokeDasharray="6 3" opacity="0.85">
          <animate attributeName="stroke-dashoffset" from="0" to="-27" dur="0.9s" repeatCount="indefinite" />
        </path>
      )}

      {/* ── User marker ── */}
      {userSec && (() => {
        const [ux, uy] = userSec.center;
        return (
          <g transform={`translate(${ux},${uy})`}>
            <circle r="10" fill="#0891b2" opacity="0">
              <animate attributeName="r" values="5;14;5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="5" fill="#22d3ee" stroke="#fff" strokeWidth="1.5" />
          </g>
        );
      })()}

      {/* ── Destination marker ── */}
      {destSec && (() => {
        const [dx, dy] = destSec.center;
        return (
          <g transform={`translate(${dx},${dy})`}>
            <circle r="10" fill={destColor} opacity="0">
              <animate attributeName="r" values="5;14;5" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <circle r="5" fill={destColor} stroke="#fff" strokeWidth="1.5" />
          </g>
        );
      })()}

      {/* ── Legend ── */}
      <g>
        <circle cx="12" cy="288" r="4" fill="#22d3ee" />
        <text x="20" y="292" fontSize="8" fill="#94a3b8" dominantBaseline="middle">You are here</text>
        <circle cx="100" cy="288" r="4" fill={destColor} />
        <text x="108" y="292" fontSize="8" fill="#94a3b8" dominantBaseline="middle">Destination</text>
        {pathD && <>
          <line x1="195" y1="288" x2="215" y2="288" stroke={destColor} strokeWidth="2" strokeDasharray="4 2" />
          <text x="220" y="292" fontSize="8" fill="#94a3b8" dominantBaseline="middle">Your route</text>
        </>}
      </g>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Rectangular Map (Football / Hockey / Indoor)
// ─────────────────────────────────────────────────────────────────────────────
const SIDE_RECTS = {
  north: { x: 20, y: 5,   w: 360, h: 48,  lx: 200, ly: 29 },
  south: { x: 20, y: 247, w: 360, h: 48,  lx: 200, ly: 271 },
  east:  { x: 340, y: 53, w: 45,  h: 194, lx: 363, ly: 150 },
  west:  { x: 15, y: 53,  w: 45,  h: 194, lx: 38,  ly: 150 },
};

// Pre-defined L-shaped path between any two sides
const RECT_PATHS = {
  'north-south': (c1, c2) => `M ${c1.lx} ${c1.ly} L ${c1.lx} 150 L ${c2.lx} 150 L ${c2.lx} ${c2.ly}`,
  'north-east':  (c1, c2) => `M ${c1.lx} ${c1.ly} L ${c1.lx} ${c2.ly} L ${c2.lx} ${c2.ly}`,
  'north-west':  (c1, c2) => `M ${c1.lx} ${c1.ly} L ${c1.lx} ${c2.ly} L ${c2.lx} ${c2.ly}`,
  'south-east':  (c1, c2) => `M ${c1.lx} ${c1.ly} L ${c1.lx} ${c2.ly} L ${c2.lx} ${c2.ly}`,
  'south-west':  (c1, c2) => `M ${c1.lx} ${c1.ly} L ${c1.lx} ${c2.ly} L ${c2.lx} ${c2.ly}`,
  'east-west':   (c1, c2) => `M ${c1.lx} ${c1.ly} L 200 ${c1.ly} L 200 ${c2.ly} L ${c2.lx} ${c2.ly}`,
};
const getRectPath = (s1, s2) => {
  const key = [s1.side, s2.side].sort().join('-');
  const fn = RECT_PATHS[key];
  return fn ? fn(SIDE_RECTS[s1.side], SIDE_RECTS[s2.side]) : null;
};

const RectMap = ({ sections, userSectionId, destSectionId, destType, onSectionClick, shape }) => {
  const userSec = sections.find(s => s.id === userSectionId);
  const destSec = sections.find(s => s.id === destSectionId);
  const destColor = DEST_COLORS[destType] || '#22d3ee';

  const pathD = useMemo(() => {
    if (!userSec || !destSec || userSec.id === destSec.id) return null;
    return getRectPath(userSec, destSec);
  }, [userSec, destSec]);

  // Pitch colours by shape
  const isIndoor = shape === 'indoor';
  const pitchFill   = isIndoor ? '#1e1b2e' : '#052e16';
  const pitchStroke = isIndoor ? '#7c3aed' : '#15803d';
  const lineStroke  = isIndoor ? '#7c3aed' : '#16a34a';

  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto rounded-2xl" style={{ background: '#0a1628' }}>
      {/* ── Stands ── */}
      {sections.map(s => {
        const r = SIDE_RECTS[s.side];
        if (!r) return null;
        const isUser = s.id === userSectionId;
        const isDest = s.id === destSectionId;
        const fill = isUser ? '#0e7490' : isDest ? '#7c2d12' : '#1e293b';
        return (
          <rect key={s.id} x={r.x} y={r.y} width={r.w} height={r.h} rx="5"
            fill={fill} stroke="#0a1628" strokeWidth="2"
            className="cursor-pointer transition-all duration-200 hover:brightness-125"
            onClick={() => onSectionClick?.(s.id)}
          />
        );
      })}

      {/* ── Playing surface ── */}
      <rect x="63" y="53" width="274" height="194" rx="4" fill={pitchFill} stroke={pitchStroke} strokeWidth="1.5" />
      {/* Centre line */}
      <line x1="63" y1="150" x2="337" y2="150" stroke={lineStroke} strokeWidth="1" opacity="0.5" />
      {/* Centre circle */}
      <circle cx="200" cy="150" r="28" fill="none" stroke={lineStroke} strokeWidth="1" opacity="0.5" />
      {isIndoor ? (
        /* Court three-point arcs */
        <>
          <path d="M 63 110 A 60 60 0 0 1 63 190" fill="none" stroke={lineStroke} strokeWidth="0.8" opacity="0.4" />
          <path d="M 337 110 A 60 60 0 0 0 337 190" fill="none" stroke={lineStroke} strokeWidth="0.8" opacity="0.4" />
        </>
      ) : (
        /* Goal / penalty areas */
        <>
          <rect x="63" y="116" width="36" height="68" fill="none" stroke={lineStroke} strokeWidth="1" opacity="0.4" />
          <rect x="301" y="116" width="36" height="68" fill="none" stroke={lineStroke} strokeWidth="1" opacity="0.4" />
          <rect x="63" y="133" width="16" height="34" fill="none" stroke={lineStroke} strokeWidth="0.8" opacity="0.3" />
          <rect x="321" y="133" width="16" height="34" fill="none" stroke={lineStroke} strokeWidth="0.8" opacity="0.3" />
        </>
      )}

      {/* ── Section labels ── */}
      {sections.map(s => {
        const r = SIDE_RECTS[s.side];
        if (!r) return null;
        const isUser = s.id === userSectionId;
        const isDest = s.id === destSectionId;
        const lines = (s.shortName || s.name).split('\n');
        const isVertical = s.side === 'east' || s.side === 'west';
        return (
          <text key={`lbl-${s.id}`} x={r.lx} y={r.ly} textAnchor="middle" dominantBaseline="middle"
            transform={isVertical ? `rotate(-90,${r.lx},${r.ly})` : undefined}
            className="pointer-events-none select-none">
            {lines.map((ln, i) => (
              <tspan key={i} x={r.lx} dy={i === 0 ? -(lines.length - 1) * 4.5 : 10}
                fontSize="7" fontWeight="700"
                fill={isUser || isDest ? '#fff' : '#64748b'}
              >{ln}</tspan>
            ))}
          </text>
        );
      })}

      {/* ── Route path ── */}
      {pathD && (
        <path d={pathD} fill="none" stroke={destColor} strokeWidth="2.5" strokeDasharray="6 3" opacity="0.85">
          <animate attributeName="stroke-dashoffset" from="0" to="-27" dur="0.9s" repeatCount="indefinite" />
        </path>
      )}

      {/* ── User marker ── */}
      {userSec && (() => {
        const r = SIDE_RECTS[userSec.side];
        if (!r) return null;
        return (
          <g transform={`translate(${r.lx},${r.ly})`}>
            <circle r="10" fill="#0891b2" opacity="0">
              <animate attributeName="r" values="5;14;5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="5" fill="#22d3ee" stroke="#fff" strokeWidth="1.5" />
          </g>
        );
      })()}

      {/* ── Destination marker ── */}
      {destSec && (() => {
        const r = SIDE_RECTS[destSec.side];
        if (!r) return null;
        return (
          <g transform={`translate(${r.lx},${r.ly})`}>
            <circle r="10" fill={destColor} opacity="0">
              <animate attributeName="r" values="5;14;5" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <circle r="5" fill={destColor} stroke="#fff" strokeWidth="1.5" />
          </g>
        );
      })()}

      {/* ── Legend ── */}
      <g>
        <circle cx="12" cy="290" r="4" fill="#22d3ee" />
        <text x="20" y="294" fontSize="8" fill="#94a3b8" dominantBaseline="middle">You are here</text>
        <circle cx="100" cy="290" r="4" fill={destColor} />
        <text x="108" y="294" fontSize="8" fill="#94a3b8" dominantBaseline="middle">Destination</text>
        {pathD && <>
          <line x1="195" y1="290" x2="215" y2="290" stroke={destColor} strokeWidth="2" strokeDasharray="4 2" />
          <text x="220" y="294" fontSize="8" fill="#94a3b8" dominantBaseline="middle">Your route</text>
        </>}
      </g>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Public export
// ─────────────────────────────────────────────────────────────────────────────
const StadiumMap = ({ stadium, userSectionId, destSectionId, destType, onSectionClick }) => {
  if (!stadium?.seating) return null;
  const { shape, sections } = stadium.seating;
  const props = { sections, userSectionId, destSectionId, destType, onSectionClick };

  if (shape === 'oval')
    return <OvalMap {...props} />;
  if (shape === 'rectangular' || shape === 'indoor')
    return <RectMap {...props} shape={shape} />;
  return null;
};

export default StadiumMap;
