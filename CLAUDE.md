@AGENTS.md

# LumenCards — Règles Claude

## Domaine
Flashcards d'apprentissage philosophique, maçonnique et spirituel. Thèmes : Kant, Kabbale, symbolisme maçonnique, philosophie de l'initiation. Approche Duolingo : progression gamifiée, statistiques, répétition espacée, génération IA.

## Règles strictes
- Tout composant UI vient de `src/design-system/` — zéro style inline ad hoc
- Toute requête HTTP passe par React Query — jamais de `fetch()` nu dans un composant
- Toute string visible passe par `src/i18n/` — zéro texte en dur dans le JSX (fr.json + en.json)
- Tout nouveau comportement conditionnel a un feature flag dans `featureFlags.config.ts`
- Branches : `main` (prod) et `develop` (staging) — toujours ouvrir une PR vers develop

## Architecture features
```
src/features/
  cards/        — types Card, Deck, CardReview
  deck/         — gestion des decks thématiques
  review/       — session de révision, logique spaced repetition
  stats/        — statistiques, niveaux (Apprenti → Grand Maître), XP
  ai-generator/ — génération de cartes depuis une réflexion utilisateur (API Claude)
```

## Gamification (niveaux maçonniques)
Apprenti → Compagnon → Maître → Grand Maître
XP basé sur : cartes révisées × précision × multiplicateur de streak

## Génération IA
Utiliser l'API Claude (claude-sonnet-4-6) pour analyser une réflexion et générer des cartes front/back avec explication. Feature flag : `AI_CARD_GENERATION`.
