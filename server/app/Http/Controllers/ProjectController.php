<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function getAll(Request $request)
    {
        $validated = $request->validate([
            'page' => 'required',
            'limit' => 'required',
        ]);

        return response()->json(
            Project::orderBy('created_at', 'DESC')
                ->with('user')
                ->withCount('tasks')
                ->paginate($validated['limit'])
        );
    }
    public function getProject($id)
    {
        $project = Project::where('id', $id)->with('user')->first();
        if ($project == null) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        $tasks = Task::where('project_id', $id)
            ->where('parent_task_id', null)
            ->with('users', 'tasks')
            ->get();
        $project->tasks = $tasks;
        return response()->json($project);
    }
    public function createProject(Request $request)
    {
        /** @var User user */
        $user = Auth::user();
        if ($user->is_admin != 1) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'required',
            'alias' => 'required|unique:projects',
            'status' => 'required',
            'initial_date' => 'required',
            'final_date' => 'required',
            'user_id' => 'required|exists:users,id',
        ]);
        $project = Project::create($validated);
        return response()->json($project);
    }
    public function uploadAvatar(Request $request, $id)
    {
        if ($request->hasFile('avatar')) {
            /** @var User $user */
            $user = Auth::user();
            $filename = $user->id . '-' . Str::random(10) . '.' . $request->avatar->getClientOriginalExtension();
            $project = Project::find($id);
            $project->update(['avatar' => $filename]);
            $request->avatar->storeAs('images', $filename, 'public');
            return response()->json(['filename' => $filename]);
        }
        return response()->json(['message' => 'File not found']);
    }
    public function updateProject(Request $request, $id)
    {
        /** @var User user */
        $user = Auth::user();
        if ($user->is_admin != 1) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'required',
            'alias' => 'required',
            'status' => 'required',
            'initial_date' => 'required',
            'final_date' => 'required',
            'user_id' => 'required|exists:users,id',
        ]);

        $projectByAlias = Project::where('alias', $validated['alias']);

        if ($projectByAlias->count() > 0) {
            $projectByAlias = $projectByAlias->first();
            if ($projectByAlias->id != $id) {
                return response()->json(['message' => 'Alias already exists'], 400);
            }
        }

        $project = Project::find($id);
        $project->update($validated);
        return response()->json($project);
    }
    public function deleteProject($id)
    {
        /** @var User user */
        $user = Auth::user();
        if ($user->is_admin != 1) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $project = Project::find($id);
        $project->delete();
        return response()->json(['message' => 'Project deleted']);
    }
}
