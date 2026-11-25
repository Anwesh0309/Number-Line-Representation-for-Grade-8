import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev-only ElevenLabs proxy (/api/elevenlabs).
 * The audio engine tries this first so the API key stays on the server while
 * developing. If it is unavailable (static hosting) the engine falls back to a
 * direct ElevenLabs call using VITE_ELEVENLABS_API_KEY.
 */
function elevenLabsProxy(apiKey) {
  const handler = (req, res, next) => {
    if (req.url !== '/api/elevenlabs' || req.method !== 'POST') return next();
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', async () => {
      try {
        if (!apiKey) throw new Error('Missing VITE_ELEVENLABS_API_KEY');
        const { text, voiceId, modelId, voiceSettings } = JSON.parse(raw || '{}');
        const r = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
            body: JSON.stringify({ text, model_id: modelId, voice_settings: voiceSettings })
          }
        );
        if (!r.ok) {
          res.statusCode = r.status;
          return res.end(await r.text());
        }
        res.setHeader('Content-Type', 'audio/mpeg');
        res.end(Buffer.from(await r.arrayBuffer()));
      } catch (e) {
        res.statusCode = 500;
        res.end(String(e));
      }
    });
  };
  return {
    name: 'elevenlabs-proxy',
    configureServer(server) { server.middlewares.use(handler); },
    configurePreviewServer(server) { server.middlewares.use(handler); }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), elevenLabsProxy(env.VITE_ELEVENLABS_API_KEY)],
    server: { port: 3000, open: true }
  };
});
