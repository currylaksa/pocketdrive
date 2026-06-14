import { useState } from 'react'
import {
  Bell,
  ChevronRight,
  TrendingDown,
  Leaf,
  Wallet,
  Fuel as FuelIcon,
  ChevronDown,
  Check,
  Gauge,
} from 'lucide-react'
import { Card, ScoreRing, StatTile, ProgressBar, Pill, SectionTitle } from '../components/ui'
import { user, vehicles, budget, alerts, goals, mileage } from '../data/seed'
import { ecoScore, scoreBand, RM, refuelAdvice } from '../lib/logic'

const alertDot: Record<string, string> = {
  price: 'bg-blue-500',
  cost: 'bg-red-500',
  efficiency: 'bg-amber-500',
  driving: 'bg-orange-500',
  route: 'bg-teal-500',
  environment: 'bg-brand-500',
  refuel: 'bg-indigo-500',
  maintenance: 'bg-rose-500',
}

export function HomeScreen({
  onNavigate,
  onOpenNotifications,
}: {
  onNavigate: (t: string) => void
  onOpenNotifications: () => void
}) {
  const [vehIdx, setVehIdx] = useState(0)
  const [vehMenu, setVehMenu] = useState(false)
  const [showGoalInfo, setShowGoalInfo] = useState(false)
  const v = vehicles[vehIdx]
  const score = ecoScore()
  const band = scoreBand(score)
  const budgetPct = (budget.spentRM / budget.monthlyRM) * 100
  const advice = refuelAdvice(v)

  return (
    <div className="animate-pop">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-600 to-teal-600 px-5 pb-7 pt-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] text-white/80">Selamat pagi 👋</div>
            <div className="text-xl font-extrabold">{user.name.split(' ')[0]}</div>
          </div>
          <button
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-white/15"
          >
            <Bell size={19} />
            <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-amber-400 text-[9px] font-extrabold text-white ring-2 ring-brand-600">
              {alerts.length}
            </span>
          </button>
        </div>

        {/* Vehicle switcher dropdown (Module 0.3) */}
        <div className="relative mt-4">
          <button
            onClick={() => setVehMenu((o) => !o)}
            aria-expanded={vehMenu}
            className="flex w-full items-center justify-between rounded-2xl bg-white/12 px-4 py-3 backdrop-blur"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-base">🚗</div>
              <div>
                <div className="text-[14px] font-bold leading-tight">
                  {v.brand} {v.model}
                </div>
                <div className="text-[11px] text-white/75">
                  {v.year} · {v.fuelType} · {v.engine}
                </div>
              </div>
            </div>
            <ChevronDown size={18} className={`text-white/80 transition-transform ${vehMenu ? 'rotate-180' : ''}`} />
          </button>

          {vehMenu && (
            <div className="animate-pop absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-white shadow-float">
              {vehicles.map((veh, i) => (
                <button
                  key={veh.id}
                  onClick={() => {
                    setVehIdx(i)
                    setVehMenu(false)
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-base">🚗</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-ink">
                      {veh.brand} {veh.model}
                    </div>
                    <div className="text-[11px] text-ink-faint">
                      {veh.year} · {veh.fuelType} · Tank {veh.fuelLevelPct}%
                    </div>
                  </div>
                  {i === vehIdx && <Check size={17} className="text-brand-600" />}
                </button>
              ))}
              <div className="border-t border-slate-100 px-4 py-2.5 text-center text-[12px] font-semibold text-brand-600">
                + Add another vehicle
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="-mt-4 px-4 pb-6">
        {/* Eco-Score hero (Module 4.4) */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <ScoreRing score={score} band={band.label} label="Eco-Score" />
            <div className="flex-1">
              <div className="text-[13px] font-bold text-ink">Your environmental standing</div>
              <p className="mt-1 text-[12px] leading-snug text-ink-faint">
                Combines fuel efficiency, driving behaviour and route choices — updates after every
                trip.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Pill tone="brand">
                  <TrendingDown size={12} /> +4 this week
                </Pill>
                <Pill tone="slate">Goal {goals.ecoScoreTarget}</Pill>
              </div>
            </div>
          </div>
        </Card>

        {/* KPI tiles */}
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <StatTile label="Spent" value={`RM${Math.round(budget.spentRM)}`} sub="this month" accent="text-ink" />
          <StatTile label="Efficiency" value="18.6" sub="km/L" accent="text-brand-600" />
          <StatTile label="CO₂" value="117" sub="kg this mo" accent="text-teal-600" />
        </div>

        {/* Mileage records (Module 0.4) */}
        <Card className="mt-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge size={16} className="text-brand-600" />
              <span className="text-[13px] font-bold text-ink">Mileage</span>
            </div>
            <span className="text-[12px] font-semibold text-ink-faint">
              Odometer {mileage.odometer.toLocaleString()} km
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-brand-50 p-3">
              <div className="text-[11px] font-semibold text-brand-700">This month</div>
              <div className="text-lg font-extrabold text-ink">{mileage.thisMonthKm.toLocaleString()} km</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-[11px] font-semibold text-ink-faint">Last month</div>
              <div className="text-lg font-extrabold text-ink">{mileage.lastMonthKm.toLocaleString()} km</div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {mileage.records.slice(0, 3).map((r) => (
              <div key={r.date} className="flex items-center justify-between text-[12px]">
                <span className="text-ink-faint">{r.date}</span>
                <span className="font-semibold text-ink">
                  {r.odometer.toLocaleString()} km <span className="text-brand-600">(+{r.km})</span>
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Budget tracker (Module 0.5) */}
        <Card className="mt-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-brand-600" />
              <span className="text-[13px] font-bold text-ink">Monthly fuel budget</span>
            </div>
            <span className="text-[12px] font-semibold text-ink-faint">
              {RM(budget.spentRM)} / {RM(budget.monthlyRM)}
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar pct={budgetPct} tone={budgetPct > 90 ? 'amber' : 'brand'} />
          </div>
          <div className="mt-2 text-[11px] text-ink-faint">
            {RM(budget.monthlyRM - budget.spentRM)} left · {Math.round(100 - budgetPct)}% of budget
            remaining
          </div>
        </Card>

        {/* Smart refuel (Module 6) */}
        <Card className="mt-3 overflow-hidden">
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2.5">
            <FuelIcon size={15} className="text-indigo-600" />
            <span className="text-[12px] font-bold text-indigo-700">Smart refuelling</span>
            <Pill tone="slate">Tank {v.fuelLevelPct}%</Pill>
          </div>
          <div className="p-4">
            <p className="text-[13px] font-semibold text-ink">{advice.primary}</p>
            <p className="mt-1.5 text-[12px] leading-snug text-ink-faint">{advice.secondary}</p>
          </div>
        </Card>

        {/* Environmental goal (Module 0.6 / 4.5) */}
        <Card className="mt-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf size={16} className="text-brand-600" />
              <span className="text-[13px] font-bold text-ink">Cut consumption 10%</span>
            </div>
            <button
              onClick={() => setShowGoalInfo((s) => !s)}
              aria-label="What does this mean?"
              className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-ink-faint"
            >
              i
            </button>
          </div>
          {showGoalInfo && (
            <p className="animate-pop mt-2 rounded-xl bg-slate-50 px-3 py-2 text-[11.5px] leading-snug text-ink-soft">
              Your goal is to use <b>10% less fuel</b> than your monthly baseline of about{' '}
              {goals.baselineLitresMonth} L — that's roughly <b>5 L</b> (≈ {RM(5 * 2.05)}) saved and
              ~12 kg less CO₂ each month.
            </p>
          )}
          <div className="mt-3">
            <ProgressBar pct={(goals.progressPct / goals.reduceConsumptionPct) * 100} />
          </div>
          <div className="mt-2 text-[11px] text-ink-faint">
            {goals.progressPct}% reduced so far · {goals.co2ReducedKg} kg CO₂ prevented vs last month
          </div>
        </Card>

        {/* Alerts feed (Module 9) */}
        <SectionTitle
          action={
            <button onClick={onOpenNotifications} className="flex items-center text-[12px] font-semibold text-brand-600">
              See all <ChevronRight size={14} />
            </button>
          }
        >
          Recent alerts
        </SectionTitle>
        <Card className="divide-y divide-slate-100">
          {alerts.slice(0, 4).map((a) => (
            <div key={a.id} className="flex items-start gap-3 px-4 py-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${alertDot[a.kind]}`} />
              <div className="flex-1">
                <p className="text-[12.5px] leading-snug text-ink">{a.text}</p>
                <span className="text-[11px] text-ink-faint">{a.time}</span>
              </div>
            </div>
          ))}
        </Card>

        <button
          onClick={() => onNavigate('drive')}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-brand-600 to-teal-600 py-3.5 text-[14px] font-bold text-white shadow-float"
        >
          View driving analytics →
        </button>
      </div>
    </div>
  )
}
