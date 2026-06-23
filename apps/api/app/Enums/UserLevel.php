<?php

namespace App\Enums;

enum UserLevel: string
{
    case Apprentice = 'apprentice';
    case Companion = 'companion';
    case Master = 'master';
    case GrandMaster = 'grand_master';

    public static function fromXp(int $xp): self
    {
        return match (true) {
            $xp >= 5001 => self::GrandMaster,
            $xp >= 2001 => self::Master,
            $xp >= 501  => self::Companion,
            default     => self::Apprentice,
        };
    }

    public function xpToNext(): int
    {
        return match ($this) {
            self::Apprentice  => 501,
            self::Companion   => 2001,
            self::Master      => 5001,
            self::GrandMaster => 0,
        };
    }
}
