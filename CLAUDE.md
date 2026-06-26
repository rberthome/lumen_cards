@AGENTS.md

# LumenCards — Règles Claude

## Structure monorepo

```
lumen_cards/                    ← git root
  apps/
    mobile/                     ← Expo + React Native (TypeScript)
    api/                        ← Laravel 13 (PHP 8.5) — pattern myeventease
  packages/
    types/                      ← Types TS générés depuis les DTOs PHP
      generated.ts              ← AUTO-GENERATED — voir npm run types:generate
      index.ts
  Makefile                      ← make mobile | api | types-generate | lint
  .github/workflows/            ← CI séparée mobile + api
```

**Commandes principales :**
- `make mobile` — Expo dev server
- `make api` — Docker Compose Laravel
- `make types-generate` — génère `packages/types/generated.ts` depuis PHP DTOs
- `make api-migrate` — reset + reseed BDD

## Domaine
Flashcards d'apprentissage philosophique, maçonnique et spirituel. Thèmes : Kant, Kabbale, symbolisme maçonnique, philosophie de l'initiation. Approche Duolingo : progression gamifiée, statistiques, répétition espacée, génération IA.

## Règles strictes — Mobile (apps/mobile)
- Tout composant UI vient de `src/design-system/` — zéro style inline ad hoc
- Toute requête HTTP passe par React Query — jamais de `fetch()` nu dans un composant
- Toute string visible passe par `src/i18n/` — zéro texte en dur dans le JSX (fr.json + en.json)
- Tout nouveau comportement conditionnel a un feature flag dans `featureFlags.config.ts`
- Les types API viennent de `@lumen_cards/types` (généré depuis Laravel)

## Règles strictes — API (apps/api)
- Pattern Repository : Interface → Implémentation → bindé dans AppServiceProvider
- DTOs : `readonly class XxxDto implements ArrayableDto` avec `#[TypeScript]` annotation
- Controllers : injectent le repository, retournent `JsonResponse`
- Aucun code métier dans les controllers — tout dans les Services/Repositories

## Architecture mobile (apps/mobile/src/features)
- `cards/`        — types Card, Deck, CardReview
- `deck/`         — gestion des decks thématiques
- `review/`       — session de révision, logique spaced repetition (SM-2 backend)
- `stats/`        — statistiques, niveaux (Apprenti → Grand Maître), XP
- `ai-generator/` — génération de cartes depuis une réflexion utilisateur (API Claude)

## Gamification (niveaux maçonniques)
Apprenti (0–500 XP) → Compagnon (501–2000) → Maître (2001–5000) → Grand Maître (5001+)
XP : knew=true → 10 XP × streak multiplier, knew=false → 3 XP

## Types partagés
Les types de l'API sont générés automatiquement depuis les DTOs PHP annotés `#[TypeScript]`.
**Ne jamais dupliquer les types manuellement** — toujours lancer `make types-generate` après modification d'un DTO PHP.

## Génération IA
Utiliser l'API Claude (claude-sonnet-4-6) pour analyser une réflexion et générer des cartes front/back avec explication. Feature flag : `AI_CARD_GENERATION`. Réservé admins/modérateurs uniquement (V2).

## Roadmap
Voir `ROADMAP.md` à la racine pour le détail complet.
- **V1** (web) : stabiliser + polish + gaps techniques (filtre catégories, is_published, modérateur, animations)
- **V2** : génération IA (admin/modéro only), deck discovery, gamification avancée
- **V3** : mobile Expo, parité V1 + push notifications cartes dues

## Règles architecture — gaps V1 connus
- `DeckRepository::findForUser` doit filtrer `is_published = true` et utiliser `category_id` FK (pas l'enum `category` legacy)
- Le middleware `HasPermission` doit être utilisé pour les routes modérateur (pas `AdminMiddleware` générique)
- Permissions et rôle `moderator` doivent être seedés avant tout test RBAC

## Rôles et permissions
- **Admin** : accès complet
- **Modérateur** : créer/éditer decks+cartes, publier/dépublier decks, gérer les catégories — pas de gestion users
- Permissions seedées : `deck:create`, `deck:edit`, `deck:publish`, `card:create`, `card:edit`, `category:manage`

## Déploiement
Proxmox local, accès sur invitation uniquement. Pas de scaling à prévoir.
