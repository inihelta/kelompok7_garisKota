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
        try {
            $tableNum = $order->table ? $order->table->table_number : null;
            $tableStr = $tableNum ? "Meja {$tableNum}" : "Takeaway";
            $customerName = $order->customer_name ?: 'Pelanggan #' . $order->id;

            $message = "Pesanan atas nama {$customerName} ({$tableStr}) sudah selesai dan siap diantar.";
            $tag = "#PS-{$order->id} · {$tableStr}";

            $notification = AppNotification::create([
                'type' => 'order',
                'category' => 'order_ready',
                'title' => 'Pesanan siap diantar',
                'message' => $message,
                'tag' => $tag,
                'action_url' => '/dashboard/pesanan',
                'reference_id' => $order->id,
                'is_read' => false,
            ]);

            broadcast(new NotificationCreated($notification));

            return $notification;
        } catch (\Throwable $e) {
            Log::error('Error creating order ready notification: ' . $e->getMessage());
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
}
