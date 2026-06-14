// ─────────────────────────────────────────────────────────────────────────
// Domain logic: real formulas from the case study + the rule-based engines
// that stand in for ML. Pure functions, no I/O.
// ─────────────────────────────────────────────────────────────────────────

import {
  CO2_FACTOR,
  driveSession,
  fuelPrices,
  todaySessions,
  vehicles,
  type Vehicle,
} from '../data/seed'

export const RM = (n: number) => `RM${n.toFixed(2)}`

// Module 3.2 — Eco-Driving Score (weighted: accel 25, brake 25, idle 20, speed 30)
export function ecoDrivingScore(s = driveSession.scores): number {
  return Math.round(s.acceleration * 0.25 + s.braking * 0.25 + s.idling * 0.2 + s.speedConsistency * 0.3)
}

// Module 4.4 — Eco-Score (fuel 40, driving 30, route 30)
export function ecoScore(fuelEff = 88, driving = ecoDrivingScore(), route = 82): number {
  return Math.round(fuelEff * 0.4 + driving * 0.3 + route * 0.3)
}

export function scoreBand(score: number): { label: string; tone: 'good' | 'ok' | 'warn' | 'bad' } {
  if (score >= 90) return { label: 'Excellent', tone: 'good' }
  if (score >= 75) return { label: 'Good', tone: 'good' }
  if (score >= 50) return { label: 'Moderate', tone: 'ok' }
  return { label: 'Poor', tone: 'bad' }
}

// Module 4.1 — CO2 from fuel
export function co2FromFuel(litres: number, type: 'petrol' | 'diesel' = 'petrol'): number {
  return litres * (type === 'diesel' ? CO2_FACTOR.diesel : CO2_FACTOR.petrol)
}

// Module 2.4 — Trip fuel estimate
export function estimateFuel(distanceKm: number, kmPerL: number): number {
  return distanceKm / kmPerL
}

// Footprint of a day — aggregate of that day's drive sessions (Module 4.2)
export function dailyFootprint(sessions: { distanceKm: number }[] = todaySessions, kmPerL = 18.6) {
  const km = sessions.reduce((a, s) => a + s.distanceKm, 0)
  const fuel = estimateFuel(km, kmPerL)
  const co2 = co2FromFuel(fuel)
  return { km, fuel, co2, trips: sessions.length }
}

export function ron95(): number {
  return fuelPrices.prices.find((p) => p.type === 'RON95')!.price
}

// Module 6 — Smart refuelling decision (derived from fuel level + schedule)
export function refuelAdvice(v: Vehicle) {
  const litresLeft = (v.fuelLevelPct / 100) * v.tankCapacity
  const avgDailyKm = 42 // dummy driving schedule
  const kmLeft = litresLeft * v.baselineEfficiency
  const daysLeft = Math.floor(kmLeft / avgDailyKm)
  const suggestLitres = Math.round(v.tankCapacity * 0.6)
  return {
    litresLeft: litresLeft.toFixed(1),
    daysLeft,
    kmLeft: Math.round(kmLeft),
    primary: `Current fuel is enough for about ${daysLeft} days of your typical driving (${avgDailyKm} km/day).`,
    secondary: `RON97 rises again next week. Top up ~${suggestLitres} L of RON95 now to stay covered until the next price update.`,
  }
}

// ── Module 4.3 — Eco-Driving Recommendation Engine ─────────────────────────
// Rule-based stand-in for ML: 6–8 fixed recommendations, surfaced by if/else
// over the driving + efficiency + route data, ranked by estimated impact.
export type Recommendation = {
  id: string
  title: string
  detail: string
  impact: string // quantified impact, shown as a chip
  impactRM: number // for ranking (RM/month equivalent)
  source: string // which data triggered it (evidence link)
  icon: 'gauge' | 'brake' | 'timer' | 'route' | 'wrench' | 'fuel'
}

export function recommendations(): Recommendation[] {
  const recs: Recommendation[] = []
  const d = driveSession

  if (d.idleMinutes >= 3) {
    recs.push({
      id: 'idle',
      title: 'Cut idling time',
      detail: `You idled ${d.idleMinutes} min on your last trip. Switch off the engine when stopped for more than 2 minutes to reduce CO₂ emissions.`,
      impact: '~RM12/mo · 4 kg CO₂',
      impactRM: 12,
      source: `Driving data · ${d.idleMinutes} min idling`,
      icon: 'timer',
    })
  }
  if (d.harshBrakes >= 2) {
    recs.push({
      id: 'brake',
      title: 'Anticipate stops earlier',
      detail: `${d.harshBrakes} harsh braking events detected. Increase following distance and coast to a stop to drive more efficiently.`,
      impact: '~RM18/mo · 6%',
      impactRM: 18,
      source: `Driving data · ${d.harshBrakes} harsh brakes`,
      icon: 'brake',
    })
  }
  if (d.aggressiveAccel >= 1) {
    recs.push({
      id: 'accel',
      title: 'Ease off rapid acceleration',
      detail: 'Reduce rapid acceleration to save up to 10% fuel consumption. Accelerate smoothly from a standstill.',
      impact: 'up to 10% fuel',
      impactRM: 22,
      source: `Driving data · ${d.aggressiveAccel} aggressive accel`,
      icon: 'gauge',
    })
  }
  if (d.speedingEvents >= 1) {
    recs.push({
      id: 'speed',
      title: 'Hold a steady 80–90 km/h',
      detail: 'Maintaining steady speed between 80 and 90 km/h improves fuel efficiency by 12–15% on highways.',
      impact: '12–15% on highways',
      impactRM: 16,
      source: `Driving data · top speed ${d.topSpeed} km/h`,
      icon: 'gauge',
    })
  }
  // Route data
  recs.push({
    id: 'route',
    title: 'Take Route B for your KL → PJ commute',
    detail: 'Route B (SPRINT Highway) reduces emissions by 0.8 kg CO₂ per trip and saves RM0.63 in fuel vs your usual route.',
    impact: 'RM0.63/trip · 0.8 kg CO₂',
    impactRM: 14,
    source: 'Route data · frequent congested route',
    icon: 'route',
  })
  // Efficiency trend
  recs.push({
    id: 'tyre',
    title: 'Check tyre pressure',
    detail: 'Efficiency is slightly below your vehicle baseline. Under-inflated tyres are a common cause — a quick check can recover 2–3% economy.',
    impact: '2–3% economy',
    impactRM: 8,
    source: 'Efficiency trend · below baseline',
    icon: 'wrench',
  })

  return recs.sort((a, b) => b.impactRM - a.impactRM)
}

// Context object passed to the live Eco-Coach (Claude) endpoint
export function coachContext() {
  const v = vehicles[0]
  return {
    vehicle: `${v.brand} ${v.model} (${v.fuelType})`,
    ecoScore: ecoScore(),
    ecoDrivingScore: ecoDrivingScore(),
    idleMinutes: driveSession.idleMinutes,
    harshBrakes: driveSession.harshBrakes,
    aggressiveAccel: driveSession.aggressiveAccel,
    ron95Price: ron95(),
    fuelLevelPct: v.fuelLevelPct,
    monthlySpendRM: 287.4,
  }
}
