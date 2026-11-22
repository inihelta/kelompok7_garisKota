<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Stock;
use App\Models\StockCategory;
use App\Models\Table;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_belongs_to_table(): void
    {
        $table = Table::create(['table_number' => 5, 'capacity' => 4, 'available' => true, 'location' => 'indoor']);
        $order = Order::create([
            'table_id' => $table->id,
            'customer_name' => 'Budi',
            'order_type' => 'dine-in',
            'total_price' => 25000,
            'order_status' => 'pending',
        ]);

        $this->assertEquals($table->id, $order->table->id);
    }

    public function test_order_has_many_order_items(): void
    {
        $table = Table::create(['table_number' => 5, 'capacity' => 4, 'available' => true, 'location' => 'indoor']);
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
            'order_status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'menu_id' => $menu->id,
            'quantity' => 1,
            'unit_price' => 25000,
        ]);

        $this->assertEquals(1, $order->orderItems->count());
    }

    public function test_order_has_one_payment(): void
    {
        $table = Table::create(['table_number' => 5, 'capacity' => 4, 'available' => true, 'location' => 'indoor']);
        $order = Order::create([
            'table_id' => $table->id,
            'customer_name' => 'Budi',
            'order_type' => 'dine-in',
            'total_price' => 25000,
            'order_status' => 'pending',
        ]);

        Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'cash',
            'payment_amount' => 25000,
            'payment_status' => 'pending',
        ]);

        $this->assertNotNull($order->payment);
    }

    public function test_menu_belongs_to_category(): void
    {
        $category = Category::create(['name' => 'Minuman']);
        $menu = Menu::create([
            'category_id' => $category->id,
            'name' => 'Kopi',
            'price' => 25000,
            'stock' => 10,
            'status' => 'tersedia',
        ]);

        $this->assertEquals($category->id, $menu->category->id);
    }

    public function test_table_has_many_orders(): void
    {
        $table = Table::create(['table_number' => 5, 'capacity' => 4, 'available' => true, 'location' => 'indoor']);
        Order::create([
            'table_id' => $table->id,
            'customer_name' => 'Budi',
            'order_type' => 'dine-in',
            'total_price' => 25000,
            'order_status' => 'pending',
        ]);

        $this->assertEquals(1, $table->orders->count());
    }

    public function test_stock_status_attribute(): void
    {
        $category = StockCategory::create(['name' => 'Bahan', 'icon' => 'food']);
        $stock = Stock::create([
            'stock_category_id' => $category->id,
            'name' => 'Susu',
            'sku' => 'SUSU-001',
            'stock' => 1,
            'unit' => 'Liter',
            'min_stock' => 5,
        ]);

        $this->assertEquals('Menipis', $stock->status);
    }

    public function test_stock_category_has_many_stocks(): void
    {
        $category = StockCategory::create(['name' => 'Bahan', 'icon' => 'food']);
        Stock::create([
            'stock_category_id' => $category->id,
            'name' => 'Susu',
            'sku' => 'SUSU-001',
            'stock' => 10,
            'unit' => 'Liter',
            'min_stock' => 5,
        ]);

        $this->assertEquals(1, $category->stocks->count());
    }

    public function test_category_has_many_menus(): void
    {
        $category = Category::create(['name' => 'Minuman']);
        Menu::create([
            'category_id' => $category->id,
            'name' => 'Kopi',
            'price' => 25000,
            'stock' => 10,
            'status' => 'tersedia',
        ]);

        $this->assertEquals(1, $category->menus->count());
    }
}