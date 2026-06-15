// ─────────────────────────────────────────────────────────────────────────
// PocketDrive seed data — every hardcoded value the prototype uses lives here.
// This stands in for what real APIs, OCR and ML models would produce.
// ─────────────────────────────────────────────────────────────────────────

export const user = {
  name: 'Amir Rahman',
  email: 'amir@example.com',
  initials: 'AR',
}

// Module 0.2 / 0.3 / 0.4 — Vehicle profile + baseline efficiency
export type Vehicle = {
  id: string
  brand: string
  model: string
  year: number
  fuelType: 'RON95' | 'RON97' | 'Diesel'
  engine: string
  tankCapacity: number // litres
  transmission: 'Automatic' | 'Manual'
  baselineEfficiency: number // km/L benchmark
  fuelLevelPct: number // current tank %
}

export const vehicles: Vehicle[] = [
  {
    id: 'myvi',
    brand: 'Perodua',
    model: 'Myvi 1.5 AV',
    year: 2021,
    fuelType: 'RON95',
    engine: '1.5L',
    tankCapacity: 42,
    transmission: 'Automatic',
    baselineEfficiency: 14.2, // ~7.0 L/100km
    fuelLevelPct: 43, // ≈ 18 L of 42 L
  },
  {
    id: 'city',
    brand: 'Honda',
    model: 'City 1.5 V',
    year: 2019,
    fuelType: 'RON97',
    engine: '1.5L',
    tankCapacity: 40,
    transmission: 'Automatic',
    baselineEfficiency: 16.8,
    fuelLevelPct: 72,
  },
]

// Module 0.5 / 0.6 — Budget & environmental goals
export const budget = {
  monthlyRM: 300,
  spentRM: 187,
}

export const goals = {
  reduceConsumptionPct: 10, // target
  progressPct: 6.4, // achieved so far this month
  baselineLitresMonth: 52, // monthly baseline fuel use
  ecoScoreTarget: 80,
  co2ReductionTargetKg: 15,
  co2ReducedKg: 8.0,
}

// Module 0.4 — Mileage / odometer records
export const mileage = {
  odometer: 48230,
  thisMonthKm: 1180,
  lastMonthKm: 1042,
  records: [
    { date: '08 Jun 2026', odometer: 48230, km: 520 },
    { date: '31 May 2026', odometer: 47710, km: 520 },
    { date: '23 May 2026', odometer: 47190, km: 550 },
    { date: '15 May 2026', odometer: 46640, km: 510 },
  ],
}

// Module 1.1 — Current fuel prices (gov-regulated, hardcoded)
export const fuelPrices = {
  lastUpdated: '12 Jun 2026, 12:00 AM',
  weekLabel: '12–18 Jun 2026',
  prices: [
    { type: 'RON95', price: 2.05, delta: 0.0, unit: 'L' },
    { type: 'RON97', price: 2.90, delta: +0.1, unit: 'L' },
    { type: 'Diesel', price: 2.88, delta: -0.05, unit: 'L' },
  ],
}

// Module 1.2 — Price history at three zoom levels (week / month / year)
export const priceHistory = {
  week: [
    { label: 'Mon', RON95: 2.05, RON97: 2.80, Diesel: 2.9 },
    { label: 'Tue', RON95: 2.05, RON97: 2.80, Diesel: 2.9 },
    { label: 'Wed', RON95: 2.05, RON97: 2.83, Diesel: 2.88 },
    { label: 'Thu', RON95: 2.05, RON97: 2.85, Diesel: 2.88 },
    { label: 'Fri', RON95: 2.05, RON97: 2.88, Diesel: 2.88 },
    { label: 'Sat', RON95: 2.05, RON97: 2.90, Diesel: 2.88 },
    { label: 'Sun', RON95: 2.05, RON97: 2.90, Diesel: 2.88 },
  ],
  month: [
    { label: 'W1', RON95: 2.05, RON97: 2.66, Diesel: 2.95 },
    { label: 'W2', RON95: 2.05, RON97: 2.70, Diesel: 2.92 },
    { label: 'W3', RON95: 2.05, RON97: 2.72, Diesel: 2.9 },
    { label: 'W4', RON95: 2.05, RON97: 2.78, Diesel: 2.93 },
    { label: 'W5', RON95: 2.05, RON97: 2.82, Diesel: 2.88 },
    { label: 'W6', RON95: 2.05, RON97: 2.90, Diesel: 2.88 },
  ],
  year: [
    { label: 'Jul', RON95: 2.05, RON97: 2.58, Diesel: 2.85 },
    { label: 'Aug', RON95: 2.05, RON97: 2.62, Diesel: 2.88 },
    { label: 'Sep', RON95: 2.05, RON97: 2.66, Diesel: 2.9 },
    { label: 'Oct', RON95: 2.05, RON97: 2.64, Diesel: 2.95 },
    { label: 'Nov', RON95: 2.05, RON97: 2.68, Diesel: 2.98 },
    { label: 'Dec', RON95: 2.05, RON97: 2.72, Diesel: 3.0 },
    { label: 'Jan', RON95: 2.05, RON97: 2.76, Diesel: 2.97 },
    { label: 'Feb', RON95: 2.05, RON97: 2.70, Diesel: 2.94 },
    { label: 'Mar', RON95: 2.05, RON97: 2.74, Diesel: 2.92 },
    { label: 'Apr', RON95: 2.05, RON97: 2.80, Diesel: 2.9 },
    { label: 'May', RON95: 2.05, RON97: 2.85, Diesel: 2.89 },
    { label: 'Jun', RON95: 2.05, RON97: 2.90, Diesel: 2.88 },
  ],
}

// Module 2.1 — Fuel logs (most recent first)
export type FuelLog = {
  id: string
  date: string
  station: string
  fuelType: string
  litres: number
  amountRM: number
  odometer: number
}

export const fuelLogs: FuelLog[] = [
  { id: 'l1', date: '08 Jun 2026', station: 'Petronas Jln Universiti', fuelType: 'RON95', litres: 31.2, amountRM: 63.96, odometer: 48230 },
  { id: 'l2', date: '31 May 2026', station: 'Shell Federal Hwy', fuelType: 'RON95', litres: 28.5, amountRM: 58.43, odometer: 47710 },
  { id: 'l3', date: '23 May 2026', station: 'Petron Damansara', fuelType: 'RON95', litres: 33.0, amountRM: 67.65, odometer: 47190 },
  { id: 'l4', date: '15 May 2026', station: 'BHPetrol Kerinchi', fuelType: 'RON95', litres: 30.1, amountRM: 61.71, odometer: 46640 },
]

// Module 2.2 — Hardcoded "OCR" extraction result (revealed after fake scan)
export const ocrResult = {
  date: '11 Jun 2026',
  station: 'Petronas Bangsar South',
  fuelType: 'RON95',
  litres: 29.8,
  amountRM: 61.09,
}

// Module 2.5 — Efficiency trend (km/L over recent fills)
export const efficiencyTrend = [
  { label: 'Mar', kmL: 12.5 },
  { label: 'Apr', kmL: 13.1 },
  { label: 'May', kmL: 13.8 },
  { label: 'Jun', kmL: 14.2 },
]

export const efficiencyStats = {
  current: 14.2,
  best: 15.1,
  worst: 12.6,
  baseline: 13.8,
}

// Module 2.6 — Monthly spending breakdown
export const monthlySpend = [
  { month: 'Feb', rm: 152 },
  { month: 'Mar', rm: 171 },
  { month: 'Apr', rm: 162 },
  { month: 'May', rm: 174 },
  { month: 'Jun', rm: 187 },
]

// Module 3.1 / 3.2 — A completed driving session (the "Simulate Drive" result)
export const driveSession = {
  durationMin: 25,
  distanceKm: 14.3,
  route: 'Bangsar → KLCC',
  harshBrakes: 3,
  aggressiveAccel: 1,
  idleMinutes: 4,
  topSpeed: 96,
  speedingEvents: 2,
  // Module 3.2 weighted sub-scores (0–100)
  scores: {
    acceleration: 82, // 25%
    braking: 68, // 25%
    idling: 71, // 20%
    speedConsistency: 80, // 30%
  },
}

// A single recorded driving session, with its own detected-event timeline.
export type DriveEvent = { t: number; kind: 'accel' | 'brake' | 'idle' | 'speed'; label: string; detail: string }
export type Session = {
  id: string
  time: string
  route: string
  distanceKm: number
  durationMin: number
  topSpeed: number
  harshBrakes: number
  aggressiveAccel: number
  idleMinutes: number
  timeline: DriveEvent[]
}

// Today's sessions — each fully detailed (Module 3.1)
export const todaySessions: Session[] = [
  {
    id: 's1',
    time: '08:12',
    route: 'Bangsar → KLCC',
    distanceKm: 14.3,
    durationMin: 25,
    topSpeed: 96,
    harshBrakes: 3,
    aggressiveAccel: 1,
    idleMinutes: 4,
    timeline: [
      { t: 2, kind: 'accel', label: 'Aggressive acceleration', detail: 'Jln Maarof on-ramp' },
      { t: 7, kind: 'brake', label: 'Harsh braking', detail: 'Traffic light, Jln Bangsar' },
      { t: 11, kind: 'idle', label: 'Idling 2m 10s', detail: 'Jam near Pavilion' },
      { t: 15, kind: 'brake', label: 'Harsh braking', detail: 'Pedestrian crossing' },
      { t: 19, kind: 'speed', label: 'Speeding 96 km/h', detail: 'Jln Tun Razak' },
      { t: 22, kind: 'brake', label: 'Harsh braking', detail: 'KLCC ramp' },
    ],
  },
  {
    id: 's2',
    time: '18:45',
    route: 'KLCC → Bangsar',
    distanceKm: 17.2,
    durationMin: 31,
    topSpeed: 88,
    harshBrakes: 2,
    aggressiveAccel: 2,
    idleMinutes: 6,
    timeline: [
      { t: 3, kind: 'accel', label: 'Aggressive acceleration', detail: 'KLCC exit ramp' },
      { t: 8, kind: 'idle', label: 'Idling 3m 05s', detail: 'Jam, Jln Ampang' },
      { t: 14, kind: 'brake', label: 'Harsh braking', detail: 'Jln Tun Razak lights' },
      { t: 20, kind: 'accel', label: 'Aggressive acceleration', detail: 'Overtaking, Jln Bangsar' },
      { t: 27, kind: 'brake', label: 'Harsh braking', detail: 'Bangsar junction' },
    ],
  },
]

// Yesterday's sessions (for "view previous day footprint")
export const yesterdaySessions: Session[] = [
  {
    id: 'y1',
    time: '09:05',
    route: 'Bangsar → Mid Valley',
    distanceKm: 8.6,
    durationMin: 18,
    topSpeed: 74,
    harshBrakes: 1,
    aggressiveAccel: 0,
    idleMinutes: 2,
    timeline: [
      { t: 4, kind: 'idle', label: 'Idling 1m 50s', detail: 'Carpark queue, Mid Valley' },
      { t: 12, kind: 'brake', label: 'Harsh braking', detail: 'Jln Syed Putra merge' },
    ],
  },
  {
    id: 'y2',
    time: '17:30',
    route: 'Mid Valley → Bangsar',
    distanceKm: 9.1,
    durationMin: 22,
    topSpeed: 81,
    harshBrakes: 2,
    aggressiveAccel: 1,
    idleMinutes: 3,
    timeline: [
      { t: 5, kind: 'accel', label: 'Aggressive acceleration', detail: 'Federal Hwy slip road' },
      { t: 10, kind: 'brake', label: 'Harsh braking', detail: 'Angkasapuri lights' },
      { t: 18, kind: 'brake', label: 'Harsh braking', detail: 'Bangsar junction' },
    ],
  },
]

// Days the user can browse in the footprint view
export const driveDays = [
  { id: 'today', label: 'Today', dateLabel: '12 Jun 2026', sessions: todaySessions },
  { id: 'yesterday', label: 'Yesterday', dateLabel: '11 Jun 2026', sessions: yesterdaySessions },
]

// Module 4.1 — Carbon emission factors
export const CO2_FACTOR = { petrol: 2.31, diesel: 2.68 } // kg CO2 / litre

// Module 4.5 — Monthly CO2 trend
export const co2Trend = [
  { month: 'Mar', kg: 44 },
  { month: 'Apr', kg: 42 },
  { month: 'May', kg: 40 },
  { month: 'Jun', kg: 38.4 },
]

// Module 5.3 — Route comparison (hardcoded, KL → PJ)
export type Route = {
  id: string
  name: string
  via: string
  distanceKm: number
  timeMin: number
  fuelL: number
  costRM: number
  co2Kg: number
  traffic: 'Light' | 'Moderate' | 'Heavy'
  recommended?: boolean
}

export const sampleTrip = {
  from: 'Kuala Lumpur (KLCC)',
  to: 'Petaling Jaya (1 Utama)',
}

export const routes: Route[] = [
  { id: 'A', name: 'Route A', via: 'Jln Tun Razak → Federal Hwy', distanceKm: 18, timeMin: 30, fuelL: 1.5, costRM: 3.15, co2Kg: 3.47, traffic: 'Heavy' },
  { id: 'B', name: 'Route B', via: 'SPRINT Highway', distanceKm: 20, timeMin: 24, fuelL: 1.2, costRM: 2.52, co2Kg: 2.77, traffic: 'Light', recommended: true },
  { id: 'C', name: 'Route C', via: 'Jln Damansara', distanceKm: 17, timeMin: 34, fuelL: 1.45, costRM: 3.05, co2Kg: 3.35, traffic: 'Moderate' },
]

// Module 4.7 — Alternative transport comparison for the sample trip
export const altTransport = [
  { mode: 'Your car (Route B)', costRM: 2.52, co2Kg: 2.77, icon: 'car' },
  { mode: 'MRT + walk', costRM: 3.1, co2Kg: 0.6, icon: 'train' },
  { mode: 'Carpool (3 pax)', costRM: 0.84, co2Kg: 0.92, icon: 'users' },
]

// Module 9 — Notification / alert feed
export type Alert = {
  id: string
  kind: 'price' | 'cost' | 'efficiency' | 'driving' | 'route' | 'environment' | 'refuel' | 'maintenance'
  text: string
  time: string
}

export const alerts: Alert[] = [
  { id: 'a1', kind: 'price', text: 'RON97 increased by RM0.10/L this week. Estimated extra monthly cost: RM18.', time: '2h ago' },
  { id: 'a2', kind: 'refuel', text: 'Your tank is at 43% — enough for ~6 days of typical driving.', time: '5h ago' },
  { id: 'a3', kind: 'driving', text: 'Frequent harsh braking detected on your Bangsar → KLCC trip.', time: 'Yesterday' },
  { id: 'a4', kind: 'environment', text: 'You cut carbon emissions by 6% this week. Keep it up!', time: 'Yesterday' },
  { id: 'a5', kind: 'maintenance', text: 'Tyre pressure check due based on recent mileage (48,230 km).', time: '2 days ago' },
  { id: 'a6', kind: 'efficiency', text: 'Fuel efficiency improved to 14.2 km/L — above your vehicle baseline.', time: '3 days ago' },
  { id: 'a7', kind: 'route', text: 'A more fuel-efficient route is available for your usual KL → PJ commute.', time: '4 days ago' },
]

// Module 2.8 — Maintenance reminders
export const maintenance = [
  { id: 'm1', item: 'Tyre pressure check', due: 'Due now', reason: 'Efficiency dipped 2% — possible under-inflation', urgent: true },
  { id: 'm2', item: 'Engine oil change', due: 'In ~1,200 km', reason: 'Every 10,000 km interval', urgent: false },
  { id: 'm3', item: 'Air filter', due: 'In ~3,500 km', reason: 'Affects combustion efficiency', urgent: false },
]
