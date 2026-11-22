<?php

namespace Tests\Feature;

use App\Models\Stock;
use App\Models\StockCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_stok_page_loads(): void
    {
        $response = $this->actingAs($this->user)->get('/dashboard/stok');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Stok'));
    }

    public function test_create_stock_item(): void
    {
        $category = StockCategory::create(['name' => 'Bahan', 'icon' => 'food']);

        $response = $this->actingAs($this->user)->post('/stocks', [
            'stock_category_id' => $category->id,
            'name' => 'Susu Oat',
            'sku' => 'SUSU-OAT-001',
            'stock' => 5,
            'unit' => 'Liter',
            'min_stock' => 1,
            'est_daily' => 2,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('stocks', ['name' => 'Susu Oat', 'sku' => 'SUSU-OAT-001']);
    }

    public function test_create_stock_validates_required_fields(): void
    {
        $response = $this->actingAs($this->user)->post('/stocks', []);
        $response->assertSessionHasErrors(['stock_category_id', 'name', 'sku', 'stock', 'unit', 'min_stock']);
    }

    public function test_update_stock(): void
    {
        $category = StockCategory::create(['name' => 'Bahan', 'icon' => 'food']);
        $stock = Stock::create([
            'stock_category_id' => $category->id,
            'name' => 'Susu Oat',
            'sku' => 'SUSU-OAT-001',
            'stock' => 5,
            'unit' => 'Liter',
            'min_stock' => 1,
        ]);

        $response = $this->actingAs($this->user)->put("/stocks/{$stock->id}", [
            'stock' => 10,
            'min_stock' => 2,
        ]);

        $response->assertRedirect();
        $this->assertEquals(10, $stock->fresh()->stock);
    }

    public function test_delete_stock(): void
    {
        $category = StockCategory::create(['name' => 'Bahan', 'icon' => 'food']);
        $stock = Stock::create([
            'stock_category_id' => $category->id,
            'name' => 'Susu Oat',
            'sku' => 'SUSU-OAT-001',
            'stock' => 5,
            'unit' => 'Liter',
            'min_stock' => 1,
        ]);

        $response = $this->actingAs($this->user)->delete("/stocks/{$stock->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('stocks', ['id' => $stock->id]);
    }
}