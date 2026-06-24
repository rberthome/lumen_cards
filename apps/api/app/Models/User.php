<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role_id'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function hasPermission(string $entity, string $action): bool
    {
        if (! $this->relationLoaded('role') || ! $this->role) {
            return false;
        }

        return $this->role->hasPermission($entity, $action);
    }

    public function hasAnyAdminPermission(): bool
    {
        return ($this->role?->permissions->isNotEmpty()) ?? false;
    }

    public function getPermissions(): array
    {
        if (! $this->role) {
            return [];
        }

        return $this->role->permissions
            ->map(fn (Permission $p) => "{$p->entity}:{$p->action}")
            ->toArray();
    }

    public function decks(): HasMany
    {
        return $this->hasMany(Deck::class);
    }

    public function cardProgresses(): HasMany
    {
        return $this->hasMany(CardProgress::class);
    }

    public function reviewSessions(): HasMany
    {
        return $this->hasMany(ReviewSession::class);
    }

    public function stat(): HasOne
    {
        return $this->hasOne(UserStat::class);
    }
}
