<?php

namespace App\Enums;

enum PresentationMode: string
{
    case TwoChoices  = 'two_choices';
    case FourChoices = 'four_choices';
    case Open        = 'open';
}
