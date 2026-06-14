// Small shared presentational primitives used across screens.
import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
  onClick,
  'aria-label': ariaLabel,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  'aria-label'?: string
}) {
  const interactive = onClick
    ? 'text-left w-full active:scale-[0.99] transition-transform'
    : ''
  const Comp: any = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      aria-label={ariaLabel}
      className={`rounded-2xl bg-white shadow-card border border-slate-100 ${interactive} ${className}`}
    >
      {children}
    </Comp>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-1 mb-2 mt-5">
      <h2 className="text-[15px] font-bold text-ink tracking-tight">{children}</h2>
      {action}
    </div>
  )
}

export function Pill({
  children,
  tone = 'brand',
}: {
  children: ReactNode
  tone?: 'brand' | 'amber' | 'red' | 'slate' | 'teal'
}) {
  const tones: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-700',
    teal: 'bg-teal-50 text-teal-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-600',
    slate: 'bg-slate-100 text-slate-600',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function StatTile({
  label,
  value,
  sub,
  accent = 'text-ink',
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  accent?: string
}) {
  return (
    <div className="rounded-2xl bg-white shadow-card border border-slate-100 p-3.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</div>
      <div className={`mt-1 text-2xl font-extrabold tracking-tight ${accent}`}>{value}</div>
      {sub && <div className="text-[11px] text-ink-faint mt-0.5">{sub}</div>}
    </div>
  )
}

// Circular score gauge (SVG)
export function ScoreRing({
  score,
  size = 132,
  label,
  band,
}: {
  score: number
  size?: number
  label?: string
  band?: string
}) {
  const stroke = 11
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(Math.max(score, 0), 100) / 100
  const dash = c * pct
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.22,1,0.36,1)' }}
        />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-extrabold text-ink leading-none">{score}</div>
        {band && <div className="text-[11px] font-bold text-brand-600 mt-1">{band}</div>}
        {label && <div className="text-[10px] text-ink-faint">{label}</div>}
      </div>
    </div>
  )
}

export function ProgressBar({ pct, tone = 'brand' }: { pct: number; tone?: 'brand' | 'amber' | 'red' }) {
  const tones = { brand: 'bg-brand-500', amber: 'bg-amber-500', red: 'bg-red-500' }
  return (
    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full rounded-full ${tones[tone]} transition-all duration-700`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  )
}
