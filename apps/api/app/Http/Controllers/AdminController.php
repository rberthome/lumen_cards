<?php

namespace App\Http\Controllers;

use App\Enums\UserLevel;
use App\Models\Role;
use App\Models\User;
use App\Repositories\Admin\AdminRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct(private readonly AdminRepositoryInterface $admin) {}

    public function users(Request $request): JsonResponse
    {
        $page   = (int) $request->query('page', 1);
        $search = $request->query('search');

        $paginator = $this->admin->paginateUsers($page, $search ?: null);

        $data = $paginator->map(function ($user) {
            $stat  = $user->stat;
            $xp    = $stat?->xp ?? 0;
            $level = UserLevel::fromXp($xp);

            return [
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'role_slug'   => $user->role?->slug,
                'role_name'   => $user->role?->name,
                'level'       => $level->value,
                'xp'          => $xp,
                'streak_days' => $stat?->streak_days ?? 0,
                'created_at'  => $user->created_at->toISOString(),
            ];
        });

        return response()->json([
            'data'     => $data,
            'total'    => $paginator->total(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    public function updateUserRole(Request $request, int $id): JsonResponse
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            'role_id' => 'nullable|integer|exists:roles,id',
        ]);

        $user->update(['role_id' => $data['role_id']]);

        return response()->json(['role_id' => $user->role_id]);
    }

    public function deleteUser(int $id): JsonResponse
    {
        $this->admin->anonymizeUser($id);

        return response()->json(null, 204);
    }

    public function exportUser(int $id): JsonResponse
    {
        $data = $this->admin->exportUser($id);

        return response()->json($data);
    }

    public function stats(): JsonResponse
    {
        return response()->json($this->admin->getStats()->toArray());
    }
}
