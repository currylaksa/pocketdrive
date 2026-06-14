# Jimat — Pitch Notes

*Drive smart. Spend less. Emit less.*

## 1. Problem (context)
Malaysian drivers face rising, frequently-revised fuel prices (RON95/RON97/Diesel) and have **no single place** to see what they actually spend, how their driving wastes fuel, or whether a cheaper route or refuelling moment exists. Fuel is one of the largest recurring household costs, yet the decisions around it are made blind.

## 2. Target market & demand
- **Primary:** ~16 million private-vehicle drivers in Malaysia, especially daily commuters in the Klang Valley (KL/PJ) feeling petrol-price pressure.
- **Pain points:** opaque spending, surprise price hikes, congestion that quietly burns fuel, no feedback loop on driving habits.
- **Why now:** subsidy rationalisation and weekly price floats make cost awareness urgent; nearly every driver already carries the sensor platform (a smartphone).

## 3. Solution & value proposition
One app that turns scattered fuel data into **money saved and emissions cut**:
- See real spend vs budget, efficiency, and a single **Eco-Score** at a glance.
- Log fills in seconds via **receipt scanning** (OCR).
- Get a post-trip **driving breakdown** with ranked, *quantified* coaching ("ease off braking → ~RM18/mo").
- Choose the **cheapest, lowest-emission route**, not just the fastest.
- Know **when and how much to refuel** before prices change.
- Ask a **live AI Eco-Coach** anything, grounded in your own data.

**Why us vs alternatives:** generic fuel-log apps track spend but don't coach; navigation apps optimise time, not fuel cost or CO₂. Jimat unifies cost + behaviour + route + emissions into one actionable score and a conversational coach — localised to Malaysian prices and roads.

## 4. Effective & creative use of AI
- **Live Claude Eco-Coach** reasons over the driver's real metrics (idling, braking, Eco-Score, RON95 price) to give personalised, Ringgit-quantified advice — genuine AI in the product, not a chatbot bolt-on.
- **Recommendation engine** cross-references driving, route and efficiency data into ranked, evidence-linked actions — the "what to change and what it's worth" layer.
- Roadmap: on-device ML for accelerometer/GPS event detection and price-forecasting from historical trends.

## 5. Sustainability, growth & business model
- **Maintainable & scalable:** clean React/TS front end; data and ML are isolated behind small modules, so real GPS/OCR/price feeds slot in without UI changes.
- **Business model:**
  - *Freemium* — core tracking free; Pro (RM9.90/mo) unlocks the AI coach, multi-vehicle analytics and monthly reports.
  - *B2B fleet* — per-vehicle SaaS for logistics/ride-hail fleets wanting fuel + emissions reporting.
  - *Affiliate/partnerships* — fuel-station promos, insurance safe-driver discounts, EV-transition nudges.
- **Environmental upside:** every percentage point of fuel saved is CO₂ avoided — the Eco-Score makes that tangible and habit-forming.

## 6. Demo flow (2 minutes)
1. **Home** — Eco-Score, budget, alerts at a glance.
2. **Fuel** — tap *Scan receipt* → watch it auto-fill; show price trend + cost calculator.
3. **Drive** — tap *Simulate Drive* → events replay → Eco-Driving Score → **ask the live AI coach a question**.
4. **Navigate** — tap *Find routes* → KL→PJ comparison → "Route B saves RM0.63" → refuel advice.
5. **Profile** — generate the monthly PDF report.
