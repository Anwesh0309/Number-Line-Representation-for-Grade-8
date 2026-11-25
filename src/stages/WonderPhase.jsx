import React, { useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import { wonderNarration } from '../utils/narration.js';
import { WONDER } from '../mathData.js';

export function WonderPhase({ muted, onNext }) {
  useEffect(() => {
    narrate(wonderNarration(), !muted);
    return () => stopNarration();
  }, [muted]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      <div className="w-full max-w-2xl max-h-[86vh] glass-card flex flex-col items-center text-center fade-in-up z-20 my-auto p-4 sm:p-6 overflow-y-auto">
        {/* Glowing Phase Band */}
        <div className="phase-band phase-band--wonder mb-2 shrink-0" />

        <div className="flex items-center gap-2 mb-1.5 shrink-0">
          <span className="text-2xl sm:text-3xl">🔍</span>
          <span className="text-purple-300 font-display font-800 text-xs sm:text-sm tracking-wider uppercase">
            Phase 1: Wonder & Curiosity
          </span>
        </div>

        <h2 className="font-display font-900 text-[clamp(1.4rem,2.8vh+0.7vw,2.4rem)] text-purple-200 mb-2.5 max-w-xl leading-tight shrink-0">
          {WONDER.title}
        </h2>

        {/* Feature Stat Box */}
        <div className="w-full bg-[#1e143c]/90 border border-purple-400/30 rounded-2xl p-3 sm:p-5 mb-3 flex flex-col items-center shadow-xl shrink-0">
          <div className="text-amber-300 font-display font-900 text-[clamp(2.2rem,4.8vh+1vw,3.8rem)] mb-0.5 drop-shadow-lg leading-tight">
            {WONDER.stat}
          </div>
          <p className="text-[clamp(0.85rem,1.5vh+0.25vw,1.1rem)] text-slate-200 max-w-lg leading-relaxed font-extrabold">
            {WONDER.bodyBefore}<span className="text-amber-300 font-black">{WONDER.highlight}</span>{WONDER.bodyAfter}
          </p>
        </div>

        {/* Mascot Thinking Bubble */}
        <div className="flex items-center gap-2.5 bg-[#14082c]/80 border border-purple-500/30 rounded-full px-4 py-1.5 mb-4 shrink-0">
          <div className="w-7 h-7 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-bold text-xs shrink-0">
            🤖
          </div>
          <p className="text-slate-300 text-[clamp(0.75rem,1.2vh+0.2vw,0.92rem)] font-extrabold">
            {WONDER.question}
          </p>
        </div>

        <button onClick={() => { stopNarration(); onNext(); }} className="btn-gold flex items-center gap-2 text-xs sm:text-sm md:text-base py-2.5 sm:py-3 px-6 sm:px-8 shadow-xl shrink-0">
          <span>Explore the Story</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
