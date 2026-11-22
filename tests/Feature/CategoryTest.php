<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_create_category(): void
    {
        $response = $this->actingAs($this->user)->post('/categories', [
            'name' => 'Minuman',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', ['name' => 'Minuman']);
    }

    public function test_create_category_validates_name_required(): void
    {
        $response = $this->actingAs($this->user)->post('/categories', []);
        $response->assertSessionHasErrors('name');
    }

    public function test_create_category_validates_unique_name(): void
    {
        Category::create(['name' => 'Minuman']);

        $response = $this->actingAs($this->user)->post('/categories', [
            'name' => 'Minuman',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_update_category(): void
    {
        $category = Category::create(['name' => 'Minuman']);

        $response = $this->actingAs($this->user)->put("/categories/{$category->id}", [
            'name' => 'Minuman Baru',
        ]);

        $response->assertRedirect();
        $this->assertEquals('Minuman Baru', $category->fresh()->name);
    }

    public function test_update_category_validates_unique_name(): void
    {
        Category::create(['name' => 'Minuman']);
        $category = Category::create(['name' => 'Makanan']);

        $response = $this->actingAs($this->user)->put("/categories/{$category->id}", [
            'name' => 'Minuman',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_delete_category(): void
    {
        $category = Category::create(['name' => 'Minuman']);

        $response = $this->actingAs($this->user)->delete("/categories/{$category->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_guest_cannot_create_category(): void
    {
        $response = $this->post('/categories', ['name' => 'Minuman']);
        $response->assertRedirect('/login');
    }
}