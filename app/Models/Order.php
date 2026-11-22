<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'table_id',
        'customer_name',
        'order_type',
        'total_price',
        'order_status',
    ];

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
