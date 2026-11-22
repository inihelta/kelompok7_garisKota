<?php

namespace App\Console\Commands;

use App\Services\PerformanceChart;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class CachePerformanceData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'performance:cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cache 7-day and 30-day performance chart data';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Caching performance data...');

        $days7 = PerformanceChart::build(7);
        $days30 = PerformanceChart::build(30);

        Cache::forever('performance.days7', $days7);
        Cache::forever('performance.days30', $days30);

        $this->info('Cached 7-day performance: ' . count($days7) . ' entries');
        $this->info('Cached 30-day performance: ' . count($days30) . ' entries');

        return self::SUCCESS;
    }
}
