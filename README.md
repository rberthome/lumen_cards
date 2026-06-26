# LumenCards

Révision par répétition espacée — philosophie, Kabbale et symbolisme maçonnique.
App full-stack **Next.js 16 + Prisma/SQLite**, déployée en un seul conteneur Docker.

## Démarrer

```bash
npm install
npm run db:migrate   # crée la base SQLite + applique les migrations
npm run dev          # http://localhost:3000
```

## Docker (prod)

```bash
docker compose up --build   # 1 conteneur app + volume SQLite
```

## Documentation

- **`PROJECT.md`** — cadre fonctionnel, visuel et architecture.
- **`ISSUES.md`** — plan de développement (milestones).
- **`docs/design/`** — design system validé (light + dark).
- **`DESIGN_PROMPT.md`** — prompt pour itérer le design.
