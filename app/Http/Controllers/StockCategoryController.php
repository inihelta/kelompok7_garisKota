<?php

namespace App\Http\Controllers;

use App\Models\StockCategory;
use Illuminate\Http\Request;

class StockCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(StockCategory::withCount('stocks')->get());
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
            'name' => 'required|string|max:100|unique:stock_categories,name',
            'icon' => 'nullable|in:coffee,milk,droplet,cup,food,package',
        ]);

        StockCategory::create($validated);

        return redirect()->back()->with('success', 'Kategori bahan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StockCategory $stockCategory)
    {
        return response()->json($stockCategory);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockCategory $stockCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockCategory $stockCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:stock_categories,name,' . $stockCategory->id,
            'icon' => 'nullable|in:coffee,milk,droplet,cup,food,package',
        ]);

        $stockCategory->update($validated);

        return redirect()->back()->with('success', 'Kategori bahan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockCategory $stockCategory)
    {
        $stockCategory->delete();

        return redirect()->back()->with('success', 'Kategori bahan berhasil dihapus.');
    }
}
