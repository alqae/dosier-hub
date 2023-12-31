<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TagController;

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
    // ---------------------------- Projects
    Route::get('/projects', [ProjectController::class, 'getAll']);
    Route::get('/projects/{id}', [ProjectController::class, 'getProject']);
    Route::post('/projects', [ProjectController::class, 'createProject']);
    Route::post('/projects/{id}/avatar', [ProjectController::class, 'uploadAvatar']);
    Route::put('/projects/{id}', [ProjectController::class, 'updateProject']);
    Route::delete('/projects/{id}', [ProjectController::class, 'deleteProject']);
    // ---------------------------- Tags
    Route::get('/tags', [TagController::class, 'getAll']);
    Route::post('/tags', [TagController::class, 'createTag']);
    // ---------------------------- Comments
    Route::get('/tasks/{id}/comments', [CommentController::class, 'getComments']);
    Route::post('/tasks/{id}/comments', [CommentController::class, 'createComment']);
    Route::put('/comments/{id}', [CommentController::class, 'updateComment']);
    Route::delete('/comments/{id}', [CommentController::class, 'deleteComment']);
    // ---------------------------- Tasks
    Route::delete('/tasks/{id}', [TaskController::class, 'deleteTask']);
    Route::put('/tasks/{id}', [TaskController::class, 'updateTask']);
    Route::get('/tasks/{id}', [TaskController::class, 'getTask']);
    Route::post('/projects/{id}/tasks', [TaskController::class, 'createTask']);
    // ---------------------------- Users
    Route::get('/users', [UserController::class, 'getAll']);
    Route::post('/users/invite', [UserController::class, 'inviteUser']);
    Route::get('/users/{id}', [UserController::class, 'getUser']);
    Route::put('/users/{id}', [UserController::class, 'updateProfile']);
    Route::put('/users/{id}/password', [UserController::class, 'updatePassword']);
    Route::post('/users/avatar', [UserController::class, 'uploadAvatar']);
    Route::post('/users/{id}/avatar', [UserController::class, 'uploadAvatarById']);
    Route::delete('/users/{id}', [UserController::class, 'deleteUser']);
    Route::get('/whoami', [AuthController::class, 'whoAmI']);
    // ---------------------------- Auth
    Route::post('/sign-out', [AuthController::class, 'signOut']);
});
// Files
Route::get('/files/{filename}', [UserController::class, 'getFile']);
// Authentication
Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/sign-in', [AuthController::class, 'signIn']);
// Password reset
Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('password/reset', [ForgotPasswordController::class, 'postReset'])->name('password.reset');
