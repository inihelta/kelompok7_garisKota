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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_category_id')->constrained('stock_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('sku')->unique();
            $table->decimal('stock', 10, 2)->default(0);
            $table->string('unit')->default('Pcs');
            $table->decimal('min_stock', 10, 2)->default(0);
            $table->decimal('est_daily', 10, 2)->default(0);
            $table->string('icon_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};

