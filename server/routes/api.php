<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Protected routes
Route::middleware([ 'auth:sanctum' ])->group(function() {
    Route::get('/whoami', [AuthController::class, 'whoAmI']);
    Route::post('/users/avatar', [UserController::class, 'uploadAvatar']);
    Route::get('/files/{filename}', [UserController::class, 'getFile']);
    Route::post('/sign-out', [AuthController::class, 'signOut']);
});
// Authentication
Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/sign-in', [AuthController::class, 'signIn']);
// Password reset
Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('password/reset', [ForgotPasswordController::class, 'postReset'])->name('password.reset');
