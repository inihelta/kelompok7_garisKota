<?php

namespace Tests\Feature;

use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TableTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_meja_page_loads(): void
    {
        $response = $this->actingAs($this->user)->get('/dashboard/meja');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Meja'));
    }

    public function test_meja_page_shows_tables(): void
    {
        Table::create(['table_number' => 5, 'capacity' => 4, 'available' => true, 'location' => 'indoor']);
        Table::create(['table_number' => 6, 'capacity' => 2, 'available' => false, 'location' => 'outdoor']);

        $response = $this->actingAs($this->user)->get('/dashboard/meja');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('tables', 2)
        );
    }

    public function test_guest_cannot_access_meja(): void
    {
        $response = $this->get('/dashboard/meja');
        $response->assertRedirect('/login');
    }
}