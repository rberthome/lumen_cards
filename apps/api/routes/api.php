<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\ReviewController;
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

    Route::middleware(AdminMiddleware::class)->prefix('admin')->group(function () {
        Route::get('users', [AdminController::class, 'users']);
        Route::delete('users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('users/{id}/export', [AdminController::class, 'exportUser']);
        Route::get('stats', [AdminController::class, 'stats']);
    });
});
