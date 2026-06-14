import { Bell, X } from 'lucide-react'
import { alerts } from '../data/seed'

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

const kindLabel: Record<string, string> = {
  price: 'Price',
  cost: 'Budget',
  efficiency: 'Efficiency',
  driving: 'Driving',
  route: 'Route',
  environment: 'Environment',
  refuel: 'Refuel',
  maintenance: 'Maintenance',
}

// Slide-up notifications sheet, controlled from the Home bell.
export function NotificationsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button aria-label="Close notifications" onClick={onClose} className="absolute inset-0 bg-slate-900/30" />
      <div className="animate-sheet relative flex max-h-[82%] flex-col rounded-t-3xl bg-white shadow-[0_-12px_40px_rgba(15,23,42,0.18)]">
        <div className="flex items-center gap-2 rounded-t-3xl bg-gradient-to-r from-brand-600 to-teal-600 px-4 py-3 text-white">
          <Bell size={17} />
          <div className="flex-1 text-[14px] font-bold">Notifications</div>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full bg-white/15">
            <X size={17} />
          </button>
        </div>
        <div className="no-scrollbar divide-y divide-slate-100 overflow-y-auto">
          {alerts.map((a) => (
            <div key={a.id} className="flex items-start gap-3 px-4 py-3.5">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${alertDot[a.kind]}`} />
              <div className="flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <span className="text-[10.5px] font-bold uppercase tracking-wide text-ink-faint">
                    {kindLabel[a.kind]}
                  </span>
                  <span className="text-[10.5px] text-slate-400">· {a.time}</span>
                </div>
                <p className="text-[12.5px] leading-snug text-ink">{a.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 pb-5">
          <button onClick={onClose} className="w-full rounded-xl bg-slate-100 py-2.5 text-[13px] font-semibold text-ink-soft">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  )
}
