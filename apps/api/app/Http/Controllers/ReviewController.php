<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitReviewRequest;
use App\Models\Deck;
use App\Repositories\Card\CardRepositoryInterface;
use App\Repositories\Review\DTOs\SubmitReviewItemDto;
use App\Repositories\Review\ReviewRepositoryInterface;
use App\Models\ReviewSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function __construct(
        private readonly CardRepositoryInterface $cardRepository,
        private readonly ReviewRepositoryInterface $reviewRepository,
    ) {}

    public function session(Request $request, Deck $deck): JsonResponse
    {
        $limit = (int) $request->query('limit', 20);
        $limit = max(1, min(50, $limit));

        $cards = $this->cardRepository->findDueForReview(
            userId: $request->user()->id,
            deckId: $deck->id,
            limit: $limit,
        );

        $session = ReviewSession::create([
            'user_id'     => $request->user()->id,
            'deck_id'     => $deck->id,
            'started_at'  => now(),
            'session_size' => $cards->count(),
        ]);

        return response()->json([
            'id'           => $session->id,
            'cards'        => $cards->map->toArray()->values(),
            'session_size' => $cards->count(),
            'deck_id'      => $deck->id,
        ]);
    }

    public function submit(SubmitReviewRequest $request): JsonResponse
    {
        $items = array_map(
            fn (array $item) => new SubmitReviewItemDto(
                card_id: $item['card_id'],
                knew: $item['knew'],
                time_spent_ms: $item['time_spent_ms'],
            ),
            $request->validated('items'),
        );

        $result = $this->reviewRepository->submit(
            userId: $request->user()->id,
            items: $items,
            totalDurationMs: $request->validated('total_duration_ms'),
        );

        return response()->json($result->toArray());
    }
}
