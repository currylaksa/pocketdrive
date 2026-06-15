import { useEffect, useRef, useState } from 'react'
import {
  Play,
  Gauge,
  TimerReset,
  Route as RouteIcon,
  Wrench,
  Activity,
  CircleDashed,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react'
import { Card, SectionTitle, ScoreRing, Pill, ProgressBar, ScreenHeader } from '../components/ui'
import { driveSession, co2Trend, driveDays, type Session } from '../data/seed'
import {
  ecoDrivingScore,
  scoreBand,
  recommendations,
  dailyFootprint,
  estimateFuel,
  type Recommendation,
} from '../lib/logic'

const recIcon = {
  gauge: Gauge,
  brake: Activity,
  timer: TimerReset,
  route: RouteIcon,
  wrench: Wrench,
  fuel: Gauge,
}

const eventColor: Record<string, string> = {
  accel: 'text-orange-500 bg-orange-50',
  brake: 'text-red-500 bg-red-50',
  idle: 'text-amber-500 bg-amber-50',
  speed: 'text-rose-500 bg-rose-50',
}

export function DriveScreen() {
  const [dayIdx, setDayIdx] = useState(0) // 0 = today (newest)
  const [showSessions, setShowSessions] = useState(true)
  const [openSession, setOpenSession] = useState<string | null>('s1')

  const day = driveDays[dayIdx]
  const fp = dailyFootprint(day.sessions)
  const score = ecoDrivingScore()
  const band = scoreBand(score)

  return (
    <div className="animate-pop px-4 pb-6 pt-4">
      <ScreenHeader title="Drive" subtitle="Daily footprint, sessions & score" />

      {/* ── Daily trip footprint (Module 4.2) — light & readable ── */}
      <SectionTitle>Daily trip footprint</SectionTitle>
      <Card className="p-4">
        {/* Day navigator */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setDayIdx((i) => Math.min(i + 1, driveDays.length - 1))}
            disabled={dayIdx >= driveDays.length - 1}
            aria-label="Previous day"
            className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-ink-soft disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <div className="text-[14px] font-extrabold text-ink">{day.label}</div>
            <div className="text-[11px] text-ink-faint">
              {day.dateLabel} · {fp.trips} trips
            </div>
          </div>
          <button
            onClick={() => setDayIdx((i) => Math.max(i - 1, 0))}
            disabled={dayIdx === 0}
            aria-label="Next day"
            className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-ink-soft disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Metric tiles — dark text on light tiles (high contrast) */}
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <FootprintTile value={fp.km.toFixed(1)} unit="km" label="Distance" tone="text-ink" bg="bg-slate-50" />
          <FootprintTile value={fp.fuel.toFixed(2)} unit="L" label="Fuel used" tone="text-brand-600" bg="bg-brand-50" />
          <FootprintTile value={fp.co2.toFixed(2)} unit="kg" label="CO₂" tone="text-teal-600" bg="bg-teal-50" />
        </div>

        <button
          onClick={() => setShowSessions((s) => !s)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-[13px] font-bold text-brand-700"
        >
          {showSessions ? 'Hide sessions' : `See ${day.label.toLowerCase()}'s drive sessions`}
          <ChevronDown size={16} className={`transition-transform ${showSessions ? 'rotate-180' : ''}`} />
        </button>
      </Card>

      {/* ── Drive sessions of the day — each fully detailed ── */}
      {showSessions && (
        <div className="animate-pop">
          <SectionTitle>{day.label}'s sessions</SectionTitle>
          <div className="space-y-2.5">
            {day.sessions.map((s) => (
              <Card key={s.id} className="overflow-hidden">
                <button
                  onClick={() => setOpenSession((cur) => (cur === s.id ? null : s.id))}
                  className="flex w-full items-center gap-3 p-3.5 text-left"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
                    <Clock size={17} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-ink">{s.route}</div>
                    <div className="text-[11px] text-ink-faint">
                      {s.time} · {s.distanceKm} km · {s.durationMin} min
                    </div>
                  </div>
                  <Pill tone="brand">{estimateFuel(s.distanceKm, 14.2).toFixed(2)} L</Pill>
                  <ChevronDown size={17} className={`text-slate-400 transition-transform ${openSession === s.id ? 'rotate-180' : ''}`} />
                </button>
                {openSession === s.id && <SessionReplay session={s} />}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── Eco-Driving Score (Module 3.2) ── */}
      <SectionTitle>Eco-Driving Score</SectionTitle>
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <ScoreRing score={score} band={band.label} size={120} />
          <div className="flex-1 space-y-2.5">
            <ScoreBar label="Acceleration" pct={driveSession.scores.acceleration} weight="25%" />
            <ScoreBar label="Braking" pct={driveSession.scores.braking} weight="25%" />
            <ScoreBar label="Idling" pct={driveSession.scores.idling} weight="20%" />
            <ScoreBar label="Speed consistency" pct={driveSession.scores.speedConsistency} weight="30%" />
          </div>
        </div>
        <p className="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-[11.5px] text-brand-700">
          🌱 CO₂ this month is down to {co2Trend[co2Trend.length - 1].kg} kg — a 12% drop since March.
        </p>
      </Card>

      {/* ── Recommendation engine (Module 4.3) ── */}
      <SectionTitle>Recommended actions</SectionTitle>
      <p className="-mt-1 mb-2 px-1 text-[11px] text-ink-faint">Ranked by estimated impact</p>
      <div className="space-y-2.5">
        {recommendations().map((r) => (
          <RecCard key={r.id} rec={r} />
        ))}
      </div>
    </div>
  )
}

function FootprintTile({
  value,
  unit,
  label,
  tone,
  bg,
}: {
  value: string
  unit: string
  label: string
  tone: string
  bg: string
}) {
  return (
    <div className={`rounded-2xl ${bg} p-3 text-center`}>
      <div className={`text-xl font-extrabold leading-none ${tone}`}>
        {value}
        <span className="text-[11px] font-bold"> {unit}</span>
      </div>
      <div className="mt-1 text-[11px] font-medium text-ink-faint">{label}</div>
    </div>
  )
}

// Interactive replay of one session, driven by that session's own data.
function SessionReplay({ session }: { session: Session }) {
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('done')
  const [elapsed, setElapsed] = useState<number>(session.durationMin)
  const [visibleEvents, setVisibleEvents] = useState<number>(session.timeline.length)
  const timer = useRef<number>()

  function simulate() {
    setPhase('running')
    setElapsed(0)
    setVisibleEvents(0)
    let t = 0
    timer.current = window.setInterval(() => {
      t += 1
      setElapsed(t)
      setVisibleEvents(session.timeline.filter((e) => e.t <= t).length)
      if (t >= session.durationMin) {
        window.clearInterval(timer.current)
        setPhase('done')
      }
    }, 110)
  }

  useEffect(() => () => window.clearInterval(timer.current), [])

  return (
    <div className="border-t border-slate-100">
      <div className="bg-gradient-to-br from-slate-900 to-slate-700 px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="text-[12px] text-white/70">{session.time} · {session.route}</div>
          <button
            onClick={simulate}
            disabled={phase === 'running'}
            className="flex items-center gap-1.5 rounded-full bg-brand-500 px-3.5 py-2 text-[12.5px] font-bold text-white disabled:opacity-60"
          >
            {phase === 'running' ? <CircleDashed size={15} className="animate-spin" /> : <Play size={14} fill="white" />}
            {phase === 'running' ? 'Driving…' : 'Replay drive'}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1.5 text-center">
          <Metric value={`${elapsed}m`} label="duration" />
          <Metric value={`${session.distanceKm}`} label="km" />
          <Metric value={`${estimateFuel(session.distanceKm, 14.2).toFixed(2)}`} label="L fuel" />
          <Metric value={`${session.topSpeed}`} label="top km/h" />
        </div>
        {phase === 'running' && (
          <div className="mt-3">
            <ProgressBar pct={(elapsed / session.durationMin) * 100} />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 text-[12px] font-bold text-ink">Detected events</div>
        <div className="space-y-2">
          {session.timeline.slice(0, visibleEvents).map((e, i) => (
            <div key={i} className="flex animate-pop items-center gap-3">
              <span className={`grid h-7 w-7 place-items-center rounded-lg text-[11px] font-bold ${eventColor[e.kind]}`}>
                {e.t}'
              </span>
              <div className="flex-1">
                <div className="text-[12.5px] font-semibold text-ink">{e.label}</div>
                <div className="text-[11px] text-ink-faint">{e.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <EventStat n={session.harshBrakes} label="Harsh brakes" tone="red" />
          <EventStat n={session.aggressiveAccel} label="Hard accel" tone="amber" />
          <EventStat n={session.idleMinutes} label="Min idling" tone="slate" />
        </div>
      </div>
    </div>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 py-2">
      <div className="text-lg font-extrabold leading-none text-white">{value}</div>
      <div className="text-[10px] text-white/70">{label}</div>
    </div>
  )
}

function EventStat({ n, label, tone }: { n: number; label: string; tone: 'red' | 'amber' | 'slate' }) {
  const c = { red: 'text-red-500', amber: 'text-amber-500', slate: 'text-slate-700' }
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <div className={`text-2xl font-extrabold ${c[tone]}`}>{n}</div>
      <div className="text-[11px] text-ink-faint">{label}</div>
    </div>
  )
}

function ScoreBar({ label, pct, weight }: { label: string; pct: number; weight: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold text-ink-soft">{label}</span>
        <span className="text-ink-faint">
          {pct} · {weight}
        </span>
      </div>
      <div className="mt-1">
        <ProgressBar pct={pct} tone={pct >= 75 ? 'brand' : pct >= 50 ? 'amber' : 'red'} />
      </div>
    </div>
  )
}

function RecCard({ rec }: { rec: Recommendation }) {
  const Icon = recIcon[rec.icon]
  return (
    <Card className="p-3.5">
      <div className="flex gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="text-[13px] font-bold text-ink">{rec.title}</div>
            <Pill tone="brand">{rec.impact}</Pill>
          </div>
          <p className="mt-1 text-[12px] leading-snug text-ink-faint">{rec.detail}</p>
          <div className="mt-1.5 text-[10.5px] font-medium text-slate-400">↳ {rec.source}</div>
        </div>
      </div>
    </Card>
  )
}
