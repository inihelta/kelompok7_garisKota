<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Table;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerOrderTest extends TestCase
{
    use RefreshDatabase;

    private Table $table;
    private Menu $menu;

    protected function setUp(): void
    {
        parent::setUp();

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

    public function test_order_catalog_loads_for_valid_table(): void
    {
        $token = \App\Helpers\TableToken::generate($this->table->id);

        $response = $this->get("/order/{$token}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Customer/OrderCatalog')
            ->has('table')
            ->has('menus')
        );
    }

    public function test_order_catalog_shows_invalid_for_bad_token(): void
    {
        $response = $this->get('/order/invalid-token-xyz');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Customer/OrderCatalog')
            ->where('isInvalidTable', true)
        );
    }

    public function test_store_order_creates_order_and_payment(): void
    {
        $token = \App\Helpers\TableToken::generate($this->table->id);

        $response = $this->post('/order', [
            'table_token' => $token,
            'customer_name' => 'Budi',
            'items' => [
                ['menu_id' => $this->menu->id, 'quantity' => 2, 'notes' => 'less sugar'],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('orders', [
            'table_id' => $this->table->id,
            'customer_name' => 'Budi',
            'order_status' => 'awaiting_payment',
        ]);
        $this->assertDatabaseHas('payments', [
            'payment_method' => 'cash',
            'payment_status' => 'pending',
        ]);
        // Stock should be decremented
        $this->assertEquals(8, $this->menu->fresh()->stock);
    }

    public function test_store_order_rejects_insufficient_stock(): void
    {
        $token = \App\Helpers\TableToken::generate($this->table->id);

        $response = $this->post('/order', [
            'table_token' => $token,
            'customer_name' => 'Budi',
            'items' => [
                ['menu_id' => $this->menu->id, 'quantity' => 999, 'notes' => null],
            ],
        ]);

        $response->assertSessionHasErrors();
        $this->assertEquals(10, $this->menu->fresh()->stock); // stock unchanged
    }

    public function test_order_status_accessible_with_cookie(): void
    {
        $token = \App\Helpers\TableToken::generate($this->table->id);

        $response = $this->post('/order', [
            'table_token' => $token,
            'customer_name' => 'Budi',
            'items' => [
                ['menu_id' => $this->menu->id, 'quantity' => 1, 'notes' => null],
            ],
        ]);

        // Follow redirect to status page
        $response = $this->get($response->headers->get('Location'));
        $response->assertStatus(200);
    }

    public function test_cancel_order_restores_stock(): void
    {
        $token = \App\Helpers\TableToken::generate($this->table->id);

        $this->post('/order', [
            'table_token' => $token,
            'customer_name' => 'Budi',
            'items' => [
                ['menu_id' => $this->menu->id, 'quantity' => 3, 'notes' => null],
            ],
        ]);

        $order = \App\Models\Order::first();
        $cookie = $this->app['cookie']->make('placed_orders', json_encode([$order->id]));

        $response = $this->withCookie('placed_orders', json_encode([$order->id]))
            ->put("/order/{$order->id}/cancel");

        $response->assertRedirect();
        $this->assertEquals('cancelled', $order->fresh()->order_status);
        $this->assertEquals(10, $this->menu->fresh()->stock); // stock restored
    }

    public function test_new_order_creates_notification_for_cashier(): void
    {
        $token = \App\Helpers\TableToken::generate($this->table->id);

        $this->post('/order', [
            'table_token' => $token,
            'customer_name' => 'Budi',
            'items' => [
                ['menu_id' => $this->menu->id, 'quantity' => 2, 'notes' => null],
            ],
        ]);

        $order = \App\Models\Order::first();
        $this->assertNotNull($order, 'Pesanan harus terbuat lebih dulu');

        $this->assertDatabaseHas('app_notifications', [
            'type' => 'order',
            'category' => 'new_order',
            'reference_id' => $order->id,
            'action_url' => '/dashboard/pesanan',
            'is_read' => false,
        ]);

        // Pastikan isinya memuat info meja & item, bukan template kosong
        $notification = \App\Models\AppNotification::where('reference_id', $order->id)->first();
        $this->assertStringContainsString('Meja 5', $notification->message);
        $this->assertStringContainsString('Kopi Susu', $notification->message);
    }

    public function test_customer_cancel_creates_notification_for_cashier(): void
    {
        $token = \App\Helpers\TableToken::generate($this->table->id);

        $this->post('/order', [
            'table_token' => $token,
            'customer_name' => 'Budi',
            'items' => [
                ['menu_id' => $this->menu->id, 'quantity' => 1, 'notes' => null],
            ],
        ]);

        $order = \App\Models\Order::first();

        $this->withCookie('placed_orders', json_encode([$order->id]))
            ->put("/order/{$order->id}/cancel")
            ->assertRedirect();

        $this->assertDatabaseHas('app_notifications', [
            'type' => 'order',
            'category' => 'order_cancelled',
            'reference_id' => $order->id,
        ]);
    }
}