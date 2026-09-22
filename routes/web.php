<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/rahman', function () {
    return view('welcome');
});

Route::get('/garkot', function () {
    return view('welcome');
});

