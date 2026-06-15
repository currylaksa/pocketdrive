import { useRef, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts'
import {
  Camera,
  Check,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Pencil,
  Plus,
} from 'lucide-react'
import { Card, SectionTitle, Pill, StatTile, ScreenHeader } from '../components/ui'
import {
  fuelPrices,
  priceHistory,
  fuelLogs,
  ocrResult,
  efficiencyTrend,
  efficiencyStats,
  monthlySpend,
  vehicles,
  type FuelLog,
} from '../data/seed'
import { RM, ron95 } from '../lib/logic'

type SubTab = 'prices' | 'logbook'

export function FuelScreen() {
  const [sub, setSub] = useState<SubTab>('prices')
  return (
    <div className="animate-pop px-4 pb-6 pt-4">
      <ScreenHeader title="Fuel" subtitle="Prices, costs and your consumption" />

      <div className="mt-3 flex rounded-2xl bg-slate-100 p-1">
        {(['prices', 'logbook'] as SubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSub(t)}
            className={`flex-1 rounded-xl py-2 text-[13px] font-semibold capitalize transition-colors ${
              sub === t ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-faint'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {sub === 'prices' ? <Prices /> : <Logbook />}
    </div>
  )
}

// ── Prices + history + impact calculator (Module 1.1 / 1.2 / 1.3) ──────────
type Range = 'week' | 'month' | 'year'
type Period = 'weekly' | 'monthly' | 'yearly'

const periodDefaults: Record<Period, { min: number; max: number; def: number; perLabel: string }> = {
  weekly: { min: 50, max: 800, def: 300, perLabel: 'week' },
  monthly: { min: 300, max: 3000, def: 1200, perLabel: 'month' },
  yearly: { min: 4000, max: 36000, def: 14000, perLabel: 'year' },
}

function Prices() {
  const [range, setRange] = useState<Range>('month')
  const [period, setPeriod] = useState<Period>('monthly')
  const [km, setKm] = useState(periodDefaults.monthly.def)
  const eff = vehicles[0].baselineEfficiency
  const litres = km / eff
  const cost = litres * ron95()

  function changePeriod(p: Period) {
    setPeriod(p)
    setKm(periodDefaults[p].def)
  }

  return (
    <div>
      <SectionTitle>Today's prices</SectionTitle>
      <div className="grid grid-cols-3 gap-2.5">
        {fuelPrices.prices.map((p) => (
          <div key={p.type} className="rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
            <div className="text-[11px] font-bold text-ink-faint">{p.type}</div>
            <div className="mt-1 text-[19px] font-extrabold text-ink">{p.price.toFixed(2)}</div>
            <div className="text-[10px] text-ink-faint">RM/{p.unit}</div>
            <div className="mt-1.5">
              {p.delta > 0 ? (
                <span className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-red-500">
                  <ArrowUpRight size={11} /> +{p.delta.toFixed(2)}
                </span>
              ) : p.delta < 0 ? (
                <span className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-brand-600">
                  <ArrowDownRight size={11} /> {p.delta.toFixed(2)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-ink-faint">
                  <Minus size={11} /> 0.00
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 px-1 text-[11px] text-ink-faint">
        Updated {fuelPrices.lastUpdated} · Week {fuelPrices.weekLabel}
      </div>

      {/* History chart with range filter (Module 1.2) */}
      <SectionTitle action={<Segmented value={range} onChange={(v) => setRange(v as Range)} options={['week', 'month', 'year']} />}>
        Price trend
      </SectionTitle>
      <Card className="p-4 pb-2">
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={priceHistory[range]} margin={{ top: 5, right: 6, left: -22, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[2, 3.2]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e2e8f0' }} />
            <Line type="monotone" dataKey="RON97" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Diesel" stroke="#0d9488" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="RON95" stroke="#10b981" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 pb-1 text-[11px]">
          <Legend color="#10b981" label="RON95" />
          <Legend color="#f59e0b" label="RON97" />
          <Legend color="#0d9488" label="Diesel" />
        </div>
      </Card>

      {/* Impact calculator with period filter (Module 1.3) */}
      <SectionTitle
        action={<Segmented value={period} onChange={(v) => changePeriod(v as Period)} options={['weekly', 'monthly', 'yearly']} />}
      >
        Cost impact calculator
      </SectionTitle>
      <Card className="p-4">
        <label className="text-[12px] font-semibold text-ink">
          Distance per {periodDefaults[period].perLabel}
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            min={periodDefaults[period].min}
            max={periodDefaults[period].max}
            step={50}
            value={km}
            onChange={(e) => setKm(Number(e.target.value))}
            className="flex-1 accent-brand-600"
            aria-label="Distance"
          />
          <span className="w-24 text-right text-[14px] font-bold text-ink">{km.toLocaleString()} km</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-brand-50 p-3">
            <div className="text-[11px] font-semibold text-brand-700">Fuel needed</div>
            <div className="text-lg font-extrabold text-ink">{litres.toFixed(1)} L</div>
          </div>
          <div className="rounded-xl bg-teal-50 p-3">
            <div className="text-[11px] font-semibold text-teal-700">Cost / {periodDefaults[period].perLabel}</div>
            <div className="text-lg font-extrabold text-ink">{RM(cost)}</div>
          </div>
        </div>
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-[12px] leading-snug text-amber-800">
          ⚠️ RON97 rose RM0.10/L this week. On RON97 that's about{' '}
          <b>RM{(litres * 0.1).toFixed(0)}</b> extra per {periodDefaults[period].perLabel} at this distance.
        </p>
      </Card>
    </div>
  )
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div className="flex rounded-lg bg-slate-100 p-0.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-md px-2 py-1 text-[11px] font-semibold capitalize ${
            value === o ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-faint'
          }`}
        >
          {o.replace('ly', '')}
        </button>
      ))}
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-ink-faint">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} /> {label}
    </span>
  )
}

// ── Logbook: OCR scan + manual entry + editable logs (Module 2) ────────────
function Logbook() {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [addMode, setAddMode] = useState<'none' | 'scan' | 'manual'>('none')
  const [logs, setLogs] = useState<FuelLog[]>(fuelLogs)
  const [editingId, setEditingId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function startScan() {
    setScanState('scanning')
    setTimeout(() => setScanState('done'), 2000)
  }

  function saveScanned() {
    setLogs((l) => [
      { id: `ocr-${Date.now()}`, odometer: l[0].odometer + 480, ...ocrResult },
      ...l,
    ])
    setScanState('idle')
    setAddMode('none')
  }

  function saveManual(entry: FuelLog) {
    setLogs((l) => [entry, ...l])
    setAddMode('none')
  }

  function saveEdit(entry: FuelLog) {
    setLogs((l) => l.map((x) => (x.id === entry.id ? entry : x)))
    setEditingId(null)
  }

  return (
    <div>
      {/* Add a refuel (Module 2.1 / 2.2) */}
      <SectionTitle>Add a refuel</SectionTitle>
      <Card className="p-4">
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={startScan} />

        {addMode === 'none' && (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                setAddMode('scan')
                fileRef.current?.click()
              }}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 py-6"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 text-white">
                <Camera size={20} />
              </div>
              <div className="text-[12.5px] font-bold text-brand-700">Scan receipt</div>
            </button>
            <button
              onClick={() => setAddMode('manual')}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-6"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-700 text-white">
                <Plus size={20} />
              </div>
              <div className="text-[12.5px] font-bold text-ink-soft">Enter manually</div>
            </button>
          </div>
        )}

        {addMode === 'scan' && scanState === 'scanning' && (
          <div className="flex flex-col items-center gap-3 py-9">
            <Loader2 size={34} className="animate-spin text-brand-600" />
            <div className="text-[13px] font-semibold text-ink">Reading your receipt…</div>
            <div className="text-[11px] text-ink-faint">Extracting date, station, litres & amount</div>
          </div>
        )}

        {addMode === 'scan' && scanState === 'done' && (
          <div className="animate-pop">
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-[12px] font-semibold text-brand-700">
              <Check size={15} /> Receipt scanned — review & save
            </div>
            <FillForm
              initial={{ id: 'new', odometer: logs[0].odometer + 480, ...ocrResult }}
              onSave={saveScanned}
              onCancel={() => {
                setScanState('idle')
                setAddMode('none')
              }}
              saveLabel="Save log"
            />
          </div>
        )}

        {addMode === 'manual' && (
          <FillForm
            initial={{
              id: `man-${Date.now()}`,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              station: '',
              fuelType: 'RON95',
              litres: 0,
              amountRM: 0,
              odometer: logs[0].odometer,
            }}
            onSave={saveManual}
            onCancel={() => setAddMode('none')}
            saveLabel="Add log"
          />
        )}
      </Card>

      {/* Efficiency trend (Module 2.5) */}
      <SectionTitle>Fuel efficiency</SectionTitle>
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="Current" value={efficiencyStats.current} sub="km/L" accent="text-brand-600" />
        <StatTile label="Best" value={efficiencyStats.best} sub="km/L" />
        <StatTile label="Worst" value={efficiencyStats.worst} sub="km/L" />
      </div>
      <Card className="mt-2.5 p-4 pb-2">
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={efficiencyTrend} margin={{ top: 5, right: 6, left: -26, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[12, 16]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e2e8f0' }} />
            <Line type="monotone" dataKey="kmL" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="px-1 pb-1 text-[11px] text-brand-700">
          ↗ Improving — up 1.7 km/L since March, now above baseline ({efficiencyStats.baseline}).
        </p>
      </Card>

      {/* Monthly spend (Module 2.6) */}
      <SectionTitle>Monthly spending</SectionTitle>
      <Card className="p-4 pb-2">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={monthlySpend} margin={{ top: 5, right: 6, left: -26, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e2e8f0' }} />
            <Bar dataKey="rm" fill="#0d9488" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="px-1 pb-1 text-[11px] text-amber-700">
          Fuel expenses rose RM13.00 (+7%) compared to last month.
        </p>
      </Card>

      {/* Recent logs — tap to edit (Module 2.1) */}
      <SectionTitle>Recent fills</SectionTitle>
      <Card className="divide-y divide-slate-100">
        {logs.map((l) =>
          editingId === l.id ? (
            <div key={l.id} className="p-4">
              <FillForm initial={l} onSave={saveEdit} onCancel={() => setEditingId(null)} saveLabel="Update" />
            </div>
          ) : (
            <button
              key={l.id}
              onClick={() => setEditingId(l.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <div className="text-[13px] font-semibold text-ink">{l.station || 'Manual entry'}</div>
                <div className="text-[11px] text-ink-faint">
                  {l.date} · {l.litres} L · {l.odometer.toLocaleString()} km
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-[14px] font-bold text-ink">{RM(l.amountRM)}</div>
                  <Pill tone="slate">{l.fuelType}</Pill>
                </div>
                <Pencil size={14} className="text-slate-300" />
              </div>
            </button>
          ),
        )}
      </Card>
    </div>
  )
}

// Reusable editable fill form (used for manual add, scanned review, and edit)
function FillForm({
  initial,
  onSave,
  onCancel,
  saveLabel,
}: {
  initial: FuelLog
  onSave: (entry: FuelLog) => void
  onCancel: () => void
  saveLabel: string
}) {
  const [form, setForm] = useState<FuelLog>(initial)
  const set = (k: keyof FuelLog, v: string) =>
    setForm((f) => ({ ...f, [k]: k === 'litres' || k === 'amountRM' || k === 'odometer' ? Number(v) || 0 : v }))

  return (
    <div className="space-y-2">
      <Input label="Date" value={form.date} onChange={(v) => set('date', v)} />
      <Input label="Station" value={form.station} onChange={(v) => set('station', v)} placeholder="e.g. Petronas …" />
      <Input label="Fuel type" value={form.fuelType} onChange={(v) => set('fuelType', v)} />
      <div className="grid grid-cols-2 gap-2">
        <Input label="Litres" value={String(form.litres)} onChange={(v) => set('litres', v)} type="number" />
        <Input label="Amount (RM)" value={String(form.amountRM)} onChange={(v) => set('amountRM', v)} type="number" />
      </div>
      <Input label="Odometer (km)" value={String(form.odometer)} onChange={(v) => set('odometer', v)} type="number" />
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 rounded-xl bg-slate-100 py-2.5 text-[13px] font-semibold text-ink-soft">
          Cancel
        </button>
        <button onClick={() => onSave(form)} className="flex-1 rounded-xl bg-brand-600 py-2.5 text-[13px] font-bold text-white">
          {saveLabel}
        </button>
      </div>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-ink-faint">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-[13px] font-medium text-ink outline-none focus:bg-white focus:ring-2 focus:ring-brand-200"
      />
    </label>
  )
}
