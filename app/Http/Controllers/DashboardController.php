<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Menu;
use App\Services\PerformanceChart;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with real database metrics.
     */
    public function index(Request $request)
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        // whereBetween (bukan whereDate) supaya index (created_at) terpakai
        $todayRevenue = (float) Order::where('order_status', 'completed')
            ->whereBetween('created_at', [$today->startOfDay(), $today->endOfDay()])
            ->sum('total_price');

        $yesterdayRevenue = (float) Order::where('order_status', 'completed')
            ->whereBetween('created_at', [$yesterday->startOfDay(), $yesterday->endOfDay()])
            ->sum('total_price');

        $revenueGrowth = 0;
        if ($yesterdayRevenue > 0) {
            $revenueGrowth = round((($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100);
        } elseif ($todayRevenue > 0) {
            $revenueGrowth = 100;
        }

        $todayOrdersCount = Order::whereBetween('created_at', [$today->startOfDay(), $today->endOfDay()])->count();
        $yesterdayOrdersCount = Order::whereBetween('created_at', [$yesterday->startOfDay(), $yesterday->endOfDay()])->count();

        $ordersGrowth = 0;
        if ($yesterdayOrdersCount > 0) {
            $ordersGrowth = round((($todayOrdersCount - $yesterdayOrdersCount) / $yesterdayOrdersCount) * 100);
        } elseif ($todayOrdersCount > 0) {
            $ordersGrowth = 100;
        }

        // 3. Performa Penjualan (7 Hari Terakhir & 30 Hari Terakhir) - use cached data
        $performance7Days = Cache::get('performance.days7');
        $performance30Days = Cache::get('performance.days30');

        if ($performance7Days === null || $performance30Days === null) {
            // Fallback: build on-demand (e.g., first load before cron runs)
            $performance7Days = PerformanceChart::build(7);
            $performance30Days = PerformanceChart::build(30);
            Cache::forever('performance.days7', $performance7Days);
            Cache::forever('performance.days30', $performance30Days);
        }

        // 4. Top - Selling Menu (6 Menu terlaris dari order_items)
        $topSelling = Menu::select('menus.id', 'menus.name', 'menus.image', 'menus.price')
            ->selectRaw('COALESCE(SUM(order_items.quantity), 0) as total_sold')
            ->leftJoin('order_items', 'menus.id', '=', 'order_items.menu_id')
            ->leftJoin('orders', function ($join) {
                $join->on('order_items.order_id', '=', 'orders.id')
                    ->where('orders.order_status', '=', 'completed');
            })
            ->groupBy('menus.id', 'menus.name', 'menus.image', 'menus.price')
            ->orderByDesc('total_sold')
            ->orderBy('menus.name')
            ->limit(6)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'image' => $item->image,
                    'price' => (float) $item->price,
                    'total_sold' => (int) $item->total_sold,
                ];
            });

        // 5. Tabel Pesanan Terbaru (Paginated 3 data per halaman sesuai screenshot)
        $recentOrders = Order::with(['table', 'orderItems.menu', 'payment'])
            ->latest()
            ->paginate(3)
            ->withQueryString()
            ->through(function ($order) {
                $relativeTime = $order->created_at
                    ? Carbon::parse($order->created_at)->locale('id')->diffForHumans(null, true) . " lalu"
                    : '-';

                $formattedDate = $order->created_at
                    ? Carbon::parse($order->created_at)->locale('id')->translatedFormat('d M Y, h.i A')
                    : '-';

                return [
                    'id' => $order->id,
                    'customer_name' => $order->customer_name ?: 'Pelanggan #' . $order->id,
                    'table_id' => $order->table_id,
                    'table_number' => $order->table ? $order->table->table_number : null,
                    'location' => $order->table ? $order->table->location : 'indoor',
                    'order_type' => $order->order_type,
                    'order_status' => $order->order_status,
                    'total_price' => (float) $order->total_price,
                    'items_count' => $order->orderItems->sum('quantity') ?: $order->orderItems->count(),
                    'created_at' => $order->created_at ? $order->created_at->toISOString() : null,
                    'formatted_time' => $formattedDate,
                    'relative_time' => $relativeTime,
                    'order_items' => $order->orderItems->map(function ($oi) {
                        return [
                            'id' => $oi->id,
                            'order_id' => $oi->order_id,
                            'menu_id' => $oi->menu_id,
                            'menu_name' => $oi->menu ? $oi->menu->name : 'Menu #' . $oi->menu_id,
                            'menu_image' => $oi->menu ? $oi->menu->image : null,
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
            });

        return inertia('Dashboard', [
            'metrics' => [
                'today_revenue' => $todayRevenue,
                'revenue_growth' => $revenueGrowth,
                'today_orders' => $todayOrdersCount,
                'orders_growth' => $ordersGrowth,
            ],
            'performance' => [
                'days7' => $performance7Days,
                'days30' => $performance30Days,
            ],
            'topSelling' => $topSelling,
            'recentOrders' => $recentOrders,
        ]);
    }
}
