<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppNotification extends Model
{
    protected $table = 'app_notifications';

    protected $fillable = [
        'type',
        'category',
        'title',
        'message',
        'tag',
        'action_url',
        'reference_id',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'reference_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
