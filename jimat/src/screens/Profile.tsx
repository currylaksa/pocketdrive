import { useState } from 'react'
import {
  FileText,
  Download,
  Bell,
  Wrench,
  ChevronRight,
  Plus,
  Eye,
  Leaf,
  Target,
} from 'lucide-react'
import { Card, SectionTitle, Pill } from '../components/ui'
import { user, vehicles, maintenance, goals, budget } from '../data/seed'
import { RM } from '../lib/logic'

const NOTIF_TYPES = [
  { id: 'price', label: 'Price changes', on: true },
  { id: 'cost', label: 'Budget alerts', on: true },
  { id: 'driving', label: 'Driving behaviour', on: true },
  { id: 'route', label: 'Better routes', on: false },
  { id: 'maintenance', label: 'Maintenance', on: true },
]

export function ProfileScreen() {
  const [notifs, setNotifs] = useState(NOTIF_TYPES)
  const [reportState, setReportState] = useState<'idle' | 'generating' | 'ready'>('idle')

  function viewSummary() {
    setReportState('generating')
    setTimeout(() => setReportState('ready'), 1200)
  }

  return (
    <div className="animate-pop px-4 pb-6 pt-4">
      {/* Account header (Module 0.1) */}
      <Card className="flex items-center gap-3 p-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-teal-600 text-lg font-extrabold text-white">
          {user.initials}
        </div>
        <div className="flex-1">
          <div className="text-[16px] font-extrabold text-ink">{user.name}</div>
          <div className="text-[12px] text-ink-faint">{user.email}</div>
        </div>
        <button className="rounded-xl bg-slate-100 px-3 py-2 text-[12px] font-semibold text-ink-soft">
          Edit
        </button>
      </Card>

      {/* Vehicles (Module 0.2 / 0.3) */}
      <SectionTitle action={<AddBtn />}>My vehicles</SectionTitle>
      <div className="space-y-2.5">
        {vehicles.map((v, i) => (
          <Card key={v.id} className="flex items-center gap-3 p-3.5">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-lg">🚗</div>
            <div className="flex-1">
              <div className="text-[13.5px] font-bold text-ink">
                {v.brand} {v.model}
              </div>
              <div className="text-[11px] text-ink-faint">
                {v.year} · {v.fuelType} · {v.engine} · {v.tankCapacity}L · {v.transmission}
              </div>
            </div>
            {i === 0 && <Pill tone="brand">Active</Pill>}
          </Card>
        ))}
      </div>

      {/* Goals & budget (Module 0.5 / 0.6) */}
      <SectionTitle>Goals & budget</SectionTitle>
      <Card className="divide-y divide-slate-100">
        <Row icon={<Target size={16} className="text-brand-600" />} label="Monthly fuel budget" value={RM(budget.monthlyRM)} />
        <Row icon={<Leaf size={16} className="text-brand-600" />} label="Reduce consumption" value={`${goals.reduceConsumptionPct}%`} />
        <Row icon={<Target size={16} className="text-teal-600" />} label="Eco-Score target" value={`${goals.ecoScoreTarget}`} />
      </Card>

      {/* Monthly report (Module 8) */}
      <SectionTitle>Monthly report</SectionTitle>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-500">
            <FileText size={20} />
          </div>
          <div className="flex-1">
            <div className="text-[13.5px] font-bold text-ink">June 2026 summary</div>
            <div className="text-[11px] text-ink-faint">
              Spending, efficiency, Eco-Score, CO₂ & routes
            </div>
          </div>
        </div>

        {reportState === 'ready' && (
          <div className="mt-3 animate-pop space-y-1.5 rounded-xl bg-slate-50 p-3 text-[12px]">
            <ReportLine label="Total fuel spend" value={`${RM(budget.spentRM)} (vs ${RM(budget.monthlyRM)} budget)`} />
            <ReportLine label="Avg efficiency" value="18.6 km/L (best 19.2)" />
            <ReportLine label="Eco-Score" value="84 · Good" />
            <ReportLine label="CO₂ emitted" value="117 kg (−12% vs May)" />
            <ReportLine label="Fuel saved via routes" value="RM7.50" />
          </div>
        )}

        <button
          onClick={reportState === 'idle' ? viewSummary : undefined}
          disabled={reportState === 'generating'}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-[13.5px] font-bold text-white disabled:opacity-70"
        >
          {reportState === 'generating' ? (
            <>Preparing summary…</>
          ) : reportState === 'ready' ? (
            <>
              <Download size={16} /> Download PDF
            </>
          ) : (
            <>
              <Eye size={16} /> View summary
            </>
          )}
        </button>
      </Card>

      {/* Maintenance reminders (Module 2.8) */}
      <SectionTitle>Maintenance reminders</SectionTitle>
      <Card className="divide-y divide-slate-100">
        {maintenance.map((m) => (
          <div key={m.id} className="flex items-start gap-3 px-4 py-3">
            <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${m.urgent ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-500'}`}>
              <Wrench size={15} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink">{m.item}</span>
                <Pill tone={m.urgent ? 'red' : 'slate'}>{m.due}</Pill>
              </div>
              <p className="mt-0.5 text-[11px] text-ink-faint">{m.reason}</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Notification preferences (Module 9.2) */}
      <SectionTitle>
        <span className="flex items-center gap-1.5">
          <Bell size={15} className="text-brand-600" /> Notifications
        </span>
      </SectionTitle>
      <Card className="divide-y divide-slate-100">
        {notifs.map((n) => (
          <div key={n.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-[13px] font-medium text-ink">{n.label}</span>
            <Toggle
              on={n.on}
              onClick={() =>
                setNotifs((arr) => arr.map((x) => (x.id === n.id ? { ...x, on: !x.on } : x)))
              }
            />
          </div>
        ))}
      </Card>

      <div className="mt-5 text-center text-[11px] text-ink-faint">Jimat v0.1 · Prototype</div>
    </div>
  )
}

function AddBtn() {
  return (
    <button className="flex items-center gap-1 text-[12px] font-semibold text-brand-600">
      <Plus size={14} /> Add
    </button>
  )
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <button className="flex w-full items-center gap-3 px-4 py-3 text-left">
      {icon}
      <span className="flex-1 text-[13px] font-medium text-ink">{label}</span>
      <span className="text-[13px] font-bold text-ink">{value}</span>
      <ChevronRight size={15} className="text-slate-300" />
    </button>
  )
}

function ReportLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-faint">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  )
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-brand-500' : 'bg-slate-300'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
