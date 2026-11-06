<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class orderItem extends Model
{
    protected $table = 'order_items';

    protected $fillable = [
        'order_id',
        'menu_id',
        'quantity',
        'unit_price',
        'notes',
    ];

    public function order()
    {
        return $this->belongsTo(order::class);
    }

    public function menu()
    {
        return $this->belongsTo(menu::class);
    }
}
