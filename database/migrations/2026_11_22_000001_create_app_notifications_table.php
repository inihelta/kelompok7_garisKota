<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('app_notifications', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['order', 'stock']);
            $table->string('category'); // new_order, order_ready, stock_low, stock_empty
            $table->string('title');
            $table->text('message');
            $table->string('tag')->nullable(); // e.g. "#PS-1048 · Meja 5" or "Susu oat · 0 L"
            $table->string('action_url')->nullable(); // e.g. "/dashboard/pesanan"
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            $table->index(['type', 'is_read']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_notifications');
    }
};
