import React, { useRef } from 'react';
import { fmt, round6 } from '../utils/format.js';

/* =========================================================================
   NUMBER LINE (SVG)
   Static diagram for practice questions AND interactive line for simulations.

   props
     min, max, tickStep           axis window and tick spacing
     labelStep | labels[]         which ticks get a number label
     labelFmt(v)                  custom label text
     points[]                     { v, label, color, hollow, lift }
     shade                        { from, to, fromClosed, toClosed }  (±Infinity = to the edge)
     segments[]                   { a, b, label, color } brackets above the axis
     mirror                       dashed mirror line at 0
     minorStep                    extra small ticks
     interactive, snap, onPick    click / drag to choose a value
   ========================================================================= */
const W = 600;
const H = 160;
const PAD = 38;
const AXIS_Y = 104;

export function NumberLine({
  min = -5,
  max = 5,
  tickStep = 1,
  labelStep,
  labels = null,
  labelFmt = null,
  minorStep = null,
  points = [],
  shade = null,
  segments = [],
  mirror = false,
  interactive = false,
  snap = null,
  onPick = null,
  maxWidth = 640,
  className = ''
}) {
  const svgRef = useRef(null);
  const dragging = useRef(false);

  const span = max - min || 1;
  const x = (v) => PAD + ((v - min) / span) * (W - 2 * PAD);
  const anchor = min <= 0 && max >= 0 ? 0 : min;
  const lStep = labelStep || tickStep;

  const isLabeled = (v) => {
    if (labels) return labels.some((l) => Math.abs(l - v) < 1e-6);
    const q = (v - anchor) / lStep;
    return Math.abs(q - Math.round(q)) < 1e-6;
  };

  const ticks = [];
  const N = Math.min(400, Math.round(span / tickStep));
  for (let i = 0; i <= N; i++) ticks.push(round6(min + i * tickStep));

  const minors = [];
  if (minorStep) {
    const M = Math.min(800, Math.round(span / minorStep));
    for (let i = 0; i <= M; i++) minors.push(round6(min + i * minorStep));
  }

  /* ---- interaction ---- */
  const toValue = (clientX) => {
    const rect = svgRef.current.getBoundingClientRect();
    const sx = ((clientX - rect.left) / rect.width) * W;
    let v = min + ((sx - PAD) / (W - 2 * PAD)) * span;
    v = Math.max(min, Math.min(max, v));
    if (snap) v = Math.round((v - min) / snap) * snap + min;
    return round6(v);
  };
  const down = (e) => {
    if (!interactive || !onPick) return;
    dragging.current = true;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    onPick(toValue(e.clientX));
  };
  const move = (e) => { if (dragging.current && onPick) onPick(toValue(e.clientX)); };
  const up = () => { dragging.current = false; };

  const cyan = '#38bdf8';
  const bg = '#1e1342';

  /* ---- shading ---- */
  let shadeEl = null;
  if (shade) {
    const toX = shade.to === Infinity ? W - PAD + 14 : x(shade.to);
    const leftX = shade.from === -Infinity ? PAD - 14 : x(shade.from);
    shadeEl = (
      <g>
        <line x1={leftX} y1={AXIS_Y} x2={toX} y2={AXIS_Y} stroke={cyan} strokeOpacity="0.45" strokeWidth="16" strokeLinecap="butt" />
        {shade.from === -Infinity && <polygon points={`${PAD - 28},${AXIS_Y} ${PAD - 12},${AXIS_Y - 12} ${PAD - 12},${AXIS_Y + 12}`} fill={cyan} fillOpacity="0.85" />}
        {shade.to === Infinity && <polygon points={`${W - PAD + 28},${AXIS_Y} ${W - PAD + 12},${AXIS_Y - 12} ${W - PAD + 12},${AXIS_Y + 12}`} fill={cyan} fillOpacity="0.85" />}
        {shade.from !== -Infinity && (
          <circle cx={x(shade.from)} cy={AXIS_Y} r="9" fill={shade.fromClosed ? cyan : bg} stroke={cyan} strokeWidth="3.5" />
        )}
        {shade.to !== Infinity && (
          <circle cx={x(shade.to)} cy={AXIS_Y} r="9" fill={shade.toClosed ? cyan : bg} stroke={cyan} strokeWidth="3.5" />
        )}
      </g>
    );
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="number line"
      className={`w-full select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      style={{ maxWidth, touchAction: interactive ? 'none' : 'auto' }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      {/* mirror line */}
      {mirror && min <= 0 && max >= 0 && (
        <g>
          <line x1={x(0)} y1="14" x2={x(0)} y2={AXIS_Y + 26} stroke="#c084fc" strokeWidth="2" strokeDasharray="5 5" opacity="0.8" />
          <text x={x(0)} y="11" fill="#c084fc" fontSize="11" fontWeight="900" textAnchor="middle">MIRROR</text>
        </g>
      )}

      {shadeEl}

      {/* axis with arrow heads */}
      <line x1={PAD - 16} y1={AXIS_Y} x2={W - PAD + 16} y2={AXIS_Y} stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      <polygon points={`${PAD - 26},${AXIS_Y} ${PAD - 14},${AXIS_Y - 6} ${PAD - 14},${AXIS_Y + 6}`} fill="#cbd5e1" />
      <polygon points={`${W - PAD + 26},${AXIS_Y} ${W - PAD + 14},${AXIS_Y - 6} ${W - PAD + 14},${AXIS_Y + 6}`} fill="#cbd5e1" />

      {/* minor ticks */}
      {minors.map((v, i) => (
        <line key={`m${i}`} x1={x(v)} y1={AXIS_Y - 5} x2={x(v)} y2={AXIS_Y + 5} stroke="#94a3b8" strokeWidth="1.2" />
      ))}

      {/* major ticks + labels */}
      {ticks.map((v, i) => {
        const lab = isLabeled(v);
        return (
          <g key={`t${i}`}>
            <line x1={x(v)} y1={AXIS_Y - (lab ? 11 : 7)} x2={x(v)} y2={AXIS_Y + (lab ? 11 : 7)} stroke={lab ? '#ffffff' : '#94a3b8'} strokeWidth={lab ? 2.5 : 1.6} />
            {lab && (
              <text x={x(v)} y={AXIS_Y + 34} fill="#e2e8f0" fontSize="15" fontWeight="800" textAnchor="middle">
                {labelFmt ? labelFmt(v) : fmt(v)}
              </text>
            )}
          </g>
        );
      })}

      {/* segments (distance brackets) */}
      {segments.map((s, i) => {
        const xa = x(Math.min(s.a, s.b));
        const xb = x(Math.max(s.a, s.b));
        const y = AXIS_Y - 64;
        const col = s.color || '#4ade80';
        return (
          <g key={`s${i}`}>
            <path d={`M ${xa} ${y + 8} V ${y} H ${xb} V ${y + 8}`} fill="none" stroke={col} strokeWidth="3" strokeLinejoin="round" />
            <text x={(xa + xb) / 2} y={y - 7} fill={col} fontSize="14" fontWeight="900" textAnchor="middle">{s.label}</text>
          </g>
        );
      })}

      {/* points */}
      {points.map((p, i) => {
        const px = x(p.v);
        const col = p.color || '#facc15';
        const lift = (p.lift || 0) * 22;
        const label = p.label ?? '';
        const pw = Math.max(26, String(label).length * 9 + 16);
        const py = AXIS_Y - 44 - lift;
        return (
          <g key={`p${i}`}>
            <line x1={px} y1={py + 22} x2={px} y2={AXIS_Y - 9} stroke={col} strokeWidth="2" opacity="0.8" />
            <circle cx={px} cy={AXIS_Y} r="9" fill={p.hollow ? 'none' : col} stroke={col} strokeWidth="3.5" />
            {label !== '' && (
              <g>
                <rect x={px - pw / 2} y={py} width={pw} height="22" rx="11" fill="#0c0520" stroke={col} strokeWidth="2" />
                <text x={px} y={py + 16} fill={col} fontSize="13" fontWeight="900" textAnchor="middle">{label}</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* Practice-question wrapper (kept name parity with the previous module) */
export function NumberLineDiagram({ diagramData }) {
  if (!diagramData) return null;
  return (
    <div className="flex flex-col items-center justify-center my-2 w-full">
      <NumberLine {...diagramData} />
    </div>
  );
}
