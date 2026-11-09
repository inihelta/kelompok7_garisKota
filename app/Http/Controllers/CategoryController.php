<?php

namespace App\Http\Controllers;

use App\Models\category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        category::create($validated);

        return redirect()->back()->with('success', 'Kategori menu berhasil ditambahkan.');
    }

    public function update(Request $request, category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Kategori menu berhasil diperbarui.');
    }

    public function destroy(category $category)
    {
        $category->delete();

        return redirect()->back()->with('success', 'Kategori menu berhasil dihapus.');
    }
}
