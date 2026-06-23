<?php

namespace App\Http\Controllers;

use App\Repositories\Stat\StatRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatController extends Controller
{
    public function __construct(
        private readonly StatRepositoryInterface $repository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $stats = $this->repository->findForUser($request->user()->id);

        return response()->json(['data' => $stats->toArray()]);
    }
}
