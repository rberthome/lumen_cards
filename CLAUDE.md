# LumenCards — Règles Claude

App **full-stack Next.js** (App Router + RSC) de révision par répétition espacée.
Le cadre complet (fonctionnel, visuel, archi) est dans **`PROJECT.md`** — le lire en premier.
Plan de travail : **`ISSUES.md`** + issues GitHub (milestones Socle → Boucle → Finitions).

## Stack

- **Next.js 16** (App Router, React Server Components, TypeScript) — full-stack : Server Actions + Route Handlers.
- **Prisma + SQLite** (1 fichier, WAL) — accès via `src/lib/db.ts`.
- **Tailwind v4** (tokens dans `src/app/globals.css` `@theme`), **React Query**, **zod**, **react-hook-form**, **next-intl**, **zustand**.
- Déploiement : VM Proxmox → `docker compose` → 1 conteneur (`output: standalone`) + volume `/data`.

## Commandes

- `npm run dev` — serveur de dev
- `npm run build` / `npm start` — build + serveur de prod
- `npm run typecheck` / `npm run lint` / `npm run test`
- `npm run db:migrate` (prisma migrate dev) · `npm run db:generate`

## Structure (`src/`)

`app/` routes · `features/<feature>/` (components/hooks/store/api/types/**tests**/index.ts, copier `_template/`) · `design-system/` (tokens + composants) · `config/` (env zod, featureFlags) · `i18n/` (next-intl, fr+en) · `lib/` (db, queryClient, logger) · `shared/`.

## Règles strictes

- Tout composant UI vient du **`design-system/`** — zéro style inline ad hoc.
- Toute requête côté client passe par **React Query** — jamais de `fetch()` nu dans un composant.
- Toute string visible passe par **`i18n/`** (fr + en) — zéro texte en dur dans le JSX.
- Tout comportement conditionnel a un **feature flag** (`config/featureFlags`).
- Aucune logique métier dans les composants — `features/*/api` (Server Actions) ou `hooks`.
- **Server Components par défaut**, `"use client"` seulement si interactif ; chaque segment qui charge des données a `<Suspense>` + `loading.tsx` + `error.tsx`.
- ESLint SOLID : `max-lines 200`, `complexity 10`, `no-explicit-any`.

## Domaine & gamification

Flashcards philo/maçonnique/spirituel (Kant, Kabbale, symbolisme). Répétition espacée = **paliers fixes 1/3/7/21/60 j**. Mode carte : QCM si `successCount < 3`, sinon réponse libre. XP : réussite 10 / échec 3 ; streak quotidien. Auth = comptes créés par l'admin (`mustChangePassword`).

## Legacy

Le code v0 (Laravel + Vue + Expo) est archivé dans la branche **`legacy/v0`** + tag `v0.0.0`. Y repomper le contenu maçonnique (seeders) et les bouts utiles, ne pas réécrire de zéro.
