<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewSession extends Model
{
    protected $fillable = [
        'user_id',
        'deck_id',
        'started_at',
        'completed_at',
        'cards_reviewed',
        'correct_count',
        'session_size',
    ];

    protected $casts = [
        'started_at'   => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function deck(): BelongsTo
    {
        return $this->belongsTo(Deck::class);
    }
}
