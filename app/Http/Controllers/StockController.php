<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\StockCategory;
use Illuminate\Http\Request;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stocks = Stock::with('stockCategory')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'sku' => $item->sku,
                'category' => $item->stockCategory ? $item->stockCategory->name : 'Lainnya',
                'stock' => (float) $item->stock,
                'unit' => $item->unit,
                'min_stock' => (float) $item->min_stock,
                'est_daily' => (float) $item->est_daily,
                'status' => $item->status,
                'icon_type' => $item->icon_type ?? 'package',
            ];
        });

        $categories = ['Semua Kategori'];
        $dbCategories = StockCategory::pluck('name')->toArray();
        if (!empty($dbCategories)) {
            $categories = array_merge($categories, $dbCategories);
        } else {
            $categories = [
                'Semua Kategori',
                'Biji Kopi & Bubuk',
                'Susu & Dairy',
                'Sirup & Topping',
                'Packaging & Cup',
                'Bahan Makanan',
            ];
        }

        return inertia('Stok', [
            'stockItems' => $stocks,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stock $stock)
    {
        $validated = $request->validate([
            'stock' => 'required|numeric|min:0',
            'min_stock' => 'nullable|numeric|min:0',
        ]);

        $stock->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        $stock->delete();

        return redirect()->back();
    }
}

