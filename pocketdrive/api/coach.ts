// Production endpoint: POST /api/coach (Vercel serverless, Node runtime).
//
// SELF-CONTAINED ON PURPOSE: Vercel ships this as raw ESM and does not resolve
// cross-directory local .ts imports (ERR_MODULE_NOT_FOUND), so this file must
// not import from ../src. The only dependency is the @anthropic-ai/sdk npm
// package (present in the deployment's node_modules).
//
// The Vite dev middleware (vite.config.ts) uses the shared src/lib/coach-core.ts.
// Keep the prompts + calculations below IN SYNC with that file.

const SYSTEM_PROMPT = `You are the in-app AI assistant inside PocketDrive, a Malaysian smart-fuel and eco-driving app. You help everyday Malaysian drivers spend less on petrol, cut emissions, and understand the app's features.

You can answer questions about: fuel cost and prices, fuel consumption, driving behaviour and Eco-Score, routes, carbon emissions, refuelling timing, maintenance, and how to use PocketDrive itself.

Rules:
- Be warm, concise and practical. 2-4 short sentences max. No preamble, no markdown headers.
- Use Malaysian context: Ringgit (RM), RON95/RON97/Diesel, local driving (jams, KL/PJ commutes).
- Ground tips in the driver's data provided in the user's message. Quantify impact in RM or % or kg CO2 when you can.
- Speak directly to the driver ("you"). Encourage, don't lecture.
- Output only your final answer to the driver — no analysis of your own process.`

const COPILOT_SYSTEM_PROMPT = `You are an AI Fuel Copilot built into a fuel management app for Malaysian drivers.

Driver profile:
- Name: Amir
- Vehicle: Perodua Myvi 1.5 automatic
- Fuel type: RON95
- Tank capacity: 42L
- Current fuel level: 18L
- Average fuel efficiency: 14.2 km/L
- Current RON95 price: RM2.05/L
- Current RON97 price: RM2.90/L
- Monthly fuel budget: RM300, spent RM187 so far this month
- CO₂ this month: 38.4 kg against a goal of 50 kg

When the user tells you their destination, respond with a structured Trip Strategy. Always use the driver's actual data above for all calculations. Format your response as a friendly but concise trip advisor. Cover these points in order:
1. Estimated distance and travel time
2. Expected fuel usage in litres (calculate using 14.2 km/L)
3. Expected fuel cost in RM (calculate using RM2.05/L for RON95)
4. Expected CO₂ emissions in kg (multiply litres by 2.31)
5. Recommended route (give a real Malaysian route name)
6. Best refuelling advice (should they refuel now or later, how many litres)
7. Fuel price risk this week (make a reasonable assessment)
8. One eco-driving tip specific to this journey

Keep the tone friendly, specific, and practical. Use Malaysian context. Never contradict the data values given above.

Reply in plain text only — no Markdown. Do not use #, ##, **, bullet stars, tables, or --- separators. Use simple numbered lines (1., 2., 3., …) and short sentences.`

type Msg = { role: 'user' | 'assistant'; content: string }

function cannedReply(question: string, ctx: any): string {
  const idle = ctx?.idleMinutes ?? 4
  const brakes = ctx?.harshBrakes ?? 3
  const score = ctx?.ecoScore ?? 78
  const q = (question || '').toLowerCase()
  if (q.includes('idl')) {
    return `You idled about ${idle} minutes today. At RM2.05/L that's roughly RM0.30 of fuel burned going nowhere. Switching off the engine whenever you stop for more than 2 minutes would lift your Eco-Score toward ${Math.min(score + 6, 100)}.`
  }
  if (q.includes('brak') || q.includes('accel')) {
    return `I spotted ${brakes} harsh braking events on your last trip. Easing off and anticipating stops earlier can save you up to 10% fuel — that's around RM18 a month at your current usage. Try leaving a bigger gap to the car ahead.`
  }
  return `Your Eco-Score is ${score}, which is "Good". The fastest win right now is cutting idling and smoothing out braking — together that's about RM20/month and ~6 kg CO2 saved. Want me to break down where each Ringgit goes?`
}

function copilotFallback(messages: Msg[]): string {
  const dest = [...messages].reverse().find((m) => m.role === 'user')?.content?.trim() || 'your destination'
  return [
    `Trip Strategy — ${dest}`,
    '1. Distance & time: ~25 km, about 35 min in typical traffic.',
    '2. Fuel usage: ~1.8 L (at 14.2 km/L).',
    '3. Fuel cost: ~RM3.69 (RON95 at RM2.05/L).',
    '4. CO₂: ~4.1 kg (1.8 L × 2.31).',
    '5. Route: take the SPRINT Highway / Federal Highway to avoid the worst jams.',
    "6. Refuelling: you're at 18 L — enough for this trip. Top up ~20 L of RON95 afterwards.",
    '7. Price risk: RON95 stays subsidised at RM2.05/L this week — no surprises.',
    '8. Eco tip: ease off the accelerator on on-ramps and coast to lights to save ~8% fuel.',
  ].join('\n')
}

async function callClaude(system: string, messages: Msg[], maxTokens: number, key: string): Promise<string> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: key })
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: maxTokens,
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  })
  return response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('')
    .trim()
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end(JSON.stringify({ error: 'Method Not Allowed' }))
    return
  }

  // Parse body (Vercel pre-parses JSON into req.body; fall back to raw stream).
  let payload: { question?: string; context?: any; mode?: string; messages?: Msg[] } = {}
  try {
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
  } catch {
    payload = {}
  }

  const key = process.env.ANTHROPIC_API_KEY

  try {
    if (payload.mode === 'copilot') {
      const messages = payload.messages ?? []
      if (!key || messages.length === 0) {
        res.statusCode = 200
        res.end(JSON.stringify({ reply: copilotFallback(messages), source: 'fallback' }))
        return
      }
      const text = await callClaude(COPILOT_SYSTEM_PROMPT, messages, 700, key)
      res.statusCode = 200
      res.end(JSON.stringify({ reply: text || copilotFallback(messages), source: text ? 'claude' : 'fallback' }))
      return
    }

    // Eco-Coach mode
    const question = payload.question ?? ''
    const context = payload.context ?? {}
    if (!key) {
      res.statusCode = 200
      res.end(JSON.stringify({ reply: cannedReply(question, context), source: 'fallback' }))
      return
    }
    const userMessage =
      `Driver's data right now:\n${JSON.stringify(context, null, 2)}\n\n` +
      `Driver asks: "${question || 'Give me one high-impact tip to save fuel today.'}"`
    const text = await callClaude(SYSTEM_PROMPT, [{ role: 'user', content: userMessage }], 400, key)
    res.statusCode = 200
    res.end(JSON.stringify({ reply: text || cannedReply(question, context), source: text ? 'claude' : 'fallback' }))
  } catch (err: any) {
    // Never break the demo — return a polished fallback (and the error for logs).
    const reply = payload.mode === 'copilot' ? copilotFallback(payload.messages ?? []) : cannedReply(payload.question ?? '', payload.context ?? {})
    res.statusCode = 200
    res.end(JSON.stringify({ reply, source: 'fallback', error: String(err?.message || err) }))
  }
}
