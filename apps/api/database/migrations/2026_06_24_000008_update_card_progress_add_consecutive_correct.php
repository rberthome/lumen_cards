<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('card_progress', function (Blueprint $table) {
            $table->unsignedSmallInteger('consecutive_correct')->default(0)->after('ease_factor');
        });
    }

    public function down(): void
    {
        Schema::table('card_progress', function (Blueprint $table) {
            $table->dropColumn('consecutive_correct');
        });
    }
};
