<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HasPermission
{
    public function handle(Request $request, Closure $next, string $entity, string $action): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user->loadMissing('role.permissions');

        if (! $user->hasPermission($entity, $action)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
