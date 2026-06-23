<?php

namespace App\Providers;

use App\Repositories\Card\CardRepository;
use App\Repositories\Card\CardRepositoryInterface;
use App\Repositories\Deck\DeckRepository;
use App\Repositories\Deck\DeckRepositoryInterface;
use App\Repositories\Review\ReviewRepository;
use App\Repositories\Review\ReviewRepositoryInterface;
use App\Repositories\Stat\StatRepository;
use App\Repositories\Stat\StatRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DeckRepositoryInterface::class, DeckRepository::class);
        $this->app->bind(CardRepositoryInterface::class, CardRepository::class);
        $this->app->bind(ReviewRepositoryInterface::class, ReviewRepository::class);
        $this->app->bind(StatRepositoryInterface::class, StatRepository::class);
    }

    public function boot(): void {}
}
