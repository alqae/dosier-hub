<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function getTask($id) {
        return response()->json(Task::where('id', $id)->with('users', 'tasks')->first());
    }
    public function createTask(Request $request) {
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'nullable',
            'alias' => 'nullable|unique:tasks',
            'status' => 'required',
            'initial_date' => 'nullable',
            'final_date' => 'nullable',
            'time_spend' => 'nullable',
            'parent_task_id' => 'nullable|exists:tasks,id',
            'project_id' => 'required|exists:projects,id',
            'users_ids' => 'nullable|array|exists:users,id',
        ]);

        $task = Task::create($validated);
        $task->users()->attach($validated['users_ids']);
        return response()->json($task);
    }
    public function updateTask($id, Request $request) {
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'nullable',
            'alias' => 'nullable|unique:tasks',
            'status' => 'required',
            'initial_date' => 'nullable',
            'final_date' => 'nullable',
            'time_spend' => 'nullable',
            'parent_task_id' => 'nullable|exists:tasks,id',
            'project_id' => 'required|exists:projects,id',
            'users_ids' => 'nullable|array|exists:users,id',
        ]);

        $task = Task::find($id);
        $task->update($validated);
        $task->users()->sync($validated['users_ids']);
        return response()->json($task);
    }
    public function deleteTask($id) {
        $task = Task::find($id);
        if ($task->tasks()->count() > 0) {
            foreach ($task->tasks as $subtask) {
                $subtask->delete();
            }
        }
        $task->delete();
        return response()->json($task);
    }
}
