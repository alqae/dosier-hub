<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function getComments($id) {
        return response()->json(Comment::where('task_id', $id)->with('user', 'comments')->get());
    }
    public function createComment($id, Request $request) {
        $validated = $request->validate([
            'title' => 'required',
            'comment' => 'required',
            'tags' => 'nullable|array|exists:tags,id',
            'parent_comment_id' => 'nullable|exists:comments,id',
            // 'user_id' => 'required|exists:users,id',
            'task_id' => 'required|exists:tasks,id',
        ]);

        /** @var User user */
        $user = Auth::user();
        $validated['user_id'] = $user->id;

        $comment = comment::create($validated);
        return response()->json($comment);  
    }
    public function updateComment($id, Request $request) {
        $validated = $request->validate([
            'title' => 'required',
            'comment' => 'required',
            'parent_comment_id' => 'nullable|exists:comments,id',
            'task_id' => 'required|exists:tasks,id',
            'tags_ids' => 'nullable|array|exists:tags,id',
        ]);

        /** @var User user */
        $user = Auth::user();
        $validated['user_id'] = $user->id;
    
        $comment = Comment::find($id);

        if ($user->is_admin != 1 && $comment->user_id != $user->id) {
            return response()->json([ 'message' => 'Unauthorized' ], 401);
        }

        $comment->update($validated);
        return response()->json($comment);
    }
    public function deleteComment($id) {
        $comment = Comment::find($id);
        $comment->delete();
        return response()->json([ 'message' => 'Comment deleted' ]);
    }
}
