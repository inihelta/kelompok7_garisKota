<?php

namespace App\Events;

use App\Models\AppNotification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class NotificationCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public AppNotification $notification)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('notifications'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'NotificationCreated';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->notification->id,
            'type' => $this->notification->type,
            'category' => $this->notification->category,
            'title' => $this->notification->title,
            'message' => $this->notification->message,
            'tag' => $this->notification->tag,
            'action_url' => $this->notification->action_url,
            'reference_id' => $this->notification->reference_id,
            'is_read' => (bool) $this->notification->is_read,
            'created_at' => $this->notification->created_at?->toISOString(),
            'time_ago' => $this->notification->created_at
                ? Carbon::parse($this->notification->created_at)->locale('id')->diffForHumans(null, true) . ' lalu'
                : 'baru saja',
        ];
    }
}
