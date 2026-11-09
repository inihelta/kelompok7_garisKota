<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $activeQuery = Order::with(['table', 'orderItems.menu', 'payment'])
            ->whereIn('order_status', ['pending', 'processing']);
        $historyQuery = Order::with(['table', 'orderItems.menu', 'payment'])
            ->whereIn('order_status', ['completed', 'cancelled']);

        $pesananDiprosesCount = $activeQuery->count();
        $pesananSelesaiCount = Order::where('order_status', 'completed')->count();

        $activeOrders = $activeQuery->latest()->get()->map(fn($order) => $this->mapOrder($order));

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

    public function complete(Order $order)
    {
        $order->update(['order_status' => 'completed']);

        if ($order->payment && $order->payment->payment_status === 'pending') {
            $order->payment->update(['payment_status' => 'done']);
        }

        return back()->with('success', 'Pesanan #' . $order->id . ' telah selesai.');
    }

    public function cancel(Order $order)
    {
        $order->update(['order_status' => 'cancelled']);

        if ($order->payment && $order->payment->payment_status === 'pending') {
            $order->payment->update(['payment_status' => 'failed']);
        }

        return back()->with('success', 'Pesanan #' . $order->id . ' telah dibatalkan.');
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