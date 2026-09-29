<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    });

    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
});


// Route::get('/rafly', function () {
//     return view('welcome');
// });
// Route::get('/rahman', function () {
//     return view('welcome');
// });

// Route::get('/garkot', function () {
//     return view('welcome');
// });

// Route::get('/Tasa', function () {
//     return view('welcome');
// });

// Route::get('/crystian', function () {
//     return view('welcome');
// });
