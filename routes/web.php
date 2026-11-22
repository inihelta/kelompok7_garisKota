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
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Homepage');
})->name('home');



// Public Customer Ordering Routes (QR Table Scan)
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/order/status/{order}', [CustomerOrderController::class, 'status'])->name('order.status');
    Route::put('/order/{order}/cancel', [CustomerOrderController::class, 'cancel'])->name('order.cancel');
    Route::get('/order/{token}', [CustomerOrderController::class, 'show'])
        ->where('token', '[a-zA-Z0-9\-]+')
        ->name('order.show');
});
Route::post('/order', [CustomerOrderController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('order.store');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware(['auth', 'prevent-back-history', 'throttle:60,1'])->group(function () {
    Route::get('/dashboard/menu', [MenuController::class, 'index'])->name('dashboard.menu');
    Route::get('/dashboard/pesanan', [OrderController::class, 'index'])->name('dashboard.pesanan');
    Route::put('/orders/{order}/process', [OrderController::class, 'process'])->name('orders.process');
    Route::put('/orders/{order}/complete', [OrderController::class, 'complete'])->name('orders.complete');
    Route::put('/orders/{order}/confirm-payment', [OrderController::class, 'confirmPayment'])->name('orders.confirmPayment');
    Route::put('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::get('/dashboard/pendapatan', [IncomeController::class, 'index'])->name('dashboard.pendapatan');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/meja', [TableController::class, 'index'])->name('dashboard.meja');
    Route::post('/tables', [TableController::class, 'store'])->name('tables.store');
    Route::match(['put', 'post'], '/tables/{table}', [TableController::class, 'update'])->name('tables.update');
    Route::delete('/tables/{table}', [TableController::class, 'destroy'])->name('tables.destroy');
    Route::get('/dashboard/stok', [StockController::class, 'index'])->name('dashboard.stok');
    Route::get('/dashboard/notifikasi', [NotificationController::class, 'viewAll'])->name('dashboard.notifikasi');
    Route::get('/api/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::match(['put', 'post'], '/api/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::match(['put', 'post'], '/api/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');

    Route::post('/menus', [MenuController::class, 'store'])->name('menus.store');
    Route::match(['put', 'post'], '/menus/{menu}', [MenuController::class, 'update'])->name('menus.update');
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy');

    Route::resource('stocks', StockController::class)->except(['create', 'edit']);
    Route::resource('stock-categories', StockCategoryController::class)->except(['create', 'edit']);
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::match(['put', 'post'], '/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
});
