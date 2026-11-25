# Number Line Quest · Grade 8 (MOE) — Number Line Representation

Same shell as the Circumference module (Intro → Wonder → Story → Simulate → Practice → Reflect,
10 game worlds, XP / hearts / streaks, glass-card UI, Leo & Robo mascots) with all new content.

## Run
```bash
npm install
npm run dev          # http://localhost:3000
npm run build
```

## Audio (ElevenLabs "Alice", eleven_multilingual_v2)
The API key is in `.env.local` (`VITE_ELEVENLABS_API_KEY`). Pipeline = `audio_generation_pipeline.md`.

1. **Pre-generate the 34 narration lines (recommended, do this once):**
   ```bash
   npm run generate-audio   # writes public/assets/audio/*.mp3 and src/utils/audioMap.js
   npm run clean-audio      # optional: delete orphaned mp3s
   npm run check-audio      # verifies narration.js and generate_audio.js are in sync
   ```
2. Until you do, the engine falls back automatically: static mp3 → `/api/elevenlabs` dev proxy →
   direct ElevenLabs call → browser speech synthesis. Nothing is ever silent.

**Updating a line:** edit its text in `src/mathData.js` (screen text + `speech` stay side by side) →
add/replace the same text in the `phrases` array of `scripts/generate_audio.js`
(`npm run check-audio` prints the exact line to paste) → `npm run generate-audio`.
Only paragraphs and questions are narrated, never titles.

> Security: any `VITE_` variable is bundled into the browser build. Fine for local use / a demo;
> for a public deployment pre-generate the audio and remove the key (or proxy it server-side).

## Where things are
| What | File |
|---|---|
| Lesson text, story, station list, practice worlds, question generator | `src/mathData.js` |
| Reusable SVG number line (static + draggable) | `src/components/NumberLineDiagram.jsx` |
| Phases | `src/stages/*.jsx` |
| Simulation activities (3 stations × 3) | `src/stages/sim/Station1-3.jsx` |
| Audio engine / narration scripts / map | `src/utils/audio.js`, `narration.js`, `audioMap.js` |
| Story illustrations (JPG, 8 default slides) | `public/assets/images/slide1-8.jpg` |
