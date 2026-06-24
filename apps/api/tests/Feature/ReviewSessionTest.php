<?php

namespace Tests\Feature;

use App\Models\Card;
use App\Models\Deck;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewSessionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_get_review_session(): void
    {
        $user = User::factory()->create();
        $deck = Deck::factory()->create(['user_id' => null]);
        Card::factory()->count(5)->create(['deck_id' => $deck->id]);

        $response = $this->actingAs($user)
            ->getJson("/api/decks/{$deck->id}/session?limit=5");

        $response->assertOk()
            ->assertJsonStructure([
                'id',
                'cards' => [['id', 'front', 'back', 'interval', 'repetition', 'ease_factor']],
                'session_size',
                'deck_id',
            ]);
    }

    public function test_submit_review_updates_progress_and_returns_result(): void
    {
        $user = User::factory()->create();
        $deck = Deck::factory()->create();
        $card = Card::factory()->create(['deck_id' => $deck->id]);

        $response = $this->actingAs($user)
            ->postJson('/api/review/submit', [
                'items' => [
                    ['card_id' => $card->id, 'knew' => true, 'time_spent_ms' => 5000],
                ],
                'total_duration_ms' => 5000,
            ]);

        $response->assertOk()
            ->assertJsonStructure([
                'xp_earned', 'accuracy', 'cards_reviewed', 'duration_ms', 'streak_days', 'level',
            ]);

        $this->assertDatabaseHas('card_progress', [
            'user_id' => $user->id,
            'card_id' => $card->id,
            'repetition' => 1,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_review(): void
    {
        $deck = Deck::factory()->create();

        $this->getJson("/api/decks/{$deck->id}/session")->assertUnauthorized();
    }
}
