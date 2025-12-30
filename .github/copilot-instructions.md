<!--
Guidance for AI coding assistants working on this repository.
Keep this short, actionable and specific to this codebase.
-->

# Copilot / AI assistant instructions

- Purpose: help contributors read/modify the React + Vite + TanStack Router app that uses Zustand for state and Firebase for auth/storage.

- Quick start (what humans run):
  - Install deps: `npm install`
  - Run dev server: `npm run dev` (Vite on port 3000)
  - Run backend/dev server (if needed): `npm run dev:server` (runs `ts-node src/server.ts` per package.json)
  - Build: `npm run build`
  - Tests: `npm run test` (Vitest)

- Big picture (must-read files to understand architecture):
  - `src/main.tsx` — app entry, TanStack Router routes and auth layout. Routes are code-based here.
  - `src/features/cvAppLayout/CvAppLayout.tsx` — main app layout that composes the editor, preview and export features.
  - `src/hooks/useCv.ts` — central Zustand store for CV state (summary, skills, workExperience, personalDetails). Inspect this for save/load semantics and Firestore paths.
  - `src/features/auth/firebase.ts` — Firebase client setup and exports (`auth`, `db`, optional `analytics`). Use these exports rather than reinitializing Firebase.
  - `src/features/auth/sceduleBatchWrite.ts` — scheduling helper used by `useCv` for batched persistence (read before changing persistence behavior).

- Key integration & data flows (concrete examples):
  - Client Firestore path convention: `users/${user.uid}/cvs/main` (see commented methods in `useCv.ts`). If writing server endpoints, follow same document layout.
  - Auth flow: `useAuth` hook used in `main.tsx` to gate the app; Login component lives in `src/features/auth/Login.tsx`.
  - State persistence: store uses `zustand` + `immer`; mutations are done in-place inside setters — prefer editing store actions over ad-hoc state patches.

- Project-specific conventions and patterns:
  - Import alias `@/*` maps to `./src/*` (see `tsconfig.json`). Prefer `@/` imports for internal modules.
  - IDs: code uses `crypto.randomUUID()` to create stable unique ids across components.
  - Language/field names: many model fields use Norwegian keys (e.g. `tittel`, `institusjon`, `fornavn`). Preserve them when touching the model and Firestore documents.
  - Side effects: `scheduleBatchWrite` is used for background persistence. Avoid replacing it without understanding debounce/batch semantics.

- Editing routes:
  - Routes are defined in `src/main.tsx` with `createRootRoute` / `createRoute` and combined into `routeTree`. Add new routes there (or migrate to file-based routing intentionally).

- Tests, lint and formatting:
  - Tests: `vitest` (`npm run test`). Keep tests isolated, run in jsdom where needed.
  - Linting/formatting: `npm run lint`, `npm run format`, `npm run check`.

- Safety and secrets:
  - The Firebase client config in `src/features/auth/firebase.ts` is **public** and safe to commit (Firebase client keys are meant to be exposed).
  - Server-side secrets (firebase-admin service account JSON, API keys) should stay outside the repo (see `PrivateServiceAccount.json` in `.gitignore` if used).

- When suggesting code changes, include:
  1. Files to edit (paths). 2. Short rationale (1-2 lines). 3. A focused code diff or small patch. 4. Any commands needed to validate (build/test/lint).

- If unsure, inspect these first: `package.json`, `tsconfig.json`, `src/main.tsx`, `src/hooks/useCv.ts`, `src/features/auth/firebase.ts`, `src/features/auth/sceduleBatchWrite.ts`, and `src/features/cvAppLayout/CvAppLayout.tsx`.

- Please ask if any repository details are missing or if you want a deeper architecture summary.

Assume that app is already running with `npm run dev`.
