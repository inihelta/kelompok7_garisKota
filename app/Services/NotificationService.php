<?php

namespace App\Services;

use App\Models\AppNotification;
use App\Models\Order;
use App\Models\Stock;
use App\Events\NotificationCreated;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Trigger notification for new order placed.
     */
    public static function notifyNewOrder(Order $order): ?AppNotification
    {
        try {
            $tableNum = $order->table ? $order->table->table_number : null;
            $tableStr = $tableNum ? "Meja {$tableNum}" : "Takeaway";

            // Format items summary: e.g. "Meja 5 memesan 2 Es Kopi Susu dan 1 Croissant."
            $order->loadMissing('orderItems.menu');
            $itemsList = [];
            foreach ($order->orderItems as $item) {
                $menuName = $item->menu ? $item->menu->name : 'Menu #' . $item->menu_id;
                $itemsList[] = "{$item->quantity} {$menuName}";
            }

            $itemsSummary = count($itemsList) > 0
                ? implode(', ', array_slice($itemsList, 0, 2)) . (count($itemsList) > 2 ? ' dan ' . (count($itemsList) - 2) . ' lainnya' : '')
                : '1 pesanan';

            $message = "{$tableStr} memesan {$itemsSummary}.";
            $tag = "#PS-{$order->id} · {$tableStr}";

            $notification = AppNotification::create([
                'type' => 'order',
                'category' => 'new_order',
                'title' => 'Pesanan baru masuk',
                'message' => $message,
                'tag' => $tag,
                'action_url' => '/dashboard/pesanan',
                'reference_id' => $order->id,
                'is_read' => false,
            ]);

            broadcast(new NotificationCreated($notification));

            return $notification;
        } catch (\Throwable $e) {
            Log::error('Error creating new order notification: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Trigger notification when order is ready / completed.
     */
    public static function notifyOrderReady(Order $order): ?AppNotification
    {
        return self::notifyOrderStatusChanged($order, 'completed');
    }

    /**
     * Trigger notification when order status changes (processing, completed, cancelled).
     */
    public static function notifyOrderStatusChanged(Order $order, string $status): ?AppNotification
    {
        try {
            $order->loadMissing('table');
            $tableNum = $order->table ? $order->table->table_number : null;
            $tableStr = $tableNum ? "Meja {$tableNum}" : "Takeaway";
            $customerName = $order->customer_name ?: 'Pelanggan #' . $order->id;

            if ($status === 'processing') {
                $category = 'order_processing';
                $title = 'Pesanan sedang diracik';
                $message = "Pesanan #PS-{$order->id} atas nama {$customerName} ({$tableStr}) sedang diproses & diracik.";
                $tag = "#PS-{$order->id} · Diracik";
            } elseif ($status === 'completed') {
                $category = 'order_ready';
                $title = 'Pesanan siap diantar';
                $message = "Pesanan atas nama {$customerName} ({$tableStr}) sudah selesai dan siap diantar.";
                $tag = "#PS-{$order->id} · Selesai";
            } elseif ($status === 'cancelled') {
                $category = 'order_cancelled';
                $title = 'Pesanan dibatalkan';
                $message = "Pesanan #PS-{$order->id} ({$tableStr}) telah dibatalkan.";
                $tag = "#PS-{$order->id} · Dibatalkan";
            } else {
                $category = 'order_change';
                $title = "Perubahan status pesanan #PS-{$order->id}";
                $message = "Status pesanan diubah menjadi: {$status}.";
                $tag = "#PS-{$order->id} · {$status}";
            }

            $notification = AppNotification::create([
                'type' => 'order',
                'category' => $category,
                'title' => $title,
                'message' => $message,
                'tag' => $tag,
                'action_url' => '/dashboard/pesanan',
                'reference_id' => $order->id,
                'is_read' => false,
            ]);

            broadcast(new NotificationCreated($notification));

            return $notification;
        } catch (\Throwable $e) {
            Log::error('Error creating order status change notification: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Trigger notification for stock alert (low or empty).
     */
    public static function notifyStockAlert(Stock $stock): ?AppNotification
    {
        try {
            $currentStock = (float) $stock->stock;
            $minStock = (float) $stock->min_stock;
            $unit = $stock->unit ?: 'satuan';

            if ($currentStock <= 0) {
                $category = 'stock_empty';
                $title = 'Stok habis';
                $message = "Bahan {$stock->name} telah habis (0 {$unit}). Segera lakukan restok.";
                $tag = "{$stock->name} · 0 {$unit}";
            } elseif ($currentStock <= $minStock) {
                $category = 'stock_low';
                $title = 'Stok menipis';
                $message = "Bahan {$stock->name} tersisa {$currentStock} {$unit}, di bawah batas minimum {$minStock} {$unit}.";
                $tag = "Sisa {$currentStock} {$unit}";
            } else {
                return null;
            }

            // Hindari notifikasi duplikat dalam 30 menit terakhir untuk stok yang sama
            $recent = AppNotification::where('type', 'stock')
                ->where('reference_id', $stock->id)
                ->where('category', $category)
                ->where('created_at', '>=', now()->subMinutes(30))
                ->first();

            if ($recent) {
                return null;
            }

            $notification = AppNotification::create([
                'type' => 'stock',
                'category' => $category,
                'title' => $title,
                'message' => $message,
                'tag' => $tag,
                'action_url' => '/dashboard/stok',
                'reference_id' => $stock->id,
                'is_read' => false,
            ]);

            broadcast(new NotificationCreated($notification));

            return $notification;
        } catch (\Throwable $e) {
            Log::error('Error creating stock notification: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Trigger notification for general stock update/restock.
     */
    public static function notifyStockUpdated(Stock $stock, ?float $previousStock = null): ?AppNotification
    {
        try {
            $currentStock = (float) $stock->stock;
            $unit = $stock->unit ?: 'satuan';

            // Check if it qualifies as an alert first
            if ($currentStock <= (float) $stock->min_stock) {
                return self::notifyStockAlert($stock);
            }

            $message = "Stok bahan {$stock->name} diperbarui menjadi {$currentStock} {$unit}.";
            $tag = "{$stock->name} · {$currentStock} {$unit}";

            $notification = AppNotification::create([
                'type' => 'stock',
                'category' => 'stock_update',
                'title' => 'Perubahan stok bahan',
                'message' => $message,
                'tag' => $tag,
                'action_url' => '/dashboard/stok',
                'reference_id' => $stock->id,
                'is_read' => false,
            ]);

            broadcast(new NotificationCreated($notification));

            return $notification;
        } catch (\Throwable $e) {
            Log::error('Error creating stock update notification: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Trigger notification when table information is updated.
     */
    public static function notifyTableUpdated(\App\Models\Table $table): ?AppNotification
    {
        try {
            $statusStr = $table->available ? 'Tersedia' : 'Terisi/Tidak Tersedia';
            $locationStr = ucfirst($table->location);
            $message = "Informasi Meja #{$table->table_number} ({$locationStr}) diperbarui. Kapasitas: {$table->capacity} orang, Status: {$statusStr}.";

            $notification = AppNotification::create([
                'type' => 'order',
                'category' => 'table_update',
                'title' => 'Perubahan data meja',
                'message' => $message,
                'tag' => "Meja #{$table->table_number} · {$locationStr}",
                'action_url' => '/dashboard/meja',
                'reference_id' => $table->id,
                'is_read' => false,
            ]);

            broadcast(new NotificationCreated($notification));

            return $notification;
        } catch (\Throwable $e) {
            Log::error('Error creating table update notification: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Trigger notification when menu item is updated.
     */
    public static function notifyMenuUpdated(\App\Models\Menu $menu): ?AppNotification
    {
        try {
            $statusStr = ucfirst($menu->status);
            $priceStr = 'Rp ' . number_format($menu->price, 0, ',', '.');
            $message = "Menu {$menu->name} diperbarui. Harga: {$priceStr}, Status: {$statusStr}.";

            $notification = AppNotification::create([
                'type' => 'order',
                'category' => 'menu_update',
                'title' => 'Perubahan menu',
                'message' => $message,
                'tag' => "Menu · {$menu->name}",
                'action_url' => '/dashboard/menu',
                'reference_id' => $menu->id,
                'is_read' => false,
            ]);

            broadcast(new NotificationCreated($notification));

            return $notification;
        } catch (\Throwable $e) {
            Log::error('Error creating menu update notification: ' . $e->getMessage());
            return null;
        }
    }
}
