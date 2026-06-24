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
use App\Http\Middleware\HasPermission;
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

    Route::prefix('admin')->group(function () {
        // Decks — éditorial (modérateur + admin). Suppression réservée à l'admin.
        Route::get('decks', [DeckCrudController::class, 'index'])->middleware(HasPermission::class.':deck,edit');
        Route::post('decks', [DeckCrudController::class, 'store'])->middleware(HasPermission::class.':deck,create');
        Route::put('decks/{id}', [DeckCrudController::class, 'update'])->middleware(HasPermission::class.':deck,edit');
        Route::patch('decks/{id}/publish', [DeckCrudController::class, 'publish'])->middleware(HasPermission::class.':deck,publish');
        Route::delete('decks/{id}', [DeckCrudController::class, 'destroy'])->middleware(HasPermission::class.':deck,delete');

        // Cards — éditorial (modérateur + admin). Suppression réservée à l'admin.
        Route::get('cards', [CardCrudController::class, 'index'])->middleware(HasPermission::class.':card,edit');
        Route::post('cards', [CardCrudController::class, 'store'])->middleware(HasPermission::class.':card,create');
        Route::put('cards/{id}', [CardCrudController::class, 'update'])->middleware(HasPermission::class.':card,edit');
        Route::delete('cards/{id}', [CardCrudController::class, 'destroy'])->middleware(HasPermission::class.':card,delete');

        // Catégories — admin uniquement (index reste public hors groupe admin).
        Route::middleware(HasPermission::class.':category,manage')->group(function () {
            Route::apiResource('categories', CategoryController::class)->except(['index']);
        });

        // Utilisateurs + stats — admin uniquement.
        Route::middleware(HasPermission::class.':user,manage')->group(function () {
            Route::get('users', [AdminController::class, 'users']);
            Route::delete('users/{id}', [AdminController::class, 'deleteUser']);
            Route::get('users/{id}/export', [AdminController::class, 'exportUser']);
            Route::get('stats', [AdminController::class, 'stats']);
        });

        // Rôles & permissions — admin uniquement.
        Route::middleware(HasPermission::class.':role,manage')->group(function () {
            Route::get('roles', [RoleController::class, 'index']);
            Route::get('roles/{id}', [RoleController::class, 'show']);
            Route::post('roles', [RoleController::class, 'store']);
            Route::put('roles/{id}', [RoleController::class, 'update']);
            Route::delete('roles/{id}', [RoleController::class, 'destroy']);
            Route::post('roles/{id}/assign', [RoleController::class, 'assignToUser']);
        });
    });
});
