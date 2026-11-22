<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Table $table;
    private Menu $menu;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->table = Table::create([
            'table_number' => 5,
            'capacity' => 4,
            'available' => true,
            'location' => 'indoor',
        ]);
        $category = Category::create(['name' => 'Minuman']);
        $this->menu = Menu::create([
            'category_id' => $category->id,
            'name' => 'Kopi Susu',
            'price' => 25000,
            'stock' => 10,
            'status' => 'tersedia',
        ]);
    }

    private function createOrder(string $status = 'pending'): Order
    {
        $order = Order::create([
            'table_id' => $this->table->id,
            'customer_name' => 'Budi',
            'order_type' => 'dine-in',
            'total_price' => 25000,
            'order_status' => $status,
        ]);
        OrderItem::create([
            'order_id' => $order->id,
            'menu_id' => $this->menu->id,
            'quantity' => 1,
            'unit_price' => 25000,
        ]);
        Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'cash',
            'payment_amount' => 25000,
            'payment_status' => 'pending',
        ]);
        return $order;
    }

    public function test_pesanan_page_loads_for_authenticated_user(): void
    {
        $response = $this->actingAs($this->user)->get('/dashboard/pesanan');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Pesanan'));
    }

    public function test_process_order_changes_status_to_processing(): void
    {
        $order = $this->createOrder('pending');

        $response = $this->actingAs($this->user)->put("/orders/{$order->id}/process");

        $response->assertRedirect();
        $this->assertEquals('processing', $order->fresh()->order_status);
    }

    public function test_complete_order_changes_status_and_marks_payment_done(): void
    {
        $order = $this->createOrder('processing');

        $response = $this->actingAs($this->user)->put("/orders/{$order->id}/complete");

        $response->assertRedirect();
        $this->assertEquals('completed', $order->fresh()->order_status);
        $this->assertEquals('done', $order->fresh()->payment->payment_status);
    }

    public function test_cancel_order_restores_stock(): void
    {
        $order = $this->createOrder('pending');
        $originalStock = $this->menu->fresh()->stock;

        // Decrement stock to simulate order
        $this->menu->decrement('stock', 1);

        $response = $this->actingAs($this->user)->put("/orders/{$order->id}/cancel");

        $response->assertRedirect();
        $this->assertEquals('cancelled', $order->fresh()->order_status);
        $this->assertEquals($originalStock, $this->menu->fresh()->stock);
    }

    public function test_guest_cannot_access_pesanan(): void
    {
        $response = $this->get('/dashboard/pesanan');
        $response->assertRedirect('/login');
    }
}