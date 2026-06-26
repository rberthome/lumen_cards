# LumenCards — Roadmap

_Généré le 2026-06-24 — issu du session de grilling._

---

## A — Decision Log

| # | Décision | Rationale |
|---|---|---|
| D1 | V1 = web stabilisé + polish (aujourd'hui/demain) | Timeline courte, base solide existante |
| D2 | V2 = génération IA (admin/modéro only) + features avancées | IA = outil de production, pas self-service utilisateur |
| D3 | V3 = mobile Expo, parité V1 + push notifications | Mobile secondaire, valider le produit sur web d'abord |
| D4 | Migrer vers `category_id` FK, abandonner l'enum `category` dans DeckRepository | L'admin gère déjà les catégories via la table — pas de double système |
| D5 | Client voit uniquement `is_published = true` | Contrôle editorial nécessaire |
| D6 | Modérateur = créer/éditer decks+cartes + publier/dépublier. Pas users, pas catégories | Separation of concerns : éditorial vs admin |
| D7 | V1 polish : flip animation, XP post-session, streak, confetti | "Addictif" = feedback immédiat à chaque action |
| D8 | Déploiement Proxmox local, invitation uniquement | Audience de niche, pas de scaling à prévoir |
| D9 | Routes admin granulaires via middleware `HasPermission` existant | L'infra RBAC existe, juste pas câblée aux routes |

---

## B — Roadmap V1 / V2 / V3

### V1 — Web livrable (aujourd'hui/demain)

**Gaps backend à corriger :**

- [ ] `DeckRepository::findForUser` → filtrer `is_published = true`
- [ ] `DeckRepository::findForUser` → utiliser `category_id` FK, eager-load relation `category`, retourner `category_name` + `category_id` dans le DTO
- [ ] `GET /decks` → accepter `?category_id=` en query param optionnel
- [ ] Seeder permissions : créer `deck:create`, `deck:edit`, `deck:publish`, `card:create`, `card:edit`
- [ ] Seeder roles : créer rôle `moderator` avec ces 5 permissions
- [ ] Routes admin → câbler `HasPermission` middleware sur les routes modérateur
- [ ] `AdminSeeder` → assigner un rôle admin au user admin (éviter lock-out RBAC)

**Gaps frontend à corriger :**

- [ ] `DeckListView` → chips/tabs filtre par catégorie (`GET /categories` + `GET /decks?category_id=`)
- [ ] Vue modérateur → layout admin partagé, nav réduite : decks + cartes uniquement
- [ ] `ReviewView` → animation flip CSS sur la carte avant révélation
- [ ] Post-session → modal XP "+X XP, niveau Y" + confetti
- [ ] `StatsView` / `AppLayout` → streak quotidien visible

**Ce qui existe et ne bouge pas en V1 :**
- CRUD admin complet (catégories, decks, cartes, users)
- Review QCM fonctionnel + SM-2 backend
- Auth Sanctum + design system

---

### V2 — Features avancées web

- **Génération IA** : réflexion → Claude API → N cartes générées → validation → ajout deck (admin/modéro only, feature flag `AI_CARD_GENERATION`)
- **Deck discovery** : catalogue public par catégorie avant connexion
- **Gamification** : historique streaks, leaderboard, badges niveaux maçonniques visuels
- **Import/export** : CSV de cartes pour seeder rapidement du contenu

---

### V3 — Mobile Expo

- Parité exacte V1 : catégories, decks publiés, review QCM, stats, gamification
- Push notifications (`expo-notifications`) pour les cartes dues du jour
- Auth Sanctum identique (tokens Bearer, même API)
- Design tokens adaptés React Native

---

## C — Risk Register

| Priorité | Risque | Impact | Mitigation |
|---|---|---|---|
| **CRITIQUE** | Permissions table vide — modérateur non fonctionnel sans seed | Bloque V1 modérateur | Seeder à écrire en premier |
| **CRITIQUE** | Double système catégorie (enum + FK) — filtre client impossible | Bloque filtre catégorie V1 | Migrer DeckRepository vers `category_id` |
| **HAUT** | `AdminSeeder` crée admin avec `is_admin=true` sans rôle/permissions — risque lock-out après refacto RBAC | Admin inaccessible | Adapter AdminSeeder + vérifier `hasAnyAdminPermission()` |
| **HAUT** | `HasPermission` middleware existant mais jamais utilisé dans les routes | Routes non granulaires | Recâbler les routes admin |
| **MOYEN** | Push notifications V3 sur Proxmox local — Expo push service nécessite serveur joignable | Notifications inopérantes en local pur | Cloudflare Tunnel ou ngrok en dev, reporter à un déploiement réseau |
| **MOYEN** | Génération IA V2 sans rate limiting ni queue | Appels Claude API non maîtrisés | Throttle Laravel + job queue avant activation feature flag |
| **BAS** | Animation flip CSS — flash/FOUC sur Safari | Dégradation visuelle mineure | Tester sur Safari, fallback sans animation |
