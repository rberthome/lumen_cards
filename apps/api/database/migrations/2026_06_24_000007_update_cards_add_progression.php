<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->text('wrong_answer_1')->nullable()->after('back');
            $table->text('wrong_answer_2')->nullable()->after('wrong_answer_1');
            $table->text('wrong_answer_3')->nullable()->after('wrong_answer_2');
            $table->json('progression_config')->nullable()->after('difficulty');
        });
    }

    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->dropColumn(['wrong_answer_1', 'wrong_answer_2', 'wrong_answer_3', 'progression_config']);
        });
    }
};
