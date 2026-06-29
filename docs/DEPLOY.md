# Déploiement — Plan (Next.js sur Proxmox + Postgres distant)

> **Statut : plan** (à exécuter après le dev V1). Certaines décisions restent ouvertes
> (méthode d'accès privé, automatisation). Voir « Décisions » en bas.

## Vue d'ensemble

```
            Proxmox (réseau privé)
┌───────────────────────────────────────────────┐
│  LXC "app"                  VM "postgres"        │
│  Node 22 + systemd          PostgreSQL           │
│  app Next (standalone)  ──► lumencards (5432)    │
│  Tailscale serve (HTTPS)                          │
└───────────────────────────────────────────────┘
        ▲ accès confidentiel (Tailscale / Cloudflare)
   invités (comptes créés par l'admin)
```

- **App** : build Next `output: "standalone"`, lancé par **systemd** dans un **LXC** (pas de Docker — l'app est _stateless_).
- **Base** : **PostgreSQL** sur une **VM séparée** de la même Proxmox, jointe par le réseau privé.
- **Accès** : strictement confidentiel via réseau privé (voir §7), **en plus** de l'auth applicative (comptes créés par l'admin, `mustChangePassword`).

---

## 1. Prérequis Proxmox

- **LXC `app`** : Debian/Ubuntu, Node 22 (via nvm ou nodesource), un user dédié `lumencards`.
- **VM `postgres`** : PostgreSQL 16+ (existante).
- Les deux sur le même réseau privé Proxmox ; noter l'IP de la VM Postgres (ex. `10.0.0.20`).

## 2. À faire côté code AVANT le premier déploiement

Le code utilise SQLite en dev — bascule sur Postgres pour la prod :

1. `prisma/schema.prisma` → `datasource db { provider = "postgresql" }`.
2. Régénérer la migration init pour Postgres (les migrations sont spécifiques au dialecte) :
   ```bash
   rm -rf prisma/migrations
   DATABASE_URL="postgresql://…" npx prisma migrate dev --name init
   ```
   (à committer — c'est le schéma de référence appliqué en prod).
3. `src/config/env.ts` / `.env.example` : `DATABASE_URL` au format Postgres.

> Tant que ce n'est pas fait, le dev local peut rester sur SQLite ; la bascule est triviale
> car il n'y a pas de données de prod.

## 3. La VM Postgres

```sql
-- en tant que superuser postgres
CREATE USER lumencards WITH PASSWORD '••••••••';
CREATE DATABASE lumencards OWNER lumencards;
```

- `postgresql.conf` : `listen_addresses = '*'` (ou l'IP LAN de la VM).
- `pg_hba.conf` : autoriser l'IP du LXC app en `scram-sha-256`, ex. :
  ```
  host  lumencards  lumencards  10.0.0.0/24  scram-sha-256
  ```
- Recharger : `sudo systemctl reload postgresql`. Pare-feu : n'ouvrir 5432 qu'au réseau privé.

## 4. Le LXC app

Layout :

```
/opt/lumencards/
  src/          # le dépôt git (build ici)
  app/          # le build standalone servi par systemd
/etc/lumencards.env   # secrets/config (root:lumencards, chmod 640)
```

**`/etc/lumencards.env`** :

```
NODE_ENV=production
PORT=3000
HOSTNAME=127.0.0.1
DATABASE_URL=postgresql://lumencards:••••••••@10.0.0.20:5432/lumencards?schema=public
SESSION_SECRET=<chaîne aléatoire ≥ 32 caractères>
```

**`/etc/systemd/system/lumencards.service`** :

```ini
[Unit]
Description=LumenCards (Next.js)
After=network.target

[Service]
Type=simple
User=lumencards
WorkingDirectory=/opt/lumencards/app
EnvironmentFile=/etc/lumencards.env
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now lumencards
```

## 5. Build, migration & release (script de déploiement manuel)

**`/opt/lumencards/deploy.sh`** (à lancer en SSH ; le plus simple pour démarrer) :

```bash
#!/usr/bin/env bash
set -euo pipefail
set -a; . /etc/lumencards.env; set +a

cd /opt/lumencards/src
git pull --ff-only
npm ci
npm run build
npx prisma migrate deploy            # applique les migrations sur la VM Postgres

# Publie le build standalone
rsync -a --delete .next/standalone/ /opt/lumencards/app/
rsync -a .next/static/             /opt/lumencards/app/.next/static/
rsync -a public/                   /opt/lumencards/app/public/

sudo systemctl restart lumencards
echo "✓ déployé"
```

- **Ordre** : `migrate deploy` AVANT le restart → le nouveau code rencontre un schéma déjà migré.
- **Migrations destructives** (supprimer une colonne) : en 2 temps (déployer le code qui ne l'utilise plus, _puis_ la migration de suppression) pour éviter toute coupure.

## 6. Premier démarrage — seed admin

`migrate deploy` crée les **tables** mais pas le **compte admin**. Une fois, après le 1er déploiement :

```bash
cd /opt/lumencards/src
set -a; . /etc/lumencards.env; set +a
npm run db:seed        # crée l'admin + les catégories de base
```

(le seed `prisma/seed.ts` est dans le dépôt ; `tsx` est dispo car `npm ci` installe les devDeps).
Puis connexion `admin@lumencards.local` / `changeme` → changement de mot de passe forcé.

> Évolution possible : un bootstrap « si aucun user, créer l'admin depuis des variables d'env »
> au démarrage, pour ne plus dépendre du seed manuel.

## 7. Accès confidentiel (décision ouverte)

**Option A — Tailscale (recommandé)** : aucun port public, l'app n'existe que sur le tailnet.

```bash
tailscale up
tailscale serve --bg 3000     # expose en HTTPS sur le nom *.ts.net, accès tailnet only
```

Les invités installent Tailscale et sont ajoutés au tailnet. HTTPS auto, pas de reverse proxy.

**Option B — Cloudflare Tunnel + Access** : si les invités ne peuvent pas installer de client VPN.
URL publique gatée par Cloudflare Access (lien magique e-mail / SSO), tunnel sortant (aucun port entrant).

> Dans les deux cas, c'est une protection **réseau** qui s'ajoute à l'auth de l'app.

## 8. Automatisation (plus tard, optionnel)

Au début, `deploy.sh` lancé à la main suffit. Pour du « push-to-deploy » ensuite :

- **Runner GitHub Actions self-hosted** dans le LXC (modèle _pull_, aucun port entrant à ouvrir).
- Workflow `deploy.yml` sur `push: main` → `npm ci → build → prisma migrate deploy → release → restart`.
- Secrets : portés par l'environnement du runner / `/etc/lumencards.env` → **rien chez GitHub**.
- `sudoers` : autoriser le user du runner à lancer _uniquement_ le restart.

## 9. Sauvegardes

Postgres = outillage mature. Cron quotidien sur la VM :

```bash
pg_dump -U lumencards lumencards | gzip > /backups/lumencards-$(date +%F).sql.gz
```

Conserver N jours sur un autre disque/partage. (Restauration testée au moins une fois.)

---

## Décisions

| Sujet              | Décision                                                            |
| ------------------ | ------------------------------------------------------------------- |
| Base de données    | **PostgreSQL distant** (VM Proxmox) — pas SQLite en prod            |
| Runtime            | **Node + systemd** dans un LXC — **pas de Docker** (app stateless)  |
| Build              | Next `output: "standalone"`                                         |
| Migrations         | `prisma migrate deploy` au déploiement                              |
| Accès confidentiel | **Ouvert** : Tailscale (reco) vs Cloudflare Tunnel+Access           |
| Automatisation     | **Ouvert** : `deploy.sh` manuel d'abord, runner self-hosted ensuite |

> Ces choix font évoluer l'ADR initial (SQLite + Docker). À acter dans `PROJECT.md` / `docs/adr`
> au moment de la mise en place.
