import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { generateReply } from './src/lib/coach-core'

// ── Live Claude "Eco-Coach" endpoint (DEV ONLY) ─────────────────────────────
// Exposes POST /api/coach on the Vite dev server (one `npm run dev`).
// In production this same logic is served by api/coach.ts (Vercel function).

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => resolve(data))
  })
}

function ecoCoachPlugin(): PluginOption {
  return {
    name: 'eco-coach-api',
    configureServer(server) {
      server.middlewares.use('/api/coach', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        const raw = await readBody(req)
        let payload: { question?: string; context?: any } = {}
        try {
          payload = JSON.parse(raw || '{}')
        } catch {
          /* ignore malformed body, fall back below */
        }
        const result = await generateReply(payload.question ?? '', payload.context ?? {}, process.env.ANTHROPIC_API_KEY)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(result))
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load .env so ANTHROPIC_API_KEY reaches the server middleware (Vite only
  // exposes VITE_-prefixed vars to import.meta.env by default).
  const env = loadEnv(mode, process.cwd(), '')
  if (env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY
  }
  return { plugins: [react(), ecoCoachPlugin()] }
})
