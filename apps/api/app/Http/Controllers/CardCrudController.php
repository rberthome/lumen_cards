<?php

namespace App\Http\Controllers;

use App\Repositories\Card\CardCrudRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CardCrudController extends Controller
{
    public function __construct(private readonly CardCrudRepositoryInterface $cards) {}

    public function index(Request $request): JsonResponse
    {
        $page   = (int) $request->query('page', 1);
        $deckId = $request->query('deck_id') ? (int) $request->query('deck_id') : null;
        $search = $request->query('search');

        $paginator = $this->cards->paginate($page, $deckId, $search ?: null);

        return response()->json([
            'data'     => collect($paginator->items())->map(fn ($c) => $this->cards->toDto($c)->toArray()),
            'total'    => $paginator->total(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'deck_id'          => 'required|integer|exists:decks,id',
            'front'            => 'required|string',
            'back'             => 'required|string',
            'wrong_answer_1'   => 'nullable|string',
            'wrong_answer_2'   => 'nullable|string',
            'wrong_answer_3'   => 'nullable|string',
            'explanation'      => 'nullable|string',
            'source'           => 'nullable|string|max:255',
            'tags'             => 'nullable|array',
            'tags.*'           => 'string|max:50',
            'difficulty'       => 'nullable|in:easy,medium,hard',
            'progression_config' => 'nullable|array',
            'progression_config.threshold_4_choices' => 'nullable|integer|min:1',
            'progression_config.threshold_open'      => 'nullable|integer|min:1',
            'progression_config.xp_correct'          => 'nullable|integer|min:1',
            'progression_config.xp_incorrect'        => 'nullable|integer|min:0',
            'progression_config.difficulty_weight'   => 'nullable|numeric|min:0.1|max:5',
        ]);

        $card = $this->cards->create($data);

        return response()->json($this->cards->toDto($card)->toArray(), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $card = $this->cards->find($id);

        if (! $card) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            'deck_id'          => 'sometimes|integer|exists:decks,id',
            'front'            => 'sometimes|string',
            'back'             => 'sometimes|string',
            'wrong_answer_1'   => 'nullable|string',
            'wrong_answer_2'   => 'nullable|string',
            'wrong_answer_3'   => 'nullable|string',
            'explanation'      => 'nullable|string',
            'source'           => 'nullable|string|max:255',
            'tags'             => 'nullable|array',
            'difficulty'       => 'nullable|in:easy,medium,hard',
            'progression_config' => 'nullable|array',
            'progression_config.threshold_4_choices' => 'nullable|integer|min:1',
            'progression_config.threshold_open'      => 'nullable|integer|min:1',
            'progression_config.xp_correct'          => 'nullable|integer|min:1',
            'progression_config.xp_incorrect'        => 'nullable|integer|min:0',
            'progression_config.difficulty_weight'   => 'nullable|numeric|min:0.1|max:5',
        ]);

        $updated = $this->cards->update($card, $data);

        return response()->json($this->cards->toDto($updated)->toArray());
    }

    public function destroy(int $id): JsonResponse
    {
        $card = $this->cards->find($id);

        if (! $card) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $this->cards->delete($card);

        return response()->json(null, 204);
    }
}
