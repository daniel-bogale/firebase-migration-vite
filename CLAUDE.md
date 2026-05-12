# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is yarn (yarn.lock present; no package-lock.json).

- `yarn dev` — start Vite dev server
- `yarn build` — production build to `dist/`
- `yarn preview` — serve the built `dist/` locally
- `yarn lint` — ESLint on `src/**/*.{js,jsx}`. Configured with `--max-warnings 0`, so any warning fails the command.

There is no test runner configured.

## Architecture

This is a tiny Vite + React 18 single-page app that performs CRUD against a Firestore `users` collection. Despite the repo name ("firebase-migration-vite"), there is no migration script — the project is the migrated app itself, hence [src/firebase-new-config.js](src/firebase-new-config.js) (the "new" Firebase SDK config that replaced an older setup).

The whole app is three files:

- [src/main.jsx](src/main.jsx) — React 18 `createRoot` entry, renders `<App />` in `StrictMode`.
- [src/App.jsx](src/App.jsx) — entire UI and all CRUD logic in one component. Uses MUI (`@mui/material`) `Input`/`Button`/`Typography`. Polls Firestore every 2 seconds via `setInterval` inside `useEffect` — note this interval is **never cleared**, so editing this file requires care if you add re-renders or remount logic.
- [src/firebase-new-config.js](src/firebase-new-config.js) — Firebase init. Selects between two parallel config objects at runtime via `import.meta.env.PROD`:
  - Prod build → reads `VITE_FIREBASE_*_PROD` vars
  - Dev (everything else) → reads `VITE_FIREBASE_*_DEV` vars

  Both sets must be defined in `.env` (gitignored variants like `.env.local` also work — see [.gitignore](.gitignore)). Exported `db` is the Firestore instance consumed by `App.jsx`. The file also `console.log`s the resolved config — be aware this leaks the active Firebase web config to the browser console.

### Things to know before editing

- **No router, no state library, no service layer.** Firestore calls (`getDocs`/`addDoc`/`updateDoc`/`deleteDoc`) are inlined in `App.jsx`. If you're asked to add a feature, prefer extending `App.jsx` over introducing abstractions unless the task explicitly requires them.
- **Mixed Firebase imports.** `App.jsx` imports from `firebase/firestore` while `firebase-new-config.js` imports `getFirestore` from `@firebase/firestore` (scoped form). Both resolve to the same package via the `firebase` meta-package; don't "fix" one to match the other without reason.
- **JSX in `.js` files.** `firebase-new-config.js` is `.js` (no JSX), but lint rules and Vite's React plugin are configured for `.jsx`. Keep that boundary.
- **ESLint zero-warnings policy.** A `react-refresh/only-export-components` warning will fail `yarn lint`. If you export non-component values from a component file, either move them to a separate module or use the `allowConstantExport` escape hatch already enabled in [.eslintrc.cjs](.eslintrc.cjs).

### Env vars

Required in `.env` (or `.env.local`) for the app to boot without runtime errors from Firebase init:

```
VITE_FIREBASE_API_KEY_DEV
VITE_FIREBASE_AUTH_DOMAIN_DEV
VITE_FIREBASE_PROJECT_ID_DEV
VITE_FIREBASE_STORAGE_BUCKET_DEV
VITE_FIREBASE_MESSAGING_SENDER_ID_DEV
VITE_FIREBASE_APP_ID_DEV
```

…and the matching `*_PROD` set for production builds. Only vars prefixed `VITE_` are exposed to client code by Vite.
