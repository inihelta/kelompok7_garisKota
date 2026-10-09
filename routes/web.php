<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [MenuController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/pesanan', function () {
        return Inertia::render('Pesanan');
    })->name('dashboard.pesanan');
    Route::get('/dashboard/pendapatan', function () {
        return Inertia::render('Pendapatan');
    })->name('dashboard.pendapatan');
    Route::get('/dashboard/menu', function () {
        return Inertia::render('Menu');
    })->name('dashboard.menu');
    Route::get('/dashboard/stok', function () {
        return Inertia::render('Stok');
    })->name('dashboard.stok');


    Route::post('/menus', [MenuController::class, 'store'])->name('menus.store');
    Route::match(['put', 'post'], '/menus/{menu}', [MenuController::class, 'update'])->name('menus.update');
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy');

    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
});
