// Production Eco-Coach endpoint: POST /api/coach
// Vercel serverless function. Mirrors the Vite dev middleware via shared logic.
import type { IncomingMessage, ServerResponse } from 'node:http'
import { generateReply } from '../src/lib/coach-core'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => resolve(data))
  })
}

export default async function handler(req: IncomingMessage & { method?: string }, res: ServerResponse) {
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
}
