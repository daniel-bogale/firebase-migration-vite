# firebase-migration-vite

Small Vite + React app that does CRUD against a Firestore `users` collection. The repo name reflects its origin (a migration from an older Firebase setup) — there's no migration script here, just the migrated app.

## Stack

- Vite 4 + React 18
- Firebase 10 (Firestore)
- MUI v5 (`@emotion/react`, `@emotion/styled`)
- ESLint 8 with `react`, `react-hooks`, `react-refresh`

## Prerequisites

- Node 22 (`.nvmrc` is included; if you use nvm, run `nvm use`)
- Yarn (the lockfile is `yarn.lock`)
- A Firebase project with Firestore enabled. Two web apps recommended — one for dev, one for prod — but a single app works if you point both var sets at it.

## Setup

```sh
git clone <this repo>
cd firebase-migration-vite
nvm use            # optional, picks up .nvmrc
cp .env.example .env
# open .env and paste values from Firebase Console
yarn
yarn dev
```

Where to find the Firebase values: Firebase Console → Project settings → Your apps → select your Web app → SDK setup and configuration → "Config". Copy each field into the matching `VITE_FIREBASE_*_DEV` variable in `.env`. Fill the `_PROD` set too if you plan to build for production.

## Scripts

| Command | What it does |
| --- | --- |
| `yarn dev` | Vite dev server (uses `_DEV` env vars) |
| `yarn build` | Production build to `dist/` (uses `_PROD` env vars) |
| `yarn preview` | Serve `dist/` locally to test the prod build |
| `yarn lint` | ESLint over `src/`. Configured with `--max-warnings 0`, so any warning fails the command. |

## How the dev/prod config switch works

[src/firebase-new-config.js](src/firebase-new-config.js) reads `import.meta.env.PROD`. Vite sets that to `false` during `yarn dev` and `true` during `yarn build`. The file then picks one of two parallel config objects — the `_DEV` set or the `_PROD` set — so you don't have to swap env files when building. Only variables prefixed `VITE_` are exposed to the client by Vite.

## Project layout

```
src/
├── main.jsx                 # React 18 entry (createRoot)
├── App.jsx                  # All UI and all Firestore CRUD in one component
├── firebase-new-config.js   # Firebase init, exports `db`
└── App.css
```

The whole app is ~135 lines. There's no router, no state library, no service layer — Firestore calls are inlined in `App.jsx`.

## A note on git history

An earlier commit on `main` checked `.env` into the repo. It has since been untracked, but the values are still in history. Firebase web API keys aren't strict secrets (they ship in every client bundle and are gated by Firestore Security Rules), so this is usually fine. If you want a clean slate, rotate the web config in Firebase Console and update `.env`.
