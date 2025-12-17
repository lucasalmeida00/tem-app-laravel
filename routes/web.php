<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SignupController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\ReportController;

/* GET Routes */

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/signup', [SignupController::class, 'index'])->name('signup');
Route::get('/login', [LoginController::class, 'index'])->name('login');

/* POST Routes */
Route::post('/signup', [SignupController::class, 'store'])->name('signup.store');
Route::post('/login', [LoginController::class, 'login'])->name('login.attempt');


/* Report Routes (Public API) */
Route::prefix('api/report')->group(function () {
    Route::post('/generate', [ReportController::class, 'generate'])->name('api.report.generate');
    Route::post('/download', [ReportController::class, 'download'])->name('api.report.download');
    Route::post('/preview', [ReportController::class, 'preview'])->name('api.report.preview');
    Route::get('/health', [ReportController::class, 'health'])->name('api.report.health');
});

/* Protected Routes (Only with Login) */
Route::middleware('auth:sanctum')->group(function () {


    /* GET Routes */
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/logout', [LogoutController::class, 'logout'])->name('logout');
    Route::get('/dashboard/{url_hash}', [DashboardController::class, 'show'])->name('dashboard.business.show');
    Route::get('/dashboard/{url_hash}/resume', [DashboardController::class, 'resume'])->name('dashboard.business.resume');

    /* POST Routes */
    Route::post('/dashboard/business', [DashboardController::class, 'store'])->name('dashboard.business.store');
    Route::post('/dashboard/{url_hash}/autosave', [DashboardController::class, 'autosave'])->name('dashboard.business.autosave');

    /* DELETE Routes */
    Route::delete('/dashboard/business/{business}', [DashboardController::class, 'destroy'])->name('dashboard.business.destroy');
});
