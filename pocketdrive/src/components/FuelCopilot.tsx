import { useRef, useState } from 'react'
import { Sparkles, Send, Loader2, MapPin } from 'lucide-react'
import { Card } from './ui'

type Msg = { role: 'user' | 'assistant'; content: string }

const CHIPS = ['Office (PJ)', 'Johor Bahru', 'KL City Centre']

// AI Fuel Copilot — destination-driven trip planner at the top of Home.
// Holds a multi-turn thread so the driver can ask follow-ups about a trip.
export function FuelCopilot() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const threadRef = useRef<HTMLDivElement>(null)

  async function ask(text: string) {
    const q = text.trim()
    if (!q || busy) return
    const next: Msg[] = [...messages, { role: 'user', content: q }]
    setMessages(next)
    setInput('')
    setBusy(true)
    setTimeout(() => threadRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 30)
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'copilot', messages: next }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: "I couldn't reach the network just now — try again in a moment." },
      ])
    } finally {
      setBusy(false)
      setTimeout(() => threadRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 50)
    }
  }

  return (
    <div className="px-4 -mt-4">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 shadow-float">
        <div className="p-5">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={18} className="text-brand-200" />
            <span className="text-[15px] font-extrabold tracking-tight">AI Fuel Copilot</span>
          </div>
          <p className="mt-1 text-[12.5px] leading-snug text-brand-100/90">
            Good morning, Amir. Where are you heading today?
          </p>

          {/* Quick-tap destinations (only before the first question) */}
          {messages.length === 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => ask(c)}
                  disabled={busy}
                  className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur active:scale-95 disabled:opacity-50"
                >
                  <MapPin size={12} />
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Free-text destination input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
            className="mt-3 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={messages.length === 0 ? 'Or type your destination…' : 'Ask a follow-up…'}
              className="flex-1 rounded-xl bg-white/15 px-3.5 py-2.5 text-[13px] text-white outline-none backdrop-blur placeholder:text-white/60"
              aria-label="Destination"
            />
            <button
              type="submit"
              disabled={busy}
              aria-label="Send"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-700 disabled:opacity-50"
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>

        {/* Mini chat thread — Trip Strategy + follow-ups */}
        {(messages.length > 0 || busy) && (
          <div
            ref={threadRef}
            className="no-scrollbar max-h-80 space-y-2.5 overflow-y-auto bg-white/95 p-4"
          >
            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-600 px-3.5 py-2 text-[12.5px] font-medium text-white">
                    {m.content}
                  </div>
                </div>
              ) : (
                <Card key={i} className="p-3.5">
                  <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-ink">{m.content}</p>
                </Card>
              ),
            )}
            {busy && (
              <div className="flex items-center gap-2 px-1 py-1 text-[12px] font-medium text-ink-faint">
                <Loader2 size={15} className="animate-spin text-brand-600" />
                Planning your trip…
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
