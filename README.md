# Галактика Зубрянського ліцею: Місія 1946 🚀

A real-time, cosmic **SWOT-analysis interactive for a teachers' pedagogical council
(педрада)**. Ideas fly in from teachers' phones as asteroids, reach critical mass,
get clustered by AI into planets, and culminate in a strategic **Star Map** with a
spoken conclusion and a downloadable official PDF report.

Built from a Claude Design prototype + a detailed product brief. Live site:
**https://bazf.github.io/swot/**

| Phase | What happens |
| --- | --- |
| **Старт** | Cosmic start screen, teachers join via link/QR |
| **Накопичення** | Anonymous thoughts drift in as neutral "stardust"; the moderator can drag them into 4 colour zones, or let the AI sort them |
| **Критична маса** (40) | Core pulses crimson — moderator swipes it to trigger AI synthesis |
| **Кластери** | AI groups thoughts into planet-diagrams; cycle repeats |
| **Зоряна карта** | 4 SWOT constellations + TOP-3 priority orbit + AI voice + PDF report |

The 4 cosmic categories map to SWOT: ⭐ **Зірки** = Strengths · 🕳 **Чорні діри** =
Weaknesses · 🪐 **Нові планети** = Opportunities · ☄ **Метеорити** = Threats.

---

## Two runtime modes

The same static site behaves differently depending on configuration:

- **Demo** — a fully local simulation: board ⇄ phone preview, a Director control panel,
  sample data and auto-fill. No Firebase, no AI. It's the default when no config is
  committed, and is always reachable at **`?demo=1`** (the public showcase URL, also
  what the e2e tests drive) even after a live config blob is committed.
- **Live** — once an encrypted config blob is committed and the URL carries the key
  (`#key=…`), the app connects to **Firebase Realtime Database** and **OpenRouter**:
  - `?role=board` → the **Master** multiboard (drives phases, calls the AI, narrates).
  - default → the **Slave** phone client (submits anonymous thoughts, gets the report).
  - committed blob but missing/wrong key → an access-error screen.

## Tech stack

React 18 · TypeScript · Vite · custom-CSS design system · Firebase Realtime Database
(modular SDK) · OpenRouter · crypto-js (AES) · jsPDF + html2canvas · Web Speech API ·
Vitest + Testing Library · Playwright · GitHub Actions → GitHub Pages.

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173/swot/  (demo mode)
npm run test         # unit tests (Vitest)
npm run e2e          # end-to-end tests (Playwright, builds + previews)
npm run build        # type-check + production build → dist/
npm run lint         # ESLint
```

## Configuration & security

API keys must never be committed in plaintext (the repo is public). Instead:

1. Open the **hidden admin tool**: `…/swot/?admin=1`.
2. Fill in the Firebase config + OpenRouter key, choose an **encryption password**.
3. Click **Зашифрувати** — it AES-encrypts the config and shows a one-line snippet.
4. Paste that line into [`src/lib/encrypted-config.ts`](src/lib/encrypted-config.ts) and commit.
5. Distribute the links (the password rides in the URL hash and is scrubbed from the
   address bar on load):
   - Moderator (board): `…/swot/?role=board#key=YOUR_PASSWORD`
   - Teachers (phones): `…/swot/#key=YOUR_PASSWORD`

> **Firebase `apiKey` is public by design.** The real security boundary is the
> **Database Rules** — see [`database.rules.json`](database.rules.json) for a
> shape-validated starting point. The encryption gates app discovery and bundles the
> secret OpenRouter key; rules protect the data. Tighten/disable rules outside the
> event window.

For local live testing without the blob, copy `.env.example` → `.env.local`, set
`VITE_LOCAL_LIVE=1` and fill the values (gitignored).

### Firebase data model

```
/sessions/{sessionId}/app_state      { phase, cycle, count, threshold, updatedAt }
/sessions/{sessionId}/messages/{k}   { cat, text, ts }
/sessions/{sessionId}/clusters       Cluster[]
/sessions/{sessionId}/final_report   { map, priorities, conclusion }
```

## Deployment

Pushing to `main` runs two GitHub Actions workflows:

- **CI** (`.github/workflows/ci.yml`) — type-check, lint, unit + e2e tests.
- **Deploy** (`.github/workflows/deploy.yml`) — builds and publishes `dist/` to Pages.

One-time: repo **Settings → Pages → Source → GitHub Actions**. Vite `base` is `/swot/`
so the site serves at `https://bazf.github.io/swot/`.

## Project structure

```
src/
  components/   cosmos/ board/ starmap/ mobile/ report/ shell/ live/ admin/ common/
  state/        machine (pure reducer) · sim · useDemoMission · useLiveMission · types
  lib/          crypto · config · encrypted-config · firebase · openrouter · pdf · speech · session
  data/         catalog (categories, sample content, thresholds)
  styles/       tokens · animations · base  (the design system)
e2e/            Playwright specs (run against demo mode)
```

Single-responsibility components, each kept small; one component per file.

## Credits

Lyceum brand: navy `#1B3A6B` + gold `#F2A900`. Display font **Unbounded**, body
**Nunito**. Designed in Claude Design; implemented with Claude Code.
