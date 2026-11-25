import React, { useState, useEffect } from 'react';
import { NumberLine } from '../../components/NumberLineDiagram.jsx';
import { fmt } from '../../utils/format.js';
import { shuffle, SIM_STATIONS } from '../../mathData.js';
import {
  Banner, Stat, GoldBtn, GhostBtn, Pill,
  RealWorldBadge, StoryCallout, GradeTip, PANEL
} from './shared.jsx';

const pick = (a) => a[Math.floor(Math.random() * a.length)];

/* =========================================================================
   STATION 2 · ACTIVITY 1 — POLAR WEATHER THERMOMETER DROP ZONE
   Real-World Scenario: McMurdo Polar Station recording temperature readings
   from freezing blizzards to heated hydroponic research domes.
   Story Alignment: Slide 4 & Slide 1 (Thermometer analogy, left is colder, right is warmer).
   ========================================================================= */
const DROP_POOL = [
  { s: '−3.5', v: -3.5, label: 'Polar Blizzard (−3.5°C)', icon: '❄️', type: 'Severe Frost' },
  { s: '−3', v: -3, label: 'Glacial Ridge (−3°C)', icon: '🧊', type: 'Deep Freeze' },
  { s: '−2.5', v: -2.5, label: 'Windchill Gale (−2.5°C)', icon: '🌨️', type: 'Sub-Zero' },
  { s: '−2', v: -2, label: 'Permafrost Ice (−2°C)', icon: '🧊', type: 'Sub-Zero' },
  { s: '−7/4', v: -1.75, label: 'Sleet Storm (−1.75°C)', icon: '🌨️', type: 'Sub-Zero' },
  { s: '−3/2', v: -1.5, label: 'Tundra Chill (−1.5°C)', icon: '🌬️', type: 'Sub-Zero' },
  { s: '−5/4', v: -1.25, label: 'Frozen Fog (−1.25°C)', icon: '🌫️', type: 'Sub-Zero' },
  { s: '−1', v: -1, label: 'Frosty Breeze (−1°C)', icon: '❄️', type: 'Sub-Zero' },
  { s: '−3/4', v: -0.75, label: 'Melting Glaze (−0.75°C)', icon: '💧', type: 'Near Freezing' },
  { s: '−1/2', v: -0.5, label: 'Ice Bath Crust (−0.5°C)', icon: '💧', type: 'Near Freezing' },
  { s: '−0.25', v: -0.25, label: 'Slush Mix (−0.25°C)', icon: '💧', type: 'Freezing Threshold' },
  { s: '0.25', v: 0.25, label: 'Melt Slush (+0.25°C)', icon: '🌱', type: 'Above Freezing' },
  { s: '1/2', v: 0.5, label: 'Hydroponics (+0.5°C)', icon: '🌱', type: 'Cool Shelter' },
  { s: '3/4', v: 0.75, label: 'Seedling Dome (+0.75°C)', icon: '🌿', type: 'Cool Shelter' },
  { s: '5/4', v: 1.25, label: 'Botanical Pod (+1.25°C)', icon: '🪴', type: 'Temperate' },
  { s: '3/2', v: 1.5, label: 'Base Habitat (+1.5°C)', icon: '🏕️', type: 'Heated Station' },
  { s: '1.75', v: 1.75, label: 'Living Quarters (+1.75°C)', icon: '🏡', type: 'Heated Station' },
  { s: '2', v: 2, label: 'Solarium Lab (+2°C)', icon: '☀️', type: 'Warm Research' },
  { s: '2.25', v: 2.25, label: 'Solar Greenhouse (+2.25°C)', icon: '☀️', type: 'Warm Research' },
  { s: '2.5', v: 2.5, label: 'Geothermal Generator (+2.5°C)', icon: '♨️', type: 'Geothermal' },
  { s: '3', v: 3, label: 'Incubator Chamber (+3°C)', icon: '🔥', type: 'Geothermal' },
  { s: '3.5', v: 3.5, label: 'Heat Core Exchanger (+3.5°C)', icon: '🔥', type: 'Thermal Core' }
];

function makeDropCards() {
  for (let tries = 0; tries < 500; tries++) {
    const chosen = shuffle(DROP_POOL).slice(0, 5);
    const sorted = [...chosen].sort((a, b) => a.v - b.v);
    const apart = sorted.every((c, i) => i === 0 || c.v - sorted[i - 1].v >= 0.5);
    if (
      apart &&
      chosen.filter((c) => c.v < 0).length >= 2 &&
      chosen.some((c) => c.s.includes('/')) &&
      chosen.some((c) => c.s.includes('.'))
    ) {
      return chosen.map((c, i) => ({ ...c, id: i }));
    }
  }
  return [DROP_POOL[0], DROP_POOL[4], DROP_POOL[12], DROP_POOL[18], DROP_POOL[21]].map((c, i) => ({ ...c, id: i }));
}

export function DropZone({ onComplete, onRetry }) {
  const [cards, setCards] = useState(makeDropCards);
  const [placed, setPlaced] = useState({});
  const [sel, setSel] = useState(0);
  const [checked, setChecked] = useState(false);

  const allPlaced = cards.every((c) => placed[c.id] != null);
  const okOf = (c) => placed[c.id] != null && Math.abs(placed[c.id] - c.v) < 0.01;
  const score = cards.filter(okOf).length;

  useEffect(() => { if (checked && score === cards.length) onComplete(); }, [checked, score]); // eslint-disable-line

  const drop = (val) => {
    if (checked || sel == null) return;
    setPlaced((p) => ({ ...p, [sel]: val }));
    const next = cards.find((c) => c.id !== sel && placed[c.id] == null);
    if (next) setSel(next.id);
  };

  const check = () => {
    setChecked(true);
    if (score !== cards.length) onRetry();
  };

  const fix = () => {
    const kept = {};
    cards.forEach((c) => { if (okOf(c)) kept[c.id] = placed[c.id]; });
    setPlaced(kept);
    setChecked(false);
    const first = cards.find((c) => kept[c.id] == null);
    setSel(first ? first.id : null);
  };

  const fresh = () => {
    const c = makeDropCards();
    setCards(c); setPlaced({}); setChecked(false); setSel(c[0].id);
  };

  const activeCard = cards.find((c) => c.id === sel);
  const placedList = cards.filter((c) => placed[c.id] != null).sort((a, b) => placed[a.id] - placed[b.id]);
  const points = placedList.map((c, i) => ({
    v: placed[c.id],
    label: `${c.s}°C`,
    lift: i % 3,
    color: checked ? (okOf(c) ? '#4ade80' : '#f43f5e') : '#facc15'
  }));
  if (checked) {
    cards.filter((c) => !okOf(c)).forEach((c) => points.push({ v: c.v, label: `✓ ${c.s}°C`, color: '#4ade80', hollow: true, lift: 3 }));
  }

  return (
    <div className={PANEL}>
      <RealWorldBadge
        icon="❄️"
        title="Antarctic Weather Station · Thermometer Calibration"
        context="Calibrating sensor temperature logs from sub-zero blizzards to heated bio-domes"
        level="Grade 7 Meteorology & Integers"
      />

      <StoryCallout slideRef="Slide 4: Thermometer Analogy">
        Slide 4 reminder: "Think of a thermometer: −8°C is colder than −2°C! Left is less, right is greater."
      </StoryCallout>

      {/* Sensor Cards Tray */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2.5 shrink-0">
        {cards.map((c) => {
          const isSel = sel === c.id && !checked;
          const state = checked ? (okOf(c) ? 'ok' : 'bad') : placed[c.id] != null ? 'placed' : 'idle';
          return (
            <button
              key={c.id}
              onClick={() => !checked && setSel(c.id)}
              className={`px-3.5 py-2 rounded-2xl border-2 font-display font-900 text-sm sm:text-base flex items-center gap-2 transition cursor-pointer shadow-md ${
                isSel
                  ? 'border-amber-300 bg-amber-400 text-slate-950 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.7)]'
                  : state === 'ok' ? 'border-emerald-400 bg-emerald-600/40 text-emerald-100'
                  : state === 'bad' ? 'border-rose-400 bg-rose-600/40 text-rose-100 animate-shake'
                  : state === 'placed' ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-100'
                  : 'border-white/25 bg-[#14082c] text-white hover:border-amber-300'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.s}°C</span>
              {state === 'placed' && <span className="text-cyan-300 text-xs">✓ Placed</span>}
            </button>
          );
        })}
      </div>

      {/* Thermometer Display Card */}
      <div className="w-full bg-[#12062b] rounded-2xl border-2 border-cyan-400/35 p-3 sm:p-4 shadow-xl flex flex-col items-center gap-2.5">
        {/* Active Sensor Reading Detail */}
        {activeCard && !checked && (
          <div className="w-full flex items-center justify-between bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeCard.icon}</span>
              <div>
                <p className="font-900 text-amber-300">{activeCard.label}</p>
                <p className="text-[10px] text-slate-300 font-bold">Category: {activeCard.type}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target Value</span>
              <span className="font-mono font-900 text-sm sm:text-base text-cyan-300 block">{activeCard.s}°C</span>
            </div>
          </div>
        )}

        <NumberLine
          min={-4} max={4} tickStep={1} minorStep={0.25}
          labelFmt={(v) => `${v}°C`}
          points={points} interactive={!checked} snap={0.25} onPick={drop} maxWidth={640}
        />
        <p className="text-[11px] font-bold text-slate-300">
          {checked
            ? `Result: ${score} of ${cards.length} sensors placed correctly on the thermometer`
            : sel != null
            ? `👆 Tap the thermometer tick where ${activeCard?.s}°C belongs (in steps of 0.25°C)`
            : 'All 5 sensor logs placed. Press Check!'}
        </p>
      </div>

      {/* Real-World Telemetry Stats */}
      <div className="w-full flex flex-wrap gap-2.5 justify-center">
        <Stat label="Selected Sensor" value={activeCard ? `${activeCard.s}°C` : 'Done'} tone="text-amber-300" sub={activeCard?.type || 'All Logged'} />
        <Stat label="Freezing Point" value="0.0°C" tone="text-cyan-300" sub="Pure water melting" />
        <Stat label="Sub-Zero Sensors" value={`${cards.filter((c) => c.v < 0).length} of 5`} tone="text-sky-300" sub="Below 0°C freezing" />
        <Stat label="Accuracy Score" value={`${score}/${cards.length}`} tone="text-emerald-300" sub="Correctly calibrated" />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {!checked && <GoldBtn onClick={check} disabled={!allPlaced}>Check Readings ✓</GoldBtn>}
        {checked && score !== cards.length && <GoldBtn onClick={fix}>🛠️ Fix the red sensors</GoldBtn>}
        <GhostBtn onClick={fresh}>🔄 New Polar Sensors</GhostBtn>
      </div>

      <GradeTip title="Grade 7 Ordering Tip: How To Compare Negative Decimals & Fractions" speech={SIM_STATIONS[1].activities[0].tipSpeech}>
        Remember the thermometer rule: −2.5°C is colder than −1.5°C, so −2.5 must sit farther to the left from zero. The bigger a negative number looks, the colder and smaller it really is!
      </GradeTip>

      {checked && score === cards.length && (
        <Banner ok>
          🎉 Excellent meteorology work! All fractions, decimals, and negative readings sit precisely where they belong on the thermometer.
        </Banner>
      )}
      {checked && score !== cards.length && (
        <Banner ok={false}>
          Green hollow circles indicate the exact correct locations for the red cards. Count steps from 0 and try again!
        </Banner>
      )}
    </div>
  );
}

/* =========================================================================
   STATION 2 · ACTIVITY 2 — ARCTIC EXPEDITION MOUNTAIN ORDER UP
   Real-World Scenario: Mountain rangers ranking climate sensors across
   5 elevation camps from the coldest polar peak to the warmest base camp.
   Story Alignment: Slide 4 & Slide 6 (Ordering negatives, fractions, √2 and π).
   ========================================================================= */
const ORDER_POOL = [
  { s: '−3', v: -3, camp: 'Blizzard Peak (−3°C)', icon: '🏔️' },
  { s: '−2.5', v: -2.5, camp: 'Ice Shelf (−2.5°C)', icon: '🧊' },
  { s: '−3/2', v: -1.5, camp: 'Frost Ridge (−1.5°C)', icon: '🌨️' },
  { s: '−1', v: -1, camp: 'Wind Pass (−1°C)', icon: '🌬️' },
  { s: '−3/4', v: -0.75, camp: 'Glacial Moraine (−0.75°C)', icon: '❄️' },
  { s: '−1/4', v: -0.25, camp: 'Snowfield Camp (−0.25°C)', icon: '❄️' },
  { s: '0', v: 0, camp: 'Timberline Baseline (0°C)', icon: '💧' },
  { s: '0.4', v: 0.4, camp: 'Alpine Meadow (+0.4°C)', icon: '🌱' },
  { s: '3/4', v: 0.75, camp: 'Spring Shelter (+0.75°C)', icon: '🌿' },
  { s: '1.2', v: 1.2, camp: 'Valley Station (+1.2°C)', icon: '🏡' },
  { s: '√2', v: Math.SQRT2, camp: 'Geothermal Trail (√2 ≈ +1.41°C)', icon: '♨️' },
  { s: '9/4', v: 2.25, camp: 'Lowland Biolab (+2.25°C)', icon: '☀️' },
  { s: '2.6', v: 2.6, camp: 'South Foothills (+2.6°C)', icon: '🏕️' },
  { s: 'π', v: Math.PI, camp: 'Hot Springs Basin (π ≈ +3.14°C)', icon: '♨️' },
  { s: '−√2', v: -Math.SQRT2, camp: 'Crevasse Chasm (−√2 ≈ −1.41°C)', icon: '🧊' },
  { s: '−0.6', v: -0.6, camp: 'Upper Tarn (−0.6°C)', icon: '🌨️' }
];

function makeOrderCards() {
  for (let tries = 0; tries < 500; tries++) {
    const chosen = shuffle(ORDER_POOL).slice(0, 5);
    const sorted = [...chosen].sort((a, b) => a.v - b.v);
    const apart = sorted.every((c, i) => i === 0 || c.v - sorted[i - 1].v >= 0.3);
    if (apart && chosen.filter((c) => c.v < 0).length >= 2 && chosen.some((c) => c.s.includes('√') || c.s === 'π')) {
      return chosen.map((c, i) => ({ ...c, id: i }));
    }
  }
  return shuffle(ORDER_POOL.slice(0, 5)).map((c, i) => ({ ...c, id: i }));
}

export function OrderUp({ onComplete, onRetry }) {
  const [cards, setCards] = useState(makeOrderCards);
  const [order, setOrder] = useState([]);
  const [result, setResult] = useState(null);
  const [reveal, setReveal] = useState(false);

  const sortedIds = [...cards].sort((a, b) => a.v - b.v).map((c) => c.id);
  const byId = (id) => cards.find((c) => c.id === id);

  const tap = (id) => {
    if (result === 'ok' || order.includes(id)) return;
    setResult(null);
    setOrder((o) => [...o, id]);
  };
  const removeFrom = (slot) => {
    if (result === 'ok') return;
    setResult(null);
    setOrder((o) => o.slice(0, slot));
  };
  const check = () => {
    const ok = order.every((id, i) => id === sortedIds[i]);
    setResult(ok ? 'ok' : 'bad');
    if (ok) onComplete(); else onRetry();
  };
  const fresh = () => { setCards(makeOrderCards()); setOrder([]); setResult(null); setReveal(false); };

  const showLine = result === 'ok' || reveal;
  const points = sortedIds.map((id, i) => ({
    v: byId(id).v,
    label: byId(id).s,
    color: ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8'][i],
    lift: i % 2
  }));

  return (
    <div className={PANEL}>
      <RealWorldBadge
        icon="🏔️"
        title="Arctic Mountain Expedition · Climate Sorter"
        context="Ranking waypoint temperatures from coldest peak (left) to warmest valley (right)"
        level="Grade 7 Real Numbers & Ordering"
      />

      <StoryCallout slideRef="Slide 4 & 6: Ordering Numbers">
        Story Slide 4 & 6: "The farther right a number sits, the greater it is. Irrational numbers like √2 ≈ 1.414 and π ≈ 3.141 have exact spots too!"
      </StoryCallout>

      {/* Mountain Trail Gradient Indicator */}
      <div className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-950 via-purple-950 to-amber-950 border border-white/10 text-xs font-900 text-slate-200 shrink-0">
        <span className="flex items-center gap-1.5 text-sky-300">
          <span>❄️</span> COLDEST (Least / Farthest Left)
        </span>
        <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">Left &lt; Right</span>
        <span className="flex items-center gap-1.5 text-amber-300">
          WARMEST (Greatest / Farthest Right) <span>♨️</span>
        </span>
      </div>

      {/* Answer Slots (5 Mountain Waypoint Stations) */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2.5 shrink-0">
        {cards.map((_, slot) => {
          const id = order[slot];
          const c = id != null ? byId(id) : null;
          const wrong = result === 'bad' && c && id !== sortedIds[slot];
          return (
            <button
              key={slot}
              onClick={() => c && removeFrom(slot)}
              className={`min-w-[70px] sm:min-w-[85px] h-14 sm:h-16 rounded-2xl border-2 font-display font-900 text-base sm:text-xl flex flex-col items-center justify-center transition cursor-pointer shadow-md ${
                c
                  ? wrong
                    ? 'border-rose-400 bg-rose-600/40 text-rose-100 border-solid animate-shake'
                    : result === 'ok'
                    ? 'border-emerald-400 bg-emerald-600/40 text-emerald-100 border-solid shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                    : 'border-amber-300 bg-amber-400/20 text-amber-200 border-solid'
                  : 'border-white/20 border-dashed text-white/30 bg-[#12062b]'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase">Camp {slot + 1}</span>
              <span>{c ? c.s : '---'}</span>
            </button>
          );
        })}
      </div>

      {/* Card Tray */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2.5 shrink-0">
        {cards.map((c) => {
          const used = order.includes(c.id);
          return (
            <button
              key={c.id}
              disabled={used || result === 'ok'}
              onClick={() => tap(c.id)}
              className={`px-4 py-2 rounded-2xl border-2 font-display font-900 text-sm sm:text-base transition cursor-pointer shadow-md flex items-center gap-2 ${
                used
                  ? 'border-white/10 bg-white/5 text-white/20 shadow-none'
                  : 'border-cyan-400/60 bg-[#14082c] text-white hover:bg-cyan-500/20 hover:scale-105 hover:border-cyan-300'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.s}</span>
            </button>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
        <GoldBtn onClick={check} disabled={order.length < cards.length || result === 'ok'}>
          Check Order ✓
        </GoldBtn>
        <GhostBtn onClick={() => { setOrder([]); setResult(null); }} disabled={!order.length || result === 'ok'}>
          ↩ Reset Slots
        </GhostBtn>
        {result === 'bad' && (
          <GhostBtn onClick={() => setReveal(true)}>👀 Reveal Temperature Line</GhostBtn>
        )}
        <GhostBtn onClick={fresh}>🔄 New Expedition</GhostBtn>
      </div>

      <GradeTip title="Grade 7 Strategy: Where Do √2 and π Fit In?" speech={SIM_STATIONS[1].activities[1].tipSpeech}>
        Remember: √2 ≈ 1.414 (between 1 and 2), and π ≈ 3.141 (between 3 and 4). If comparing negatives, −3/2 = −1.5, which is smaller (colder) than −1.0 because it sits farther to the left!
      </GradeTip>

      {result === 'bad' && (
        <Banner ok={false}>
          Not quite right yet! Remember: on the number line, numbers farther to the left are colder and smaller. Tap any red slot to pick it back up.
        </Banner>
      )}
      {result === 'ok' && (
        <Banner ok>
          🎉 Flawless expedition ranking! You correctly ordered negatives, decimals, fractions, and irrational square roots from least to greatest.
        </Banner>
      )}

      {showLine && (
        <div className="w-full flex flex-col items-center bg-[#14082c]/85 rounded-2xl border border-white/15 p-2 fade-in-up">
          <NumberLine min={-4} max={4} tickStep={1} minorStep={0.25} points={points} maxWidth={640} />
          <p className="text-xs font-black text-amber-300 pt-1">
            Exact Order: {sortedIds.map((id) => byId(id).s).join(' < ')}
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   STATION 2 · ACTIVITY 3 — ROLLER COASTER SAFETY GATE & SPEED RADAR
   Real-World Scenario: Amusement park ride safety barrier governor:
   height clearance, maximum wind limits, and coolant temperature ceilings.
   Story Alignment: Slide 7 (Inequalities: open vs closed circles, shading direction).
   ========================================================================= */
const SCENARIOS = [
  { op: '≥', a: 2, title: 'Super Coaster Height Clearance', desc: 'Rider height x must be at least 2.0 meters (x ≥ 2)' },
  { op: '>', a: 3, title: 'Hyperloop Launch Acceleration', desc: 'Launch speed x must strictly exceed 3.0 m/s (x > 3)' },
  { op: '≤', a: -1, title: 'Cryo-Coolant Safety Ceiling', desc: 'Coolant temp x must be at most −1.0°C (x ≤ −1)' },
  { op: '<', a: 4, title: 'Track Wind Gust Warning', desc: 'Crosswind speed x must be strictly less than 4.0 m/s (x < 4)' },
  { op: '≥', a: -2, title: 'Winter Coaster Thermal Barrier', desc: 'Track temperature x must be at least −2.0°C (x ≥ −2)' },
  { op: '≤', a: 3, title: 'Centrifuge G-Force Safety Limit', desc: 'Gravity force x must be at most 3.0 Gs (x ≤ 3)' }
];

const READ = {
  '>': 'strictly greater than (more than)',
  '≥': 'greater than or equal to (at least)',
  '<': 'strictly less than (under)',
  '≤': 'less than or equal to (at most)'
};

const opOf = (dir, closed) => (dir === 'right' ? (closed ? '≥' : '>') : closed ? '≤' : '<');

export function GraphBuilder({ onComplete, onRetry }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const target = SCENARIOS[scenarioIdx % SCENARIOS.length];

  const [b, setB] = useState(null);
  const [closed, setClosed] = useState(null);
  const [dir, setDir] = useState(null);
  const [wins, setWins] = useState(0);
  const [status, setStatus] = useState(null);

  const ready = b != null && closed != null && dir != null;
  const right = dir === 'right';

  useEffect(() => { if (wins >= 3) onComplete(); }, [wins]); // eslint-disable-line

  let shade = null;
  let points = [];
  if (b != null && dir == null) points = [{ v: b, hollow: closed === false, label: `${b}`, color: '#38bdf8' }];
  if (b != null && dir != null) {
    shade = right
      ? { from: b, to: Infinity, fromClosed: !!closed }
      : { from: -Infinity, to: b, toClosed: !!closed };
  }

  const check = () => {
    const wantRight = target.op === '>' || target.op === '≥';
    const wantClosed = target.op === '≥' || target.op === '≤';
    const msgs = [];
    if (b !== target.a) msgs.push(`boundary tick is at ${b}, but target is ${target.a}`);
    if (closed !== wantClosed) msgs.push(wantClosed ? 'the boundary is included (≥/≤), so use a closed circle ●' : 'the boundary is not included (>/<), so use an open circle ○');
    if ((dir === 'right') !== wantRight) msgs.push(wantRight ? 'shade to the right for values greater than boundary' : 'shade to the left for values less than boundary');

    if (!msgs.length) {
      setStatus({ ok: true });
      setWins((w) => w + 1);
    } else {
      setStatus({ ok: false, msgs });
      onRetry();
    }
  };

  const next = () => {
    setScenarioIdx((i) => i + 1);
    setB(null); setClosed(null); setDir(null); setStatus(null);
  };

  return (
    <div className={PANEL}>
      <RealWorldBadge
        icon="🎢"
        title="Theme Park Safety Governor · Electronic Barrier Gate"
        context="Configuring inequality sensors for roller coaster height, speed & coolant rules"
        level="Grade 7 Inequalities & Graphing"
      />

      <StoryCallout slideRef="Slide 7: Inequalities on the Line">
        Slide 7 rule: "Open circle: not included. Closed circle: included. Ride rule: at least 120 cm is x ≥ 120!"
      </StoryCallout>

      {/* Round & Mission Progress */}
      <div className="w-full flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                i < wins ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_8px_#34d399]' : 'bg-transparent border-white/40'
              }`}
            />
          ))}
          <span className="text-xs font-900 text-amber-300">Gate Safety Mission {Math.min(wins + 1, 3)} of 3</span>
        </div>
        <span className="text-[11px] font-bold text-slate-300">{target.title}</span>
      </div>

      {/* Scenario Target Display Box */}
      <div className="w-full bg-[#14082c] border-2 border-amber-400/60 rounded-2xl px-5 py-3 shadow-xl flex flex-col items-center justify-center gap-1 shrink-0">
        <span className="text-xs font-black text-amber-300 uppercase tracking-widest">{target.desc}</span>
        <div className="font-display font-900 text-2xl sm:text-4xl text-white my-0.5">
          x {target.op} {fmt(target.a)}
        </div>
        <span className="text-[11px] font-extrabold text-cyan-300">
          Meaning: x is {READ[target.op]} {fmt(target.a)}
        </span>
      </div>

      {/* Number Line Display */}
      <div className="w-full bg-[#12062b] rounded-2xl border-2 border-cyan-400/35 p-3 sm:p-4 shadow-xl flex flex-col items-center gap-2">
        <NumberLine
          min={-6} max={6} tickStep={1} labelStep={1}
          shade={shade} points={points} interactive snap={1}
          onPick={(v) => { if (!status?.ok) { setB(v); setStatus(null); } }} maxWidth={620}
        />
        <p className="text-xs font-900 text-cyan-300">
          {b == null
            ? '👆 Step 1: Tap the number line to set the boundary number'
            : ready
            ? `Current Gate Graph: x ${opOf(dir, closed)} ${fmt(b)}`
            : `Boundary set at ${fmt(b)}. Now choose the circle inclusion and shading direction.`}
        </p>
      </div>

      {/* Control Buttons for Circle & Shading */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center gap-1.5 bg-[#14082c] px-3 py-1.5 rounded-xl border border-white/15">
          <span className="text-xs font-900 text-slate-300 mr-1">Circle:</span>
          <Pill active={closed === false} onClick={() => { setClosed(false); setStatus(null); }}>
            ○ Open (Not Included)
          </Pill>
          <Pill active={closed === true} onClick={() => { setClosed(true); setStatus(null); }}>
            ● Closed (Included)
          </Pill>
        </div>

        <div className="flex items-center gap-1.5 bg-[#14082c] px-3 py-1.5 rounded-xl border border-white/15">
          <span className="text-xs font-900 text-slate-300 mr-1">Shade Direction:</span>
          <Pill active={dir === 'left'} tone="gold" onClick={() => { setDir('left'); setStatus(null); }}>
            ◀ Left (Less Than)
          </Pill>
          <Pill active={dir === 'right'} tone="gold" onClick={() => { setDir('right'); setStatus(null); }}>
            Right (Greater Than) ▶
          </Pill>
        </div>
      </div>

      {/* Check / Next */}
      <div className="flex items-center justify-center gap-3 shrink-0">
        {!status?.ok && <GoldBtn onClick={check} disabled={!ready}>Lock In Gate Sensor ✓</GoldBtn>}
        {status?.ok && wins < 3 && <GoldBtn onClick={next}>Next Safety Gate →</GoldBtn>}
      </div>

      <GradeTip title="Grade 7 Rule of Thumb: Open vs Closed Circles" speech={SIM_STATIONS[1].activities[2].tipSpeech}>
        Use a <strong>closed circle ●</strong> when the boundary number is allowed (has the equal bar: ≤ or ≥). Use an <strong>open circle ○</strong> when the value must strictly stay beyond the boundary (&lt; or &gt;)!
      </GradeTip>

      {status && !status.ok && (
        <Banner ok={false}>
          Sensor calibration adjustment needed: {status.msgs.join('; ')}.
        </Banner>
      )}
      {status?.ok && wins < 3 && (
        <Banner ok>
          ✅ Safety gate armed! x {target.op} {fmt(target.a)} is graphed with the proper circle and shading.
        </Banner>
      )}
      {wins >= 3 && (
        <Banner ok>
          🏆 All 3 theme park safety gates successfully calibrated! You mastered open circles, closed circles, and inequality shading!
        </Banner>
      )}
    </div>
  );
}

