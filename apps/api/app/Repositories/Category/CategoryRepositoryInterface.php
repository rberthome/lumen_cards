<?php

namespace App\Repositories\Category;

use App\Models\Category;
use App\Repositories\Category\DTOs\CategoryDto;
use Illuminate\Support\Collection;

interface CategoryRepositoryInterface
{
    /** @return Collection<int, CategoryDto> */
    public function all(): Collection;

    public function find(int $id): ?Category;

    public function create(array $data): Category;

    public function update(Category $category, array $data): Category;

    public function delete(Category $category): void;

    public function toDto(Category $category): CategoryDto;
}
