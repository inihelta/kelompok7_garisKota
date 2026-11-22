<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class MenuTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->category = Category::create(['name' => 'Minuman']);
    }

    public function test_menu_page_loads(): void
    {
        $response = $this->actingAs($this->user)->get('/dashboard/menu');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Menu'));
    }

    public function test_create_menu(): void
    {
        $response = $this->actingAs($this->user)->post('/menus', [
            'name' => 'Kopi Susu',
            'category_id' => $this->category->id,
            'price' => 25000,
            'stock' => 10,
            'description' => 'Kopi susu enak',
            'status' => 'tersedia',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('menus', ['name' => 'Kopi Susu', 'price' => 25000]);
    }

    public function test_create_menu_validates_required_fields(): void
    {
        $response = $this->actingAs($this->user)->post('/menus', []);
        $response->assertSessionHasErrors(['name', 'category_id', 'price', 'stock', 'status']);
    }

    public function test_create_menu_validates_status_enum(): void
    {
        $response = $this->actingAs($this->user)->post('/menus', [
            'name' => 'Kopi',
            'category_id' => $this->category->id,
            'price' => 25000,
            'stock' => 10,
            'status' => 'invalid-status',
        ]);

        $response->assertSessionHasErrors('status');
    }

    public function test_update_menu(): void
    {
        $menu = Menu::create([
            'category_id' => $this->category->id,
            'name' => 'Kopi',
            'price' => 25000,
            'stock' => 10,
            'status' => 'tersedia',
        ]);

        $response = $this->actingAs($this->user)->put("/menus/{$menu->id}", [
            'name' => 'Kopi Baru',
            'category_id' => $this->category->id,
            'price' => 30000,
            'stock' => 15,
            'status' => 'tersedia',
        ]);

        $response->assertRedirect();
        $this->assertEquals('Kopi Baru', $menu->fresh()->name);
        $this->assertEquals(30000, $menu->fresh()->price);
    }

    public function test_update_menu_with_image_upload(): void
    {
        $menu = Menu::create([
            'category_id' => $this->category->id,
            'name' => 'Kopi',
            'price' => 25000,
            'stock' => 10,
            'status' => 'tersedia',
        ]);

        $image = UploadedFile::fake()->image('menu.jpg', 500, 500);

        $response = $this->actingAs($this->user)->put("/menus/{$menu->id}", [
            'name' => 'Kopi',
            'category_id' => $this->category->id,
            'price' => 25000,
            'stock' => 10,
            'status' => 'tersedia',
            'image' => $image,
        ]);

        $response->assertRedirect();
        $this->assertNotNull($menu->fresh()->image);
    }

    public function test_delete_menu(): void
    {
        $menu = Menu::create([
            'category_id' => $this->category->id,
            'name' => 'Kopi',
            'price' => 25000,
            'stock' => 10,
            'status' => 'tersedia',
        ]);

        $response = $this->actingAs($this->user)->delete("/menus/{$menu->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('menus', ['id' => $menu->id]);
    }

    public function test_guest_cannot_access_menu(): void
    {
        $response = $this->get('/dashboard/menu');
        $response->assertRedirect('/login');
    }
}