<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardProgress extends Model
{
    protected $fillable = [
        'user_id',
        'card_id',
        'interval',
        'repetition',
        'ease_factor',
        'next_review_at',
        'last_reviewed_at',
    ];

    protected $casts = [
        'interval'         => 'integer',
        'repetition'       => 'integer',
        'ease_factor'      => 'float',
        'next_review_at'   => 'datetime',
        'last_reviewed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }
}
