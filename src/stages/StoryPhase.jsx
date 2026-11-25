import React, { useState, useEffect, useRef } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { narrate, stopNarration } from '../utils/audio.js';
import { getStoryNarration } from '../utils/narration.js';
import { STORY_SLIDES } from '../mathData.js';

export function StoryPhase({ muted, onDone, onSlideChange }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = STORY_SLIDES[slideIdx];

  // keep the latest callback in a ref so parent re-renders never re-trigger narration
  const slideChangeRef = useRef(onSlideChange);
  slideChangeRef.current = onSlideChange;

  useEffect(() => {
    if (slideChangeRef.current) slideChangeRef.current(slideIdx + 1, STORY_SLIDES.length);
  }, [slideIdx]);

  useEffect(() => {
    narrate(getStoryNarration(slideIdx), !muted);
    return () => stopNarration();
  }, [slideIdx, muted]);

  const goNext = () => {
    stopNarration();
    if (slideIdx < STORY_SLIDES.length - 1) {
      setSlideIdx(i => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    stopNarration();
    if (slideIdx > 0) setSlideIdx(i => i - 1);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-between sm:justify-center p-2.5 sm:p-4 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Story Card with Fluid Screen Adaptation & Zero Overflow */}
      <div className="w-full max-w-5xl max-h-[82vh] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-7 items-center fade-in-up z-20 my-auto overflow-y-auto">
        {/* Left Column: Responsive 1:1 Image Illustration (never cropped) */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 w-full max-w-[min(100%,240px)] sm:max-w-[min(100%,300px)] md:max-w-[min(100%,54vh)] aspect-square mx-auto bg-[#0e0626]/90 flex items-center justify-center shrink-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-contain rounded-2xl transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Right Column: Fluid Typography & Callout Pills */}
        <div className="flex flex-col items-start text-left justify-center gap-2.5 sm:gap-3.5 overflow-y-auto max-h-full py-1">
          {/* Slide Title */}
          <h2 className="font-display font-900 text-[clamp(1.35rem,2.8vh+0.6vw,2.35rem)] text-amber-400 leading-tight drop-shadow-md">
            {slide.title}
          </h2>

          {/* Body Narrative */}
          <p className="text-slate-100 text-[clamp(0.88rem,1.7vh+0.25vw,1.18rem)] leading-relaxed font-extrabold drop-shadow-sm">
            {slide.body}
          </p>

          {/* Pull-Quote Sparkle Pill */}
          <div className="w-full bg-[#1e0e45] border-2 border-amber-400/60 rounded-xl px-4 py-2 sm:py-2.5 text-center text-amber-300 font-display font-900 text-[clamp(0.82rem,1.4vh+0.2vw,1.05rem)] flex items-center justify-center gap-2 shadow-lg">
            <span className="shrink-0 text-lg sm:text-xl">✨</span>
            <span className="leading-snug">"{slide.quote}"</span>
            <span className="shrink-0 text-lg sm:text-xl">✨</span>
          </div>

          {/* Mascot Speech Bubble Pill */}
          <div className="flex items-center gap-3 w-full mt-0.5">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-amber-400 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shrink-0">
              🦁
            </div>
            <div className="bg-white text-[#0c031d] rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 font-display font-900 text-[clamp(0.82rem,1.4vh+0.2vw,1.05rem)] shadow-xl flex-1 text-left leading-snug">
              {slide.bubble}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Row: Back, Dots, Next (Always kept in frame) */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-2 sm:mt-2.5 z-20 shrink-0 px-2">
        <button
          onClick={goPrev}
          disabled={slideIdx === 0}
          className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/30 text-white font-display font-900 text-xs sm:text-sm md:text-base px-5 sm:px-7 py-2 sm:py-2.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-xl hover:scale-105"
        >
          ← Back
        </button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {STORY_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { stopNarration(); setSlideIdx(i); }}
              className={`rounded-full transition-all cursor-pointer ${
                i === slideIdx
                  ? 'w-3 sm:w-3.5 h-3 sm:h-3.5 bg-amber-400 shadow-[0_0_14px_rgba(250,204,21,0.9)]'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="btn-gold text-xs sm:text-sm md:text-base px-6 sm:px-8 py-2 sm:py-2.5 font-900 flex items-center gap-1.5 shadow-[0_0_25px_rgba(250,204,21,0.85)] hover:scale-105"
        >
          <span>{slideIdx === STORY_SLIDES.length - 1 ? 'Enter Lab 🧪' : 'Next'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
