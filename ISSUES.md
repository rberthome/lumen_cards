# LumenCards — Plan d'issues GitHub (à relire avant création)

Convention : **issues plates**, labels `core` / `visual` / `later`, 3 milestones
(`Socle` → `Boucle` → `Finitions`). Toutes référencent `PROJECT.md`.

> Relis, dis-moi ce qui manque / saute / fusionne. Ensuite je les crée (étape C).

---

## Milestone 0 — Fondations

### #1 · [Techno] Décision technique & ADR — `core`
**Contexte** — Acter le stack (réf. `PROJECT.md §7-8`) dans un ADR versionné.
**Tâches**
- [ ] ADR : Next.js App Router + React + TS, Prisma + SQLite (WAL), 1 conteneur `output: standalone`.
- [ ] Hébergement : VM Proxmox → `docker compose`, volume pour le `.db`.
- [ ] Auth : comptes créés par admin, `must_change_password`, reset piloté admin (pas d'email).
- [ ] Lister explicitement les choix repoussés (`later`) : Postgres, magic-link, IA, mobile.
**Acceptation** — `docs/adr/0001-stack.md` mergé ; les autres issues s'y réfèrent.

### #2 · Scaffold projet & qualité — `core`
**Contexte** — Squelette aligné `project-init` adapté Next mono-app (`PROJECT.md §7`).
**Tâches**
- [ ] `create-next-app` **dernière version stable** (TS, Tailwind, ESLint, App Router, `src/`).
- [ ] Convention de rendu : **Server Components par défaut**, streaming via `<Suspense>` +
      `loading.tsx` (squelettes) + `error.tsx` par segment ; `"use client"` réservé à l'interactif.
- [ ] Arborescence `features/_template`, `design-system`, `config`, `i18n`, `lib`, `shared`.
- [ ] ESLint SOLID : `max-lines 200`, `complexity 10`, `no-explicit-any`, interdiction `fetch()` direct.
- [ ] Husky + lint-staged + pre-commit (`eslint --fix`, prettier, `tsc --noEmit`).
- [ ] Vitest + coverage (global 60 %).
- [ ] `config/env.ts` (zod), `config/featureFlags` (localAdapter), `lib/logger` (consoleAdapter).
- [ ] `.github/workflows/ci.yml` (lint + typecheck + tests + build).
**Acceptation** — `main` protégée, CI verte sur une PR vide.

### #3 · Design-system : tokens + composants de base — `visual`
**Contexte** — Implémenter le design system validé : `docs/design/systeme-visuel-light.html`
(specs résumées dans `PROJECT.md §5`). Le HTML fait foi pour le rendu exact.
**Tâches**
- [ ] `tokens/` : colors (or/indigo/neutres + sémantiques), typography (Display/H1/H2/corps/
      secondaire/label aux tailles exactes), spacing (base 4), radii (6/10/16/full), shadows
      (sm/md/lg + gold glow).
- [ ] Tokens sémantiques (`bg`, `surface`, `accent`, `info`, `correct`, `incorrect`…).
- [ ] Thème `light` (le `dark` est déjà designé dans `docs/design/systeme-visuel-dark.html` → `later`).
- [ ] Composants conformes aux specs : Button (primaire/secondaire/ghost + états), Input
      (repos/focus/erreur/désactivé), Card, Modal (overlay + anim), Toast, Badge (modes/streak/
      acquise/à revoir), Progress (dégradé or), Loader + Skeleton (shimmer).
- [ ] **Système de focus** dans Modal (focus 1er champ, trap Tab, Escape, restauration) + prop
      `autofocus` / méthode `focus()` sur Input. *(repompé de `legacy/v0`)*
**Acceptation** — page de démo des composants fidèle au HTML de référence ; modales focalisables au clavier.

### #4 · i18n (next-intl, fr/en) — `core`
**Contexte** — Règle stricte : zéro string en dur (`PROJECT.md §7`).
**Tâches**
- [ ] next-intl configuré, `locales/fr.json` + `en.json`.
- [ ] Clés de base : app, nav, erreurs communes, actions.
- [ ] Sélecteur de langue (fr par défaut).
**Acceptation** — un écran rendu intégralement via clés i18n.

---

## Milestone 1 — Socle

### #5 · Schéma Prisma & migrations — `core`
**Contexte** — Modèle de `PROJECT.md §4`.
**Tâches**
- [ ] Modèles User, Category, Deck, Card, CardProgress.
- [ ] `lib/db.ts` (client Prisma singleton), SQLite WAL.
- [ ] Migration initiale + seed minimal (1 admin, 1 catégorie, 1 deck, quelques cartes).
**Acceptation** — `prisma migrate` OK, seed exécutable.

### #6 · Auth — connexion & session — `core`
**Contexte** — Comptes créés par admin (`PROJECT.md §8`).
**Tâches**
- [ ] Écran **Connexion** (sobre, invitation only, pas de landing).
- [ ] Server Action login + session (cookie httpOnly), hash mdp.
- [ ] Middleware routes protégées (`user` vs `admin`).
- [ ] Flux `must_change_password` → forcer le changement à la 1ʳᵉ connexion.
**Acceptation** — login OK, route protégée inaccessible sans session, changement de mdp forcé fonctionne.

### #7 · Admin — gestion des utilisateurs (créer + reset mdp) — `core`
**Contexte** — `PROJECT.md §8`, reset piloté admin (sans email).
**Tâches**
- [ ] Lister / créer un user (mdp initial + `must_change_password = true`).
- [ ] **Reset mdp** : génère un mdp temporaire, repasse `must_change_password` à true.
**Acceptation** — admin crée un user qui peut se connecter et est forcé de changer son mdp.

### #8 · Admin — CRUD catégories — `core`
**Tâches** — Liste + créer/éditer/supprimer (name, slug, cover_emoji, sort_order). Dialog avec focus auto.
**Acceptation** — CRUD complet, catégories réutilisables par les decks.

### #9 · Admin — CRUD decks — `core`
**Tâches** — CRUD (title, description, category_id, cover_emoji, `is_published`).
**Acceptation** — un deck publié apparaît côté client ; un non-publié non.

### #10 · Admin — CRUD cartes — `core`
**Tâches** — CRUD (front, back, explanation, wrong_answer_1/2/3, source) rattachées à un deck.
**Acceptation** — cartes créées et révisables.

---

## Milestone 2 — Boucle de révision

### #11 · Logique répétition espacée (paliers) — `core`
**Contexte** — Paliers fixes 1/3/7/21/60 j (`PROJECT.md §3`).
**Tâches**
- [ ] Calcul `next_review_at` : succès → palier+1 ; échec → palier 0 (due immédiat).
- [ ] Sélection des **cartes dues** (`next_review_at <= now`), par deck et tous decks.
- [ ] Tests unitaires du calcul (cas limites inclus).
**Acceptation** — couverture tests sur le scheduler ; cartes dues correctes.

### #12 · Accueil / liste des decks + « cartes dues » — `visual` `core`
**Contexte** — Écran 2 (`PROJECT.md §6`).
**Tâches**
- [ ] Liste decks (emoji, titre, « X cartes dues »).
- [ ] CTA proéminent **« Réviser ce qui est dû »** (tous decks).
- [ ] Streak 🔥 visible.
- [ ] **Streaming** : coquille affichée immédiatement, listes/compteurs streamés via `<Suspense>`
      + squelette (`loading.tsx`), `error.tsx` du segment.
**Acceptation** — compteur dues exact, CTA lance une session, pas d'écran blanc bloquant (squelette visible).

### #13 · Détail d'un deck — `visual`
**Tâches** — Liste des cartes + bouton réviser ce deck ; deck vide → message « ajoute des cartes ».
**Acceptation** — états plein / vide gérés.

### #14 · Session — mode QCM — `core` `visual`
**Contexte** — `success_count < 3` (`PROJECT.md §3`).
**Tâches**
- [ ] Question (front) + 4 réponses mélangées.
- [ ] Feedback couleur (verte correcte / rouge choisie-fausse), badge « Choix multiple ».
**Acceptation** — réponse enregistrée, feedback clair.

### #15 · Session — mode réponse libre (flip) — `core` `visual`
**Contexte** — `success_count >= 3`.
**Tâches**
- [ ] Flip front↔back, boutons « Je savais ✓ » / « Je ne savais pas ✗ », badge « Réponse libre ».
**Acceptation** — auto-évaluation enregistrée.

### #16 · Session — progression, cas limites & soumission — `core`
**Contexte** — `PROJECT.md §3` (cas limites).
**Tâches**
- [ ] Barre de progression + compteur ✓/✗.
- [ ] Re-passage carte ratée **plafonné à 2** (fin du bug de boucle).
- [ ] Rien dû → « À jour ✓ » + « réviser en avance ».
- [ ] Quitter en cours → progression partielle sauvée.
- [ ] Soumission de la session (mise à jour CardProgress).
**Acceptation** — aucun re-empilement infini ; reprise propre.

### #17 · Résultat de session — `visual`
**Tâches** — XP gagné, streak, récap bon/mauvais, bouton recommencer / retour.
**Acceptation** — données cohérentes avec la session.

---

## Milestone 3 — Finitions

### #18 · Gamification : XP + streak — `core`
**Tâches** — XP (succès 10 / échec 3) sur User ; streak +1/jour avec ≥ 1 révision ; reset si jour manqué.
**Acceptation** — XP & streak persistés et exacts après plusieurs jours.

### #19 · Écran Mes stats (minimal) — `visual`
**Tâches** — streak, cartes connues, cartes dues. Sobre.
**Acceptation** — chiffres corrects.

### #20 · Confettis & polish visuel — `visual`
**Tâches** — confettis fin de session ; passe responsive mobile-first ; cohérence tokens.
**Acceptation** — fluide sur mobile, aucun style inline.

---

## Backlog `later` (issues à créer mais hors V1)

- IA — génération de cartes (Claude) `later`
- App mobile Expo (parité V1 + push) `later`
- RBAC — rôle modérateur granulaire `later`
- Niveaux maçonniques (Apprenti → Grand Maître) `later`
- Dark mode `later`
- Migration Postgres `later`
- Auth magic-link / email (reset self-service) `later`
- Lib d'icônes (remplacer les emojis) `later`
- Workflows deploy staging/prod `later`
