<?php

namespace App\Http\Controllers;

use App\Models\order;
use App\Models\payment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class IncomeController extends Controller
{
    /**
     * Display the revenue and income metrics page.
     */
    public function index(Request $request)
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        // 1. Metric: Pendapatan Hari Ini & Kemarin
        $todayRevenue = (float) order::where('order_status', 'completed')
            ->whereDate('created_at', $today)
            ->sum('total_price');

        $yesterdayRevenue = (float) order::where('order_status', 'completed')
            ->whereDate('created_at', $yesterday)
            ->sum('total_price');

        $revenueGrowth = 0;
        if ($yesterdayRevenue > 0) {
            $revenueGrowth = round((($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100);
        } elseif ($todayRevenue > 0) {
            $revenueGrowth = 100;
        }

        // 2. Metric: Pesanan Hari Ini & Kemarin (completed only)
        $todayCompletedOrders = order::where('order_status', 'completed')
            ->whereDate('created_at', $today)
            ->count();
        $yesterdayCompletedOrders = order::where('order_status', 'completed')
            ->whereDate('created_at', $yesterday)
            ->count();

        $ordersGrowth = 0;
        if ($yesterdayCompletedOrders > 0) {
            $ordersGrowth = round((($todayCompletedOrders - $yesterdayCompletedOrders) / $yesterdayCompletedOrders) * 100);
        } elseif ($todayCompletedOrders > 0) {
            $ordersGrowth = 100;
        }

        // 3. Metric: Rata-rata Transaksi (AOV)
        $totalCompletedOrdersAllTime = order::where('order_status', 'completed')->count();
        $totalRevenueAllTime = (float) order::where('order_status', 'completed')->sum('total_price');

        $averageTransaction = 0;
        if ($todayCompletedOrders > 0 && $todayRevenue > 0) {
            $averageTransaction = round($todayRevenue / $todayCompletedOrders);
        } elseif ($totalCompletedOrdersAllTime > 0) {
            $averageTransaction = round($totalRevenueAllTime / $totalCompletedOrdersAllTime);
        }

        // 4. Metric: Total Biaya (Estimasi Biaya Operasional / HPP ~53% dari pendapatan)
        $totalCost = round($todayRevenue * 0.53);

        // 5. Performa Penjualan (7 Hari & 30 Hari)
        $buildPerformanceData = function ($days) {
            $data = [];
            for ($i = $days - 1; $i >= 0; $i--) {
                $targetDate = Carbon::today()->subDays($i);
                $dateStr = $targetDate->toDateString();

                $dayOrders = order::whereDate('created_at', $dateStr)->count();
                $dayRevenue = (float) order::where('order_status', 'completed')
                    ->whereDate('created_at', $dateStr)
                    ->sum('total_price');

                $data[] = [
                    'day_index' => $days - 1 - $i,
                    'label' => $days === 7
                        ? (string) ($days - 1 - $i)
                        : $targetDate->format('d/m'),
                    'date' => $targetDate->translatedFormat('d M'),
                    'pesanan' => $dayOrders,
                    'pendapatan' => $dayRevenue,
                ];
            }
            return $data;
        };

        $performance7Days = $buildPerformanceData(7);
        $performance30Days = $buildPerformanceData(30);

        // 6. Sumber Pendapatan (Berdasarkan Metode Pembayaran di Tabel payments)
        $paymentData = payment::select('payment_method')
            ->selectRaw('SUM(payment_amount) as total_amount')
            ->selectRaw('COUNT(*) as total_count')
            ->where('payment_status', 'done')
            ->groupBy('payment_method')
            ->get();

        $grandTotalPayments = (float) $paymentData->sum('total_amount');
        if ($grandTotalPayments === 0.0) {
            $grandTotalPayments = (float) order::where('order_status', 'completed')->sum('total_price');
        }

        $labelMap = [
            'cash' => 'Cash',
            'qris' => 'Qris',
            'bank_transfer' => 'Transfer Bank',
            'e_wallet' => 'Debit',
        ];

        $paymentSources = [];
        $methods = ['cash', 'qris', 'bank_transfer', 'e_wallet'];

        foreach ($methods as $methodKey) {
            $found = $paymentData->firstWhere('payment_method', $methodKey);
            $amount = $found ? (float) $found->total_amount : 0.0;
            $percentage = $grandTotalPayments > 0 ? round(($amount / $grandTotalPayments) * 100) : 0;

            $paymentSources[] = [
                'key' => $methodKey,
                'name' => $labelMap[$methodKey],
                'value' => $amount,
                'percentage' => $percentage,
            ];
        }

        // 7. Tabel Pesanan Terbaru (3 baris per halaman)
        $recentOrders = order::with(['table', 'orderItems.menu', 'payment'])
            ->latest()
            ->paginate(3)
            ->withQueryString()
            ->through(function ($order) {
                $relativeTime = $order->created_at
                    ? Carbon::parse($order->created_at)->locale('id')->diffForHumans(null, true)
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

        return inertia('Pendapatan', [
            'metrics' => [
                'today_revenue' => $todayRevenue,
                'revenue_growth' => $revenueGrowth,
                'today_orders' => $todayCompletedOrders,
                'orders_growth' => $ordersGrowth,
                'average_transaction' => $averageTransaction,
                'total_cost' => $totalCost,
            ],
            'performance' => [
                'days7' => $performance7Days,
                'days30' => $performance30Days,
            ],
            'paymentSources' => [
                'items' => $paymentSources,
                'total' => $grandTotalPayments,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
