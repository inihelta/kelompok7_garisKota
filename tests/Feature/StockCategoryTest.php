<?php

namespace Tests\Feature;

use App\Models\StockCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockCategoryTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_index_returns_json(): void
    {
        StockCategory::create(['name' => 'Bahan', 'icon' => 'food']);

        $response = $this->actingAs($this->user)->get('/stock-categories');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
    }

    public function test_create_stock_category(): void
    {
        $response = $this->actingAs($this->user)->post('/stock-categories', [
            'name' => 'Bahan',
            'icon' => 'coffee',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('stock_categories', ['name' => 'Bahan', 'icon' => 'coffee']);
    }

    public function test_create_stock_category_validates_unique_name(): void
    {
        StockCategory::create(['name' => 'Bahan']);

        $response = $this->actingAs($this->user)->post('/stock-categories', [
            'name' => 'Bahan',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_create_stock_category_validates_icon(): void
    {
        $response = $this->actingAs($this->user)->post('/stock-categories', [
            'name' => 'Bahan',
            'icon' => 'invalid-icon',
        ]);

        $response->assertSessionHasErrors('icon');
    }

    public function test_show_stock_category(): void
    {
        $category = StockCategory::create(['name' => 'Bahan', 'icon' => 'food']);

        $response = $this->actingAs($this->user)->get("/stock-categories/{$category->id}");

        $response->assertStatus(200);
        $response->assertJson(['name' => 'Bahan']);
    }

    public function test_update_stock_category(): void
    {
        $category = StockCategory::create(['name' => 'Bahan', 'icon' => 'food']);

        $response = $this->actingAs($this->user)->put("/stock-categories/{$category->id}", [
            'name' => 'Bahan Baru',
            'icon' => 'milk',
        ]);

        $response->assertRedirect();
        $this->assertEquals('Bahan Baru', $category->fresh()->name);
    }

    public function test_delete_stock_category(): void
    {
        $category = StockCategory::create(['name' => 'Bahan']);

        $response = $this->actingAs($this->user)->delete("/stock-categories/{$category->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('stock_categories', ['id' => $category->id]);
    }
}