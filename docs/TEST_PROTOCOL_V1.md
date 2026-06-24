# Protocole de validation — LumenCards V1 (web)

Valide la finalisation V1 : backend RBAC + catégories (Phase 1) et polish frontend
(Phase 2 : filtre catégories, flip carte, confetti/niveau, streak, vue modérateur).

- **Branche :** `feature/qcm-review`
- **Web :** http://localhost:3000
- **API (curl direct) :** http://localhost:8001/api  _(cible du proxy Vite ; le web utilise `/api`)_

---

## 0. Démarrage

```bash
make api           # démarre api + db + redis
make web           # démarre le web sur http://localhost:3000
make api-migrate   # reset COMPLET + reseed (admin, permissions, rôles, 3 decks publiés + catégories)
```

> ⚠️ `make api-migrate` efface la base. À lancer avant chaque passe de test pour repartir propre.

### Vérifs automatisées préalables (doivent être vertes)

```bash
docker compose exec api php artisan test           # 7 passed
cd apps/web && npm run typecheck && npm run build   # verts
```

---

## 1. Création des comptes

Trois rôles sont nécessaires.

### a) Admin — déjà seedé
```
email    : admin@lumencards.dev
password : admin1234
```

### b) Utilisateur simple — via l'interface
1. Aller sur http://localhost:3000/register
2. Créer un compte (ex. `user@test.dev` / `user1234`)
3. Après inscription → redirigé automatiquement vers `/app/decks` (espace apprenant)

### c) Modérateur — via tinker
Il n'existe pas encore d'UI d'assignation de rôle ; on le fait en une commande :

```bash
docker compose exec api php artisan tinker --execute='
$u = App\Models\User::firstOrCreate(
  ["email" => "mod@lumencards.dev"],
  ["name" => "Modo", "password" => Hash::make("mod1234")]
);
$u->role_id = App\Models\Role::where("slug","moderator")->first()->id;
$u->save();
echo "Modérateur prêt : mod@lumencards.dev / mod1234\n";
'
```

### (Optionnel) Récupérer un token API pour les tests curl
```bash
curl -s http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mod@lumencards.dev","password":"mod1234"}'
# → { "token": "...", "user": { "role_slug": "moderator", "permissions": [...] } }

# Puis, pour les appels protégés :
#   -H "Authorization: Bearer <token>"
```

---

## 2. Phase 1 — RBAC & API

| # | Action | Attendu |
|---|---|---|
| 1.1 | Login **admin**, onglet réseau sur `GET /api/user` | `role_slug: "admin"`, `permissions` = 10 entrées |
| 1.2 | Login **modérateur**, idem | `role_slug: "moderator"`, `permissions` = `deck:create/edit/publish`, `card:create/edit` (5) |
| 1.3 | Login **user simple**, idem | `role_slug: null`, `permissions: []` |
| 1.4 | User simple → page **Decks** | Seuls les **decks publiés** (3) s'affichent, chacun avec sa catégorie |
| 1.5 | Modérateur → espace admin → **Decks** → cliquer *Supprimer* sur un deck | Échec : **403** (toast d'erreur, deck non supprimé) — le modérateur ne peut pas supprimer |
| 1.6 | Admin → **Decks** → *Supprimer* un deck | **204**, le deck disparaît |
| 1.7 | Admin → **Decks** → *Nouveau deck*, remplir titre + catégorie uniquement | **201**, deck créé (pas d'erreur 500) |

**Anti-lockout (critique) :** juste après `make api-migrate`, l'admin doit pouvoir se connecter
et accéder à `/admin`. S'il reçoit 403, le seed RBAC est cassé.

### Variante curl (1.4 / filtre catégorie)
```bash
TOKEN=...   # token d'un user simple
curl -s http://localhost:8001/api/decks -H "Authorization: Bearer $TOKEN"
# → uniquement is_published=true, chaque deck a category_id + category_name

curl -s "http://localhost:8001/api/decks?category_id=1" -H "Authorization: Bearer $TOKEN"
# → uniquement les decks de la catégorie 1
```

---

## 3. Phase 2 — Filtre catégories (`/app/decks`)

| # | Action | Attendu |
|---|---|---|
| 2.1 | User simple → page Decks | Chips de catégories + chip « Toutes » actif (doré) |
| 2.2 | Cliquer une catégorie (ex. *Kant*) | Filtrage **instantané** (sans rechargement), seuls les decks de cette catégorie |
| 2.3 | Saisir un texte de recherche **en plus** d'une catégorie | Les deux filtres se combinent |
| 2.4 | Cliquer « Toutes » | Tous les decks publiés reviennent |

---

## 4. Phase 2 — Session de révision (flip + célébration)

| # | Action | Attendu |
|---|---|---|
| 3.1 | Deck → *Réviser* → choisir une taille → Commencer | Premier écran de carte |
| 3.2 | Carte **classique** : cliquer « Voir la réponse » | La carte se **retourne en 3D** (flip fluide), le verso révèle la réponse |
| 3.3 | Carte **QCM** | Choix qui se colorent (vert = bon / rouge = mauvais) — pas de flip (inchangé) |
| 3.4 | Aller au bout de la session | **Confetti** + écran de résultat avec animation « pop » |
| 3.5 | Écran de résultat | Affiche **XP gagnés**, **précision %**, **cartes révisées**, **🔥 streak** et **niveau atteint** |
| 3.6 | Activer « réduire les animations » au niveau de l'OS, refaire une session | Aucun flip animé ni confetti (dégradation propre) |

---

## 5. Phase 2 — Streak dans le header

| # | Action | Attendu |
|---|---|---|
| 4.1 | Après ≥ 1 session terminée aujourd'hui, regarder le header de `/app` | Pill **🔥 N** à côté du nom |
| 4.2 | Survoler la pill | Tooltip « N jours d'affilée » |
| 4.3 | Compte tout neuf (0 session) | Pas de pill (masquée si streak = 0) |

---

## 6. Phase 2 — Vue modérateur & gating

| # | Action | Attendu |
|---|---|---|
| 5.1 | Login **modérateur** | Arrive dans l'espace admin, sous-titre « **Modération** » |
| 5.2 | Nav latérale (modérateur) | Seulement **Decks** + **Cartes** |
| 5.3 | Login **admin** | Sous-titre « Administration », nav **complète** (Utilisateurs, Stats, Catégories, Decks, Cartes) |
| 5.4 | **User simple** → forcer l'URL `http://localhost:3000/admin` | Redirigé vers `/app/decks` (route gardée) |
| 5.5 | Admin sur `/admin` → **recharger (F5)** | Reste connecté, nav correcte, nom affiché (hydratation user au reload) |

---

## 7. Non-régression

| # | Action | Attendu |
|---|---|---|
| 6.1 | Admin : créer / éditer / publier un deck, ajouter une carte | Fonctionne |
| 6.2 | `/app/stats` | Niveau, streak, précision, cartes affichés |
| 6.3 | Bascule de langue FR / EN | Toutes les strings traduites (chips, XP, niveau, streak, modération) |

---

## Critère de succès

Sections **2 à 6 toutes vertes**, section **7 sans régression**.

## Limitation connue (hors périmètre V1)
Dans les vues admin, le modérateur voit encore les boutons *Supprimer* (qui renvoient 403
côté backend — cf. test 1.5). Le masquage per-action de ces boutons n'est pas fait.
