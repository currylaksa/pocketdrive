import type { ReactNode } from 'react'

// App shell: a full-height, phone-width column centered on the page.
// On a phone browser it fills the screen edge-to-edge; on desktop it sits as a
// centered column over the page background.
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] justify-center">
      <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-slate-50 shadow-xl">
        {children}
      </div>
    </div>
  )
}
