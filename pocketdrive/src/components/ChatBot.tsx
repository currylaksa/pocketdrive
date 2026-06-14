import { useEffect, useRef, useState } from 'react'
import { Sparkles, Send, X, MessageCircle } from 'lucide-react'
import { coachContext } from '../lib/logic'

type Msg = { role: 'user' | 'bot'; text: string }

const DEFAULTS = [
  'How can I reduce my fuel consumption?',
  'How can I reduce my environmental impact?',
  'How do I get my Eco-Score above 80?',
]

// Floating AI assistant available on every tab.
export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'bot',
      text: "Hi Aiman! I'm your PocketDrive assistant. Ask me anything about your fuel, driving, routes or emissions — I'll use your live data.",
    },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // ── Draggable floating button ──────────────────────────────────────────
  // Users can drag the AI button anywhere so it never blocks content.
  // Position (relative to the app container) is remembered across reloads.
  const fabRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(() => {
    try {
      const s = localStorage.getItem('pd_fab_pos')
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })
  const drag = useRef({ active: false, moved: false, dx: 0, dy: 0, sx: 0, sy: 0 })

  // Keep a remembered position on-screen if the viewport changed size.
  useEffect(() => {
    const btn = fabRef.current
    const parent = btn?.offsetParent as HTMLElement | null
    if (!pos || !btn || !parent) return
    const maxX = parent.clientWidth - btn.offsetWidth - 8
    const maxY = parent.clientHeight - btn.offsetHeight - 8
    const x = Math.max(8, Math.min(pos.x, maxX))
    const y = Math.max(8, Math.min(pos.y, maxY))
    if (x !== pos.x || y !== pos.y) setPos({ x, y })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onFabPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    const btn = fabRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    drag.current = {
      active: true,
      moved: false,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      sx: e.clientX,
      sy: e.clientY,
    }
    btn.setPointerCapture(e.pointerId)
  }

  function onFabPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const d = drag.current
    if (!d.active) return
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 6) return
    d.moved = true
    const btn = fabRef.current!
    const parent = btn.offsetParent as HTMLElement | null
    if (!parent) return
    const pr = parent.getBoundingClientRect()
    const maxX = pr.width - btn.offsetWidth - 8
    const maxY = pr.height - btn.offsetHeight - 8
    const x = Math.max(8, Math.min(e.clientX - pr.left - d.dx, maxX))
    const y = Math.max(8, Math.min(e.clientY - pr.top - d.dy, maxY))
    setPos({ x, y })
  }

  function onFabPointerUp() {
    if (!drag.current.active) return
    drag.current.active = false
    if (drag.current.moved && pos) {
      try {
        localStorage.setItem('pd_fab_pos', JSON.stringify(pos))
      } catch {
        /* ignore storage failures */
      }
    }
  }

  async function ask(question: string) {
    if (!question.trim() || busy) return
    setMessages((m) => [...m, { role: 'user', text: question }])
    setInput('')
    setBusy(true)
    setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 30)
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context: coachContext() }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'bot', text: data.reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: "I couldn't reach the network just now — but cutting idling is always a safe first win." },
      ])
    } finally {
      setBusy(false)
      setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 50)
    }
  }

  return (
    <>
      {/* Floating action button — draggable, tap to open */}
      {!open && (
        <button
          ref={fabRef}
          onClick={() => {
            if (!drag.current.moved) setOpen(true)
          }}
          onPointerDown={onFabPointerDown}
          onPointerMove={onFabPointerMove}
          onPointerUp={onFabPointerUp}
          aria-label="Open AI assistant (drag to move)"
          title="Tap to open · drag to move"
          style={pos ? { left: pos.x, top: pos.y } : undefined}
          className={`absolute z-30 flex h-14 w-14 touch-none cursor-grab select-none items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-teal-600 text-white shadow-float active:scale-95 active:cursor-grabbing ${
            pos ? '' : 'bottom-24 right-4'
          }`}
        >
          <MessageCircle size={24} />
          <span className="pointer-events-none absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-[10px] font-extrabold text-white">
            AI
          </span>
        </button>
      )}

      {/* Chat sheet */}
      {open && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end">
          <button
            aria-label="Close assistant"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/30"
          />
          <div className="animate-sheet relative flex max-h-[82%] flex-col rounded-t-3xl bg-white shadow-[0_-12px_40px_rgba(15,23,42,0.18)]">
            {/* Header */}
            <div className="flex items-center gap-2 rounded-t-3xl bg-gradient-to-r from-brand-600 to-teal-600 px-4 py-3 text-white">
              <Sparkles size={17} />
              <div className="flex-1">
                <div className="text-[14px] font-bold leading-tight">PocketDrive Assistant</div>
                <div className="text-[10.5px] text-white/80">AI · live · uses your data</div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full bg-white/15">
                <X size={17} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug ${
                      m.role === 'user'
                        ? 'rounded-br-sm bg-brand-600 text-white'
                        : 'rounded-bl-sm bg-slate-100 text-ink'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3">
                    <span className="flex gap-1">
                      <Dot /> <Dot /> <Dot />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Default questions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {DEFAULTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-[11.5px] font-medium text-brand-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                ask(input)
              }}
              className="flex items-center gap-2 border-t border-slate-100 p-3 pb-5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 rounded-xl bg-slate-100 px-3.5 py-3 text-[13px] outline-none placeholder:text-slate-400"
                aria-label="Ask the assistant"
              />
              <button
                type="submit"
                disabled={busy}
                aria-label="Send"
                className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
}
