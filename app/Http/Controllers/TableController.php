<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tables = Table::with(['orders' => function ($query) {
            $query->whereIn('order_status', ['pending', 'processing'])
                ->with('orderItems')
                ->latest();
        }])
        ->orderBy('table_number')
        ->get()
        ->map(function ($t) {
            $activeOrder = $t->orders->first();
            $itemsCount = 0;
            if ($activeOrder) {
                $itemsCount = (int) ($activeOrder->orderItems->count() ?: 1);
            }

            return [
                'id' => $t->id,
                'table_number' => $t->table_number,
                'capacity' => $t->capacity,
                'available' => $activeOrder ? false : (bool) $t->available,
                'location' => $t->location,
                'active_order' => $activeOrder ? [
                    'id' => $activeOrder->id,
                    'items_count' => $itemsCount,
                    'order_status' => $activeOrder->order_status,
                    'customer_name' => $activeOrder->customer_name,
                ] : null,
            ];
        });

        return inertia('Meja', [
            'tables' => $tables,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(table $table)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(table $table)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, table $table)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(table $table)
    {
        //
    }
}
