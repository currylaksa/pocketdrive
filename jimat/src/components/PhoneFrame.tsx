import type { ReactNode } from 'react'

// Renders children inside an iPhone-style device frame, centered on screen.
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="mb-4 text-center">
        <div className="text-2xl font-extrabold tracking-tight text-brand-700">PocketDrive</div>
        <div className="text-xs text-ink-faint">Drive smart. Spend less. Emit less.</div>
      </div>
      <div className="relative" style={{ width: 390, maxWidth: '100%' }}>
        {/* Device frame */}
        <div className="relative rounded-[3rem] bg-slate-900 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
          {/* Notch */}
          <div className="absolute left-1/2 top-3 z-20 h-7 w-36 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
          <div
            className="relative overflow-hidden rounded-[2.3rem] bg-slate-50"
            style={{ height: 'min(844px, 88vh)' }}
          >
            {children}
          </div>
        </div>
      </div>
      <div className="mt-3 text-[11px] text-ink-faint">Prototype · Sample data · Malaysia</div>
    </div>
  )
}

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-3 pb-1 text-[12px] font-semibold text-white">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="tracking-tight">5G</span>
        <span>􀙇</span>
        <span className="inline-block h-3 w-6 rounded-[3px] border border-white/70 relative">
          <span className="absolute inset-0.5 right-1.5 rounded-[1px] bg-white" />
        </span>
      </span>
    </div>
  )
}
