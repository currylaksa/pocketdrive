import { useState } from 'react'
import {
  MapPin,
  Search,
  Loader2,
  Check,
  Car,
  TrainFront,
  Users,
  Fuel as FuelIcon,
  Clock,
  Droplet,
  Navigation2,
  Square,
} from 'lucide-react'
import { Card, SectionTitle, Pill, ScreenHeader } from '../components/ui'
import { sampleTrip, routes, altTransport, type Route } from '../data/seed'
import { RM } from '../lib/logic'

const altIcon = { car: Car, train: TrainFront, users: Users }

export function NavigateScreen() {
  const [state, setState] = useState<'idle' | 'searching' | 'results'>('idle')
  const [selected, setSelected] = useState<string>('B')
  const [from, setFrom] = useState(sampleTrip.from)
  const [to, setTo] = useState(sampleTrip.to)
  const [navStarted, setNavStarted] = useState(false)

  function findRoutes() {
    setNavStarted(false)
    setState('searching')
    setTimeout(() => setState('results'), 1400)
  }

  const recommended = routes.find((r) => r.recommended)!
  const usual = routes.find((r) => r.id === 'A')!
  const saving = usual.costRM - recommended.costRM
  const selectedRoute = routes.find((r) => r.id === selected)!

  return (
    <div className="animate-pop px-4 pb-6 pt-4">
      <ScreenHeader title="Navigate" subtitle="Fuel-smart route comparison" />

      {/* Trip input — editable (Module 5.1) */}
      <Card className="mt-3 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Start location"
              aria-label="Start location"
              className="w-full bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <MapPin size={15} className="shrink-0 text-red-500" />
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Destination"
              aria-label="Destination"
              className="w-full bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        <button
          onClick={findRoutes}
          disabled={state === 'searching' || !from.trim() || !to.trim()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-teal-600 py-3 text-[14px] font-bold text-white disabled:opacity-60"
        >
          {state === 'searching' ? <Loader2 size={17} className="animate-spin" /> : <Search size={16} />}
          {state === 'searching' ? 'Finding routes…' : 'Find routes'}
        </button>
        <p className="mt-2 text-center text-[10.5px] text-ink-faint">
          Sample route — Kuala Lumpur to Petaling Jaya
        </p>
      </Card>

      {state === 'results' && (
        <div className="animate-pop">
          {/* Recommendation banner (Module 5.2) */}
          <Card className="mt-3 flex items-center gap-3 bg-gradient-to-r from-brand-50 to-teal-50 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
              <Check size={20} />
            </div>
            <div>
              <div className="text-[13px] font-bold text-brand-800">Take Route B (SPRINT Highway)</div>
              <div className="text-[12px] text-brand-700">
                Saves {RM(saving)} in fuel & 0.7 kg CO₂ vs your usual route — and it's faster.
              </div>
            </div>
          </Card>

          {/* Comparison cards (Module 5.3) */}
          <SectionTitle>Compare routes</SectionTitle>
          <p className="-mt-1 mb-2 px-1 text-[11px] text-ink-faint">Tap a route to select it</p>
          <div className="space-y-2.5">
            {routes.map((r) => (
              <RouteCard key={r.id} r={r} selected={selected === r.id} onSelect={() => setSelected(r.id)} />
            ))}
          </div>

          {/* Start driving (after a route is chosen) */}
          {navStarted ? (
            <Card className="mt-3 flex items-center gap-3 bg-gradient-to-r from-brand-600 to-teal-600 p-4 text-white">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
              </span>
              <div className="flex-1">
                <div className="text-[13px] font-bold">Navigating · {selectedRoute.name}</div>
                <div className="text-[11px] text-white/85">
                  {selectedRoute.timeMin} min · {selectedRoute.distanceKm} km · est. {RM(selectedRoute.costRM)} fuel
                </div>
              </div>
              <button
                onClick={() => setNavStarted(false)}
                className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-[12px] font-bold"
              >
                <Square size={12} fill="white" /> End
              </button>
            </Card>
          ) : (
            <button
              onClick={() => setNavStarted(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-teal-600 py-3.5 text-[14px] font-bold text-white shadow-float"
            >
              <Navigation2 size={17} fill="white" /> Start driving · {selectedRoute.name}
            </button>
          )}

          {/* Traffic-aware note (Module 5.4) */}
          <Card className="mt-3 p-3.5">
            <p className="text-[12px] leading-snug text-amber-800">
              🚦 <b>Live traffic:</b> Heavy congestion on Route A (Federal Hwy) may increase fuel use by
              ~18%. Route B is clear right now.
            </p>
          </Card>

          {/* Alt transport (Module 4.7) */}
          <SectionTitle>Alternatives for this trip</SectionTitle>
          <Card className="divide-y divide-slate-100">
            {altTransport.map((a) => {
              const Icon = altIcon[a.icon as keyof typeof altIcon]
              return (
                <div key={a.mode} className="flex items-center gap-3 px-4 py-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon size={17} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-ink">{a.mode}</div>
                    <div className="text-[11px] text-ink-faint">{a.co2Kg} kg CO₂</div>
                  </div>
                  <div className="text-[14px] font-bold text-ink">{RM(a.costRM)}</div>
                </div>
              )
            })}
          </Card>
        </div>
      )}
    </div>
  )
}

function RouteCard({ r, selected, onSelect }: { r: Route; selected: boolean; onSelect: () => void }) {
  const trafficTone = r.traffic === 'Heavy' ? 'red' : r.traffic === 'Moderate' ? 'amber' : 'brand'
  return (
    <Card onClick={onSelect} className={`p-4 ${selected ? 'ring-2 ring-brand-500' : ''}`} aria-label={`Select ${r.name}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-extrabold text-ink">{r.name}</span>
          {r.recommended && <Pill tone="brand">Recommended</Pill>}
        </div>
        <Pill tone={trafficTone as any}>{r.traffic} traffic</Pill>
      </div>
      <div className="mt-1 text-[11px] text-ink-faint">via {r.via}</div>
      <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
        <Cell icon={<MapPin size={13} />} value={`${r.distanceKm} km`} />
        <Cell icon={<Clock size={13} />} value={`${r.timeMin} min`} />
        <Cell icon={<Droplet size={13} />} value={`${r.fuelL} L`} />
        <Cell icon={<FuelIcon size={13} />} value={RM(r.costRM)} highlight />
      </div>
    </Card>
  )
}

function Cell({ icon, value, highlight }: { icon: React.ReactNode; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl py-2 ${highlight ? 'bg-brand-50' : 'bg-slate-50'}`}>
      <div className="flex justify-center text-slate-400">{icon}</div>
      <div className={`mt-0.5 text-[12px] font-bold ${highlight ? 'text-brand-700' : 'text-ink'}`}>{value}</div>
    </div>
  )
}
