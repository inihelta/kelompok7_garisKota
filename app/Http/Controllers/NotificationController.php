<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use Illuminate\Http\Request;
use Carbon\Carbon;

class NotificationController extends Controller
{
    /**
     * Get recent notifications and counts (JSON API for Header dropdown).
     */
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'all'); // all, unread, order, stock
        $limit = (int) $request->query('limit', 15);

        $query = AppNotification::query()->latest('created_at');

        if ($tab === 'unread') {
            $query->unread();
        } elseif ($tab === 'order') {
            $query->ofType('order');
        } elseif ($tab === 'stock') {
            $query->ofType('stock');
        } elseif ($tab === 'changes') {
            $query->whereIn('category', [
                'order_processing',
                'order_ready',
                'order_cancelled',
                'order_change',
                'stock_update',
                'table_update',
                'menu_update',
            ]);
        }

        $notifications = $query->take($limit)->get()->map(function ($n) {
            return [
                'id' => $n->id,
                'type' => $n->type,
                'category' => $n->category,
                'title' => $n->title,
                'message' => $n->message,
                'tag' => $n->tag,
                'action_url' => $n->action_url,
                'reference_id' => $n->reference_id,
                'is_read' => (bool) $n->is_read,
                'created_at' => $n->created_at?->toISOString(),
                'time_ago' => $n->created_at
                    ? Carbon::parse($n->created_at)->locale('id')->diffForHumans(null, true) . ' lalu'
                    : 'baru saja',
            ];
        });

        $unreadCount = AppNotification::unread()->count();
        $orderCount = AppNotification::ofType('order')->count();
        $stockCount = AppNotification::ofType('stock')->count();
        $changesCount = AppNotification::whereIn('category', [
            'order_processing',
            'order_ready',
            'order_cancelled',
            'order_change',
            'stock_update',
            'table_update',
            'menu_update',
        ])->count();
        $allCount = AppNotification::count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
            'counts' => [
                'all' => $allCount,
                'unread' => $unreadCount,
                'order' => $orderCount,
                'stock' => $stockCount,
                'changes' => $changesCount,
            ],
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead($id)
    {
        $notification = AppNotification::findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'unread_count' => AppNotification::where('is_read', false)->count(),
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead()
    {
        AppNotification::where('is_read', false)->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'unread_count' => 0,
        ]);
    }

    /**
     * View all notifications (Dedicated Full Page).
     */
    public function viewAll(Request $request)
    {
        $tab = $request->query('tab', 'all');
        $search = $request->query('search', '');

        $query = AppNotification::query()->latest('created_at');

        if ($tab === 'unread') {
            $query->unread();
        } elseif ($tab === 'order') {
            $query->ofType('order');
        } elseif ($tab === 'stock') {
            $query->ofType('stock');
        } elseif ($tab === 'changes') {
            $query->whereIn('category', [
                'order_processing',
                'order_ready',
                'order_cancelled',
                'order_change',
                'stock_update',
                'table_update',
                'menu_update',
            ]);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhere('tag', 'like', "%{$search}%");
            });
        }

        $notifications = $query->paginate(12)->withQueryString()->through(function ($n) {
            return [
                'id' => $n->id,
                'type' => $n->type,
                'category' => $n->category,
                'title' => $n->title,
                'message' => $n->message,
                'tag' => $n->tag,
                'action_url' => $n->action_url,
                'reference_id' => $n->reference_id,
                'is_read' => (bool) $n->is_read,
                'created_at' => $n->created_at?->toISOString(),
                'time_ago' => $n->created_at
                    ? Carbon::parse($n->created_at)->locale('id')->diffForHumans(null, true) . ' lalu'
                    : 'baru saja',
            ];
        });

        $unreadCount = AppNotification::unread()->count();
        $changesCount = AppNotification::whereIn('category', [
            'order_processing',
            'order_ready',
            'order_cancelled',
            'order_change',
            'stock_update',
            'table_update',
            'menu_update',
        ])->count();

        return inertia('Notifikasi', [
            'notifications' => $notifications,
            'currentTab' => $tab,
            'searchQuery' => $search,
            'unreadCount' => $unreadCount,
            'counts' => [
                'all' => AppNotification::count(),
                'unread' => $unreadCount,
                'order' => AppNotification::ofType('order')->count(),
                'stock' => AppNotification::ofType('stock')->count(),
                'changes' => $changesCount,
            ],
        ]);
    }
}
