<?php

namespace App\Repositories\Category;

use App\Models\Category;
use App\Repositories\Category\DTOs\CategoryDto;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function all(): Collection
    {
        return Category::withCount('decks')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map($this->toDto(...));
    }

    public function find(int $id): ?Category
    {
        return Category::withCount('decks')->find($id);
    }

    public function create(array $data): Category
    {
        $data['slug'] ??= Str::slug($data['name']);

        return Category::create($data);
    }

    public function update(Category $category, array $data): Category
    {
        $category->update($data);

        return $category->fresh();
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }

    public function toDto(Category $category): CategoryDto
    {
        return new CategoryDto(
            id:          $category->id,
            name:        $category->name,
            slug:        $category->slug,
            description: $category->description,
            cover_emoji: $category->cover_emoji,
            sort_order:  $category->sort_order,
            deck_count:  $category->decks_count ?? $category->decks()->count(),
        );
    }
}
