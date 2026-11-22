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

    public function test_guest_cannot_access_dashboard(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }
}