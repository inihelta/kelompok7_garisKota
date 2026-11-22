<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return redirect()->route('dashboard.menu');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        Category::create($validated);

        return redirect()->back()->with('success', 'Kategori menu berhasil ditambahkan.');
    }

    public function update(Request $request, $category)
    {
        $cat = $category instanceof Category ? $category : Category::findOrFail($category);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $cat->id,
        ]);

        $cat->update($validated);

        return redirect()->back()->with('success', 'Kategori menu berhasil diperbarui.');
    }

    public function destroy(Request $request, $category)
    {
        $cat = $category instanceof Category ? $category : Category::findOrFail($category);

        $cat->delete();

        return redirect()->back()->with('success', 'Kategori menu berhasil dihapus.');
    }
}
