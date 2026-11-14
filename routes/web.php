<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\StockCategoryController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\CustomerOrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Homepage');
})->name('home');



// Public Customer Ordering Routes (QR Table Scan)
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/order/{token}', [CustomerOrderController::class, 'show'])->name('order.show');
    Route::get('/order/status/{order}', [CustomerOrderController::class, 'status'])->name('order.status');
});
Route::post('/order', [CustomerOrderController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('order.store');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware(['auth', 'prevent-back-history'])->group(function () {
    Route::get('/dashboard/menu', [MenuController::class, 'index'])->name('dashboard.menu');
    Route::get('/dashboard/pesanan', [OrderController::class, 'index'])->name('dashboard.pesanan');
    Route::put('/orders/{order}/complete', [OrderController::class, 'complete'])->name('orders.complete');
    Route::put('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::get('/dashboard/pendapatan', [IncomeController::class, 'index'])->name('dashboard.pendapatan');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/meja', [TableController::class, 'index'])->name('dashboard.meja');
    Route::get('/dashboard/stok', [StockController::class, 'index'])->name('dashboard.stok');

    Route::post('/menus', [MenuController::class, 'store'])->name('menus.store');
    Route::match(['put', 'post'], '/menus/{menu}', [MenuController::class, 'update'])->name('menus.update');
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy');

    Route::resource('stocks', StockController::class)->except(['create', 'edit']);
    Route::resource('stock-categories', StockCategoryController::class)->except(['create', 'edit']);
    Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);

    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
});
