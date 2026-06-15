// Production Eco-Coach + Fuel Copilot endpoint: POST /api/coach
// Vercel serverless function (Node runtime). Mirrors the Vite dev middleware,
// but defensive: it dynamically imports the shared logic and surfaces any error
// as JSON so the browser degrades gracefully instead of hitting a platform 500.

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end(JSON.stringify({ error: 'Method Not Allowed' }))
    return
  }

  try {
    // Vercel auto-parses JSON bodies into req.body; fall back to a manual stream
    // read for runtimes that don't (keeps parity with the Vite dev middleware).
    let payload: { question?: string; context?: any; mode?: string; messages?: any[] } = {}
    if (req.body && typeof req.body === 'object') {
      payload = req.body
    } else if (typeof req.body === 'string' && req.body.trim()) {
      payload = JSON.parse(req.body)
    } else {
      const raw: string = await new Promise((resolve) => {
        let d = ''
        req.on('data', (c: any) => (d += c))
        req.on('end', () => resolve(d))
        req.on('error', () => resolve(''))
      })
      payload = raw ? JSON.parse(raw) : {}
    }

    const { generateReply, generateTripReply } = await import('../src/lib/coach-core')
    const key = process.env.ANTHROPIC_API_KEY
    const result =
      payload.mode === 'copilot'
        ? await generateTripReply(payload.messages ?? [], key)
        : await generateReply(payload.question ?? '', payload.context ?? {}, key)

    res.statusCode = 200
    res.end(JSON.stringify(result))
  } catch (err: any) {
    // Never surface a platform 500 to the client — return a usable fallback.
    res.statusCode = 200
    res.end(
      JSON.stringify({
        reply: "I couldn't plan that just now — please try again in a moment.",
        source: 'fallback',
        error: String(err?.stack || err?.message || err),
      }),
    )
  }
}
