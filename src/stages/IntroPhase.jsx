import React from 'react';
import { BgSymbols } from '../components/TopNav.jsx';

export function IntroModal({ onBegin }) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Intro Content Card with Fluid Viewport Constraints & Responsive Typography */}
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col items-center text-center fade-in-up z-20 my-auto justify-between overflow-y-auto p-1">
        {/* Pill Badge */}
        <div className="bg-[#1c0d38] border-2 border-amber-400/50 text-amber-300 text-[clamp(0.8rem,1.5vh,1.1rem)] font-900 px-5 py-1 rounded-full shadow-lg mb-1.5 tracking-wide shrink-0">
          ✨ MOE Curriculum · Grade 8
        </div>

        {/* Title */}
        <h1 className="font-display font-900 text-[clamp(1.85rem,4.8vh+0.8vw,3.6rem)] text-white text-center leading-tight tracking-tight mb-1 shrink-0">
          Number Line{" "}
          <span className="text-[#facc15] font-900 block drop-shadow-[0_0_28px_rgba(250,204,21,0.7)]">
            Representation
          </span>
        </h1>

        {/* Mascot Avatar & Speech Pill */}
        <div className="flex items-center gap-2.5 mb-1.5 shrink-0">
          <div className="w-[clamp(2.3rem,4.2vh,3rem)] h-[clamp(2.3rem,4.2vh,3rem)] rounded-full bg-[#facc15] p-0.5 shadow-[0_0_22px_rgba(250,204,21,0.8)] flex items-center justify-center text-[clamp(1.3rem,2.4vh,1.8rem)] shrink-0">
            🦁
          </div>
          <div className="bg-white rounded-full px-5 py-1.5 text-[#0c031d] font-display font-900 text-[clamp(0.85rem,1.6vh,1.15rem)] shadow-lg">
            Ready for a number adventure? 🎉
          </div>
        </div>

        {/* Subtitle text */}
        <p className="text-slate-100 text-[clamp(0.85rem,1.7vh+0.2vw,1.15rem)] max-w-2xl text-center leading-snug mb-2 font-extrabold drop-shadow-sm shrink-0">
          Join Leo on a journey to place, compare, and measure every kind of number — integers, fractions, decimals, and even √2 — on the number line!
        </p>

        {/* YOUR LEARNING JOURNEY Flow Card */}
        <div className="w-full max-w-3xl bg-[#14082c]/95 border-2 border-purple-400/40 rounded-2xl p-[clamp(0.5rem,1.4vh,1.1rem)] shadow-2xl backdrop-blur-md flex flex-col items-center mb-2 shrink-0">
          <p className="text-[#facc15] text-[clamp(0.75rem,1.3vh,0.95rem)] font-display font-900 tracking-wider text-center mb-1.5">
            YOUR LEARNING JOURNEY
          </p>

          {/* Top Row: Wonder -> Story -> Simulate */}
          <div className="flex items-center justify-center gap-[clamp(0.8rem,2.8vw,2.5rem)] w-full mb-1.5">
            {/* Wonder */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[clamp(2rem,3.8vh,2.8rem)] h-[clamp(2rem,3.8vh,2.8rem)] rounded-full border-2 border-purple-400 bg-purple-950/90 text-purple-200 flex items-center justify-center text-[clamp(0.95rem,1.8vh,1.3rem)] shadow-[0_0_16px_rgba(192,132,252,0.65)] mb-0.5">
                🔍
              </div>
              <p className="font-display font-900 text-white text-[clamp(0.8rem,1.5vh,1.05rem)] leading-tight">Wonder</p>
              <p className="text-slate-200 text-[clamp(0.68rem,1.1vh,0.85rem)] font-extrabold">Spark curiosity</p>
            </div>
            <span className="text-amber-400 font-black text-[clamp(0.85rem,1.6vh,1.1rem)] mb-2">→</span>

            {/* Story */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[clamp(2rem,3.8vh,2.8rem)] h-[clamp(2rem,3.8vh,2.8rem)] rounded-full border-2 border-amber-400 bg-amber-950/90 text-amber-200 flex items-center justify-center text-[clamp(0.95rem,1.8vh,1.3rem)] shadow-[0_0_16px_rgba(251,191,36,0.65)] mb-0.5">
                📖
              </div>
              <p className="font-display font-900 text-white text-[clamp(0.8rem,1.5vh,1.05rem)] leading-tight">Story</p>
              <p className="text-slate-200 text-[clamp(0.68rem,1.1vh,0.85rem)] font-extrabold">Hear the tale</p>
            </div>
            <span className="text-amber-400 font-black text-[clamp(0.85rem,1.6vh,1.1rem)] mb-2">→</span>

            {/* Simulate */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[clamp(2rem,3.8vh,2.8rem)] h-[clamp(2rem,3.8vh,2.8rem)] rounded-full border-2 border-teal-400 bg-teal-950/90 text-teal-200 flex items-center justify-center text-[clamp(0.95rem,1.8vh,1.3rem)] shadow-[0_0_16px_rgba(45,212,191,0.65)] mb-0.5">
                🧪
              </div>
              <p className="font-display font-900 text-white text-[clamp(0.8rem,1.5vh,1.05rem)] leading-tight">Simulate</p>
              <p className="text-slate-200 text-[clamp(0.68rem,1.1vh,0.85rem)] font-extrabold">Explore labs</p>
            </div>
          </div>

          {/* Bottom Row: Practice -> Reflect */}
          <div className="flex items-center justify-center gap-[clamp(1.5rem,4vw,3.5rem)] w-full">
            {/* Practice */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[clamp(2rem,3.8vh,2.8rem)] h-[clamp(2rem,3.8vh,2.8rem)] rounded-full border-2 border-emerald-400 bg-emerald-950/90 text-emerald-200 flex items-center justify-center text-[clamp(0.95rem,1.8vh,1.3rem)] shadow-[0_0_16px_rgba(52,211,153,0.65)] mb-0.5">
                🎮
              </div>
              <p className="font-display font-900 text-white text-[clamp(0.8rem,1.5vh,1.05rem)] leading-tight">Practice</p>
              <p className="text-slate-200 text-[clamp(0.68rem,1.1vh,0.85rem)] font-extrabold">Test skills</p>
            </div>
            <span className="text-amber-400 font-black text-[clamp(0.85rem,1.6vh,1.1rem)] mb-2">→</span>

            {/* Reflect */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[clamp(2rem,3.8vh,2.8rem)] h-[clamp(2rem,3.8vh,2.8rem)] rounded-full border-2 border-indigo-400 bg-indigo-950/90 text-indigo-200 flex items-center justify-center text-[clamp(0.95rem,1.8vh,1.3rem)] shadow-[0_0_16px_rgba(129,140,248,0.65)] mb-0.5">
                📝
              </div>
              <p className="font-display font-900 text-white text-[clamp(0.8rem,1.5vh,1.05rem)] leading-tight">Reflect</p>
              <p className="text-slate-200 text-[clamp(0.68rem,1.1vh,0.85rem)] font-extrabold">Key learnings</p>
            </div>
          </div>
        </div>

        {/* Begin Button */}
        <button
          onClick={onBegin}
          className="btn-gold text-[clamp(1.05rem,2.2vh,1.45rem)] font-900 py-[clamp(0.5rem,1.4vh,0.85rem)] px-[clamp(2rem,5vw,4rem)] mb-2 shadow-[0_0_35px_rgba(250,204,21,0.85)] hover:scale-105 transition cursor-pointer shrink-0"
        >
          🚀 Begin Your Journey!
        </button>

        {/* 3 Bottom Feature Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-3xl shrink-0">
          <div className="bg-[#14082c]/95 border-2 border-purple-400/35 rounded-xl p-[clamp(0.35rem,1vh,0.75rem)] flex flex-col items-center justify-center text-center w-full hover:border-purple-300 transition">
            <div className="w-[clamp(1.8rem,3vh,2.4rem)] h-[clamp(1.8rem,3vh,2.4rem)] rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center text-[clamp(0.9rem,1.7vh,1.2rem)] mb-0.5 font-bold">
              🔢
            </div>
            <span className="font-display font-900 text-white text-[clamp(0.75rem,1.4vh,1rem)]">Number Types</span>
            <span className="text-slate-200 text-[clamp(0.68rem,1.1vh,0.85rem)] font-extrabold">Integers to √</span>
          </div>

          <div className="bg-[#14082c]/95 border-2 border-purple-400/35 rounded-xl p-[clamp(0.35rem,1vh,0.75rem)] flex flex-col items-center justify-center text-center w-full hover:border-purple-300 transition">
            <div className="w-[clamp(1.8rem,3vh,2.4rem)] h-[clamp(1.8rem,3vh,2.4rem)] rounded-lg bg-rose-500/30 text-rose-300 flex items-center justify-center text-[clamp(0.9rem,1.7vh,1.2rem)] mb-0.5 font-bold">
              🧪
            </div>
            <span className="font-display font-900 text-white text-[clamp(0.75rem,1.4vh,1rem)]">Simulations</span>
            <span className="text-slate-200 text-[clamp(0.68rem,1.1vh,0.85rem)] font-extrabold">Interactive labs</span>
          </div>

          <div className="bg-[#14082c]/95 border-2 border-purple-400/35 rounded-xl p-[clamp(0.35rem,1vh,0.75rem)] flex flex-col items-center justify-center text-center w-full hover:border-purple-300 transition">
            <div className="w-[clamp(1.8rem,3vh,2.4rem)] h-[clamp(1.8rem,3vh,2.4rem)] rounded-lg bg-amber-500/30 text-amber-300 flex items-center justify-center text-[clamp(0.9rem,1.7vh,1.2rem)] mb-0.5 font-bold">
              🏆
            </div>
            <span className="font-display font-900 text-white text-[clamp(0.75rem,1.4vh,1rem)]">10 Game Worlds</span>
            <span className="text-slate-200 text-[clamp(0.68rem,1.1vh,0.85rem)] font-extrabold">XP & awards</span>
          </div>
        </div>
      </div>
    </div>
  );
}
