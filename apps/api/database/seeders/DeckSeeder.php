<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\Category;
use App\Models\Deck;
use Illuminate\Database\Seeder;

class DeckSeeder extends Seeder
{
    public function run(): void
    {
        // Catégories (FK)
        $kantCat = Category::firstOrCreate(
            ['slug' => 'kant'],
            ['name' => 'Kant', 'cover_emoji' => '⚖️', 'sort_order' => 1]
        );
        $kabbalahCat = Category::firstOrCreate(
            ['slug' => 'kabbalah'],
            ['name' => 'Kabbale', 'cover_emoji' => '✡️', 'sort_order' => 2]
        );
        $masonicCat = Category::firstOrCreate(
            ['slug' => 'masonic'],
            ['name' => 'Maçonnique', 'cover_emoji' => '🔺', 'sort_order' => 3]
        );

        // Deck Kant
        $kant = Deck::create([
            'user_id'      => null,
            'category_id'  => $kantCat->id,
            'title'        => 'Kant — Philosophie Critique',
            'description'  => 'Les concepts fondamentaux de la philosophie critique de Kant.',
            'cover_emoji'  => '⚖️',
            'is_published' => true,
        ]);

        $this->kantCards($kant->id);

        // Deck Kabbale
        $kabbalah = Deck::create([
            'user_id'      => null,
            'category_id'  => $kabbalahCat->id,
            'title'        => 'Kabbale — Mystique Juive',
            'description'  => 'Les enseignements de la tradition kabbalistique.',
            'cover_emoji'  => '✡️',
            'is_published' => true,
        ]);

        $this->kabbalahCards($kabbalah->id);

        // Deck Maçonnique
        $masonic = Deck::create([
            'user_id'      => null,
            'category_id'  => $masonicCat->id,
            'title'        => 'Symbolisme Maçonnique',
            'description'  => 'Les symboles et enseignements de la Franc-Maçonnerie.',
            'cover_emoji'  => '🔺',
            'is_published' => true,
        ]);

        $this->masonicCards($masonic->id);
    }

    private function kantCards(int $deckId): void
    {
        $cards = [
            [
                'front'       => "Qu'est-ce que l'impératif catégorique selon Kant ?",
                'back'        => "Agis seulement selon la maxime grâce à laquelle tu peux vouloir en même temps qu'elle devienne une loi universelle.",
                'explanation' => "L'impératif catégorique est le principe moral suprême de Kant. Il doit être distingué des impératifs hypothétiques (conditionnels). Il commande sans condition et exprime le devoir moral pur.",
                'source'      => 'Fondements de la métaphysique des mœurs (1785)',
                'tags'        => ['éthique', 'morale', 'devoir'],
                'difficulty'  => 'medium',
            ],
            [
                'front'       => "Qu'est-ce que la 'chose en soi' (Ding an sich) chez Kant ?",
                'back'        => "La réalité telle qu'elle est indépendamment de toute perception ou représentation humaine. Elle est inconnaissable par la raison.",
                'explanation' => "Kant distingue le phénomène (ce qui apparaît à notre expérience) du noumène ou chose en soi. Nous ne pouvons connaître que les phénomènes, jamais la réalité ultime.",
                'source'      => 'Critique de la raison pure (1781)',
                'tags'        => ['métaphysique', 'épistémologie', 'phénomène'],
                'difficulty'  => 'hard',
            ],
            [
                'front'       => "Quelles sont les deux sources de la connaissance selon Kant ?",
                'back'        => "La sensibilité (intuitions — espace et temps) et l'entendement (concepts — catégories comme causalité, substance).",
                'explanation' => "Kant synthétise l'empirisme (Hume) et le rationalisme (Leibniz) : la connaissance naît de l'union des intuitions sensibles et des concepts de l'entendement. 'Sans intuitions, les concepts sont vides ; sans concepts, les intuitions sont aveugles.'",
                'source'      => 'Critique de la raison pure (1781)',
                'tags'        => ['épistémologie', 'connaissance', 'synthèse'],
                'difficulty'  => 'medium',
            ],
            [
                'front'       => "Qu'est-ce que les antinomies de la raison pure ?",
                'back'        => "Contradictions dans lesquelles tombe la raison lorsqu'elle tente de connaître le monde dans sa totalité (infini/fini, liberté/déterminisme, Dieu/contingence).",
                'explanation' => "Les antinomies prouvent que la raison dépasse ses limites légitimes lorsqu'elle s'applique au monde dans son ensemble. C'est l'une des principales limites de la raison théorique.",
                'source'      => 'Critique de la raison pure (1781)',
                'tags'        => ['raison', 'dialectique', 'limites'],
                'difficulty'  => 'hard',
            ],
        ];

        foreach ($cards as $card) {
            Card::create(['deck_id' => $deckId, ...$card]);
        }
    }

    private function kabbalahCards(int $deckId): void
    {
        $cards = [
            [
                'front'       => "Qu'est-ce que l'Ein Sof dans la Kabbale ?",
                'back'        => "L'infini absolu, Dieu dans son essence inconnaissable et sans limite, avant toute émanation ou manifestation.",
                'explanation' => "Ein Sof signifie littéralement 'sans fin'. C'est l'aspect de Dieu qui transcende toute compréhension humaine, au-delà de tout attribut ou qualité. Seules les Sefirot permettent d'approcher le divin.",
                'source'      => 'Zohar, Kabbale de Guérona',
                'tags'        => ['infini', 'divin', 'émanation'],
                'difficulty'  => 'medium',
            ],
            [
                'front'       => "Qu'est-ce que les Sefirot ?",
                'back'        => "Les dix attributs ou émanations divines à travers lesquels l'Ein Sof se révèle et crée le monde. Elles forment l'Arbre de Vie.",
                'explanation' => "Les 10 Sefirot sont : Keter (Couronne), Chokhmah (Sagesse), Binah (Compréhension), Chesed (Amour), Gevurah (Force), Tiferet (Beauté), Netzach (Victoire), Hod (Splendeur), Yesod (Fondation), Malkhout (Royauté).",
                'source'      => 'Sefer ha-Bahir, Zohar',
                'tags'        => ['arbre de vie', 'émanations', 'structure divine'],
                'difficulty'  => 'medium',
            ],
            [
                'front'       => "Qu'est-ce que le Tsimtsoum ?",
                'back'        => "Le retrait ou contraction de l'Ein Sof pour créer un espace vide (Halal) dans lequel le monde peut exister.",
                'explanation' => "Concept introduit par Isaac Louria (XVIe s). Sans ce retrait divin, tout ce qui existe serait annihilé par la présence infinie de Dieu. Le Tsimtsoum est l'acte primordial de création par le vide.",
                'source'      => 'Kabbale lourianique, Isaac Louria',
                'tags'        => ['création', 'cosmologie', 'Louria'],
                'difficulty'  => 'hard',
            ],
            [
                'front'       => "Qu'est-ce que le Tikkoun Olam ?",
                'back'        => "La 'réparation du monde', mission spirituelle consistant à restaurer les étincelles divines dispersées lors de la Shevirat ha-Kelim (brisure des vases).",
                'explanation' => "Après la brisure des vases primordiaux, des étincelles divines (Nitzotzot) sont tombées dans la matière. Chaque acte juste, chaque étude de la Torah et chaque prière contribue à rassembler ces étincelles et à réparer le monde.",
                'source'      => 'Kabbale lourianique',
                'tags'        => ['réparation', 'éthique', 'cosmologie'],
                'difficulty'  => 'medium',
            ],
        ];

        foreach ($cards as $card) {
            Card::create(['deck_id' => $deckId, ...$card]);
        }
    }

    private function masonicCards(int $deckId): void
    {
        $cards = [
            [
                'front'       => "Que symbolisent les deux colonnes J et B du temple de Salomon ?",
                'back'        => "Jakin (Il établira) et Boaz (En lui est la force). Elles représentent la dualité : force et stabilité, actif et passif, masculin et féminin.",
                'explanation' => "Situées à l'entrée du Temple de Salomon (1 Rois 7:21), ces colonnes symbolisent les piliers de l'univers moral. En loge, elles encadrent l'entrée et rappellent au maçon qu'il entre dans un espace sacré.",
                'source'      => 'Bible, 1 Rois 7 ; symbolisme maçonnique',
                'tags'        => ['temple', 'dualité', 'symboles'],
                'difficulty'  => 'easy',
            ],
            [
                'front'       => "Que signifie le G.A.D.U. ?",
                'back'        => "Grand Architecte De l'Univers. Principe créateur universel et référence spirituelle non dogmatique de la Franc-Maçonnerie.",
                'explanation' => "Le G.A.D.U. n'est pas le Dieu d'une religion particulière — il est le symbole d'un principe ordonnateur supérieur. Cette formulation permet à des membres de toutes traditions de travailler ensemble.",
                'source'      => 'Rituels maçonniques',
                'tags'        => ['spiritualité', 'universalisme', 'principe'],
                'difficulty'  => 'easy',
            ],
            [
                'front'       => "Que symbolisent l'équerre et le compas maçonniques ?",
                'back'        => "L'équerre symbolise la rectitude morale et l'action juste. Le compas symbolise la limitation de ses désirs et la maîtrise de soi.",
                'explanation' => "Ensemble, ils forment le signe distinctif de la Franc-Maçonnerie. L'équerre est l'outil du travail matériel (tailleur de pierre), le compas est celui de la mesure spirituelle. Ils rappellent au maçon d'allier action et réflexion.",
                'source'      => 'Symbolisme des outils maçonniques',
                'tags'        => ['outils', 'symboles', 'morale'],
                'difficulty'  => 'easy',
            ],
            [
                'front'       => "Quels sont les trois grades symboliques de la Franc-Maçonnerie ?",
                'back'        => "Apprenti, Compagnon, Maître. Chacun correspond à une étape de l'initiation et du développement spirituel.",
                'explanation' => "L'Apprenti apprend à travailler sur lui-même (taille de la pierre brute). Le Compagnon voyage et acquiert le savoir. Le Maître reçoit le mot secret et comprend le mystère de la mort et de la renaissance symbolique (mort d'Hiram).",
                'source'      => 'Rituels du Rite Écossais Ancien et Accepté',
                'tags'        => ['grades', 'initiation', 'progression'],
                'difficulty'  => 'easy',
            ],
        ];

        foreach ($cards as $card) {
            Card::create(['deck_id' => $deckId, ...$card]);
        }
    }
}
