<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;

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
    Route::get('/projects', [ProjectController::class, 'getAll']);
    Route::get('/projects/{id}', [ProjectController::class, 'getProject']);
    Route::post('/projects', [ProjectController::class, 'createProject']);
    Route::post('/projects/{id}/avatar', [ProjectController::class, 'uploadAvatar']);
    Route::put('/projects/{id}', [ProjectController::class, 'updateProject']);
    Route::delete('/projects/{id}', [ProjectController::class, 'deleteProject']);
    // ---------------------------- Users
    Route::get('/users', [UserController::class, 'getAll']);
    Route::get('/users/{id}', [UserController::class, 'getUser']);
    Route::put('/users/{id}', [UserController::class, 'updateUser']);
    Route::put('/users/{id}/password', [UserController::class, 'updatePassword']);
    Route::post('/users/avatar', [UserController::class, 'uploadAvatar']);
    // ----------------------------
    Route::get('/whoami', [AuthController::class, 'whoAmI']);
    Route::post('/sign-out', [AuthController::class, 'signOut']);
});
Route::get('/files/{filename}', [UserController::class, 'getFile']);
// Authentication
Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/sign-in', [AuthController::class, 'signIn']);
// Password reset
Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('password/reset', [ForgotPasswordController::class, 'postReset'])->name('password.reset');
