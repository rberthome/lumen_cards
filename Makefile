.PHONY: help install mobile api api-cli api-migrate types-generate lint typecheck

help:
	@echo "LumenCards — Monorepo"
	@echo ""
	@echo "  make install          Install all dependencies"
	@echo "  make mobile           Start Expo dev server"
	@echo "  make api              Start Laravel API (Docker)"
	@echo "  make api-cli          Shell dans le conteneur API"
	@echo "  make api-migrate      Reset + reseed la BDD API"
	@echo "  make types-generate   Génère les types TS depuis les DTOs PHP"
	@echo "  make lint             Lint le code mobile"
	@echo "  make typecheck        Typecheck le code mobile"

install:
	npm install --prefix apps/mobile --legacy-peer-deps
	cd apps/api && docker compose up -d && docker compose exec app composer install && docker compose exec app php artisan key:generate && docker compose exec app php artisan migrate --seed

mobile:
	npm run start --prefix apps/mobile

api:
	cd apps/api && docker compose up

api-cli:
	cd apps/api && docker compose exec app bash

api-migrate:
	cd apps/api && docker compose exec app php artisan migrate:fresh --seed

types-generate:
	cd apps/api && docker compose exec app php artisan typescript:transform
	cp apps/api/resources/ts/generated.d.ts packages/types/generated.ts
	@echo "Types générés dans packages/types/generated.ts"

lint:
	npm run lint --prefix apps/mobile

typecheck:
	npm run typecheck --prefix apps/mobile
