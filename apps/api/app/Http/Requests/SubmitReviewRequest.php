<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items'                   => 'required|array|min:1',
            'items.*.card_id'         => 'required|integer|exists:cards,id',
            'items.*.knew'            => 'required|boolean',
            'items.*.time_spent_ms'   => 'required|integer|min:0',
            'total_duration_ms'       => 'required|integer|min:0',
        ];
    }
}
