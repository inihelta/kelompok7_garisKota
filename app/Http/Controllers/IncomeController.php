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
        $filter = $request->query('filter', 'today');
        $startDateParam = $request->query('start_date');
        $endDateParam = $request->query('end_date');

        if ($startDateParam && $endDateParam) {
            $filter = 'custom';
            $startDate = Carbon::parse($startDateParam)->startOfDay();
            $endDate = Carbon::parse($endDateParam)->endOfDay();
            $diffDays = max(1, (int) $startDate->diffInDays($endDate));
            $prevStartDate = (clone $startDate)->subDays($diffDays);
            $prevEndDate = (clone $startDate)->subSecond();
            $dateRangeLabel = $startDate->translatedFormat('d M Y') . ' - ' . $endDate->translatedFormat('d M Y');
        } else {
            switch ($filter) {
                case 'yesterday':
                    $startDate = Carbon::yesterday()->startOfDay();
                    $endDate = Carbon::yesterday()->endOfDay();
                    $prevStartDate = Carbon::yesterday()->subDay()->startOfDay();
                    $prevEndDate = Carbon::yesterday()->subDay()->endOfDay();
                    $dateRangeLabel = 'Kemarin (' . $startDate->translatedFormat('d M Y') . ')';
                    break;
                case '7days':
                    $startDate = Carbon::today()->subDays(6)->startOfDay();
                    $endDate = Carbon::today()->endOfDay();
                    $prevStartDate = Carbon::today()->subDays(13)->startOfDay();
                    $prevEndDate = Carbon::today()->subDays(7)->endOfDay();
                    $dateRangeLabel = $startDate->translatedFormat('d M Y') . ' - ' . $endDate->translatedFormat('d M Y');
                    break;
                case '30days':
                    $startDate = Carbon::today()->subDays(29)->startOfDay();
                    $endDate = Carbon::today()->endOfDay();
                    $prevStartDate = Carbon::today()->subDays(59)->startOfDay();
                    $prevEndDate = Carbon::today()->subDays(30)->endOfDay();
                    $dateRangeLabel = $startDate->translatedFormat('d M Y') . ' - ' . $endDate->translatedFormat('d M Y');
                    break;
                case 'this_month':
                    $startDate = Carbon::today()->startOfMonth();
                    $endDate = Carbon::today()->endOfMonth();
                    $prevStartDate = Carbon::today()->subMonth()->startOfMonth();
                    $prevEndDate = Carbon::today()->subMonth()->endOfMonth();
                    $dateRangeLabel = 'Bulan Ini (' . $startDate->translatedFormat('M Y') . ')';
                    break;
                case 'today':
                default:
                    $filter = 'today';
                    $startDate = Carbon::today()->startOfDay();
                    $endDate = Carbon::today()->endOfDay();
                    $prevStartDate = Carbon::yesterday()->startOfDay();
                    $prevEndDate = Carbon::yesterday()->endOfDay();
                    $dateRangeLabel = 'Hari Ini (' . $startDate->translatedFormat('d M Y') . ')';
                    break;
            }
        }

        // 1. Metric: Pendapatan Periode & Periode Sebelumnya
        $periodRevenue = (float) order::where('order_status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_price');

        $prevRevenue = (float) order::where('order_status', 'completed')
            ->whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->sum('total_price');

        $revenueGrowth = 0;
        if ($prevRevenue > 0) {
            $revenueGrowth = round((($periodRevenue - $prevRevenue) / $prevRevenue) * 100);
        } elseif ($periodRevenue > 0) {
            $revenueGrowth = 100;
        }

        // 2. Metric: Pesanan Periode & Periode Sebelumnya (completed only)
        $periodCompletedOrders = order::where('order_status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
        $prevCompletedOrders = order::where('order_status', 'completed')
            ->whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->count();

        $ordersGrowth = 0;
        if ($prevCompletedOrders > 0) {
            $ordersGrowth = round((($periodCompletedOrders - $prevCompletedOrders) / $prevCompletedOrders) * 100);
        } elseif ($periodCompletedOrders > 0) {
            $ordersGrowth = 100;
        }

        // 3. Metric: Rata-rata Transaksi (AOV)
        $totalCompletedOrdersAllTime = order::where('order_status', 'completed')->count();
        $totalRevenueAllTime = (float) order::where('order_status', 'completed')->sum('total_price');

        $averageTransaction = 0;
        if ($periodCompletedOrders > 0 && $periodRevenue > 0) {
            $averageTransaction = round($periodRevenue / $periodCompletedOrders);
        } elseif ($totalCompletedOrdersAllTime > 0) {
            $averageTransaction = round($totalRevenueAllTime / $totalCompletedOrdersAllTime);
        }

        // 4. Metric: Total Biaya (Estimasi Biaya Operasional / HPP ~53% dari pendapatan)
        $totalCost = round($periodRevenue * 0.53);

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
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('payment_method')
            ->get();

        $grandTotalPayments = (float) $paymentData->sum('total_amount');
        if ($grandTotalPayments === 0.0 && $periodRevenue > 0) {
            $grandTotalPayments = $periodRevenue;
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

        // 7. Tabel Pesanan Terbaru (Filter sesuai tanggal, fallback ke semua pesanan jika kosong)
        $recentOrdersQuery = order::with(['table', 'orderItems.menu', 'payment'])
            ->whereBetween('created_at', [$startDate, $endDate]);

        if ($recentOrdersQuery->count() === 0) {
            $recentOrdersQuery = order::with(['table', 'orderItems.menu', 'payment']);
        }

        $recentOrders = $recentOrdersQuery->latest()
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

        return inertia('Pendapatan', [
            'metrics' => [
                'today_revenue' => $periodRevenue,
                'revenue_growth' => $revenueGrowth,
                'today_orders' => $periodCompletedOrders,
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
            'currentFilter' => $filter,
            'dateRangeLabel' => $dateRangeLabel,
            'startDate' => $startDate->toDateString(),
            'endDate' => $endDate->toDateString(),
        ]);
    }
}
