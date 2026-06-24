.PHONY: up stop migrate install test style db cli types-generate

up: .env
	docker compose up --build -d

stop:
	docker compose stop

.env:
	cp .env.example .env

vendor: composer.lock composer.json
	docker compose exec app composer install

migrate:
	docker compose exec app php artisan migrate:refresh --seed

install: up vendor migrate
	docker compose exec app php artisan key:generate

test:
	docker compose exec app php artisan test

style:
	docker compose exec app ./vendor/bin/pint

db:
	docker compose exec app php artisan db

cli:
	docker compose exec app sh

types-generate:
	docker compose exec app php artisan typescript:transform
	cp resources/types/generated.d.ts ../../packages/types/generated.ts
	@echo "✅ Types générés dans packages/types/generated.ts"
