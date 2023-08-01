<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function whoAmI()
    {
        return response()->json(Auth::user());
    }
    public function signIn(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($validated)) {
            return response()->json([
                'message' => 'Bad credentials. Please try again.'
            ], 401);
        }
        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token]);
    }
    public function signUp(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|min:3|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'])
        ]);

        $token = $user->createToken('main')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token]);
    }
    public function signOut()
    {
        /** @var User $user **/
        $user = Auth::user();
        $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();
        return response()->json(['message' => 'Signed out']);
    }
}
