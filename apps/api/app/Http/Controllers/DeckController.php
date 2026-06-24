<?php

namespace App\Http\Controllers;

use App\Repositories\Deck\DeckRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeckController extends Controller
{
    public function __construct(
        private readonly DeckRepositoryInterface $repository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $categoryId = $request->query('category_id') ? (int) $request->query('category_id') : null;

        $decks = $this->repository->findForUser($request->user()->id, $categoryId);

        return response()->json(['data' => $decks->map->toArray()->values()]);
    }

    public function show(Request $request, int $deck): JsonResponse
    {
        $deckDto = $this->repository->findById($deck, $request->user()->id);

        return response()->json(['data' => $deckDto->toArray()]);
    }
}
