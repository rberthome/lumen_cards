<?php

namespace App\Models;

use App\Enums\DeckCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Deck extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'cover_emoji',
    ];

    protected $casts = [
        'category' => DeckCategory::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }
}
