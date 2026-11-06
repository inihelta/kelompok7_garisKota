<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class payment extends Model
{
    protected $table = 'payments';

    protected $fillable = [
        'order_id',
        'payment_method',
        'payment_amount',
        'payment_status',
        'transaction_ref',
    ];

    public function order()
    {
        return $this->belongsTo(order::class);
    }
}

