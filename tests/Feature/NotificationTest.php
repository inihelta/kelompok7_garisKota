<?php

namespace Tests\Feature;

use App\Models\AppNotification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    private function createNotification(array $overrides = []): AppNotification
    {
        return AppNotification::create(array_merge([
            'type' => 'order',
            'category' => 'new_order',
            'title' => 'Pesanan Baru',
            'message' => 'Pesanan #1 dari Meja 5',
            'is_read' => false,
        ], $overrides));
    }

    public function test_index_returns_notifications(): void
    {
        $this->createNotification();

        $response = $this->actingAs($this->user)->get('/api/notifications');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'notifications',
            'unread_count',
            'counts' => ['all', 'unread', 'order', 'stock'],
        ]);
    }

    public function test_index_filters_unread(): void
    {
        $this->createNotification(['is_read' => false]);
        $this->createNotification(['is_read' => true]);

        $response = $this->actingAs($this->user)->get('/api/notifications?tab=unread');

        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('unread_count'));
    }

    public function test_index_filters_by_type(): void
    {
        $this->createNotification(['type' => 'order']);
        $this->createNotification(['type' => 'stock', 'category' => 'stock_low']);

        $response = $this->actingAs($this->user)->get('/api/notifications?tab=stock');

        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('counts.stock'));
    }

    public function test_mark_as_read(): void
    {
        $notification = $this->createNotification();

        $response = $this->actingAs($this->user)->put("/api/notifications/{$notification->id}/read");

        $response->assertStatus(200);
        $this->assertTrue($notification->fresh()->is_read);
    }

    public function test_mark_all_as_read(): void
    {
        $this->createNotification(['is_read' => false]);
        $this->createNotification(['is_read' => false]);

        $response = $this->actingAs($this->user)->put('/api/notifications/mark-all-read');

        $response->assertStatus(200);
        $this->assertEquals(0, AppNotification::unread()->count());
    }

    public function test_view_all_page_loads(): void
    {
        $this->createNotification();

        $response = $this->actingAs($this->user)->get('/dashboard/notifikasi');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Notifikasi'));
    }

    public function test_view_all_with_search(): void
    {
        $this->createNotification(['title' => 'Pesanan Baru', 'message' => 'Pesanan #1 dari Meja 5']);
        $this->createNotification(['title' => 'Stok Menipis', 'message' => 'Stok Kopi hampir habis']);

        $response = $this->actingAs($this->user)->get('/dashboard/notifikasi?search=Pesanan');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->where('searchQuery', 'Pesanan')
            ->has('notifications.data', 1)
        );
    }

    public function test_guest_cannot_access_notifications(): void
    {
        $response = $this->get('/api/notifications');
        $response->assertRedirect('/login');
    }
}