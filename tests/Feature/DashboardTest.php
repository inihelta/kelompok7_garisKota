<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_dashboard_page_loads(): void
    {
        $response = $this->actingAs($this->user)->get('/dashboard');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Dashboard'));
    }

    public function test_dashboard_shows_metrics(): void
    {
        $table = Table::create([
            'table_number' => 5,
            'capacity' => 4,
            'available' => true,
            'location' => 'indoor',
        ]);

        $category = Category::create(['name' => 'Minuman']);
        $menu = Menu::create([
            'category_id' => $category->id,
            'name' => 'Kopi',
            'price' => 25000,
            'stock' => 10,
            'status' => 'tersedia',
        ]);

        $order = Order::create([
            'table_id' => $table->id,
            'customer_name' => 'Budi',
            'order_type' => 'dine-in',
            'total_price' => 25000,
            'order_status' => 'completed',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'menu_id' => $menu->id,
            'quantity' => 1,
            'unit_price' => 25000,
        ]);

        $response = $this->actingAs($this->user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('metrics')
            ->has('performance')
            ->has('topSelling')
            ->has('recentOrders')
        );
    }

    public function test_dashboard_performance_chart_shape(): void
    {
        $response = $this->actingAs($this->user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(function ($page) {
            $seven = $page->toArray()['props']['performance']['days7'];
            $thirty = $page->toArray()['props']['performance']['days30'];

            // Jumlah entri tetap 7 & 30, termasuk hari tanpa pesanan
            $this->assertCount(7, $seven, 'days7 harus punya 7 entri');
            $this->assertCount(30, $thirty, 'days30 harus punya 30 entri');

            // Hari kosong harus 0, bukan null/kosong
            // (0.0 float jadi 0 setelah serialisasi JSON — sama seperti versi lama)
            $this->assertSame(0, $seven[0]['pesanan']);
            $this->assertEquals(0, $seven[0]['pendapatan']);

            // Bentuk kunci wajib sama dengan versi lama (dipakai chart)
            foreach (['day_index', 'label', 'date', 'pesanan', 'pendapatan'] as $key) {
                $this->assertArrayHasKey($key, $seven[0]);
            }

            // Entri hari ini (urutan terakhir) harus terisi
            $today = end($seven);
            $this->assertSame(6, $today['day_index']);
        });
    }

    public function test_dashboard_uses_few_queries(): void
    {
        // Chart dulu 74 query (loop per hari × 2 rentang); sekarang 2 query groupBy.
        // Batas longgar agar tidak rapuh, tapi tetap menangkap kembalinya loop per hari.
        \Illuminate\Support\Facades\DB::flushQueryLog();
        \Illuminate\Support\Facades\DB::enableQueryLog();

        $this->actingAs($this->user)->get('/dashboard')->assertStatus(200);

        $count = count(\Illuminate\Support\Facades\DB::getQueryLog());
        \Illuminate\Support\Facades\DB::disableQueryLog();

        $this->assertLessThan(
            25,
            $count,
            "Dashboard memakai {$count} query (batas 25) — kemungkinan loop per hari sudah kembali."
        );
    }

    public function test_guest_cannot_access_dashboard(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }
}