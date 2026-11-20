<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewOrderPlaced implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Order $order)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('orders'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'OrderPlaced';
    }

    public function broadcastWith(): array
    {
        $tableNum = $this->order->table?->table_number ?? '01';
        if (is_numeric($tableNum) && (int) $tableNum < 10) {
            $tableNum = '0' . (int) $tableNum;
        }

        return [
            'id' => $this->order->id,
            'customer_name' => $this->order->customer_name ?: 'Pelanggan #' . $this->order->id,
            'table_number' => (string) $tableNum,
            'total_price' => (float) $this->order->total_price,
            'status' => $this->order->order_status,
            'created_at' => $this->order->created_at?->toISOString(),
        ];
    }
}
