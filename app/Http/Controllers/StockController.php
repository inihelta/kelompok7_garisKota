<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\StockCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stocks = Stock::with('stockCategory')
            ->orderBy('id', 'asc')
            ->paginate(8)
            ->withQueryString()
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'stock_category_id' => $item->stock_category_id,
                    'name' => $item->name,
                    'sku' => $item->sku,
                    'category' => $item->stockCategory ? $item->stockCategory->name : 'Lainnya',
                    'stock' => (float) $item->stock,
                    'unit' => $item->unit,
                    'min_stock' => (float) $item->min_stock,
                    'est_daily' => (float) $item->est_daily,
                    'status' => $item->status,
                    'icon_type' => $item->stockCategory ? ($item->stockCategory->icon ?? 'package') : 'package',
                ];
            });

        $dbCategories = StockCategory::withCount('stocks')->get();
        if ($dbCategories->isEmpty()) {
            $categoriesData = [
                ['id' => 1, 'name' => 'Biji Kopi & Bubuk', 'icon' => 'coffee', 'stocks_count' => 1],
                ['id' => 2, 'name' => 'Susu & Dairy', 'icon' => 'milk', 'stocks_count' => 2],
                ['id' => 3, 'name' => 'Sirup & Topping', 'icon' => 'droplet', 'stocks_count' => 3],
                ['id' => 4, 'name' => 'Packaging & Cup', 'icon' => 'cup', 'stocks_count' => 1],
                ['id' => 5, 'name' => 'Bahan Makanan', 'icon' => 'food', 'stocks_count' => 1],
            ];
            $categoryNames = [
                'Semua Kategori',
                'Biji Kopi & Bubuk',
                'Susu & Dairy',
                'Sirup & Topping',
                'Packaging & Cup',
                'Bahan Makanan',
            ];
        } else {
            $categoriesData = $dbCategories->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'icon' => $c->icon ?? 'package',
                'stocks_count' => $c->stocks_count ?? 0,
            ])->toArray();
            $categoryNames = array_merge(['Semua Kategori'], $dbCategories->pluck('name')->toArray());
        }

        return inertia('Stok', [
            'auth' => Auth::user(),
            'stockItems' => $stocks,
            'categories' => $categoryNames,
            'categoryList' => $categoriesData,
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
        $validated = $request->validate([
            'stock_category_id' => 'required|exists:stock_categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:stocks,sku',
            'stock' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'min_stock' => 'required|numeric|min:0',
            'est_daily' => 'nullable|numeric|min:0',
        ]);

        Stock::create($validated);

        return redirect()->route('dashboard.stok')->with('success', 'Bahan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Stock $stock)
    {
        return response()->json($stock->load('stockCategory'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stock $stock)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stock $stock)
    {
        $validated = $request->validate([
            'stock_category_id' => 'sometimes|exists:stock_categories,id',
            'name' => 'sometimes|string|max:255',
            'sku' => 'sometimes|string|unique:stocks,sku,' . $stock->id,
            'stock' => 'required|numeric|min:0',
            'unit' => 'sometimes|string|max:50',
            'min_stock' => 'nullable|numeric|min:0',
            'est_daily' => 'nullable|numeric|min:0',
        ]);

        $stock->update($validated);

        return redirect()->back()->with('success', 'Stok bahan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        $stock->delete();

        return redirect()->back()->with('success', 'Bahan berhasil dihapus.');
    }
}
