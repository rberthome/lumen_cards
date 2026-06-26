# LumenCards — Cadre du projet

> App privée et sur invitation de **révision par répétition espacée** pour apprendre du
> contenu philosophique, maçonnique et spirituel (Kant, Kabbale, symbolisme maçonnique,
> philosophie de l'initiation). Gamifiée façon Duolingo, mais **sobre et initiatique**.

Ce document est la source de vérité **fonctionnelle et visuelle**. Le choix technique y est
acté mais détaillé dans une issue dédiée. Toutes les issues GitHub référencent ce fichier.

---

## 1. Raison d'être & utilisateurs

- **Problème résolu** : mémoriser durablement un corpus dense (concepts, symboles, citations)
  via la répétition espacée, sans friction.
- **Utilisateurs** : cercle restreint d'initiés **sur invitation**, **< 50 personnes**.
  Jamais de public ouvert, jamais de scaling à prévoir.
- **Conséquence directe** : on supprime tout ce qui sert à scaler. On privilégie toujours la
  **solution la plus simple**, quitte à ouvrir un ticket d'évolution plus tard.

### Principe directeur

> **Simple d'abord, on ajuste avec le temps.** Toute complexité non justifiée par < 50 users
> devient une issue `later`, pas du code V1.

---

## 2. Périmètre V1

| Brique | Décision | Note |
|---|---|---|
| Boucle de révision | ✅ **Cœur** | Le seul non-négociable |
| Decks + catégories | ✅ Garde | Structurant |
| CRUD admin (decks/cartes/catégories) | ✅ Garde | Admin = toi |
| Gamification | ✅ **Light** | XP + streak uniquement. Niveaux maçonniques = `later` |
| Stats | ✅ **Minimal** | Streak, cartes connues, cartes dues |
| Auth invitation | ✅ Garde | Comptes créés par l'admin |
| Génération IA des cartes | ⏸️ Repousse | V2 — c'est ce qui complexifie tout |
| RBAC granulaire (modérateur) | ⏸️ Repousse / simplifie | V1 = admin seul |
| App mobile native (Expo) | ❌ Coupe | Web responsive mobile-first suffit |
| Tags / difficulty sur cartes | ❌ Coupe | Jamais exploités |

---

## 3. L'expérience de révision (le cœur)

### Flux d'une session

1. L'utilisateur arrive sur l'accueil → voit **« X cartes dues aujourd'hui »**.
2. Geste principal : **« Réviser ce qui est dû »** (tous decks confondus).
   Geste secondaire : ouvrir un deck précis et le réviser.
3. Choix du nombre de cartes (5 / 10 / 20 / toutes).
4. Révision carte par carte (mode QCM ou réponse libre, voir ci-dessous).
5. Écran de **résultat** : XP gagné, streak, récap bon/mauvais.

### Répétition espacée — **paliers fixes** (pas de SM-2 complet)

- Paliers : **1j → 3j → 7j → 21j → 60j**.
- Réussite → on monte d'un palier ; `next_review_at = now + jours[palier]`.
- Échec → retour au **palier 0** ; la carte est due immédiatement.
- Une carte est « due » si `next_review_at <= now` → simple requête, **aucun cron / worker**.

### Mode de réponse — progression QCM → réponse libre

- **Déclencheur unique** : le nombre de **réussites** de la carte.
  - `success_count < 3` → **QCM** (choix multiple, 4 options).
  - `success_count >= 3` → **réponse libre** (carte qui se retourne, auto-évaluation).
- Pas de double système session/inter-session (c'était la cause du bug de boucle).

### Cas limites (comportements attendus)

| Cas | Comportement |
|---|---|
| Deck vide | Message « ajoute des cartes », pas de bouton réviser |
| Rien n'est dû | « À jour ✓ » + option « réviser en avance » |
| Carte ratée en boucle | Re-passage en fin de session **plafonné à 2**, puis on passe |
| Quitter en cours de session | Progression des cartes déjà répondues **sauvée**, le reste abandonné |

---

## 4. Modèle de données (cible V1)

> Concret pour cadrer les issues. ORM Prisma, SQLite.

- **User** : `id`, `name`, `email`, `password_hash`, `role` (`admin` | `user`),
  `must_change_password` (bool), `xp` (int), `streak_days` (int), `last_review_at`, `created_at`.
- **Category** : `id`, `name`, `slug`, `cover_emoji`, `sort_order`.
- **Deck** : `id`, `title`, `description`, `category_id` (FK), `cover_emoji`,
  `is_published` (bool), `created_at`.
- **Card** : `id`, `deck_id` (FK), `front`, `back`, `explanation`,
  `wrong_answer_1/2/3` (nullable), `source` (nullable), `created_at`.
- **CardProgress** (un par user × carte) : `id`, `user_id`, `card_id`, `level` (index palier),
  `success_count`, `next_review_at`, `last_reviewed_at`.

XP : réussite = **10 XP**, échec = **3 XP**. Streak : +1 par jour avec ≥ 1 révision.

---

## 5. Cadre visuel

> **Source de référence** : design system validé dans `docs/design/systeme-visuel-light.html`
> (+ variante `-dark.html`). Les tokens ci-dessous en sont l'extraction ; le HTML fait foi pour
> le rendu exact des composants.

### Ambiance

**Sobre · initiatique · lumineux.** Fond clair, beaucoup d'espace, l'**or** comme accent rare
(lumière, savoir, récompense), le **serif** pour la gravité du contenu. À l'opposé d'un
Duolingo criard. V1 = thème **clair**. Le **dark mode est déjà designé**
(`docs/design/systeme-visuel-dark.html`) → reste `later` à implémenter, mais les tokens sont prêts.

### Couleurs

Trois familles + sémantiques. **Un rôle par couleur**, l'or reste rare.

#### Or — accent, marque, XP, « lumière »
| Token | Hex | Usage |
|---|---|---|
| `gold-50` | `#FFFBEB` | Fonds d'accent doux (badge XP, sélection) |
| `gold-200` | `#FDE68A` | Bordures d'accent |
| `gold-400` | `#FBBF24` | Barres de progression, hover |
| `gold-500` | `#F59E0B` | Accent principal, boutons primaires |
| `gold-600` | `#D97706` | Marque « LumenCards », texte sur fond clair |
| `gold-700` | `#B45309` | États actifs/pressés |

#### Indigo — profondeur, savoir, explications, info
| Token | Hex | Usage |
|---|---|---|
| `indigo-50` | `#EEF2FF` | Fond des encarts « Explication » |
| `indigo-500` | `#6366F1` | Liens, info |
| `indigo-600` | `#4F46E5` | Titres d'explication |
| `indigo-900` | `#312E81` | Texte initiatique sur fond clair |

#### Neutres (pierre/slate) — ~90 % de l'écran
| Token | Hex | Usage |
|---|---|---|
| `neutral-0` | `#FFFFFF` | Surfaces (cartes, modales) |
| `neutral-50` | `#F8FAFC` | Fond d'application |
| `neutral-200` | `#E2E8F0` | Bordures |
| `neutral-500` | `#64748B` | Texte secondaire |
| `neutral-700` | `#334155` | Texte courant |
| `neutral-900` | `#0F172A` | Titres |

#### Sémantiques
| Rôle | Hex | Usage |
|---|---|---|
| `success` | `#22C55E` | Bonne réponse, « je savais » |
| `error` | `#EF4444` | Mauvaise réponse, « je ne savais pas » |
| `warning` | `#F59E0B` | Alertes |
| `info` | `#3B82F6` | Informations neutres |

#### Tokens sémantiques (à exposer dans le design-system)
```
bg            → neutral-50      text          → neutral-900
surface       → neutral-0       text-muted    → neutral-500
border        → neutral-200     accent        → gold-500
accent-soft   → gold-50         info          → indigo-600
info-soft     → indigo-50       correct       → success
incorrect     → error
```

### Typographie — deux voix
**Serif `Georgia`** = contenu (on lit la pensée) · **Sans `system-ui`** = action (on agit).

| Rôle | Police | Taille / interligne / graisse |
|---|---|---|
| Display | Georgia | 46 / 1.1 / 600 |
| H1 | Georgia | 32 / 1.15 / 600 |
| H2 (question de carte) | Georgia | 24 / 1.2 / 600 |
| Corps | system-ui | 16 / 1.6 / 400 |
| Secondaire (méta, aides, compteurs) | system-ui | 14 / 1.6 / 400 |
| Label / badge de mode | system-ui | 12 / 600 / `letter-spacing .12em` uppercase |

### Fondations
- **Espacement** (base 4) : `4 xs · 8 sm · 16 md · 24 lg · 32 xl · 48 2xl`.
- **Rayons** : `6 sm · 10 md · 16 lg · 9999 full`.
- **Ombres** : `sm 0 1px 2px / md 0 4px 12px / lg 0 12px 32px` (rgba `15,23,42`), + **gold glow**
  `0 6px 24px rgba(245,158,11,.40)` (récompense uniquement).

### Specs composants (extraits clés)
- **Bouton primaire** : fond `gold-600 #D97706`, texte blanc, rayon 10, padding 12×22, ombre
  `0 2px 8px rgba(217,119,6,.30)` ; hover `brightness(1.05)` + `translateY(-1px)` ; désactivé
  `bg #F1F5F9 / texte #94A3B8`. **Secondaire** : fond blanc, bordure `neutral-200`, texte
  `neutral-700`. **Ghost** : texte `indigo-600`, hover fond `indigo-50`.
- **Input** : bordure `neutral-200`, rayon 10, padding 12×14 ; focus bordure `gold-500` + anneau
  `0 0 0 3px rgba(245,158,11,.22)` ; erreur bordure `error` + anneau rouge + message 12px.
- **Badges de mode** : « 🃏 Choix multiple » indigo (`#4F46E5` sur `indigo-50`) · « 📖 Réponse
  libre » or (`#B45309` sur `gold-50`, bordure `#FDE68A`) · « ✓ Acquise » vert · « ✗ À revoir »
  rouge · « 🔥 N jours » streak or.
- **Barre de progression** : piste `#F1F5F9`, remplissage dégradé `#FBBF24 → #D97706`, rayon full,
  hauteur 8 ; compteurs `✓` vert / `✗` rouge.
- **Loader** : spinner (anneau `gold-100`, sommet `gold-600`) ; **Skeleton** shimmer.
- **Toast** : fond `neutral-900`, texte blanc, rayon 12 (ex. « +12 XP — bonne réponse »).
- **Modal** : surface blanche rayon 18, overlay `rgba(15,23,42,.55)`, animation `modal-in`.

### Iconographie
**Emojis** comme icônes (📚 🃏 🗂️ 🔥 🎓 ⚙️ ✓ ✗) — zéro dépendance, cohérent avec « simple
d'abord ». Lib d'icônes = `later`.

### Cible & responsive
**Web responsive, mobile-first** (révision au téléphone via navigateur). Pas d'app native.

### Animations
- **Flip de carte** (retournement front ↔ back) — central à l'UX.
- **Confettis** à la fin d'une session / gain d'XP.
- Rien d'autre.

---

## 6. Écrans (périmètre visuel V1)

1. **Connexion** — invitation only, pas de landing publique.
2. **Accueil / liste des decks** — « X cartes dues », bouton « Réviser ce qui est dû ».
3. **Détail d'un deck** — liste des cartes, bouton réviser ce deck.
4. **Session de révision** — la carte (QCM ou flip), **statut de mode** visible, barre de progression.
5. **Résultat de session** — XP, streak, récap bon/mauvais.
6. **Mes stats** — streak, cartes connues, cartes dues (minimal).
7. **Admin** — CRUD decks + cartes + catégories + gestion users (créer / reset mdp).

---

## 7. Architecture & conventions (alignées `project-init`)

### Stack applicative
- **Next.js (dernière version stable) — App Router + React Server Components + TypeScript** —
  full-stack : Server Actions (mutations) + Route Handlers (`app/api`) si besoin. Serveur Node
  persistant (`next start`), pas de serverless.
- **Rendu dynamique & streaming** : par défaut Server Components ; UI **streamée avec `<Suspense>`**
  (squelettes/`loading.tsx` pendant le chargement), `error.tsx` par segment. On affiche la coquille
  immédiatement et on stream les données — pas d'écran blanc bloquant. Client Components (`"use client"`)
  réservés à l'interactif (révision, formulaires).
- **Tailwind** pour le style (tokens du design-system en source).
- **Prisma + SQLite** pour la persistance (accès direct depuis les Server Actions).
- **React Query** (`@tanstack/react-query`) côté client — **jamais de `fetch()` nu**.
- **react-hook-form + zod** pour les formulaires & validation.
- **next-intl** pour l'i18n.
- État local : Zustand si nécessaire (sinon état React simple).

### Structure de dossiers
```
prisma/
  schema.prisma
src/
  app/                       # App Router : routes, layouts
  features/                  # Un dossier par feature métier
    _template/               # À copier pour toute nouvelle feature
      components/ hooks/ store/ api/ types/ __tests__/ index.ts
    auth/                    # connexion, session, reset mdp
    decks/                   # liste + détail decks, catégories (lecture)
    review/                  # session, paliers d'espacement, QCM/libre
    stats/                   # streak, XP, cartes connues/dues
    admin/                   # CRUD decks/cartes/catégories + users
  design-system/
    tokens/                  # colors.ts typography.ts spacing.ts shadows.ts index.ts
    components/              # Button Text Input Card Modal Toast Loader Skeleton Badge ...
    themes/                  # light.ts ([plus tard] dark.ts) index.ts
    index.ts
  config/
    env.ts                   # variables d'env typées avec zod
    featureFlags/            # config.ts hook.ts types.ts adapters/localAdapter.ts
  i18n/
    locales/ fr.json en.json
    index.ts
  lib/
    db.ts                    # client Prisma (singleton)
    queryClient.ts           # React Query
    errorHandler.ts
    logger/ logger.ts adapters/consoleAdapter.ts
  shared/
    hooks/ utils/ types/
```

### Règles strictes (non négociables)
- Tout composant UI vient du **`design-system/`** — **zéro style inline ad hoc**.
- Toute requête côté client passe par **React Query** — jamais de `fetch()` nu dans un composant.
- Toute string visible passe par **`i18n/`** (fr + en) — **zéro texte en dur dans le JSX**.
- Tout comportement conditionnel a un **feature flag** (`config/featureFlags`).
- Aucune logique métier dans les composants — elle vit dans `features/*/api` (Server Actions) ou `hooks`.
- **Server Components par défaut**, `"use client"` seulement si interactif ; chaque segment qui
  charge des données a une **frontière `<Suspense>` + `loading.tsx`** (squelette) et un `error.tsx`.
- ESLint SOLID : `max-lines: 200`, `complexity: 10`, `no-explicit-any: error`, interdiction de `fetch()` direct.

### Qualité & CI
- **Husky + lint-staged** en pre-commit (eslint --fix, prettier, `tsc --noEmit`).
- **Vitest** + coverage. Cible : global 60 %, `features/**` 80 % `[progressif]`.
- **GitHub Actions** : `ci.yml` (lint + typecheck + tests + build) sur PR. Deploy = `later`
  (un seul environnement Proxmox au début).
- Branches : `main` (protégée, PR + CI verte) + `develop`.

---

## 8. Technologie & déploiement

> Détail complet dans l'**issue techno dédiée**. Synthèse actée ici :

- **Hébergement** : VM **Proxmox** locale → **Docker** → `docker compose up`.
- **Un seul conteneur** : app Next (`output: 'standalone'`) + **SQLite en fichier sur un volume**.
  « Serveur + BDD au même endroit » = littéral. Postgres = `later` (ticket d'évolution).
- SQLite en mode **WAL** (un seul process Node writer → OK à cette échelle).
- **Auth** : comptes **créés par l'admin** (toi). Pas de service mail.
  - Mot de passe initial défini par l'admin ; `must_change_password = true` → l'utilisateur le
    change à la première connexion.
  - **Reset mdp** : piloté par l'admin (génère un mdp temporaire + repasse `must_change_password`
    à true). Magic-link / email = `later`.

---

## 9. Process

- **Issues plates**, une par écran / brique (section 6 & 3), labels : `core` / `visual` / `later`.
- **3 milestones** :
  1. **Socle** — techno tranchée + auth + modèle deck/carte + CRUD admin.
  2. **Boucle** — session de révision (QCM→libre, paliers) + résultat.
  3. **Finitions** — stats minimales + XP/streak + polish visuel.
- **Ancien code** : branche **`legacy/v0` + tag**, puis `main` repart à neuf.
  **Pas de `rm` du repo, pas de suppression d'historique** — on repompe depuis `legacy/v0`
  (design-system, contenu/seeders maçonniques).

---

## 10. Risques ouverts

| Risque | Mitigation |
|---|---|
| SQLite mono-writer | 1 process Node + WAL ; revisiter seulement si scaling (improbable) |
| Contenu maçonnique | Ne pas réécrire à la main — repomper les seeders depuis `legacy/v0` |
| Calcul des paliers (`next_review_at`) | Spécifier proprement, tester (source classique de bugs) |
| Reset mdp sans email | Bien gérer le flag `must_change_password` (forcer le changement) |
