# Cyber Reinoso: bill every minute, cut off on time, reward the regulars

**English** · [Español](README.es.md)

**Live demo:** [cyber-reinoso-web.vercel.app](https://cyber-reinoso-web.vercel.app/)

Product page for **Cyber Reinoso**, a desktop system (Python + Tkinter + SQL Server) for running LAN centers and eSports arenas. The page presents it as a commercial product and includes an **interactive station-map demo**, built in React, that reproduces the system's real business rules in the browser.

> The site is in Spanish, since it targets LAN center owners in Peru.

![Cyber Reinoso hero section](docs/screenshot.png)

> System repository: [github.com/Itsfavi0/Cyber-Reinoso](https://github.com/Itsfavi0/Cyber-Reinoso)

## What it is

Cyber Reinoso tackles the four places where a LAN center loses money: time that never gets billed, customers who play past what they paid for, a snack kiosk that doesn't match the cash register, and regulars with no reason to come back. The page explains that to a venue owner in 30 seconds, and shows a recruiter how it is built under the hood.

Every number on the page comes from the system's real code: rates per station category (`CategoriasEstacion`), VIP thresholds and discounts (`modelos.py`), the hardware of the 12 stations and the test gamers (`estructura_db.sql`), and the SQL queries (`conexion.py`).

## Sections

1. **Hero**: value proposition and a live preview of the dashboard with its timers running.
2. **Problem / solution**: five everyday situations in a venue, before and after the system.
3. **Interactive demo** (the centerpiece): a map of 12 stations with statuses, timers, a dropping balance and a **Kill Switch** that ends the session automatically when the balance hits S/ 0.00. Clicking a station shows its details, the gamer and their rank, and lets you top up, check out, seat another gamer or send it to maintenance.
4. **Features**: a bento grid with hierarchy (wallet and Kill Switch as the large tile, rates, roles, power-outage recovery, soft delete and PDF reports).
5. **VIP ranks**: rank table and a savings calculator.
6. **POS kiosk**: interactive point of sale with a header-detail receipt, live stock, insufficient-balance handling and a switch that simulates a SQL Server error so you can watch the ROLLBACK.
7. **Engineering**: SVG diagram of the layers (UI → Mediator → Business / DAO → SQL Server), design decisions and three real SQL queries with custom highlighting.
8. **Stack**, **FAQ** and a **CTA** with a demo-request form that validates and confirms on the page.

![Station-map demo with the Kill Switch about to cut a session](docs/demo.png)

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4** (tokens in `@theme`, no config file)
- **lucide-react** for icons
- **@fontsource** for self-hosted fonts (Chakra Petch, IBM Plex Sans, IBM Plex Mono)
- **oxlint** as the linter (ships with the current Vite scaffold)

No animation or state libraries: motion is plain CSS and the simulation is a `useReducer`.

## Running it

Requires Node 20.19 or later (needed by Vite 8).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serves the build at http://localhost:5173
npm run lint
```

## Structure

```text
src/
├── App.jsx                      # section order
├── index.css                    # design tokens, base styles and animations
├── data/
│   ├── catalog.js               # stations, categories, gamers and products (from the real SQL)
│   ├── sqlSnippets.js           # queries copied from conexion.py
│   └── site.js                  # links and navigation
├── lib/
│   ├── billing.js               # rules ported from modelos.py and main.py (ranks, rates, Kill Switch)
│   ├── highlightSql.js          # tiny tokenizer to highlight SQL without innerHTML
│   └── validateDemoRequest.js   # form validation
├── hooks/
│   ├── useStationSimulation.js  # demo engine (reducer + 1 s clock)
│   ├── useInView.js             # pauses the simulation when off screen
│   └── usePrefersReducedMotion.js
└── components/
    ├── layout/                  # Nav (with mobile menu) and Footer
    ├── sections/                # one section per file
    ├── demo/                    # map pieces: tile, detail, event log, control bar
    ├── engineering/             # architecture diagram and SQL tabs
    ├── form/                    # demo form and accessible field
    └── ui/                      # logo, statuses, GitHub icon
```

## Design decisions

- **Art direction**: a restrained "operations console", closer to Linear or Vercel than to an RGB gamer look. A midnight-slate background and **a single cool accent** (`#7CC8FF`) inherited from the blue of the real logo.
- **Consistent status colors across the page**: Available = mint, Busy = ice accent, Maintenance = amber with diagonal stripes, cut-off = signal red. No status relies on color alone: each one has its own shape (ring, filled dot, wrench) and a text label.
- **Typography**: Chakra Petch (an angular display face with a competitive-gaming UI feel), IBM Plex Sans for body text and IBM Plex Mono for figures, timers and SQL.
- **Signature element**: the panel frame with a chamfered corner (`clip-path`), reserved for the "console" pieces only (preview, demo, calculator, kiosk and form). The rest of the page stays calm and left-aligned.
- **Rejected options**: the violet + neon pink palette the design tool suggested (exactly the cliché the brief ruled out) and phosphor green on black (overused).
- **Motion**: a single entrance choreography in the hero; everything else responds to user actions (button presses, the cut-off flash, the mobile menu). Only `transform` and `opacity`, with custom ease-out curves.
- **Real brands**: the system's test inventory uses commercial brands; the page shows generic names with the same prices and stock, and doesn't use the repository's product or PC photos because they show third-party logos.

## Technical decisions

- **Business logic separated from the UI**: `lib/billing.js` holds the same rules as `modelos.py` (ranks by minutes, discount per rank, per-minute rate rounding) and the Kill Switch criterion from `actualizar_cronometros()`: if the cost of the next minute, after discount, exceeds the balance, the session is cut and whatever was left is charged.
- **Simulation with `useReducer`**: every transition (tick, start, end, top up, maintenance) is a pure function that is easy to test. The clock only runs while the demo is on screen (`IntersectionObserver`).
- **Custom SQL highlighting**: a 20-line tokenizer returns `{ text, kind }` fragments that are rendered as `<span>`s. It avoids a heavy library and any use of `innerHTML`.
- **Self-hosted fonts**, only the latin subset and the weights in use, with `font-display: swap`.
- **Base styles outside `@layer`**: the `body` background, color and typography live outside Tailwind's layers. Unlayered styles always beat layered ones, so if whoever hosts the page injects their own `body { background: #fff }` (which happens when it is embedded in viewers or previews), the dark theme holds instead of leaving light text on a white background.

## Accessibility

- Semantic HTML, a single `h1`, headings in order and a "Skip to content" link.
- Full keyboard navigation, visible focus, a mobile menu with `aria-expanded` that closes on Escape, and SQL tabs following the ARIA pattern (arrows, Home and End).
- AA contrast checked for every text pair (the faintest text reaches 5:1).
- Automatic cut-offs are announced through an `aria-live` region; the simulation can be paused.
- Form with visible labels, errors next to each field linked via `aria-describedby`, focus on the first error and a focused confirmation.
- `prefers-reduced-motion`: no movement (only soft fades), the hero preview stops and automatic scrolling is not animated.
- Touch targets of 44 px or more on touch screens.

## Performance

Lighthouse on the production build (`npm run preview`):

| | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Mobile | 94 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

About 95 kB of gzipped JavaScript and 8 kB of gzipped CSS, with no bitmap images on the page (everything is SVG or CSS).

## Credits

- Content, business rules and test data: the Cyber Reinoso system, by Favio Brañez.
- Icons: [Lucide](https://lucide.dev) (ISC license). GitHub icon: GitHub's trademark, used only to link to the repository.
- Fonts: Chakra Petch (Cadson Demak) and IBM Plex (IBM), both under the SIL Open Font License.
- No photographs are used.

## Future ideas

- Unit tests for `lib/billing.js` and the simulation reducer (Vitest).
- A "full day" mode in the demo, with an end-of-shift cash report.
- An English version of the site.
- Real screenshots of the desktop app next to the recreation.

---

Designed and built by [Favio Brañez](https://github.com/Itsfavi0), Systems Engineering student at UNAC (Lima, Peru).
