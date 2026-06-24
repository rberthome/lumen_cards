<?php

namespace App\Repositories\Role;

use App\Models\Permission;
use App\Models\Role;
use App\Repositories\Role\DTOs\PermissionDto;
use App\Repositories\Role\DTOs\RoleDto;
use Illuminate\Support\Collection;

class RoleRepository implements RoleRepositoryInterface
{
    public function all(): Collection
    {
        return Role::with('permissions')->get()->map($this->toDto(...));
    }

    public function find(int $id): ?Role
    {
        return Role::with('permissions')->find($id);
    }

    public function create(string $name, string $slug, ?string $description): Role
    {
        return Role::create([
            'name'        => $name,
            'slug'        => $slug,
            'description' => $description,
            'is_system'   => false,
        ]);
    }

    public function update(Role $role, array $data): Role
    {
        $role->update($data);

        return $role->fresh('permissions');
    }

    public function delete(Role $role): void
    {
        $role->delete();
    }

    public function syncPermissions(Role $role, array $permissionIds): void
    {
        $role->permissions()->sync($permissionIds);
    }

    public function allPermissions(): Collection
    {
        return Permission::all()->map(fn (Permission $p) => new PermissionDto(
            id:          $p->id,
            entity:      $p->entity,
            action:      $p->action,
            description: $p->description,
        ));
    }

    public function toDto(Role $role): RoleDto
    {
        $permissions = $role->relationLoaded('permissions')
            ? $role->permissions->map(fn (Permission $p) => "{$p->entity}:{$p->action}")->toArray()
            : [];

        return new RoleDto(
            id:          $role->id,
            name:        $role->name,
            slug:        $role->slug,
            description: $role->description,
            is_system:   $role->is_system,
            permissions: $permissions,
        );
    }
}
