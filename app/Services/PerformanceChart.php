<?php

namespace App\Services;

use App\Models\Order;
use Carbon\Carbon;

class PerformanceChart
{
    /**
     * Data chart performa N hari terakhir (termasuk hari ini).
     *
     * Dulu dijalankan per hari (2 query × N hari = 74 query untuk 7+30 hari);
     * sekarang 2 query groupBy untuk seluruh rentang. Bentuk output dijaga
     * identik dengan versi lama agar frontend & test tidak berubah.
     */
    public static function build(int $days): array
    {
        $start = Carbon::today()->subDays($days - 1)->startOfDay();
        $end = Carbon::now();

        // whereBetween (bukan whereDate) supaya index (created_at) terpakai:
        // whereDate memakai DATE() yang mematikan index.
        $orderCounts = Order::whereBetween('created_at', [$start, $end])
            ->selectRaw('date(created_at) as day, COUNT(*) as total')
            ->groupByRaw('date(created_at)')
            ->pluck('total', 'day');

        $revenues = Order::where('order_status', 'completed')
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('date(created_at) as day, SUM(total_price) as total')
            ->groupByRaw('date(created_at)')
            ->pluck('total', 'day');

        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $targetDate = Carbon::today()->subDays($i);
            $day = $targetDate->toDateString();

            $data[] = [
                'day_index' => $days - 1 - $i,
                'label' => $days === 7
                    ? (string) ($days - 1 - $i)
                    : $targetDate->format('d/m'),
                'date' => $targetDate->translatedFormat('d M'),
                'pesanan' => (int) ($orderCounts[$day] ?? 0),
                'pendapatan' => (float) ($revenues[$day] ?? 0),
            ];
        }

        return $data;
    }
}
