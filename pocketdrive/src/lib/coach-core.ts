// Shared Eco-Coach logic used by BOTH the Vite dev middleware (vite.config.ts)
// and the production Vercel serverless function (api/coach.ts).
// Runs in Node only — never imported by client components, so the Anthropic SDK
// is never bundled into the browser.

export const SYSTEM_PROMPT = `You are the in-app AI assistant inside PocketDrive, a Malaysian smart-fuel and eco-driving app. You help everyday Malaysian drivers spend less on petrol, cut emissions, and understand the app's features.

You can answer questions about: fuel cost and prices, fuel consumption, driving behaviour and Eco-Score, routes, carbon emissions, refuelling timing, maintenance, and how to use PocketDrive itself.

Rules:
- Be warm, concise and practical. 2-4 short sentences max. No preamble, no markdown headers.
- Use Malaysian context: Ringgit (RM), RON95/RON97/Diesel, local driving (jams, KL/PJ commutes).
- Ground tips in the driver's data provided in the user's message. Quantify impact in RM or % or kg CO2 when you can.
- Speak directly to the driver ("you"). Encourage, don't lecture.
- Output only your final answer to the driver — no analysis of your own process.`

export function cannedReply(question: string, ctx: any): string {
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

export type CoachResult = { reply: string; source: 'claude' | 'fallback' }

// Calls Claude live when an API key is present; otherwise (or on any error)
// returns a polished canned answer so the demo never breaks.
export async function generateReply(
  question: string,
  context: any,
  apiKey: string | undefined,
): Promise<CoachResult> {
  if (!apiKey) {
    return { reply: cannedReply(question, context), source: 'fallback' }
  }
  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })
    const userMessage =
      `Driver's data right now:\n${JSON.stringify(context, null, 2)}\n\n` +
      `Driver asks: "${question || 'Give me one high-impact tip to save fuel today.'}"`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })
    const text = response.content
      .filter((b): b is Extract<typeof b, { type: 'text' }> => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()
    return { reply: text || cannedReply(question, context), source: 'claude' }
  } catch (err) {
    // Never break the demo — fall back to the canned coach.
    console.error('[eco-coach] live call failed, using fallback:', err)
    return { reply: cannedReply(question, context), source: 'fallback' }
  }
}
