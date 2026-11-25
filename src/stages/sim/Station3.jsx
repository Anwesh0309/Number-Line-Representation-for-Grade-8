import React, { useState } from 'react';
import { NumberLine } from '../../components/NumberLineDiagram.jsx';
import { fmt, fmtFixed, parseNum, round6 } from '../../utils/format.js';
import { axisFor, SIM_STATIONS } from '../../mathData.js';
import {
  Banner, Stat, GoldBtn, GhostBtn,
  RealWorldBadge, StoryCallout, GradeTip, PANEL
} from './shared.jsx';

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const paren = (v) => (v < 0 ? `(${fmt(v)})` : fmt(v));

const inputCls =
  'bg-[#14082c] border-2 border-cyan-400/70 rounded-xl px-4 py-2 text-white font-display font-900 text-base sm:text-lg text-center outline-none focus:border-amber-400 w-36 shadow-inner';

/* =========================================================================
   STATION 3 · ACTIVITY 1 — HIGH-SPEED RAIL MILEPOST DETECTIVE
   Real-World Scenario: High-speed rail line telemetry breakdown:
   Train beacon A is at km va, beacon B is at km vb. Track emergency beacon P
   is detected at an unlabelled sleeper. Reverse-engineer the step size and find P!
   Story Alignment: Slide 1 & Detective Lab (Every number has an exact spot).
   ========================================================================= */
function makeMystery() {
  const scale = pick([1, 2, 3, 4, 5, 10, 0.5]);
  const start = scale * randInt(-6, -1);
  const i = randInt(1, 3);
  const j = randInt(6, 9);
  let k;
  do { k = randInt(0, 10); } while (k === i || k === j);
  const val = (t) => round6(start + t * scale);
  return { scale, i, j, k, va: val(i), vb: val(j), ans: val(k) };
}

export function MysteryPoint({ onComplete, onRetry }) {
  const [pz, setPz] = useState(makeMystery);
  const [text, setText] = useState('');
  const [status, setStatus] = useState(null);
  const [hint, setHint] = useState(false);

  const check = () => {
    const n = parseNum(text);
    if (Math.abs(n - pz.ans) < 1e-6) {
      setStatus({ ok: true });
      onComplete();
    } else {
      setStatus({ ok: false });
      onRetry();
    }
  };

  const fresh = () => {
    setPz(makeMystery());
    setText('');
    setStatus(null);
    setHint(false);
  };

  const distKm = round6(pz.vb - pz.va);
  const stepCount = pz.j - pz.i;
  const pStepFromA = pz.k - pz.i;

  return (
    <div className={PANEL}>
      <RealWorldBadge
        icon="🚄"
        title="High-Speed Rail Telemetry · Milepost Detective"
        context="Calculating track sleeper step size to locate emergency sensor P along the railway line"
        level="Grade 7 Scale, Intervals & Algebra"
      />

      <StoryCallout slideRef="Slide 1 & Detective Lab">
        Slide 1 rule: "Every number has an exact spot on the line. When tick labels are missing, find the size of one step first!"
      </StoryCallout>

      {/* Rail Telemetry HUD Box */}
      <div className="w-full bg-[#12062b] rounded-2xl border-2 border-cyan-400/40 p-3 sm:p-4 shadow-xl flex flex-col items-center gap-3">
        {/* Track Telemetry Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="font-900 text-amber-300">Signal A: km {fmt(pz.va)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            <span className="font-900 text-cyan-300">Signal B: km {fmt(pz.vb)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" />
            <span className="font-900 text-rose-300">Emergency Sensor P: ? km</span>
          </div>
        </div>

        {/* Number Line Diagram */}
        <NumberLine
          min={0} max={10} tickStep={1} labels={[pz.i, pz.j]}
          labelFmt={(v) => (v === pz.i ? `${fmt(pz.va)} km` : `${fmt(pz.vb)} km`)}
          points={[
            { v: pz.i, label: `A (${fmt(pz.va)} km)`, color: '#facc15' },
            { v: pz.j, label: `B (${fmt(pz.vb)} km)`, color: '#38bdf8' },
            { v: pz.k, label: status?.ok ? `P = ${fmt(pz.ans)} km` : 'P (?)', color: '#f43f5e' }
          ]}
          segments={[{ a: pz.i, b: pz.j, label: `${stepCount} sleeper intervals = ${fmt(distKm)} km`, color: '#4ade80' }]}
          maxWidth={640}
        />
        <p className="text-[11px] font-bold text-slate-300">
          Track sleeper spacing is constant. Work out the distance of 1 step, then count to P.
        </p>
      </div>

      {/* Real-World Telemetry Stats */}
      <div className="w-full flex flex-wrap gap-2.5 justify-center">
        <Stat label="Total Span A➔B" value={`${fmt(distKm)} km`} tone="text-amber-300" sub={`${stepCount} track intervals`} />
        <Stat label="1 Step Distance" value={hint ? `${fmt(pz.scale)} km` : '? km'} tone="text-cyan-300" sub="Distance per sleeper" />
        <Stat label="P Position from A" value={`${Math.abs(pStepFromA)} steps ${pStepFromA > 0 ? 'East (+)' : 'West (-)'}`} tone="text-pink-300" sub="Relative step count" />
      </div>

      {/* Answer Input Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
        <span className="font-display font-900 text-base sm:text-lg text-white">Location of P =</span>
        <input
          type="text"
          inputMode="text"
          value={text}
          placeholder="e.g. 12"
          onChange={(e) => { setText(e.target.value); setStatus(null); }}
          onKeyDown={(e) => e.key === 'Enter' && text && check()}
          className={inputCls}
        />
        <span className="font-display font-900 text-base sm:text-lg text-cyan-300">km</span>
        <GoldBtn onClick={check} disabled={!text.trim() || status?.ok}>Verify Milepost ✨</GoldBtn>
        <GhostBtn onClick={() => setHint((h) => !h)}>💡 Railway Hint</GhostBtn>
        <GhostBtn onClick={fresh}>🔄 New Track Puzzle</GhostBtn>
      </div>

      <GradeTip title="Grade 7 Detective Strategy: Two-Step Method" speech={SIM_STATIONS[2].activities[0].tipSpeech}>
        1. <strong>Find Step Size:</strong> Subtract (Beacon B − Beacon A), then divide by the number of tick intervals ({stepCount}). That gives the value of exactly one step! <br />
        2. <strong>Count to P:</strong> Starting at Beacon A ({fmt(pz.va)}), add or subtract one step size for each tick towards P!
      </GradeTip>

      {hint && (
        <div className="p-3 bg-amber-950/95 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center fade-in-up shrink-0 shadow-lg">
          💡 Step size = (Signal B − Signal A) ÷ {stepCount} steps = ({fmt(pz.vb)} − {paren(pz.va)}) ÷ {stepCount} = <strong>{fmt(pz.scale)} km per step</strong>. P is {Math.abs(pStepFromA)} step{Math.abs(pStepFromA) === 1 ? '' : 's'} {pStepFromA > 0 ? 'right' : 'left'} of A!
        </div>
      )}

      {status?.ok && (
        <Banner ok>
          🎉 Spot on! Each railway sleeper marks {fmt(pz.scale)} km. Sensor P is {Math.abs(pStepFromA)} step{Math.abs(pStepFromA) === 1 ? '' : 's'} from Signal A, putting it at exactly <strong>{fmt(pz.ans)} km</strong>.
        </Banner>
      )}
      {status && !status.ok && (
        <Banner ok={false}>
          Not quite right yet. Calculate the size of 1 step first: ({fmt(pz.vb)} − {paren(pz.va)}) ÷ {stepCount}. Then add or subtract from Signal A.
        </Banner>
      )}
    </div>
  );
}

/* =========================================================================
   STATION 3 · ACTIVITY 2 — COAST GUARD RESCUE PATROL MIDPOINT
   Real-World Scenario: Stranded vessel at A, Coastal Lighthouse at B.
   Coast Guard Rescue Helicopter M must calculate total search distance
   and deploy supply parachute at the exact midpoint M!
   Story Alignment: Slide 5 (Distance |a - b| and Midpoint (a + b) / 2).
   ========================================================================= */
function makeBeacons() {
  const a = randInt(-10, 2);
  const b = a + randInt(4, 12);
  return { a, b };
}

export function MidpointMission({ onComplete, onRetry }) {
  const [pz, setPz] = useState(makeBeacons);
  const [dText, setDText] = useState('');
  const [mText, setMText] = useState('');
  const [status, setStatus] = useState(null);
  const [hint, setHint] = useState(false);

  const { a, b } = pz;
  const ax = axisFor(a - 2, b + 2);
  const dist = b - a;
  const mid = (a + b) / 2;
  const mGuess = parseNum(mText);

  const points = [
    { v: a, label: `Vessel A (${fmt(a)} NM)`, color: '#facc15' },
    { v: b, label: `Lighthouse B (${fmt(b)} NM)`, color: '#38bdf8' }
  ];
  if (!Number.isNaN(mGuess) && mGuess >= ax.min && mGuess <= ax.max && !status?.ok) {
    points.push({ v: mGuess, label: `Helicopter M (${fmt(mGuess)} NM)`, color: '#4ade80', hollow: true, lift: 1 });
  }
  if (status?.ok) {
    points.push({ v: mid, label: `Helicopter M (${fmt(mid)} NM)`, color: '#4ade80', lift: 1 });
  }

  const check = () => {
    const dOk = Math.abs(parseNum(dText) - dist) < 1e-6;
    const mOk = Math.abs(parseNum(mText) - mid) < 1e-6;
    if (dOk && mOk) {
      setStatus({ ok: true });
      onComplete();
    } else {
      setStatus({ ok: false, dOk, mOk });
      onRetry();
    }
  };

  const fresh = () => {
    setPz(makeBeacons());
    setDText('');
    setMText('');
    setStatus(null);
    setHint(false);
  };

  return (
    <div className={PANEL}>
      <RealWorldBadge
        icon="🚁"
        title="Coast Guard Air Rescue · Patrol Midpoint Waypoint"
        context="Calculating patrol distance and deploying supply drop halfway between vessel and lighthouse"
        level="Grade 7 Distance & Coordinate Midpoint"
      />

      <StoryCallout slideRef="Slide 5: Absolute Value & Distance">
        Story Slide 5: "Distance between two points a and b is |a − b|, never negative. The midpoint is exactly halfway: (a + b) ÷ 2!"
      </StoryCallout>

      {/* Radar Coordinate Map Display */}
      <div className="w-full bg-[#12062b] rounded-2xl border-2 border-cyan-400/40 p-3 sm:p-4 shadow-xl flex flex-col items-center gap-3">
        {/* Radar Telemetry Header */}
        <div className="w-full flex items-center justify-between bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 text-xs font-bold">
          <span className="text-amber-300 flex items-center gap-1.5">
            <span>⛵</span> Stranded Vessel A: {fmt(a)} Nautical Miles
          </span>
          <span className="text-sky-300 flex items-center gap-1.5">
            <span>🗼</span> Lighthouse B: {fmt(b)} Nautical Miles
          </span>
          <span className="text-emerald-300 flex items-center gap-1.5">
            <span>🚁</span> Rescue Drop M: {mText ? `${mText} NM` : '? NM'}
          </span>
        </div>

        <NumberLine
          {...ax} points={points}
          segments={status?.ok ? [{ a, b, label: `Patrol Corridor Distance = ${dist} NM`, color: '#4ade80' }] : []}
          interactive snap={0.5}
          onPick={(v) => { if (!status?.ok) { setMText(fmt(v)); setStatus(null); } }} maxWidth={640}
        />
        <p className="text-[11px] font-bold text-slate-300">
          👆 Tap the line to position Rescue Helicopter M, or type the answers in the mission flight computer below
        </p>
      </div>

      {/* Flight Computer Inputs */}
      <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
        <label className="flex items-center gap-2 font-display font-900 text-white text-xs sm:text-sm bg-[#14082c] px-3.5 py-2 rounded-2xl border border-white/15 shadow-md">
          <span>📏 Total Patrol Distance:</span>
          <input
            type="text"
            value={dText}
            placeholder="|B − A|"
            onChange={(e) => { setDText(e.target.value); setStatus(null); }}
            className={inputCls}
          />
          <span className="text-amber-300 text-xs">NM</span>
        </label>

        <label className="flex items-center gap-2 font-display font-900 text-white text-xs sm:text-sm bg-[#14082c] px-3.5 py-2 rounded-2xl border border-white/15 shadow-md">
          <span>🎯 Midpoint Drop Waypoint M:</span>
          <input
            type="text"
            value={mText}
            placeholder="(A + B) / 2"
            onChange={(e) => { setMText(e.target.value); setStatus(null); }}
            className={inputCls}
          />
          <span className="text-emerald-300 text-xs">NM</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
        <GoldBtn onClick={check} disabled={!dText.trim() || !mText.trim() || status?.ok}>
          Deploy Rescue Mission ✨
        </GoldBtn>
        <GhostBtn onClick={() => setHint((h) => !h)}>💡 Rescue Formula</GhostBtn>
        <GhostBtn onClick={fresh}>🔄 New Coordinates</GhostBtn>
      </div>

      <GradeTip title="Grade 7 Flight Navigation: Distance vs Midpoint" speech={SIM_STATIONS[2].activities[1].tipSpeech}>
        • <strong>Distance:</strong> Subtract coordinates and take the absolute value: |B − A| = |{fmt(b)} − {paren(a)}|. Distance is always positive! <br />
        • <strong>Midpoint:</strong> Find the average coordinate: (A + B) ÷ 2. That is the exact point halfway between them!
      </GradeTip>

      {hint && (
        <div className="p-3 bg-amber-950/95 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center fade-in-up shrink-0 shadow-lg">
          💡 Distance = |{fmt(b)} − {paren(a)}| = <strong>{dist} NM</strong>. Midpoint = ({fmt(a)} + {paren(b)}) ÷ 2 = <strong>{fmt(mid)} NM</strong> (which is {dist / 2} NM away from each beacon).
        </div>
      )}

      {status?.ok && (
        <Banner ok>
          🎉 Mission success! Total distance is |{fmt(b)} − {paren(a)}| = {dist} Nautical Miles. Helicopter M deployed the drop at ({fmt(a)} + {paren(b)}) ÷ 2 = <strong>{fmt(mid)} NM</strong>, exactly {dist / 2} NM from both beacons!
        </Banner>
      )}
      {status && !status.ok && (
        <Banner ok={false}>
          {status.dOk ? '✅ Distance is correct! ' : '❌ Distance: compute |B − A| (count total units). '}
          {status.mOk ? '✅ Midpoint is correct!' : '❌ Midpoint: it is halfway: (A + B) ÷ 2.'}
        </Banner>
      )}
    </div>
  );
}

/* =========================================================================
   STATION 3 · ACTIVITY 3 — ARCHITECTURAL TILE ROOT SQUEEZE
   Real-World Scenario: Cutting a square marble mosaic tile for a historic fountain.
   Target tile surface area is exactly N m². Since Area = x · x, x must be √N.
   Story Alignment: Slide 6 (Square unit diagonal √2 swung down by compass).
   ========================================================================= */
const TARGETS = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15];

export function RootSqueeze({ onComplete, onRetry }) {
  const [n, setN] = useState(() => pick(TARGETS));
  const k = Math.floor(Math.sqrt(n));
  const [x, setX] = useState(() => round6(k + 0.5));
  const [status, setStatus] = useState(null);

  const sq = x * x;
  const diff = Math.abs(sq - n);
  const heat = diff < 0.25 ? '🔥 Precision Laser Cut!' : diff < 1.2 ? '♨️ Warm - Close Cut' : '❄️ Cold - Off Target';
  const dirText = sq < n ? 'Tile area too small: slide right ▶' : sq > n ? 'Tile area too big: ◀ slide left' : 'Exact match!';

  const nudge = (dx) => {
    if (status?.ok) return;
    const nx = Math.max(k, Math.min(k + 1, round6(x + dx)));
    setX(nx);
    setStatus(null);
  };

  const lock = () => {
    if (Math.abs(x - Math.sqrt(n)) <= 0.015) {
      setStatus({ ok: true });
      onComplete();
    } else {
      setStatus({ ok: false });
      onRetry();
    }
  };

  const fresh = () => {
    const nn = pick(TARGETS.filter((t) => t !== n));
    setN(nn);
    setX(round6(Math.floor(Math.sqrt(nn)) + 0.5));
    setStatus(null);
  };

  return (
    <div className={PANEL}>
      <RealWorldBadge
        icon="🏛️"
        title="Architectural Mosaic Studio · Tile Laser Cutter"
        context={`Cutting a square marble tile with target surface area exactly ${n}.0 m²`}
        level="Grade 7 Irrational Numbers & Square Roots"
      />

      <StoryCallout slideRef="Slide 6: Irrational Numbers Have Spots Too!">
        Story Slide 6: "Numbers like √2 are irrational: their decimals never end, but they have exact spots! Swing the square diagonal down with a compass!"
      </StoryCallout>

      {/* Blueprint Visual & Target Card */}
      <div className="w-full bg-[#12062b] rounded-2xl border-2 border-amber-400/50 p-3 sm:p-4 shadow-xl flex flex-col items-center gap-3">
        {/* Blueprint Specs Header */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">📐</span>
            <div>
              <p className="font-900 text-amber-300">Square Fountain Tile Blueprint</p>
              <p className="text-[10px] text-slate-300 font-bold">Target Area: Side × Side = {n}.0 m² (so Side = √{n} m)</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Target Range</span>
            <span className="font-mono font-900 text-xs sm:text-sm text-cyan-300 block">
              Between {k} and {k + 1} (since {k}²={k*k} &lt; {n} &lt; {k+1}²={(k+1)*(k+1)})
            </span>
          </div>
        </div>

        {/* Dynamic Tile Blueprint Preview */}
        <div className="flex items-center justify-center gap-4 py-1">
          <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-amber-700/60 to-purple-900/60 rounded-xl border-2 border-amber-300 flex flex-col items-center justify-center p-1 text-center shadow-inner relative overflow-hidden">
            <span className="text-[10px] font-bold text-amber-200">Cut Area</span>
            <span className="font-display font-900 text-sm sm:text-base text-white">{sq.toFixed(3)} m²</span>
            <span className="text-[9px] text-slate-300 font-bold">Side: {fmtFixed(x, 2)} m</span>
          </div>
          <div className="text-left text-xs font-bold text-slate-200">
            <p className="text-amber-300 font-black">Target Fountain Area: {n}.000 m²</p>
            <p className="text-slate-300">Difference: <span className="font-mono text-cyan-300">{diff.toFixed(4)} m²</span></p>
            <p className="text-[11px] text-pink-300 font-bold mt-0.5">{heat} • {dirText}</p>
          </div>
        </div>

        {/* Number Line */}
        <NumberLine
          min={k} max={k + 1} tickStep={0.1} labels={[k, k + 0.5, k + 1]}
          labelFmt={(v) => `${fmtFixed(v, Number.isInteger(v) ? 0 : 1)} m`}
          points={[{ v: round6(x), label: `${fmtFixed(x, 2)} m`, color: '#facc15' }]}
          interactive snap={0.01}
          onPick={(v) => { if (!status?.ok) { setX(round6(v)); setStatus(null); } }} maxWidth={640}
        />
        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-300 pt-1">
          <span>👆 Drag to squeeze side length x</span>
          <span>•</span>
          <button onClick={() => nudge(-0.01)} className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px] text-cyan-200">◀ -0.01</button>
          <button onClick={() => nudge(0.01)} className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px] text-cyan-200">+0.01 ▶</button>
        </div>
      </div>

      {/* Real-World Telemetry */}
      <div className="w-full flex flex-wrap gap-2.5 justify-center">
        <Stat label="Side Length x" value={`${fmtFixed(x, 2)} m`} tone="text-amber-300" sub={`Target: √${n} m`} />
        <Stat label="Current Area (x²)" value={`${sq.toFixed(4)} m²`} tone="text-cyan-300" sub={`${fmtFixed(x, 2)} × ${fmtFixed(x, 2)}`} />
        <Stat label="Target Area" value={`${n}.000 m²`} tone="text-emerald-300" sub="Fountain slot size" />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
        <GoldBtn onClick={lock} disabled={status?.ok}>
          🎯 Lock In Laser Cut
        </GoldBtn>
        <GhostBtn onClick={fresh}>🔄 New Tile Target</GhostBtn>
      </div>

      <GradeTip title="Grade 7 Insight: Why Can't We Write √N as a Simple Fraction?" speech={SIM_STATIONS[2].activities[2].tipSpeech}>
        Numbers like √2, √3, and √5 are <strong>irrational</strong>. Their decimals go on forever without ever repeating ({Math.sqrt(n).toFixed(5)}…). But as you just proved, they are not imaginary—they have an exact, razor-sharp physical coordinate on the ruler!
      </GradeTip>

      {status?.ok && (
        <Banner ok>
          🎉 Precision cut achieved! √{n} ≈ <strong>{fmtFixed(x, 2)} m</strong> (True value: {Math.sqrt(n).toFixed(6)}… m). Even though its decimals never end, it has one exact, immovable spot on the number line!
        </Banner>
      )}
      {status && !status.ok && (
        <Banner ok={false}>
          Not close enough yet. Keep fine-tuning until x × x is within 0.03 of {n}.0 m².
        </Banner>
      )}
    </div>
  );
}

