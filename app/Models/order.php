<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'table_id',
        'order_type',
        'total_price',
        'order_status',
    ];

    public function table()
    {
        return $this->belongsTo(table::class);
    }

    public function orderItems()
    {
        return $this->hasMany(orderItem::class);
    }

    public function items()
    {
        return $this->hasMany(orderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(payment::class);
    }
}
