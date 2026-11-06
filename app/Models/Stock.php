<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table = 'stocks';

    protected $fillable = [
        'stock_category_id',
        'name',
        'sku',
        'stock',
        'unit',
        'min_stock',
        'est_daily',
        'icon_type',
    ];

    protected $casts = [
        'stock' => 'float',
        'min_stock' => 'float',
        'est_daily' => 'float',
    ];

    public function stockCategory()
    {
        return $this->belongsTo(StockCategory::class, 'stock_category_id');
    }

    public function getStatusAttribute(): string
    {
        return $this->stock <= $this->min_stock ? 'Menipis' : 'Aman';
    }
}

