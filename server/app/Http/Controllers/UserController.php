<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function getAll() {
        return response()->json(User::all());
    }
    public function getUser($id) {
        return response()->json(User::find($id));
    }
    public function uploadAvatar(Request $request) {
        if ($request->hasFile('avatar')) {
            /** @var User $user */
            $user = Auth::user();
            $filename = $user->id . '-' . Str::random(10) . '.' . $request->avatar->getClientOriginalExtension();
            $user->update([ 'avatar' => $filename ]);
            $request->avatar->storeAs('images', $filename, 'public');
            return response()->json([ 'success' => $filename ]);
        }
        return response()->json([ 'message' => 'File not found' ]);
    }
    public function updateProfile(Request $request, $id) {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required',
        ]);
        $userByEmail = User::where('email', $validated['email']);
        if ($userByEmail->count() > 0) {
            $userByEmail = $userByEmail->first();
            if ($userByEmail->id != $id) {
                return response()->json([ 'message' => 'Email already exists' ], 400);
            }
        }
        $user = User::find($id);
        $user->update($validated);
        return response()->json($user);
    }
    public function updatePassword(Request $request, $id) {
        $validated = $request->validate([
            'password' => 'required',
        ]);
        $user = User::find($id);
        $user->update([ 'password' => bcrypt($validated['password']) ]);
        return response()->json($user);
    }
    public function getFile($filename) {
        return response()->file(
            public_path('storage/images/' . $filename)
        );
    }
}
