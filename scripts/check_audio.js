/* Verifies that every line narrated in src/utils/narration.js exists in the `phrases`
   array of scripts/generate_audio.js (so nothing falls back to a live API call). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const { allNarrationSegments } = await import(pathToFileURL(path.join(ROOT, 'src', 'utils', 'narration.js')).href);
const gen = fs.readFileSync(path.join(__dirname, 'generate_audio.js'), 'utf8');

const segs = allNarrationSegments();
const missing = segs.filter((s) => !gen.includes(JSON.stringify(s.text)));
if (missing.length) {
  console.log(`✖ ${missing.length} narration line(s) missing from generate_audio.js:`);
  missing.forEach((s) => console.log(`  { text: ${JSON.stringify(s.text)}, style: '${s.style}' },`));
  process.exit(1);
}
console.log(`✔ All ${segs.length} narration lines are covered by generate_audio.js`);
