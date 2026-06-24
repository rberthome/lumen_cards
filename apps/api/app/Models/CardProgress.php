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
        'consecutive_correct',
        'next_review_at',
        'last_reviewed_at',
    ];

    protected $casts = [
        'interval'            => 'integer',
        'repetition'          => 'integer',
        'ease_factor'         => 'float',
        'consecutive_correct' => 'integer',
        'next_review_at'      => 'datetime',
        'last_reviewed_at'    => 'datetime',
    ];

    public function getPresentationMode(Card $card): string
    {
        $config = $card->progressionConfig();

        if ($this->consecutive_correct >= $config['threshold_open']) {
            return 'open';
        }

        if ($this->consecutive_correct >= $config['threshold_4_choices']) {
            return 'four_choices';
        }

        return 'two_choices';
    }

    public function applyCorrect(): void
    {
        $this->consecutive_correct++;
    }

    public function applyError(Card $card): void
    {
        $config = $card->progressionConfig();

        if ($this->consecutive_correct >= $config['threshold_open']) {
            $this->consecutive_correct = $config['threshold_4_choices'];
        } elseif ($this->consecutive_correct >= $config['threshold_4_choices']) {
            $this->consecutive_correct = 0;
        } else {
            $this->consecutive_correct = 0;
        }
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }
}
