import { useState } from 'react'
import { Home, Fuel, Gauge, Navigation, User } from 'lucide-react'
import { PhoneFrame } from './components/PhoneFrame'
import { ChatBot } from './components/ChatBot'
import { NotificationsSheet } from './components/Notifications'
import { HomeScreen } from './screens/Home'
import { FuelScreen } from './screens/Fuel'
import { DriveScreen } from './screens/Drive'
import { NavigateScreen } from './screens/Navigate'
import { ProfileScreen } from './screens/Profile'

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
