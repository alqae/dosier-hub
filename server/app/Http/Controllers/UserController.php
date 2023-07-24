<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UserController extends Controller
{
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
    public function getFile($filename) {
        return response()->file(
            public_path('storage/images/' . $filename)
        );
    }
}
