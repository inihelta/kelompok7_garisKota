<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class category extends Model
{
    protected $fillable = [
        'name',
    ];

    public function menus()
    {
        return $this->hasMany(menu::class);
    }
}
