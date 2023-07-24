<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(Request $request) {
        $validated = $request->validate([
            'email' => 'required|email|exists:users'
        ]);

        $token = Str::random(64);
        $password_reset_tokens = DB::table('password_reset_tokens');
        $password_reset_tokens->where('email', $validated['email'])->delete();
        DB::table('password_reset_tokens')->insert([
            'email' => $validated['email'],
            'token' => $token,
            'created_at' => now()
        ]);
        Mail::send('emails.forgot-password', [
            'token' => $token,
            'app_url' => env('APP_URL', 'http://localhost:5173')
        ], function($message) use ($validated) {
            $message->to($validated['email']);
            $message->subject('Reset your password');
        }
        );
        return response()->json([ 'token' => $token ]);
    }
    public function postReset() {
        $validated = request()->validate([
            'token' => 'required',
            'password' => 'required'
        ]);
        $password_reset_tokens = DB::table('password_reset_tokens');
        $token = $password_reset_tokens->where('token', $validated['token'])->first();
        if (!$token) {
            return response()->json([ 'message' => 'Invalid token' ], 400);
        }
        User::where('email', $token->email)->update([
            'password' => Hash::make($validated['password'])
        ]);
        $password_reset_tokens->where('token', $validated['token'])->delete();
        return response()->json([ 'message' => 'Password reset' ]);
    }
}
