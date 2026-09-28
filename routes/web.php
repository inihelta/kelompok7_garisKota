<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return view('login');
});

Route::get('/dashboard', function () {
    return view('dashboard');
});

Route::get('/rafly', function () {
    return view('welcome');
});
Route::get('/rahman', function () {
    return view('welcome');
});

Route::get('/garkot', function () {
    return view('welcome');
});

Route::get('/Tasa', function () {
    return view('welcome');
});

Route::get('/crystian', function () {
    return view('welcome');
});
