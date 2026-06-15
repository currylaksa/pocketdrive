import { lazy, Suspense, useState } from 'react'
import { Home, Fuel, Gauge, Navigation, User, Loader2 } from 'lucide-react'
import { PhoneFrame } from './components/PhoneFrame'
import { ChatBot } from './components/ChatBot'
import { NotificationsSheet } from './components/Notifications'

// Lazy-load each tab so the initial bundle stays small — recharts (used only
// in Fuel) and per-screen code split into their own chunks, fetched on tap.
const HomeScreen = lazy(() => import('./screens/Home').then((m) => ({ default: m.HomeScreen })))
const FuelScreen = lazy(() => import('./screens/Fuel').then((m) => ({ default: m.FuelScreen })))
const DriveScreen = lazy(() => import('./screens/Drive').then((m) => ({ default: m.DriveScreen })))
const NavigateScreen = lazy(() => import('./screens/Navigate').then((m) => ({ default: m.NavigateScreen })))
const ProfileScreen = lazy(() => import('./screens/Profile').then((m) => ({ default: m.ProfileScreen })))

function ScreenFallback() {
  return (
    <div className="grid h-full place-items-center">
      <Loader2 size={26} className="animate-spin text-brand-500" />
    </div>
  )
}

type Tab = 'home' | 'fuel' | 'drive' | 'navigate' | 'profile'

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'fuel', label: 'Fuel', icon: Fuel },
  { id: 'navigate', label: 'Navigate', icon: Navigation },
  { id: 'drive', label: 'Drive', icon: Gauge },
  { id: 'profile', label: 'Profile', icon: User },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col">
        {/* Scrollable content */}
        <main className="no-scrollbar flex-1 overflow-y-auto bg-slate-50">
          <Suspense fallback={<ScreenFallback />}>
            {tab === 'home' && (
              <HomeScreen
                onNavigate={setTab as (t: string) => void}
                onOpenNotifications={() => setNotifOpen(true)}
              />
            )}
            {tab === 'fuel' && <FuelScreen />}
            {tab === 'drive' && <DriveScreen />}
            {tab === 'navigate' && <NavigateScreen />}
            {tab === 'profile' && <ProfileScreen />}
          </Suspense>
        </main>

        {/* Bottom tab bar */}
        <nav
          className="flex items-stretch justify-around border-t border-slate-200 bg-white/95 px-2 pb-5 pt-2 backdrop-blur"
          aria-label="Primary"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-current={active ? 'page' : undefined}
                aria-label={label}
                className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition-colors"
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.6 : 2}
                  className={active ? 'text-brand-600' : 'text-slate-400'}
                />
                <span
                  className={`text-[10.5px] font-semibold ${active ? 'text-brand-700' : 'text-slate-400'}`}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Global floating AI assistant */}
        <ChatBot />

        {/* Notifications overlay (triggered from Home) */}
        <NotificationsSheet open={notifOpen} onClose={() => setNotifOpen(false)} />
      </div>
    </PhoneFrame>
  )
}
