# App Context

## Tech Stack
- **Framework:** React 19.2
- **Language:** TypeScript 6.0
- **Build Tool:** Vite 8.0
- **Testing:** Vitest 3.2
- **Linting:** ESLint 10.3 (flat config)
- **Backend:** Supabase (PostgreSQL + Auth)
- **Drag & Drop:** dnd-kit
- **Styling:** Plain CSS (custom properties, OKLCH colors)

## Dev Commands
- `npm run dev` — Start Vite dev server (HMR)
- `npm run build` — Type-check + production build
- `npm run preview` — Preview production build
- `npm run lint` — Lint with ESLint
- `npm test` — Run Vitest tests

## Dev URL
- `http://localhost:5173`

## Testing
- Framework: Vitest
- Config: `vitest.config.ts` (node environment, globals: true)
- Run: `npm test` or `npx vitest`
- Test file: `kanban-mvp/src/lib/kanban-utils.test.ts`
- Test patterns: `describe`/`it`/`expect` globally

## Environment Variables (required)
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key

## Key Paths
- Source: `kanban-mvp/src/`
- Entry: `kanban-mvp/src/main.tsx`
- App root: `kanban-mvp/src/App.tsx`
- Configs: `kanban-mvp/vite.config.ts`, `kanban-mvp/vitest.config.ts`
- Supabase client: `kanban-mvp/src/lib/supabaseClient.ts`
- API layer: `kanban-mvp/src/lib/api.ts`
