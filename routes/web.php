<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\StockCategoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // return view('welcome');
    return Inertia::render('Homepage');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware(['auth', 'prevent-back-history'])->group(function () {
    Route::get('/dashboard/menu', [MenuController::class, 'index'])->name('dashboard.menu');
    Route::get('/dashboard/pesanan', function () {
        return Inertia::render('Pesanan');
    })->name('dashboard.pesanan');
    Route::get('/dashboard/pendapatan', function () {
        return Inertia::render('Pendapatan');
    })->name('dashboard.pendapatan');
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    Route::get('/dashboard/kategori', function () {
        return Inertia::render('Kategori');
    })->name('dashboard.kategori');
    Route::get('/dashboard/meja', [TableController::class, 'index'])->name('dashboard.meja');
    Route::get('/dashboard/stok', [StockController::class, 'index'])->name('dashboard.stok');

    Route::post('/menus', [MenuController::class, 'store'])->name('menus.store');
    Route::match(['put', 'post'], '/menus/{menu}', [MenuController::class, 'update'])->name('menus.update');
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy');

    Route::resource('stocks', StockController::class)->except(['create', 'edit']);
    Route::resource('stock-categories', StockCategoryController::class)->except(['create', 'edit']);

    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
});
