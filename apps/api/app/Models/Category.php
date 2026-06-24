<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'cover_emoji', 'sort_order'];

    public function decks(): HasMany
    {
        return $this->hasMany(Deck::class);
    }
}
