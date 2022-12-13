<?php

use App\Http\Controllers\MapController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/regions', [MapController::class, 'getRegions']);
Route::post('/regions', [MapController::class, 'saveRegions']);
