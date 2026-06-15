<div align="center">

# 🚗 PocketDrive

### Your Personal Fuel & Eco-Driving Co-Pilot

*Know when to fill up. Know how to drive smart. Save more every week.*

[![Live App](https://img.shields.io/badge/▶_Live_App-pocketdrive--smoky.vercel.app-10b981?style=for-the-badge)](https://pocketdrive-smoky.vercel.app)
[![Pitch Deck](https://img.shields.io/badge/📊_Pitch_Deck-View-f4c66a?style=for-the-badge)](https://currylaksa.github.io/pocketdrive/pitch/)

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06b6d4?logo=tailwindcss&logoColor=white)
![Claude](https://img.shields.io/badge/AI-Claude_Haiku_4.5-d97757?logo=anthropic&logoColor=white)

</div>

---

## Why PocketDrive?

Malaysia is moving from blanket fuel subsidies to a **tiered, personalized** system (BUDI95). Diesel already floats with global markets, and the top earners now pay market rate. For the first time, *what fuel costs you* depends on **who you are and how you drive** — yet two drivers in the same car, on the same commute, can see a **15–20% cost difference** purely from driving behaviour and refuelling timing.

PocketDrive turns the sensor already in every pocket — your phone — into a personal fuel co-pilot that translates driving habits into **ringgit saved and carbon avoided**.

---

## ✨ Features

| | Feature | What it does |
|---|---|---|
| 🤖 | **AI Fuel Copilot** | Tell it where you're heading → get a live, data-grounded **Trip Strategy** (distance, fuel, cost, CO₂, route, refuel advice). Ask follow-ups in a chat thread. |
| 💬 | **Live Eco-Coach** | Claude explains your Eco-Score and exactly how to improve it, quantified in RM and kg CO₂. |
| 🌱 | **Eco-Score** | A single score from your acceleration, idling and route choices. |
| 🧾 | **Receipt OCR** | Snap a fuel receipt → the log auto-fills. |
| 🗺️ | **Route savings** | Compare routes in real ringgit ("Route B saves RM0.63") + refuel timing. |
| 📄 | **PDF reports** | One tap ties spend, mileage and emissions together. |

> **Demo principle:** this is a high-fidelity prototype. OCR, GPS/sensor detection and route APIs are simulated with grounded sample data so judges can experience the full flow. The genuinely **live AI** is the Claude-powered **Eco-Coach** and **Fuel Copilot** — with a polished canned fallback so the demo never breaks on stage.

---

## 🤖 The AI, briefly

Both AI features call **Claude (`claude-haiku-4-5`)** through a single endpoint, `POST /api/coach`:

| Mode | Persona | System prompt |
|------|---------|---------------|
| `copilot` | AI Fuel Copilot — multi-turn trip planner with the driver's master data baked in | trip-strategy format |
| *(default)* | Eco-Coach — concise, quantified driving tips | grounds answers in live trip data |

- **Locally** the endpoint runs as a **Vite dev-server middleware** (`vite.config.ts`).
- **In production** it's a **Vercel serverless function** (`pocketdrive/api/coach.ts`).
- No API key? Both modes return a high-quality **canned fallback** — the UI never shows an error.

---

## 📱 Screens

| Tab | Highlights |
|-----|-----------|
| **Home** | AI Fuel Copilot · Eco-Score · fuel remaining · budget · goals · alerts |
| **Fuel** | live prices · trend chart · cost calculator · logs · OCR receipt scan |
| **Drive** | Simulate Drive · Eco-Driving Score · trip emissions · live Eco-Coach |
| **Navigate** | KL→PJ route comparison · smart refuelling |
| **Profile** | account · vehicles · goals · monthly PDF report · maintenance |

---

## 🚀 Quick start

> The app lives in the [`pocketdrive/`](pocketdrive) folder. **Requires Node 18+.**

```bash
git clone https://github.com/currylaksa/pocketdrive.git
cd pocketdrive/pocketdrive        # the Vite app

npm install
npm run dev                       # → http://localhost:5173
```

Open the link — the app renders inside a phone frame, ready to demo or screenshot.

### 🔑 Enable the live Claude AI (recommended)

The Fuel Copilot and Eco-Coach call Claude live when an API key is present:

```bash
cp .env.example .env              # then paste your key into .env
# ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

Get a key at [console.anthropic.com](https://console.anthropic.com/). **Never commit a real key** — `.env` is git-ignored.

---

## 🧑‍💻 Usage

```bash
npm run dev        # start the dev server (live /api/coach middleware)
npm run build      # type-check + production build → dist/
npm run preview    # preview the production build locally
```

**Try the AI Fuel Copilot:** on the Home screen, tap a destination chip (*Office (PJ)*, *Johor Bahru*, *KL City Centre*) or type your own and hit send. You'll get a Trip Strategy computed from the driver profile, and you can ask follow-up questions in the same card.

---

## 📦 Deployment (Vercel)

The production app is deployed on Vercel at **[pocketdrive-smoky.vercel.app](https://pocketdrive-smoky.vercel.app)**.

1. **Root Directory:** `pocketdrive`
2. **Environment variable:** `ANTHROPIC_API_KEY` (Project → Settings → Environment Variables)
3. Push to `main` → Vercel auto-builds and deploys.

> ⚠️ **Note for contributors:** Vercel ships `api/*.ts` as raw ESM and does **not** bundle cross-directory local imports — so `api/coach.ts` is kept **self-contained** (it inlines its prompts/logic and depends only on `@anthropic-ai/sdk`). The Vite dev middleware uses the shared `src/lib/coach-core.ts`; keep the prompts in the two in sync.

---

## 🗂️ Project structure

```
pocketdrive/                 # the Vite + React app
├── api/coach.ts             # Vercel serverless AI endpoint (self-contained)
├── src/
│   ├── screens/             # Home · Fuel · Drive · Navigate · Profile
│   ├── components/          # FuelCopilot, ChatBot, PhoneFrame, ui, …
│   ├── lib/
│   │   ├── coach-core.ts    # shared AI logic (Vite dev middleware)
│   │   └── logic.ts         # Eco-Score, refuel rules, formulas
│   └── data/seed.ts         # grounded sample data for the prototype
├── vite.config.ts           # dev server + /api/coach middleware
└── README.md                # deeper case-study mapping & "how the fakes work"

pitch/index.html             # storytelling pitch deck (GitHub Pages)
```

For the full case-study → screen mapping and how each simulated feature works, see **[`pocketdrive/README.md`](pocketdrive/README.md)**.

---

## 🛠️ Tech stack

**Frontend:** React 18 · TypeScript · Vite · TailwindCSS · Recharts · lucide-react
**AI:** Anthropic Claude (`claude-haiku-4-5`) via `@anthropic-ai/sdk`
**Hosting:** Vercel (app) · GitHub Pages (pitch deck)

---

<div align="center">

*Built for the Vibeathon — drive smart, spend less, emit less.* 🌱

</div>
