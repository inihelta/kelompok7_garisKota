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
                'table_number' => (int) $t->table_number,
                'capacity' => (int) $t->capacity,
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_number' => 'required|integer|min:1|unique:tables,table_number',
            'capacity' => 'required|integer|min:1|max:50',
            'available' => 'required|boolean',
            'location' => 'required|in:indoor,outdoor',
        ], [
            'table_number.required' => 'Nomor meja wajib diisi.',
            'table_number.unique' => 'Nomor meja sudah terdaftar.',
            'table_number.integer' => 'Nomor meja harus berupa angka.',
            'capacity.required' => 'Kapasitas kursi wajib diisi.',
            'capacity.min' => 'Kapasitas kursi minimal 1 orang.',
            'location.required' => 'Area / lokasi wajib dipilih.',
            'location.in' => 'Lokasi harus indoor atau outdoor.',
        ]);

        Table::create($validated);

        return redirect()->route('dashboard.meja')->with('success', 'Meja baru berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $table)
    {
        $tableModel = $table instanceof Table ? $table : Table::findOrFail($table);

        $validated = $request->validate([
            'table_number' => 'required|integer|min:1|unique:tables,table_number,' . $tableModel->id,
            'capacity' => 'required|integer|min:1|max:50',
            'available' => 'required|boolean',
            'location' => 'required|in:indoor,outdoor',
        ], [
            'table_number.required' => 'Nomor meja wajib diisi.',
            'table_number.unique' => 'Nomor meja sudah terdaftar.',
            'table_number.integer' => 'Nomor meja harus berupa angka.',
            'capacity.required' => 'Kapasitas kursi wajib diisi.',
            'capacity.min' => 'Kapasitas kursi minimal 1 orang.',
            'location.required' => 'Area / lokasi wajib dipilih.',
            'location.in' => 'Lokasi harus indoor atau outdoor.',
        ]);

        $tableModel->update($validated);

        return redirect()->route('dashboard.meja')->with('success', 'Data meja berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $table)
    {
        $tableModel = $table instanceof Table ? $table : Table::findOrFail($table);

        $hasActiveOrders = $tableModel->orders()
            ->whereIn('order_status', ['pending', 'processing'])
            ->exists();

        if ($hasActiveOrders) {
            return redirect()->back()->withErrors([
                'error' => 'Meja tidak dapat dihapus karena masih memiliki pesanan aktif.',
            ]);
        }

        $tableModel->delete();

        return redirect()->route('dashboard.meja')->with('success', 'Meja berhasil dihapus.');
    }
}
