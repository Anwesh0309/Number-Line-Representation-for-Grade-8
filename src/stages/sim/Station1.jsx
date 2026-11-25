import React, { useState, useEffect } from 'react';
import { NumberLine } from '../../components/NumberLineDiagram.jsx';
import { fmt, fmtFixed, fracStr, round6 } from '../../utils/format.js';
import { SIM_STATIONS } from '../../mathData.js';
import {
  Banner, Stat, Pill, GhostBtn, GoldBtn, Goal,
  RealWorldBadge, StoryCallout, GradeTip, PANEL
} from './shared.jsx';

const r8 = (x) => Math.round(x * 1e8) / 1e8;

/* =========================================================================
   STATION 1 · ACTIVITY 1 — AEROSPACE LASER MICROMETER
   Real-World Scenario: Measuring microchip trace wires between 0 mm & 1 mm.
   Story Alignment: Slide 1 & Wonder Phase (Infinitely many numbers between 0 and 1).
   ========================================================================= */
const MICRO_OBJECTS = [
  { max: 0.05, name: '🦠 Micro-bacteria', size: '~0.02 mm', desc: 'Cellular scale' },
  { max: 0.12, name: '🧬 Human Hair', size: '~0.08 mm', desc: 'Microscopic fiber' },
  { max: 0.25, name: '📄 Silicon Wafer', size: '~0.18 mm', desc: 'Microchip substrate' },
  { max: 0.45, name: '🧵 Ultra-fine Thread', size: '~0.35 mm', desc: 'Precision suture' },
  { max: 0.65, name: '✏️ Pencil Lead', size: '~0.50 mm', desc: '0.5 mm mechanical lead' },
  { max: 0.85, name: '🔩 Micro-screw Pin', size: '~0.75 mm', desc: 'Circuit connector pin' },
  { max: 1.05, name: '📍 Sewing Pin Head', size: '~0.95 mm', desc: 'Millimeter milestone' }
];

export function ZoomLens({ onComplete }) {
  const [level, setLevel] = useState(0);
  const [maxLevel, setMaxLevel] = useState(0);
  const [lo, setLo] = useState(0);
  const [p, setP] = useState(0.5);

  const w = Math.pow(10, -level);
  const hi = r8(lo + w);
  const snap = w / 100;
  const dec = level + 2;

  const rewindow = (center, newW, newLevel) => {
    if (newLevel === 0) return 0;
    const tick = newW / 10;
    return r8(Math.round((center - newW / 2) / tick) * tick);
  };

  const zoomIn = () => {
    if (level >= 3) return;
    const nl = level + 1;
    setLo(rewindow(p, Math.pow(10, -nl), nl));
    setLevel(nl);
    setMaxLevel((m) => Math.max(m, nl));
  };
  const zoomOut = () => {
    if (level <= 0) return;
    const nl = level - 1;
    setLo(rewindow(p, Math.pow(10, -nl), nl));
    setLevel(nl);
  };
  const reset = () => { setLevel(0); setLo(0); setP(0.5); };

  const jog = (delta) => {
    const np = Math.max(lo, Math.min(hi, r8(p + delta * (w / 20))));
    setP(np);
  };

  useEffect(() => { if (maxLevel >= 3) onComplete(); }, [maxLevel]); // eslint-disable-line

  const currentObj = MICRO_OBJECTS.find((m) => p <= m.max) || MICRO_OBJECTS[MICRO_OBJECTS.length - 1];
  const magFactor = Math.pow(10, level);

  return (
    <div className={PANEL}>
      <RealWorldBadge
        icon="🔬"
        title="Aerospace Cleanroom · Laser Micrometer"
        context="Calibrating satellite micro-wires between 0.000 mm and 1.000 mm"
        level="Grade 7 Physics & Math"
      />

      <StoryCallout slideRef="Slide 1 & Wonder Phase">
        Leo & Emma wondered: "How many numbers fit between 0 and 1?" Zoom in to see the line never runs out!
      </StoryCallout>

      <Goal items={[
        { label: 'Magnify ×10', done: maxLevel >= 1 },
        { label: 'Magnify ×100', done: maxLevel >= 2 },
        { label: 'Magnify ×1000', done: maxLevel >= 3 }
      ]} />

      {/* Laser Caliper Housing Display */}
      <div className="w-full bg-gradient-to-b from-[#180a3a] to-[#0f0524] rounded-2xl border-2 border-cyan-400/30 p-3 sm:p-4 shadow-2xl flex flex-col items-center gap-3">
        {/* Caliper HUD Top Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-xs font-black uppercase text-cyan-300 tracking-wider">Laser Sensor Active</span>
          </div>
          <div className="flex items-center gap-2 bg-[#12062b] px-3 py-1 rounded-xl border border-white/15">
            <span className="text-xs font-bold text-slate-300">Magnification:</span>
            <span className="font-display font-900 text-sm sm:text-base text-amber-300">×{magFactor}</span>
            <span className="text-[10px] text-slate-400">({level === 0 ? 'Ruler' : level === 1 ? 'Loupe' : level === 2 ? 'Microscope' : 'Electron Beam'})</span>
          </div>
          <div className="text-xs font-black text-slate-300">
            Field: <span className="text-cyan-300">{fmtFixed(lo, level + 1)}</span> to <span className="text-cyan-300">{fmtFixed(hi, level + 1)} mm</span>
          </div>
        </div>

        {/* Visual Real-World Target Indicator */}
        <div className="w-full bg-[#120529]/80 border border-purple-400/25 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentObj.name.split(' ')[0]}</span>
            <div>
              <p className="text-xs font-900 text-slate-100">{currentObj.name.split(' ').slice(1).join(' ')}</p>
              <p className="text-[10px] font-bold text-slate-400">{currentObj.desc} (typical {currentObj.size})</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-black text-amber-300 block">Current Caliper Reading</span>
            <span className="font-mono font-900 text-base sm:text-lg text-emerald-300">{fmtFixed(p, dec)} mm</span>
          </div>
        </div>

        {/* Interactive Number Line */}
        <div className="w-full flex flex-col items-center relative">
          <NumberLine
            min={lo} max={hi} tickStep={w / 10} labelStep={w / 5}
            labelFmt={(v) => `${fmtFixed(v, level + 1)}`}
            points={[{ v: p, label: `${fmtFixed(p, dec)} mm`, color: '#facc15' }]}
            interactive snap={snap} onPick={(v) => setP(v)} maxWidth={640}
          />
          <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-300 pt-1">
            <span>👆 Drag caliper cursor on the line</span>
            <span>•</span>
            <button onClick={() => jog(-1)} className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px] text-cyan-200">◀ Nudge Left</button>
            <button onClick={() => jog(1)} className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px] text-cyan-200">Nudge Right ▶</button>
          </div>
        </div>
      </div>

      {/* Real-World Telemetry Stats */}
      <div className="w-full flex flex-wrap gap-2.5 justify-center">
        <Stat label="Laser Position" value={`${fmtFixed(p, dec)} mm`} tone="text-amber-300" sub={`Reading at ×${magFactor}`} />
        <Stat label="Micrometer (µm)" value={`${Math.round(p * 1000)} µm`} tone="text-cyan-300" sub="1 mm = 1,000 µm" />
        <Stat label="Tick Interval" value={`${fmtFixed(w / 10, level + 1)} mm`} tone="text-emerald-300" sub="Distance between marks" />
      </div>

      {/* Control Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={zoomIn}
          disabled={level >= 3}
          className="btn-gold text-xs sm:text-sm font-900 px-6 py-2.5 shadow-lg hover:scale-105 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <span>🔍</span> Zoom In ×10
        </button>
        <GhostBtn onClick={zoomOut} disabled={level <= 0}>➖ Zoom Out</GhostBtn>
        <GhostBtn onClick={reset}>🔄 Reset Ruler</GhostBtn>
      </div>

      <GradeTip title="Grade 7 Number Sense: Why Do Numbers Never Run Out?" speech={SIM_STATIONS[0].activities[0].tipSpeech}>
        Just like you can keep zooming a camera into a computer chip forever, you can always split any gap on a number line into 10 smaller tenths, then hundredths, then thousandths. Between 0 and 1 live infinitely many numbers!
      </GradeTip>

      {maxLevel >= 3 && (
        <Banner ok>
          🎉 Incredible! Even at ×1000 electron-microscope magnification, there is always room for infinite more decimals between any two ticks. The number line is continuous!
        </Banner>
      )}
    </div>
  );
}

/* =========================================================================
   STATION 1 · ACTIVITY 2 — DEEP SEA SUBMARINE & METEOROLOGY DRONE
   Real-World Scenario: Submarine Nautilus diving below sea level (negative m)
   paired with an Atmospheric Research Drone flying above (positive m).
   Story Alignment: Slide 2 (Mirror images across 0 & absolute value |n|).
   ========================================================================= */
const DEPTH_ZONES = [
  { max: -8, name: 'Midnight Trench Abyss', icon: '🦑', biome: 'Pitch black water, glowing bio-luminescence', temp: '2°C', press: '1.9 atm' },
  { max: -4, name: 'Ocean Twilight Zone', icon: '🐙', biome: 'Fading sunlight, deep diving octopus', temp: '8°C', press: '1.5 atm' },
  { max: -0.1, name: 'Sunlit Coral Reef', icon: '🐠', biome: 'Vibrant tropical fish and shallow corals', temp: '18°C', press: '1.2 atm' },
  { max: 0, name: 'Sea Level Baseline', icon: '⚓', biome: 'Water surface waterline & research buoy', temp: '22°C', press: '1.0 atm' }
];

export function MirrorSub({ onComplete }) {
  const [n, setN] = useState(-4);
  const [seen, setSeen] = useState([]);

  useEffect(() => {
    if (n !== 0 && !seen.includes(Math.abs(n))) setSeen((s) => [...s, Math.abs(n)]);
  }, [n]); // eslint-disable-line

  useEffect(() => { if (seen.length >= 3) onComplete(); }, [seen.length]); // eslint-disable-line

  const clamp = (v) => Math.max(-10, Math.min(10, v));
  const abs = Math.abs(n);

  const points = n === 0
    ? [{ v: 0, label: 'Sea Level (0 m)', color: '#facc15' }]
    : [
        { v: n, label: `Sub: ${fmt(n)} m`, color: '#facc15' },
        { v: -n, label: `Drone: ${fmt(-n)} m`, color: '#38bdf8', hollow: true }
      ];
  const segments = n === 0 ? [] : [
    { a: 0, b: n, label: `|${fmt(n)}| = ${abs} m`, color: '#facc15' },
    { a: 0, b: -n, label: `|${fmt(-n)}| = ${abs} m`, color: '#38bdf8' }
  ];

  const currentZone = n <= 0
    ? DEPTH_ZONES.find((z) => n <= z.max) || DEPTH_ZONES[DEPTH_ZONES.length - 1]
    : { name: 'Sky Atmosphere', icon: '🛰️', biome: 'Sunny troposphere meteorological corridor', temp: `${(22 - n * 1.5).toFixed(1)}°C`, press: `${(1.0 - n * 0.05).toFixed(2)} atm` };

  return (
    <div className={PANEL}>
      <RealWorldBadge
        icon="🤿"
        title="Deep-Sea Explorer & Meteorology Drone"
        context="Mapping underwater depths below sea level (0 m) and atmospheric heights above"
        level="Grade 7 Earth Science & Integers"
      />

      <StoryCallout slideRef="Slide 2: Mirror Images">
        Slide 2 taught us: "Every number has an opposite the same distance from zero on the other side. Zero sits right on the mirror!"
      </StoryCallout>

      <Goal items={[0, 1, 2].map((i) => ({
        label: seen[i] != null ? `Logged Depth: ${seen[i]} m` : `Target Depth ${i + 1}`,
        done: seen[i] != null
      }))} />

      {/* Visual Ocean & Sky Illustrated Cross-Section Card */}
      <div className="w-full bg-gradient-to-b from-sky-900/60 via-blue-950/80 to-[#0a0520] rounded-2xl border-2 border-sky-400/40 p-3 sm:p-4 shadow-2xl flex flex-col items-center gap-2">
        {/* Sky / Sea Level Graphic Banner */}
        <div className="w-full flex items-center justify-between bg-black/40 px-3 py-2 rounded-xl border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentZone.icon}</span>
            <div>
              <p className="font-900 text-sky-200">{currentZone.name}</p>
              <p className="text-[10px] text-slate-300 font-bold">{currentZone.biome}</p>
            </div>
          </div>
          <div className="text-right font-black">
            <span className="text-amber-300 block text-xs">Distance to Surface:</span>
            <span className="text-emerald-300 text-sm sm:text-base font-display">|{fmt(n)}| = {abs} meters</span>
          </div>
        </div>

        {/* Dynamic Vehicles Diagram */}
        <div className="w-full flex items-center justify-around py-1 text-xs sm:text-sm font-extrabold text-slate-200 border-y border-white/10 bg-white/5 rounded-lg px-2">
          <span className="flex items-center gap-1.5 text-amber-300">
            <span>🤿</span> Submarine at <span className="font-mono underline">{fmt(n)} m</span>
          </span>
          <span className="text-purple-300 font-black text-xs uppercase px-2 py-0.5 bg-purple-900/60 rounded-full border border-purple-400/30">
            🪞 Sea Level (0 m) Mirror
          </span>
          <span className="flex items-center gap-1.5 text-sky-300">
            <span>🛰️</span> Drone Twin at <span className="font-mono underline">{fmt(-n)} m</span>
          </span>
        </div>

        {/* Number Line */}
        <NumberLine
          min={-10} max={10} tickStep={1} labelStep={2} mirror
          points={points} segments={segments}
          interactive snap={1} onPick={(v) => setN(clamp(v))} maxWidth={640}
        />
        <p className="text-[11px] font-bold text-slate-300">👆 Tap any depth on the line or use the controls below</p>
      </div>

      {/* Real-World Sensor Telemetry */}
      <div className="w-full flex flex-wrap gap-2.5 justify-center">
        <Stat label="Sub Position" value={`${fmt(n)} m`} tone={n < 0 ? 'text-amber-300' : 'text-cyan-300'} sub={n < 0 ? 'Underwater depth' : n > 0 ? 'Above surface' : 'At surface'} />
        <Stat label="Twin Opposite" value={`${fmt(-n)} m`} tone="text-sky-300" sub="Mirror coordinate" />
        <Stat label="Absolute Distance" value={`|${fmt(n)}| = ${abs} m`} tone="text-emerald-300" sub="Distance from sea level" />
        <Stat label="Water Pressure" value={n <= 0 ? `${(1.0 + abs * 0.1).toFixed(1)} atm` : '1.0 atm'} tone="text-pink-300" sub="Hydrostatic reading" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <GhostBtn onClick={() => setN((v) => clamp(v - 1))}>◀ Dive Deeper (-1m)</GhostBtn>
        <GhostBtn onClick={() => setN((v) => clamp(v + 1))}>Rise Higher (+1m) ▶</GhostBtn>
        <button
          onClick={() => setN((v) => -v)}
          className="btn-gold text-xs sm:text-sm font-900 px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
        >
          <span>🪞</span> Flip Opposite Twin ({fmt(-n)} m)
        </button>
      </div>

      <GradeTip title="Grade 7 Core Concept: What Does Absolute Value Really Mean?" speech={SIM_STATIONS[0].activities[1].tipSpeech}>
        Absolute value is physical distance! A submarine diving 7 meters underwater (-7 m) and a drone flying 7 meters in the air (+7 m) are both exactly 7 meters away from the water surface (0). Distance is never negative: |-7| = 7 and |+7| = 7!
      </GradeTip>

      {seen.length >= 3 && (
        <Banner ok>
          🎉 Excellent navigation! You proved that every integer n and its opposite −n have the exact same distance from zero: |n| = |−n|!
        </Banner>
      )}
    </div>
  );
}

/* =========================================================================
   STATION 1 · ACTIVITY 3 — ARTISAN BAKERY CHOCOLATE SLICER
   Real-World Scenario: Slicing a 1-meter artisan chocolate confection
   into equal servings for pastry customers.
   Story Alignment: Slide 3 (Equal parts first, then count; fractions & decimals).
   ========================================================================= */
const DENS = [2, 3, 4, 5, 6, 8, 10];

export function FractionSplitter({ onComplete }) {
  const [d, setD] = useState(4);
  const [k, setK] = useState(1);
  const [found, setFound] = useState([]);

  const v = k / d;

  useEffect(() => {
    if (2 * k === d) {
      const key = `${k}/${d}`;
      setFound((f) => (f.includes(key) ? f : [...f, key]));
    }
  }, [k, d]);

  useEffect(() => { if (found.length >= 3) onComplete(); }, [found.length]); // eslint-disable-line

  const chooseDen = (nd) => { setD(nd); setK(Math.min(k, nd)); };

  const grams = Math.round((k / d) * 1000);
  const percent = Math.round((k / d) * 100);

  return (
    <div className={PANEL}>
      <RealWorldBadge
        icon="🍫"
        title="Artisan Chocolatier & Bakery"
        context="Chef Leo & Emma slicing a 1-meter chocolate bar into equal customer portions"
        level="Grade 7 Fractions & Proportions"
      />

      <StoryCallout slideRef="Slide 3: Fractions & Decimals">
        Slide 3 rule: "Equal parts first. Then count! 3/4 and 0.75 land on exactly the same spot!"
      </StoryCallout>

      <Goal items={[0, 1, 2].map((i) => ({
        label: found[i] ? `Cut ${found[i]} = ½ bar` : `Find cut equal to ½ bar`,
        done: !!found[i]
      }))} />

      {/* Denominator Selector Ribbon */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-[#14082c] px-3.5 py-2.5 rounded-2xl border border-cyan-400/40 w-full shrink-0 shadow-md">
        <span className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-1">
          <span>🔪</span> Slice 1-meter bar into:
        </span>
        {DENS.map((x) => (
          <Pill key={x} active={d === x} tone="gold" onClick={() => chooseDen(x)}>
            {x} slices
          </Pill>
        ))}
      </div>

      {/* Illustrated Chocolate Bar Graphic */}
      <div className="w-full bg-[#120524] rounded-2xl border-2 border-amber-400/40 p-3 sm:p-4 shadow-xl flex flex-col items-center gap-3">
        {/* Real-time Chocolate Bar Visualization */}
        <div className="w-full max-w-[620px]">
          <div className="flex items-center justify-between text-xs font-900 text-amber-200 mb-1 px-1">
            <span>0 m (Start of Bar)</span>
            <span className="text-amber-400">Selected Serving: {k} of {d} equal slices</span>
            <span>1.0 m (Full 1000g Bar)</span>
          </div>

          {/* Sliced chocolate blocks */}
          <div className="w-full h-8 sm:h-10 bg-amber-950 rounded-xl border-2 border-amber-700/80 p-0.5 flex gap-1 shadow-inner overflow-hidden">
            {Array.from({ length: d }).map((_, i) => (
              <div
                key={i}
                onClick={() => setK(i + 1)}
                className={`flex-1 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-black cursor-pointer transition-all duration-200 ${
                  i < k
                    ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 shadow-[0_0_8px_rgba(250,204,21,0.7)]'
                    : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200/50'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Number Line */}
        <NumberLine
          min={0} max={1} tickStep={1 / d} labels={[0, 1]}
          points={[{ v: round6(v), label: `${k}/${d} bar`, color: '#facc15' }]}
          interactive snap={1 / d} onPick={(val) => setK(Math.round(val * d))} maxWidth={620}
        />
        <p className="text-[11px] font-bold text-slate-300">👆 Tap a tick on the number line or tap the chocolate bar slices above</p>
      </div>

      {/* Recipe Telemetry Readout */}
      <div className="w-full flex flex-wrap gap-2.5 justify-center">
        <Stat label="Fraction Portion" value={`${k}/${d}`} tone="text-amber-300" sub={`${k} out of ${d} slices`} />
        <Stat label="Simplified" value={fracStr(k, d)} tone="text-cyan-300" sub="Lowest terms" />
        <Stat label="Metric Weight" value={`${grams} g`} tone="text-emerald-300" sub="Out of 1000g recipe" />
        <Stat label="Decimal & %" value={`${fmt(round6(v))} (${percent}%)`} tone="text-pink-300" sub="Exact coordinate" />
      </div>

      <GradeTip title="Grade 7 Bakery Tip: Why Do Different Fractions Share One Spot?" speech={SIM_STATIONS[0].activities[2].tipSpeech}>
        If you cut a 1-meter chocolate bar into 4 pieces and take 2 (2/4), that is the exact same amount of chocolate as cutting it into 8 pieces and taking 4 (4/8). Both give exactly half the bar (0.500 m = 500 grams)!
      </GradeTip>

      {found.length >= 3 && (
        <Banner ok>
          🎉 Magnificent! {found.join(' = ')} all equal ½. Even though the cuts have different slice sizes, they land on the exact same spot on the number line!
        </Banner>
      )}
    </div>
  );
}

