<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class menu extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'image',
        'stock',
        'status',
    ];

    public function category()
    {
        return $this->belongsTo(category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(orderItem::class);
    }
}
