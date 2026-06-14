# Jimat — Smart Fuel Management & Eco-Driving Assistant

*Jimat* means "save" in Malay. A mobile app prototype for Malaysian drivers to **spend less on petrol and cut emissions**, built for the Vibeathon.

> **Demo principle:** this is a high-fidelity prototype. Real APIs, OCR and ML are simulated with grounded sample data so evaluators can experience the full flow and value. The one genuinely live AI is the **Eco-Coach** (Claude).

## Run it

```bash
npm install
npm run dev          # → http://localhost:5173
```

Open the link — the app renders inside a phone frame, ready to screenshot or demo.

### Enable the live AI Eco-Coach (optional but recommended for judging)

The **Drive → Ask Eco-Coach** chat calls **Claude (`claude-opus-4-8`)** live. Provide a key:

```bash
cp .env.example .env      # then paste your key into .env
# or: export ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

Without a key it falls back to polished canned answers, **so the demo never breaks on stage.**

## What maps to what (case study → screens)

| Tab | Modules demonstrated |
|-----|----------------------|
| **Home** | 7 Unified dashboard · 4.4 Eco-Score · 0.5 budget · 0.6 goals · 6 refuel summary · 9 alert feed |
| **Fuel** | 1.1 prices · 1.2 trend · 1.3 cost-impact calculator · 2.1 logs · **2.2 OCR receipt scan** · 2.5 efficiency · 2.6 spending |
| **Drive** | **3.1 Simulate Drive** · 3.2 Eco-Driving Score · 4.1/4.2 trip emissions · **4.3 recommendation engine** · live Claude Eco-Coach |
| **Navigate** | **5.1–5.4 route optimization (KL→PJ)** · 4.7 alt-transport · **6 smart refuelling** |
| **Profile** | 0.1 account · 0.2/0.3 vehicles · 0.5/0.6 goals · **8 monthly PDF report** · 2.8 maintenance · 9.2 notification prefs |

## How the "fakes" work (by design, per the brief)

- **Route optimization (5):** 3 preset KL→PJ routes with fixed distance/time/fuel/cost. "Find routes" shows the comparison instantly.
- **OCR (2.2):** any photo → 2s spinner → form auto-fills with hardcoded extraction.
- **Driving detection (3.1):** "Simulate Drive" replays a 25-min trip (3 harsh brakes, 1 hard accel, 4 min idle).
- **Eco recommendation engine (4.3):** 6 fixed, quantified tips surfaced by if/else over the driving data, ranked by impact — each links to the data that triggered it.
- **Fuel prices (1.1):** hardcoded RON95/97/Diesel + "last updated" timestamp.
- **Refuel advice (6):** derived from the fixed fuel level + dummy daily-distance schedule.

All sample data lives in [`src/data/seed.ts`](src/data/seed.ts); the formulas and rule engines in [`src/lib/logic.ts`](src/lib/logic.ts).

## Stack

React + Vite + TypeScript + Tailwind · Recharts · lucide-react · Anthropic SDK (Eco-Coach via a tiny `/api/coach` dev-server middleware in `vite.config.ts`).
