<?php

namespace App\Models;

use App\Enums\CardDifficulty;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Card extends Model
{
    use HasFactory;

    protected $fillable = [
        'deck_id',
        'front',
        'back',
        'wrong_answer_1',
        'wrong_answer_2',
        'wrong_answer_3',
        'explanation',
        'source',
        'tags',
        'difficulty',
        'progression_config',
    ];

    protected $casts = [
        'tags'               => 'array',
        'difficulty'         => CardDifficulty::class,
        'progression_config' => 'array',
    ];

    public function progressionConfig(): array
    {
        return array_merge([
            'threshold_4_choices' => 3,
            'threshold_open'      => 7,
            'xp_correct'          => 10,
            'xp_incorrect'        => 3,
            'difficulty_weight'   => 1.0,
        ], $this->progression_config ?? []);
    }

    public function deck(): BelongsTo
    {
        return $this->belongsTo(Deck::class);
    }

    public function progresses(): HasMany
    {
        return $this->hasMany(CardProgress::class);
    }
}
