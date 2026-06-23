<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserStat extends Model
{
    protected $fillable = [
        'user_id',
        'xp',
        'streak_days',
        'last_review_date',
        'total_time_ms',
    ];

    protected $casts = [
        'xp'               => 'integer',
        'streak_days'      => 'integer',
        'total_time_ms'    => 'integer',
        'last_review_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
