# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: modified Next.js

This project runs **Next.js 16.2.9 with React 19** and, per `AGENTS.md`, APIs and conventions may differ from training data. Before writing framework code, read the relevant guide under `node_modules/next/dist/docs/` (`01-app`, `02-pages`, `03-architecture`). Heed deprecation notices.

## Commands

```bash
npm run dev     # start dev server (http://localhost:3000)
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint (eslint-config-next)
```

There is no test runner configured. Format with Prettier (config in `prettier.config.cjs`): tabs, no semicolons, single quotes, JSX single quotes, `arrowParens: avoid`, `singleAttributePerLine`, and automatic import sorting via `@trivago/prettier-plugin-sort-imports` + `prettier-plugin-tailwindcss`. Match this style in every file — imports are grouped/separated by the plugin's `importOrder`.

## Environment variables

- `BACKEND_API_URL` — base URL of the real backend (required unless mocks are on).
- `USE_MOCK_BACKEND=true` — bypass the backend and serve in-memory mock data (see `mock.ts` files). Toggled per-feature in each `service.ts`.

## Architecture

App Router with route groups under `src/app/`. Path alias `@/*` → `src/*`. UI text and error messages are in **Russian** — keep new strings consistent.

**Route groups & access control**
- `(auth)/login` — public login page.
- `(protected)/manager/*` and `(protected)/admin/*` — each group's `layout.tsx` calls `requireRole('manager'|'admin')`, which redirects unauthenticated users to `/login` and wrong-role users to their own home (`ROLE_HOME_PATH` in `src/lib/auth.ts`).
- `src/app/page.tsx` redirects to the user's role home or `/login`.

**Auth & session (all `server-only`)**
- `src/lib/session.ts` — reads/writes the httpOnly access-token cookie (`request_manager_access_token`).
- `src/lib/auth.ts` — `getCurrentUser()` (React `cache`d), `requireUser()`, `requireRole()`, `ROLE_HOME_PATH`.
- `src/features/auth/actions.ts` — `'use server'` login/logout Server Actions. Server Actions re-validate input with Zod (never trust client validation) and call `redirect()` **outside** try/catch (Next.js implements redirect by throwing).

**Backend access**
- `src/lib/backend.ts` — `backendRequest<T>()` wrapper: prefixes `BACKEND_API_URL`, sets JSON headers, `cache: 'no-store'`, injects `Bearer` token, throws typed `BackendError(message, status)`.
- Each feature's `service.ts` (`server-only`) is the seam: it either calls `backendRequest` (validating responses with the feature's Zod schema) or, when `USE_MOCK_BACKEND=true`, delegates to `mock.ts`.

**Feature module pattern** (`src/features/<feature>/`)
- `schema.ts` — Zod schemas + inferred types (single source of truth for shapes).
- `service.ts` — `server-only` data access (backend or mock).
- `actions.ts` — `'use server'` mutations.
- `mock.ts` — `server-only` in-memory fixtures / mock service.
- `*-page-content.tsx` — `'use client'` UI receiving server-fetched data as props.

Route `page.tsx` files stay thin: they `await searchParams`, fetch via the feature service/mock, and render the feature's `*-page-content` client component. Layout lives in `src/components/layout/` (`AppShell` → `AppHeader` + role-aware `AppSidebar`); navigation and route titles are driven by `src/config/navigation.ts` and `src/config/routes.ts`.

**UI components** — shadcn/ui (`components.json`, style `radix-nova`) in `src/components/ui/`, built on `radix-ui` + Tailwind v4 (`src/app/globals.css`), `lucide-react` icons, `cn()` from `src/lib/utils.ts`. Forms use `react-hook-form` + `@hookform/resolvers` with the feature's Zod schema.
