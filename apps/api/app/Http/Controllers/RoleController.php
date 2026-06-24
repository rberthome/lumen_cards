<?php

namespace App\Http\Controllers;

use App\Repositories\Role\RoleRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct(private readonly RoleRepositoryInterface $roles) {}

    public function index(): JsonResponse
    {
        return response()->json($this->roles->all()->map->toArray());
    }

    public function permissions(): JsonResponse
    {
        return response()->json($this->roles->allPermissions()->map->toArray());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'slug'        => 'required|string|max:100|unique:roles,slug|regex:/^[a-z0-9_]+$/',
            'description' => 'nullable|string|max:255',
        ]);

        $role = $this->roles->create($data['name'], $data['slug'], $data['description'] ?? null);

        return response()->json($this->roles->toDto($role)->toArray(), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $role = $this->roles->find($id);

        if (! $role) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            'name'        => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        $updated = $this->roles->update($role, $data);

        return response()->json($this->roles->toDto($updated)->toArray());
    }

    public function destroy(int $id): JsonResponse
    {
        $role = $this->roles->find($id);

        if (! $role) {
            return response()->json(['message' => 'Not found'], 404);
        }

        if ($role->is_system) {
            return response()->json(['message' => 'Cannot delete system role'], 422);
        }

        $this->roles->delete($role);

        return response()->json(null, 204);
    }

    public function syncPermissions(Request $request, int $id): JsonResponse
    {
        $role = $this->roles->find($id);

        if (! $role) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            'permission_ids'   => 'required|array',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        $this->roles->syncPermissions($role, $data['permission_ids']);
        $updated = $this->roles->find($id);

        return response()->json($this->roles->toDto($updated)->toArray());
    }
}
