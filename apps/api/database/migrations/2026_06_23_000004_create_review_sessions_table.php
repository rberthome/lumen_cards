<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('review_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('deck_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->integer('cards_reviewed')->default(0);
            $table->integer('correct_count')->default(0);
            $table->integer('session_size');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_sessions');
    }
};
