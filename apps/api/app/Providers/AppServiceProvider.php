<?php

namespace App\Providers;

use App\Repositories\Card\CardCrudRepository;
use App\Repositories\Card\CardCrudRepositoryInterface;
use App\Repositories\Card\CardRepository;
use App\Repositories\Card\CardRepositoryInterface;
use App\Repositories\Category\CategoryRepository;
use App\Repositories\Category\CategoryRepositoryInterface;
use App\Repositories\Deck\DeckCrudRepository;
use App\Repositories\Deck\DeckCrudRepositoryInterface;
use App\Repositories\Deck\DeckRepository;
use App\Repositories\Deck\DeckRepositoryInterface;
use App\Repositories\Review\ReviewRepository;
use App\Repositories\Review\ReviewRepositoryInterface;
use App\Repositories\Role\RoleRepository;
use App\Repositories\Role\RoleRepositoryInterface;
use App\Repositories\Admin\AdminRepository;
use App\Repositories\Admin\AdminRepositoryInterface;
use App\Repositories\Stat\StatRepository;
use App\Repositories\Stat\StatRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DeckRepositoryInterface::class, DeckRepository::class);
        $this->app->bind(DeckCrudRepositoryInterface::class, DeckCrudRepository::class);
        $this->app->bind(CardRepositoryInterface::class, CardRepository::class);
        $this->app->bind(CardCrudRepositoryInterface::class, CardCrudRepository::class);
        $this->app->bind(ReviewRepositoryInterface::class, ReviewRepository::class);
        $this->app->bind(StatRepositoryInterface::class, StatRepository::class);
        $this->app->bind(AdminRepositoryInterface::class, AdminRepository::class);
        $this->app->bind(RoleRepositoryInterface::class, RoleRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
    }

    public function boot(): void {}
}
