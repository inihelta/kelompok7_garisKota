<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Index untuk query dashboard, pendapatan, pesanan & kelola meja.
     * Sebelumnya ketiga tabel ini tidak punya index sama sekali (hanya PK),
     * sehingga semua filter status/tanggal/join melakukan full table scan.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Count/sum pendapatan & dashboard: WHERE order_status = ? AND created_at BETWEEN
            $table->index(['order_status', 'created_at']);
            // Order terbaru (latest()) tanpa filter status
            $table->index('created_at');
            // Eager load pesanan aktif per meja (TableController)
            $table->index('table_id');
        });

        Schema::table('order_items', function (Blueprint $table) {
            // Eager load item per pesanan & join chart top-selling
            $table->index('order_id');
            $table->index('menu_id');
        });

        Schema::table('payments', function (Blueprint $table) {
            // Sumber pendapatan: WHERE payment_status = ? AND created_at BETWEEN
            $table->index(['payment_status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['order_status', 'created_at']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['table_id']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex(['order_id']);
            $table->dropIndex(['menu_id']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['payment_status', 'created_at']);
        });
    }
};
