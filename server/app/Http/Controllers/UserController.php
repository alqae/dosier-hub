<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function getAll()
    {
        $validated = request()->validate([
            'page' => 'nullable',
            'limit' => 'nullable',
        ]);

        $page = $validated['page'] ?? null;
        $limit = $validated['limit'] ?? null;
        if ($page != null && $limit != null) {
            return response()->json(User::orderBy('created_at', 'DESC')->where('is_admin', 0)->paginate($validated['limit']));
        } else {
            return response()->json(User::orderBy('created_at', 'DESC')->get());
        }
    }
    public function getUser($id)
    {
        $user = User::find($id);
        if ($user == null) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }
    public function uploadAvatar(Request $request)
    {
        if ($request->hasFile('avatar')) {
            /** @var User $user */
            $user = Auth::user();
            return $this->saveAvatar($user);
        }
        return response()->json(['message' => 'File not found']);
    }
    public function uploadAvatarById(Request $request, $id)
    {
        if ($request->hasFile('avatar')) {
            $user = User::find($id);
            return $this->saveAvatar($user);
        }
        return response()->json(['message' => 'File not found']);
    }
    private function saveAvatar(User $user)
    {
        $filename = $user->id . '-' . Str::random(10) . '.' . request()->avatar->getClientOriginalExtension();
        $user->update(['avatar' => $filename]);
        request()->avatar->storeAs('images', $filename, 'public');
        return response()->json(['success' => $filename]);
    }
    public function updateProfile(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required',
        ]);
        $userByEmail = User::where('email', $validated['email']);
        if ($userByEmail->count() > 0) {
            $userByEmail = $userByEmail->first();
            if ($userByEmail->id != $id) {
                return response()->json(['message' => 'Email already exists'], 400);
            }
        }
        $user = User::find($id);
        $user->update($validated);
        return response()->json($user);
    }
    public function updatePassword(Request $request, $id)
    {
        $validated = $request->validate([
            'password' => 'required',
        ]);
        $user = User::find($id);
        $user->update(['password' => bcrypt($validated['password'])]);
        return response()->json($user);
    }
    public function getFile($filename)
    {
        return response()->file(
            public_path('storage/images/' . $filename)
        );
    }
    public function inviteUser(Request $request)
    {
        $validated = $request->validate([ 'email' => 'required' ]);
        $userByEmail = User::where('email', $validated['email']);
        if ($userByEmail->count() > 0) {
            return response()->json(['message' => 'Email already exists'], 400);
        }

        $user = User::create($validated);
        $token = Str::random(64);

        DB::table('invitation_tokens')->insert([
            'email' => $validated['email'],
            'token' => $token,
            'created_at' => now()
        ]);
        Mail::send(
            'emails.invite-user',
            [
                'token' => $token,
                'app_url' => env('APP_URL', 'http://localhost:5173')
            ],
            function ($message) use ($validated) {
                $message->to($validated['email']);
                $message->subject('You have been invited to join the app');
            }
        );
        return response()->json($user);
    }
    public function deleteUser($id)
    {
        /** @var User $user */
        $userLogged = Auth::user();

        if ($userLogged->is_admin != 1) {
            return response()->json([
                'message' => 'Only admin can delete users',
            ], 400);
        }

        $user = User::find($id);
        $user->delete();
        return response()->json($user);
    }
}
