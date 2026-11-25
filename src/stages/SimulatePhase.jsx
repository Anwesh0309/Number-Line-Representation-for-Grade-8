import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import { simulateActivityNarration, simSuccessNarration, simRetryNarration } from '../utils/narration.js';
import { SIM_STATIONS } from '../mathData.js';
import { ZoomLens, MirrorSub, FractionSplitter } from './sim/Station1.jsx';
import { DropZone, OrderUp, GraphBuilder } from './sim/Station2.jsx';
import { MysteryPoint, MidpointMission, RootSqueeze } from './sim/Station3.jsx';

/* station -> [activity components] */
const ACTIVITY_COMPONENTS = {
  1: [ZoomLens, MirrorSub, FractionSplitter],
  2: [DropZone, OrderUp, GraphBuilder],
  3: [MysteryPoint, MidpointMission, RootSqueeze]
};

export function SimulatePhase({ muted, onNext }) {
  const [station, setStation] = useState(1);
  const [actIdx, setActIdx] = useState(0);
  const [done, setDone] = useState({}); // "s-a" -> true
  const doneRef = useRef({});

  const st = SIM_STATIONS[station - 1];
  const currentActivity = st.activities[actIdx];
  const Activity = ACTIVITY_COMPONENTS[station][actIdx];
  const key = `${station}-${actIdx}`;

  // narrate the activity instructions whenever the activity changes
  useEffect(() => {
    narrate(simulateActivityNarration(station, actIdx), !muted);
    return () => stopNarration();
  }, [station, actIdx, muted]);

  const handleComplete = useCallback(() => {
    if (doneRef.current[key]) return;
    doneRef.current[key] = true;
    setDone((d) => ({ ...d, [key]: true }));
    narrate(simSuccessNarration(), !muted);
  }, [key, muted]);

  const handleRetry = useCallback(() => {
    narrate(simRetryNarration(), !muted);
  }, [muted]);

  const nextActivity = () => {
    stopNarration();
    if (actIdx < 2) {
      setActIdx((i) => i + 1);
    } else if (station < 3) {
      setStation((s) => s + 1);
      setActIdx(0);
    } else {
      onNext();
    }
  };

  const prevActivity = () => {
    stopNarration();
    if (actIdx > 0) {
      setActIdx((i) => i - 1);
    } else if (station > 1) {
      setStation((s) => s - 1);
      setActIdx(2);
    }
  };

  const stationDone = (s) => [0, 1, 2].every((a) => done[`${s}-${a}`]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2.5 sm:p-4 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Simulation Stations Glass Card Container */}
      <div className="w-full max-w-6xl max-h-[94vh] bg-[#160b38]/95 border-2 border-purple-400/40 rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Cyan Accent Bar */}
        <div className="w-16 h-1 bg-cyan-400 rounded-full mb-1.5 shadow-[0_0_18px_rgba(56,189,248,0.85)] shrink-0" />

        {/* Card Header Title */}
        <h2 className="font-display font-900 text-[clamp(1.15rem,2.2vh+0.3vw,1.75rem)] text-white flex items-center gap-2 mb-2 shrink-0">
          <span className="text-xl sm:text-2xl">🧪</span>
          <span>Simulation Stations</span>
        </h2>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Station Sidebar Tabs */}
          <div className="md:col-span-4 flex flex-col justify-between gap-2 shrink-0">
            <div className="flex flex-col gap-2 sm:gap-2.5">
              {SIM_STATIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { stopNarration(); setStation(s.id); setActIdx(0); }}
                  className={`p-2.5 sm:p-3 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                    station === s.id
                      ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_22px_rgba(56,189,248,0.4)] scale-[1.01]'
                      : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 sm:w-10 h-9 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold shrink-0 ${
                      station === s.id ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                    }`}>
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-900 text-xs sm:text-sm leading-tight truncate">{s.title}</p>
                      <p className="text-[10px] sm:text-[11px] font-extrabold text-slate-300 mt-0.5 truncate">{s.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm shrink-0 ml-1">{stationDone(s.id) ? '✅' : '🔓'}</span>
                </button>
              ))}
            </div>

            {/* Bottom Left CTA Button */}
            <button
              onClick={() => { stopNarration(); onNext(); }}
              className="btn-gold font-display font-900 text-xs sm:text-sm py-2 sm:py-2.5 px-4 shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition mt-0.5 w-full flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Go to Practice Phase!</span>
              <span>→</span>
            </button>
          </div>

          {/* Right Column: Interactive Simulation Box */}
          <div className="md:col-span-8 bg-[#13092e]/95 border-2 border-purple-400/35 rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between shadow-inner flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 gap-1.5">
              {/* Header Row */}
              <div className="flex items-center justify-between border-b border-white/15 pb-1.5 shrink-0">
                <h3 className="font-display font-900 text-sm sm:text-base md:text-lg text-cyan-300 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{currentActivity.icon}</span>
                  <span>{currentActivity.title}</span>
                </h3>
                <span className="font-display font-900 text-[10px] sm:text-xs text-slate-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15 whitespace-nowrap">
                  {done[key] ? '✅ ' : ''}Activity {actIdx + 1} of 3
                </span>
              </div>

              {/* Activity Description */}
              <p className="text-slate-100 text-[11px] sm:text-xs leading-snug font-extrabold shrink-0 line-clamp-2 sm:line-clamp-none">
                {currentActivity.desc}
              </p>

              {/* The interactive activity (remounts for every activity) */}
              <Activity key={key} onComplete={handleComplete} onRetry={handleRetry} />
            </div>

            {/* Bottom Activity Step Buttons */}
            <div className="flex items-center justify-between border-t border-white/15 pt-2 mt-1.5 shrink-0">
              <button
                onClick={prevActivity}
                disabled={station === 1 && actIdx === 0}
                className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border border-white/25 text-white font-display font-900 text-[11px] sm:text-xs px-4 py-1.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              >
                ← Previous Activity
              </button>

              <button
                onClick={nextActivity}
                className="btn-gold text-[11px] sm:text-xs font-900 px-5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <span>{station === 3 && actIdx === 2 ? 'Go to Practice Phase' : 'Next Activity'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
