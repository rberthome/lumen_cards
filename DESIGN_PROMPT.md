# Prompt — Claude design (LumenCards)

> Copie-colle le bloc ci-dessous dans une session Claude dédiée au design.
> Il est autonome : il contient tout le contexte nécessaire.

---

Tu es un designer produit senior. Je veux concevoir l'interface de **LumenCards**, une app web
privée de **révision par répétition espacée** (flashcards) pour un contenu philosophique,
maçonnique et spirituel (Kant, Kabbale, symbolisme maçonnique, philosophie de l'initiation).
Public : cercle restreint sur invitation, < 50 personnes. Esprit Duolingo (gamifié, progression)
mais **sobre et initiatique**, pas criard.

## Direction artistique
- **3 mots** : sobre · initiatique · lumineux.
- Fond clair, beaucoup d'espace blanc, l'**or** comme accent **rare** (lumière, savoir, récompense).
- **Serif** (Georgia) pour la marque, les titres et le contenu des cartes → gravité.
- **Sans** (system-ui) pour l'UI (labels, boutons).
- Thème **clair uniquement**. Mobile-first, responsive. Icônes = **emojis** (📚 🃏 🗂️ 🔥 🎓 ⚙️).

## Palette (hex, un rôle par couleur)
- **Or (accent/marque/XP)** : `gold-50 #FFFBEB`, `gold-400 #FBBF24`, `gold-500 #F59E0B`,
  `gold-600 #D97706`, `gold-700 #B45309`.
- **Indigo (savoir/explications/info)** : `indigo-50 #EEF2FF`, `indigo-600 #4F46E5`, `indigo-900 #312E81`.
- **Neutres (~90 % de l'écran)** : `neutral-0 #FFFFFF`, `neutral-50 #F8FAFC` (fond app),
  `neutral-200 #E2E8F0` (bordures), `neutral-500 #64748B` (texte 2ndaire), `neutral-700 #334155`
  (texte), `neutral-900 #0F172A` (titres).
- **Sémantiques** : succès `#22C55E` (bonne réponse), erreur `#EF4444` (mauvaise réponse),
  info `#3B82F6`.

## Écrans à concevoir (priorité haut → bas)
1. **Session de révision** (l'écran central) — deux modes :
   - **QCM** : la question (front) en grand, 4 réponses en boutons empilés, feedback couleur
     (verte = correcte, rouge = choisie & fausse), un **badge de mode** (« Choix multiple »).
   - **Réponse libre** : carte qui se **retourne** (front → back) ; après retournement, deux
     boutons « Je savais ✓ » / « Je ne savais pas ✗ » ; badge « Réponse libre ».
   - En haut : **barre de progression** + compteur ✓ / ✗.
2. **Accueil / liste des decks** — carte par deck avec emoji, titre, « X cartes dues » ;
   en tête, un CTA proéminent **« Réviser ce qui est dû aujourd'hui »** ; streak 🔥 visible.
3. **Résultat de session** — XP gagné, streak, récap bon/mauvais, confettis.
4. **Détail d'un deck** — liste des cartes + bouton réviser.
5. **Mes stats** — streak, cartes connues, cartes dues (minimal, élégant).
6. **Connexion** — sobre, invitation only (pas de landing publique).
7. **Admin** — CRUD decks / cartes / catégories + gestion users (créer, réinitialiser mdp).

## Contraintes techniques (à respecter dans les maquettes)
- Cible d'implémentation : **Next.js + React + Tailwind CSS**.
- Composants issus d'un **design-system** (Button, Input, Card, Modal, Toast, Badge, Loader…).
- Animations : flip de carte + confettis uniquement.

## Ce que j'attends de toi (livrables)
1. Une **proposition de système visuel** : échelle typographique, espacements, rayons, ombres,
   états des composants (repos / hover / actif / désactivé / erreur), à partir de la palette ci-dessus.
2. Les **maquettes** (mobile d'abord, puis desktop) des écrans 1 à 3 en priorité, sous forme de
   **code React + Tailwind** prêt à coller (ou HTML/CSS si tu préfères), une variante par écran.
3. Pour l'écran de révision, montre **les deux modes** (QCM et réponse libre) et les **états**
   (avant réponse, bonne réponse, mauvaise réponse).
4. Des **micro-décisions justifiées** : pourquoi tel contraste, telle hiérarchie, tel placement
   du CTA — en gardant « sobre/initiatique/lumineux » comme boussole.

Commence par me proposer le système visuel (point 1), puis on itère écran par écran.
Pose-moi des questions si un choix est ambigu plutôt que d'inventer.
