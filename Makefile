.PHONY: help install up down logs api-cli api-migrate types-generate mobile web lint typecheck

help:
	@echo ""
	@echo "  LumenCards — Monorepo (Expo + Vue.js + Laravel)"
	@echo ""
	@echo "  ── Docker (environnement complet) ──────────────────"
	@echo "  make up               Démarre tous les services (api + web + db + redis)"
	@echo "  make down             Arrête tous les services"
	@echo "  make logs             Logs en temps réel"
	@echo "  make api-cli          Shell dans le conteneur API"
	@echo "  make api-migrate      Reset + reseed la BDD"
	@echo ""
	@echo "  ── Développement individuel ─────────────────────────"
	@echo "  make mobile           Expo dev server (iOS/Android)"
	@echo "  make web              Vue.js dev server (port 3000)"
	@echo "  make api              Laravel uniquement (Docker)"
	@echo ""
	@echo "  ── Qualité ──────────────────────────────────────────"
	@echo "  make types-generate   Génère packages/types/generated.ts depuis PHP DTOs"
	@echo "  make lint             Lint mobile + web"
	@echo "  make typecheck        Typecheck mobile + web"
	@echo ""

# ── Environnement complet ───────────────────────────────────────
up:
	cp -n .env.example .env 2>/dev/null || true
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

# ── API Laravel ─────────────────────────────────────────────────
api:
	docker compose up -d api db redis

api-cli:
	docker compose exec api bash

api-migrate:
	docker compose exec api php artisan migrate:fresh --seed

# ── Web Vue.js ──────────────────────────────────────────────────
web:
	docker compose up -d web

web-local:
	cd apps/web && npm run dev

# ── Mobile Expo ─────────────────────────────────────────────────
mobile:
	cd apps/mobile && npm run start

# ── Types partagés ──────────────────────────────────────────────
types-generate:
	docker compose exec api php artisan typescript:transform
	@mkdir -p packages/types
	docker compose cp api:/app/resources/ts/generated.d.ts packages/types/generated.ts
	@echo "✓ packages/types/generated.ts mis à jour"

# ── Qualité ─────────────────────────────────────────────────────
lint:
	cd apps/mobile && npm run lint
	cd apps/web && npm run lint

typecheck:
	cd apps/mobile && npm run typecheck
	cd apps/web && npm run typecheck

# ── Install ──────────────────────────────────────────────────────
install:
	cp -n .env.example .env 2>/dev/null || true
	cd apps/mobile && npm install --legacy-peer-deps
	cd apps/web && npm install
	docker compose up -d db redis
	docker compose run --rm api composer install
	docker compose run --rm api php artisan key:generate
	docker compose run --rm api php artisan migrate --seed
	@echo ""
	@echo "✓ LumenCards prêt. Lance 'make up' pour démarrer."
