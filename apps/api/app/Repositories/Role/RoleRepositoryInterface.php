<?php

namespace App\Repositories\Role;

use App\Models\Role;
use App\Repositories\Role\DTOs\RoleDto;
use Illuminate\Support\Collection;

interface RoleRepositoryInterface
{
    /** @return Collection<int, RoleDto> */
    public function all(): Collection;

    public function find(int $id): ?Role;

    public function create(string $name, string $slug, ?string $description): Role;

    public function update(Role $role, array $data): Role;

    public function delete(Role $role): void;

    public function syncPermissions(Role $role, array $permissionIds): void;

    /** @return Collection<int, \App\Repositories\Role\DTOs\PermissionDto> */
    public function allPermissions(): Collection;

    public function toDto(Role $role): RoleDto;
}
