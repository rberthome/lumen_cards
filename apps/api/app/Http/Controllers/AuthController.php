<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\Auth\DTOs\MeDto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user  = User::create($data);
        $token = $user->createToken('app')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $this->buildMe($user)], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->with('role.permissions')->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => ['Identifiants invalides.']]);
        }

        $token = $user->createToken('app')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $this->buildMe($user)]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(null, 204);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('role.permissions');

        return response()->json(['data' => $this->buildMe($user)]);
    }

    private function buildMe(User $user): array
    {
        return (new MeDto(
            id:        $user->id,
            name:      $user->name,
            email:     $user->email,
            role_slug: $user->role?->slug,
            role_name: $user->role?->name,
            permissions: $user->getPermissions(),
        ))->toArray();
    }
}
