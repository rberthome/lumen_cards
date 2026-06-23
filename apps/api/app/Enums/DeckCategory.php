<?php

namespace App\Enums;

enum DeckCategory: string
{
    case Philosophy = 'philosophy';
    case Kabbalah = 'kabbalah';
    case Masonic = 'masonic';
    case Spiritual = 'spiritual';
    case Kant = 'kant';
    case Custom = 'custom';
}
