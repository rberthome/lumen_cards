<?php

namespace App\Models;

use App\Enums\CardDifficulty;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Card extends Model
{
    protected $fillable = [
        'deck_id',
        'front',
        'back',
        'explanation',
        'source',
        'tags',
        'difficulty',
    ];

    protected $casts = [
        'tags'       => 'array',
        'difficulty' => CardDifficulty::class,
    ];

    public function deck(): BelongsTo
    {
        return $this->belongsTo(Deck::class);
    }

    public function progresses(): HasMany
    {
        return $this->hasMany(CardProgress::class);
    }
}
