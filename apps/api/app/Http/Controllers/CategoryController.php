<?php

namespace App\Http\Controllers;

use App\Repositories\Category\CategoryRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private readonly CategoryRepositoryInterface $categories) {}

    public function index(): JsonResponse
    {
        return response()->json($this->categories->all()->map->toArray());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'slug'        => 'nullable|string|max:100|unique:categories,slug',
            'description' => 'nullable|string',
            'cover_emoji' => 'nullable|string|max:10',
            'sort_order'  => 'nullable|integer|min:0',
        ]);

        $category = $this->categories->create($data);

        return response()->json($this->categories->toDto($category)->toArray(), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = $this->categories->find($id);

        if (! $category) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            'name'        => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'cover_emoji' => 'nullable|string|max:10',
            'sort_order'  => 'nullable|integer|min:0',
        ]);

        $updated = $this->categories->update($category, $data);

        return response()->json($this->categories->toDto($updated)->toArray());
    }

    public function destroy(int $id): JsonResponse
    {
        $category = $this->categories->find($id);

        if (! $category) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $this->categories->delete($category);

        return response()->json(null, 204);
    }
}
