<?php

namespace App\Http\Controllers;

use App\Repositories\Deck\DeckCrudRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeckCrudController extends Controller
{
    public function __construct(private readonly DeckCrudRepositoryInterface $decks) {}

    public function index(Request $request): JsonResponse
    {
        $page       = (int) $request->query('page', 1);
        $search     = $request->query('search');
        $categoryId = $request->query('category_id') ? (int) $request->query('category_id') : null;

        $paginator = $this->decks->paginate($page, $search ?: null, $categoryId);

        return response()->json([
            'data'     => collect($paginator->items())->map(fn ($d) => $this->decks->toDto($d)->toArray()),
            'total'    => $paginator->total(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'nullable|integer|exists:categories,id',
            'cover_emoji' => 'nullable|string|max:10',
        ]);

        $deck = $this->decks->create($data);

        return response()->json($this->decks->toDto($deck->load('category'))->toArray(), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $deck = $this->decks->find($id);

        if (! $deck) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            'title'       => 'sometimes|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'nullable|integer|exists:categories,id',
            'cover_emoji' => 'nullable|string|max:10',
        ]);

        $updated = $this->decks->update($deck, $data);

        return response()->json($this->decks->toDto($updated)->toArray());
    }

    public function destroy(int $id): JsonResponse
    {
        $deck = $this->decks->find($id);

        if (! $deck) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $this->decks->delete($deck);

        return response()->json(null, 204);
    }

    public function publish(Request $request, int $id): JsonResponse
    {
        $deck = $this->decks->find($id);

        if (! $deck) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate(['published' => 'required|boolean']);
        $updated = $this->decks->publish($deck, $data['published']);

        return response()->json($this->decks->toDto($updated)->toArray());
    }
}
