import React, { useState } from 'react';
import { narrate, stopNarration, instruct, audioMuted } from '../../utils/audio.js';

/* Small UI building blocks shared by all simulation activities
   (dark glass, gold + cyan accents, real-world gauges, story connections) */

export function Banner({ ok = true, children }) {
  return (
    <div
      className={`w-full p-3 sm:p-4 rounded-2xl text-xs sm:text-sm md:text-base font-900 text-center shadow-xl fade-in-up shrink-0 border-2 transition-all duration-300 ${
        ok
          ? 'bg-emerald-950/95 text-emerald-200 border-emerald-400/70 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
          : 'bg-rose-950/95 text-rose-200 border-rose-400/70 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-xl sm:text-2xl">{ok ? '🌟' : '💡'}</span>
        <div className="text-left sm:text-center leading-snug">{children}</div>
      </div>
    </div>
  );
}

export function Stat({ label, value, tone = 'text-amber-300', sub = null }) {
  return (
    <div className="flex-1 min-w-[110px] sm:min-w-[130px] bg-[#14082c]/90 border border-cyan-400/35 rounded-xl px-3 py-2 text-center shadow-inner">
      <p className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-wider">{label}</p>
      <p className={`font-display font-900 text-base sm:text-xl md:text-2xl ${tone} leading-tight my-0.5`}>{value}</p>
      {sub && <p className="text-[10px] sm:text-[11px] font-bold text-slate-400">{sub}</p>}
    </div>
  );
}

export function Pill({ onClick, children, active = false, disabled = false, tone = 'cyan' }) {
  const on = tone === 'gold'
    ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-105 border-amber-300'
    : 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.6)] scale-105 border-cyan-300';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-900 border transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? on : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
      }`}
    >
      {children}
    </button>
  );
}

export function GhostBtn({ onClick, children, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:scale-105"
    >
      {children}
    </button>
  );
}

export function GoldBtn({ onClick, children, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-gold text-xs sm:text-sm md:text-base font-900 px-5 sm:px-6 py-2 sm:py-2.5 shadow-lg hover:scale-105 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export function Goal({ items }) {
  /* mission checklist: [{ label, done }] */
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
      <span className="text-xs font-900 text-amber-300 uppercase tracking-wider flex items-center gap-1">
        <span>🎯</span> Mission:
      </span>
      {items.map((it, i) => (
        <span
          key={i}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-900 border-2 transition-all ${
            it.done
              ? 'bg-emerald-500/30 border-emerald-400/80 text-emerald-200 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
              : 'bg-white/5 border-white/20 text-slate-300'
          }`}
        >
          {it.done ? '✅' : '⬜'} {it.label}
        </span>
      ))}
    </div>
  );
}

/* Real-World Context Badge for Simulation Activities */
export function RealWorldBadge({ icon, title, context, level = 'Grade 7 Lab' }) {
  return (
    <div className="w-full flex items-center justify-between bg-gradient-to-r from-blue-950/90 via-[#1c0d45]/90 to-slate-900/90 border border-cyan-400/40 rounded-xl px-3 py-1.5 shadow-md shrink-0 gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-lg sm:text-xl shrink-0 p-1 bg-cyan-500/20 rounded-lg border border-cyan-400/30 shadow-inner">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-900 text-amber-300 uppercase tracking-wide truncate">{title}</p>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-200 truncate">{context}</p>
        </div>
      </div>
      <span className="text-[9px] sm:text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider shadow-sm">
        {level}
      </span>
    </div>
  );
}

/* Story Connection Pill */
export function StoryCallout({ slideRef, children }) {
  return (
    <div className="w-full bg-[#14082c]/90 border border-purple-400/40 rounded-xl px-2.5 py-1 flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs font-bold text-purple-200 shadow-sm shrink-0">
      <span className="text-amber-400 shrink-0 font-900 flex items-center gap-1">
        <span>✨</span> Story ({slideRef}):
      </span>
      <span className="text-slate-100 font-extrabold">{children}</span>
    </div>
  );
}

/* Grade 7 Helper Accordion / Tip Card */
export function GradeTip({ title = "Grade 7 Detective Tip", speech, children }) {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (speech) {
      if (next) narrate([instruct(speech)], !audioMuted);
      else stopNarration();
    }
  };
  return (
    <div className="w-full bg-[#120729]/90 border border-amber-400/35 rounded-xl p-2 text-xs text-amber-200 shadow-md shrink-0">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between font-900 text-amber-300 cursor-pointer text-left"
      >
        <span className="flex items-center gap-1.5">
          <span>💡</span> {title}
        </span>
        <span className="text-[10px] bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40">
          {open ? 'Hide Tip ▲' : 'Show Tip ▼'}
        </span>
      </button>
      {open && (
        <div className="mt-1.5 pt-1.5 border-t border-amber-400/20 text-slate-100 font-bold leading-relaxed fade-in-up">
          {children}
        </div>
      )}
    </div>
  );
}

export const PANEL = 'flex flex-col items-center gap-2 sm:gap-2.5 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-2.5 sm:p-3.5 shadow-xl flex-1 min-h-0 overflow-y-auto';


