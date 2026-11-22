<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Tambah status 'awaiting_payment' di depan 'pending'
            $table->enum('order_status', ['awaiting_payment', 'pending', 'processing', 'completed', 'cancelled'])
                ->default('awaiting_payment')
                ->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('order_status', ['pending', 'processing', 'completed', 'cancelled'])
                ->default('pending')
                ->change();
        });
    }
};