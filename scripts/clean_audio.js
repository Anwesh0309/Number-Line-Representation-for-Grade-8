/* Removes .mp3 files in public/assets/audio that are no longer referenced by audioMap.js */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'audio');

const { audioMap } = await import(pathToFileURL(path.join(ROOT, 'src', 'utils', 'audioMap.js')).href);
const valid = new Set(Object.values(audioMap).map((p) => path.basename(p)));

let removed = 0;
for (const f of fs.existsSync(AUDIO_DIR) ? fs.readdirSync(AUDIO_DIR) : []) {
  if (f.endsWith('.mp3') && !valid.has(f)) {
    fs.unlinkSync(path.join(AUDIO_DIR, f));
    console.log('deleted', f);
    removed++;
  }
}
console.log(`Clean complete. Removed ${removed} orphaned file(s); ${valid.size} active.`);
