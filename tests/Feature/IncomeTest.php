<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IncomeTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_pendapatan_page_loads(): void
    {
        $response = $this->actingAs($this->user)->get('/dashboard/pendapatan');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Pendapatan'));
    }

    public function test_pendapatan_shows_metrics(): void
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

        Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'cash',
            'payment_amount' => 25000,
            'payment_status' => 'done',
        ]);

        $response = $this->actingAs($this->user)->get('/dashboard/pendapatan');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('metrics')
            ->has('performance')
            ->has('paymentSources')
            ->has('recentOrders')
        );
    }

    public function test_pendapatan_with_date_filter(): void
    {
        $response = $this->actingAs($this->user)->get('/dashboard/pendapatan?filter=7days');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->where('currentFilter', '7days')
        );
    }

    public function test_pendapatan_with_custom_date_range(): void
    {
        $response = $this->actingAs($this->user)->get('/dashboard/pendapatan?start_date=2026-01-01&end_date=2026-01-31');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->where('currentFilter', 'custom')
        );
    }

    public function test_guest_cannot_access_pendapatan(): void
    {
        $response = $this->get('/dashboard/pendapatan');
        $response->assertRedirect('/login');
    }
}