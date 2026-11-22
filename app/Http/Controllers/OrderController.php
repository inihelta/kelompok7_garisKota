<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Events\OrderStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $activeQuery = Order::with(['table', 'orderItems.menu', 'payment'])
            ->whereIn('order_status', ['awaiting_payment', 'pending', 'processing']);
        $historyQuery = Order::with(['table', 'orderItems.menu', 'payment'])
            ->whereIn('order_status', ['completed', 'cancelled']);

        $pesananDiprosesCount = $activeQuery->count();
        $pesananSelesaiCount = Order::where('order_status', 'completed')->count();

        // Pagination untuk active orders (sama seperti history)
        $activeOrders = $activeQuery
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn($order) => $this->mapOrder($order));

        $historyOrders = $historyQuery
            ->latest()
            ->paginate(8)
            ->withQueryString()
            ->through(fn($order) => $this->mapOrder($order));

        return inertia('Pesanan', [
            'activeOrders' => $activeOrders,
            'historyOrders' => $historyOrders,
            'stats' => [
                'processing_count' => $pesananDiprosesCount,
                'completed_count' => $pesananSelesaiCount,
            ],
        ]);
    }

    public function process(Order $order)
    {
        $order->update(['order_status' => 'processing']);

        try {
            $order->load('table');
            OrderStatusUpdated::dispatch($order, 'processing');
            \App\Services\NotificationService::notifyOrderStatusChanged($order, 'processing');
        } catch (\Throwable $e) {
        }

        return back()->with('success', 'Pesanan #' . $order->id . ' sedang diproses.');
    }

    public function complete(Order $order)
    {
        $order->update(['order_status' => 'completed']);

        if ($order->payment && $order->payment->payment_status === 'pending') {
            $order->payment->update(['payment_status' => 'done']);
        }

        try {
            $order->load(['table', 'orderItems.menu']);
            OrderStatusUpdated::dispatch($order, 'completed');
            \App\Services\NotificationService::notifyOrderStatusChanged($order, 'completed');
        } catch (\Throwable $e) {
        }

        return back()->with('success', 'Pesanan #' . $order->id . ' telah selesai.');
    }

    public function cancel(Order $order)
    {
        DB::transaction(function () use ($order) {
            // Kembalikan stok menu
            $order->load('orderItems.menu');
            foreach ($order->orderItems as $item) {
                if ($item->menu) {
                    $item->menu->increment('stock', $item->quantity);
                }
            }

            $order->update(['order_status' => 'cancelled']);
        });

        try {
            $order->load('table');
            OrderStatusUpdated::dispatch($order, 'cancelled');
            \App\Services\NotificationService::notifyOrderStatusChanged($order, 'cancelled');
        } catch (\Throwable $e) {
        }

        return back()->with('success', 'Pesanan #' . $order->id . ' telah dibatalkan.');
    }

    /**
     * Admin konfirmasi pembayaran — ubah payment_status ke 'done'
     * dan order_status dari 'awaiting_payment' ke 'pending' (masuk antrean dapur).
     */
    public function confirmPayment(Order $order)
    {
        if ($order->order_status !== 'awaiting_payment') {
            return back()->withErrors(['payment' => 'Pesanan ini tidak menunggu pembayaran (status: ' . $order->order_status . ').']);
        }

        DB::transaction(function () use ($order) {
            // Update payment
            if ($order->payment) {
                $order->payment->update(['payment_status' => 'done']);
            }

            // Update order status ke pending (siap diproses dapur)
            $order->update(['order_status' => 'pending']);
        });

        // Notifikasi & broadcast
        try {
            $order->load(['table', 'orderItems.menu', 'payment']);
            OrderStatusUpdated::dispatch($order, 'pending');
            \App\Services\NotificationService::notifyOrderStatusChanged($order, 'pending');
        } catch (\Throwable $e) {
        }

        return back()->with('success', 'Pembayaran untuk Pesanan #' . $order->id . ' dikonfirmasi. Pesanan masuk antrean dapur.');
    }

    private function mapOrder($order): array
    {
        return [
            'id' => $order->id,
            'customer_name' => $order->customer_name ?: 'Pelanggan #' . $order->id,
            'table_id' => $order->table_id,
            'table_number' => $order->table?->table_number,
            'location' => $order->table?->location ?? 'indoor',
            'order_type' => $order->order_type,
            'order_status' => $order->order_status,
            'total_price' => (float) $order->total_price,
            'items_count' => $order->orderItems->sum('quantity') ?: $order->orderItems->count(),
            'created_at' => $order->created_at?->toISOString(),
            'formatted_time' => $order->created_at
                ? Carbon::parse($order->created_at)->locale('id')->translatedFormat('d M Y, h.i A')
                : '-',
            'relative_time' => $order->created_at
                ? Carbon::parse($order->created_at)->locale('id')->diffForHumans(null, true)
                : '-',
            'order_items' => $order->orderItems->map(function ($oi) {
                return [
                    'id' => $oi->id,
                    'order_id' => $oi->order_id,
                    'menu_id' => $oi->menu_id,
                    'menu_name' => $oi->menu?->name ?? 'Menu #' . $oi->menu_id,
                    'menu_image' => $oi->menu?->image,
                    'quantity' => (int) $oi->quantity,
                    'unit_price' => (float) $oi->unit_price,
                    'notes' => $oi->notes,
                ];
            }),
            'payment' => $order->payment ? [
                'id' => $order->payment->id,
                'payment_method' => $order->payment->payment_method,
                'payment_amount' => (float) $order->payment->payment_amount,
                'payment_status' => $order->payment->payment_status,
                'transaction_ref' => $order->payment->transaction_ref,
            ] : null,
        ];
    }
}
