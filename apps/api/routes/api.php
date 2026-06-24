<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CardCrudController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\DeckCrudController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StatController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'me']);

    Route::get('decks', [DeckController::class, 'index']);
    Route::get('decks/{deck}', [DeckController::class, 'show']);

    Route::get('decks/{deck}/session', [ReviewController::class, 'session']);
    Route::post('review/submit', [ReviewController::class, 'submit']);

    Route::get('stats', [StatController::class, 'index']);

    Route::get('categories', [CategoryController::class, 'index']);

    Route::middleware(AdminMiddleware::class)->prefix('admin')->group(function () {
        Route::get('users', [AdminController::class, 'users']);
        Route::delete('users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('users/{id}/export', [AdminController::class, 'exportUser']);
        Route::get('stats', [AdminController::class, 'stats']);

        Route::apiResource('categories', CategoryController::class)->except(['index']);
        Route::apiResource('decks', DeckCrudController::class);
        Route::patch('decks/{id}/publish', [DeckCrudController::class, 'publish']);
        Route::apiResource('cards', CardCrudController::class);

        Route::get('roles', [RoleController::class, 'index']);
        Route::get('roles/{id}', [RoleController::class, 'show']);
        Route::post('roles', [RoleController::class, 'store']);
        Route::put('roles/{id}', [RoleController::class, 'update']);
        Route::delete('roles/{id}', [RoleController::class, 'destroy']);
        Route::post('roles/{id}/assign', [RoleController::class, 'assignToUser']);
    });
});
