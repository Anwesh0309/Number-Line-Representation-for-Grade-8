/* =========================================================================
   AUDIO ENGINE — ElevenLabs "Alice" hybrid pipeline
   Voice : Alice (Clear, Engaging Educator) — Voice ID Xb7hH8MSUJpSbSDYk0k2
   Model : eleven_multilingual_v2

   1. Segment helpers  : say(), ask(), cheer(), emphasize(), think(), celebrate(), instruct()
   2. Cache check      : getAudioUrl() looks in audioMap[text] (pre-generated .mp3) first
   3. Dynamic request  : /api/elevenlabs proxy -> direct ElevenLabs API (per-style settings)
   4. Queue management : narrate() plays segments sequentially, stopNarration() halts at once
   5. Overlap guard    : monotonic queue token + immediate promise/abort cancellation
   Last resort         : browser speech synthesis, so the lesson is never silent.
   ========================================================================= */
import { audioMap } from './audioMap.js';

export const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
export const MODEL_ID = 'eleven_multilingual_v2';

/* ElevenLabs voice settings by style */
export const VOICE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true }
};

/* Browser speech-synthesis tuning (fallback only) */
const FALLBACK_TUNING = {
  celebration:   { rate: 1.06, pitch: 1.2 },
  encouragement: { rate: 1.0,  pitch: 1.1 },
  question:      { rate: 0.98, pitch: 1.08 },
  emphasis:      { rate: 0.95, pitch: 1.05 },
  thinking:      { rate: 0.9,  pitch: 0.95 },
  statement:     { rate: 1.0,  pitch: 1.0 },
  instruction:   { rate: 1.0,  pitch: 1.0 }
};

/* ---------- Segment helpers ---------- */
export const say = (text) => ({ text, style: 'statement' });
export const ask = (text) => ({ text, style: 'question' });
export const cheer = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const instruct = (text) => ({ text, style: 'encouragement' });

/* ---------- State ---------- */
export let audioMuted = false;
let queueGeneration = 0;
let currentAudioElement = null;
let activeStopper = null;
let activeAbortController = null;
let ttsVoice = null;
const dynamicCache = new Map(); // "style::text" -> Promise<objectUrl|null>

/* ---------- Dynamic ElevenLabs request ---------- */
async function fetchDynamic(text, style, signal) {
  const voiceSettings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

  // 1) dev/server proxy (keeps the key off the client)
  try {
    const r = await fetch('/api/elevenlabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId: VOICE_ID, modelId: MODEL_ID, voiceSettings }),
      signal
    });
    if (r.ok && (r.headers.get('content-type') || '').includes('audio')) {
      return URL.createObjectURL(await r.blob());
    }
  } catch (e) {
    if (e?.name === 'AbortError') return null;
  }

  // 2) direct call
  const apiKey = import.meta.env?.VITE_ELEVENLABS_API_KEY;
  if (!apiKey || signal?.aborted) return null;
  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
        body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: voiceSettings }),
        signal
      }
    );
    if (!r.ok) return null;
    return URL.createObjectURL(await r.blob());
  } catch (e) {
    return null;
  }
}

function getDynamicUrl(text, style, signal) {
  const key = `${style}::${text}`;
  if (!dynamicCache.has(key)) {
    const p = fetchDynamic(text, style, signal).then((url) => {
      if (!url) dynamicCache.delete(key); // allow a retry later
      return url;
    });
    dynamicCache.set(key, p);
  }
  return dynamicCache.get(key);
}

/** Cache check first (static asset), otherwise dynamic request. */
export async function getAudioUrl(text, style = 'statement', signal) {
  if (audioMap[text]) return audioMap[text];
  return getDynamicUrl(text, style, signal);
}

/** Warm the cache for upcoming segments (skips already-static assets). */
export function preload(segments) {
  const list = Array.isArray(segments) ? segments : [segments];
  list.forEach((s) => {
    if (s && s.text && !audioMap[s.text]) getAudioUrl(s.text, s.style);
  });
}

/* ---------- Playback ---------- */
function playUrl(url, isCurrent) {
  return new Promise((resolve) => {
    if (!isCurrent()) return resolve(false);
    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      if (activeStopper === stopCurrent) activeStopper = null;
      resolve(ok);
    };

    let audio = null;
    const stopCurrent = () => {
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.onpause = null;
        try {
          audio.pause();
          audio.currentTime = 0;
          audio.removeAttribute('src');
        } catch (e) {}
        if (currentAudioElement === audio) currentAudioElement = null;
      }
      finish(true);
    };

    try {
      if (activeStopper) activeStopper();
      audio = new Audio(url);
      currentAudioElement = audio;
      activeStopper = stopCurrent;

      audio.onended = () => {
        if (currentAudioElement === audio) currentAudioElement = null;
        finish(true);
      };
      audio.onerror = () => {
        if (currentAudioElement === audio) currentAudioElement = null;
        finish(false);
      };
      audio.onpause = () => {
        if (!isCurrent() || currentAudioElement !== audio) finish(true);
      };

      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.catch(() => {
          if (currentAudioElement === audio) currentAudioElement = null;
          finish(false);
        });
      }
    } catch (e) {
      finish(false);
    }
  });
}

function pickVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => /female|alice|zira|samantha|victoria|google us english/i.test(v.name)) ||
    voices.find((v) => v.lang && v.lang.startsWith('en')) ||
    voices[0]
  );
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { ttsVoice = pickVoice(); };
  ttsVoice = pickVoice();
}

function fallbackSpeech(seg, isCurrent) {
  return new Promise((resolve) => {
    if (!isCurrent() || typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (activeStopper === stopCurrent) activeStopper = null;
      resolve();
    };
    const stopCurrent = () => {
      try { window.speechSynthesis.cancel(); } catch (e) {}
      finish();
    };

    if (activeStopper) activeStopper();
    activeStopper = stopCurrent;

    const cfg = FALLBACK_TUNING[seg.style] || FALLBACK_TUNING.statement;
    const utter = new SpeechSynthesisUtterance(seg.text);
    if (ttsVoice) utter.voice = ttsVoice;
    utter.rate = cfg.rate;
    utter.pitch = cfg.pitch;
    utter.onend = finish;
    utter.onerror = finish;
    window.speechSynthesis.speak(utter);
  });
}

async function speakSegment(seg, isCurrent, signal) {
  if (!seg || !seg.text || !isCurrent()) return;

  let url = await getAudioUrl(seg.text, seg.style, signal);
  if (!isCurrent()) return;

  if (url) {
    const ok = await playUrl(url, isCurrent);
    if (ok || !isCurrent()) return;
    // static file missing/corrupt -> try a dynamic request once
    if (audioMap[seg.text]) {
      url = await getDynamicUrl(seg.text, seg.style, signal);
      if (url && isCurrent() && (await playUrl(url, isCurrent))) return;
    }
  }
  if (isCurrent()) await fallbackSpeech(seg, isCurrent);
}

/* ---------- Queue management ---------- */
export function setMuted(m) {
  audioMuted = m;
  if (m) stopNarration();
}

export async function narrate(segments, autoplay = true) {
  stopNarration();
  if (!autoplay || audioMuted) return;

  const myGen = queueGeneration;
  const controller = new AbortController();
  activeAbortController = controller;
  const isCurrent = () => queueGeneration === myGen && !audioMuted && !controller.signal.aborted;
  const list = (Array.isArray(segments) ? segments : [segments]).filter(Boolean);

  for (let i = 0; i < list.length; i++) {
    if (!isCurrent()) return;
    if (list[i + 1]) preload(list[i + 1]);
    await speakSegment(list[i], isCurrent, controller.signal);
  }
}

export function stopNarration() {
  queueGeneration += 1;
  if (activeAbortController) {
    try { activeAbortController.abort(); } catch (e) {}
    activeAbortController = null;
  }
  if (activeStopper) {
    const stop = activeStopper;
    activeStopper = null;
    stop();
  }
  if (currentAudioElement) {
    const a = currentAudioElement;
    currentAudioElement = null;
    try {
      a.pause();
      a.currentTime = 0;
      a.removeAttribute('src');
    } catch (e) {}
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
}
