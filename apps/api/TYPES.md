# Génération des types TypeScript

Les types TypeScript sont générés automatiquement depuis les DTOs PHP annotés `#[TypeScript]`.

## Générer les types

```bash
# Depuis apps/api/
make types-generate

# Ou directement
docker compose exec app php artisan typescript:transform
```

Les types sont copiés dans `packages/types/generated.ts` et peuvent être importés
dans `apps/mobile` via `@lumen_cards/types`.

## DTOs annotés

Tous les DTOs dans `app/Repositories/*/DTOs/` annotés `#[TypeScript]` sont transformés :

| DTO | Type généré |
|---|---|
| `DeckDto` | `DeckDto` |
| `CardDto` | `CardDto` |
| `CardWithProgressDto` | `CardWithProgressDto` |
| `ReviewSessionDto` | `ReviewSessionDto` |
| `SubmitReviewItemDto` | `SubmitReviewItemDto` |
| `ReviewResultDto` | `ReviewResultDto` |
| `UserStatDto` | `UserStatDto` |

## Règle

**Ne jamais dupliquer les types manuellement dans le frontend.**
Après toute modification d'un DTO PHP, relancer `make types-generate`.
