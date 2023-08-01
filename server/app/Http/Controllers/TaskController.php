<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\Comment;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function getTask($id)
    {
        $comments = Comment::where('task_id', $id)
            ->where('parent_comment_id', null)
            ->orderBy('created_at', 'DESC')
            ->with('comments', 'tags', 'user')
            ->get();
        $task = Task::where('id', $id)
            ->with('users', 'tasks')
            ->first();
        $task->comments = $comments;
        return response()->json($task);
    }
    public function createTask(Request $request)
    {
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
        $this->calculateProgress($task);
        return response()->json($task);
    }
    public function updateTask($id, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'nullable',
            'alias' => 'nullable',
            'status' => 'required',
            'initial_date' => 'nullable',
            'final_date' => 'nullable',
            'time_spend' => 'nullable',
            'parent_task_id' => 'nullable|exists:tasks,id',
            'project_id' => 'required|exists:projects,id',
            'users_ids' => 'nullable|array|exists:users,id',
        ]);

        if ($validated['alias'] != null) {
            $taskByAlias = Task::where('alias', $validated['alias']);
            if ($taskByAlias->count() > 0) {
                $taskByAlias = $taskByAlias->first();
                if ($taskByAlias->id != $id) {
                    return response()->json(['message' => 'Alias already exists'], 400);
                }
            }
        }

        $task = Task::find($id);

        if ($validated['status'] == 'Done') {
            $unCompletedTasks = Task::where('parent_task_id', $id)->where('status', '!=', 'Done')->get();
            if ($unCompletedTasks->count() > 0 && $validated['status'] == 'Done') {
                return response()->json([
                    'message' => 'You cannot mark this task as Done, there are uncompleted tasks'
                ], 400);
            }
        }

        $task->update($validated);
        $task->users()->sync($validated['users_ids']);
        $this->calculateProgress($task);
        return response()->json($task);
    }
    public function deleteTask($id)
    {
        $task = Task::find($id);
        if ($task->tasks()->count() > 0) {
            foreach ($task->tasks as $subtask) {
                $subtask->delete();
            }
        }
        $task->delete();
        return response()->json($task);
    }
    private function calculateProgress(Task $task)
    {
        $parent_task_id = $task->parent_task_id;
        $totalTasksCompleted = 0;
        $entity = null;
        $allTasks = 0;
        $progress = 0;

        if ($parent_task_id != null) {
            $entity = Task::find($parent_task_id);
            $allTasks = $entity->tasks()->get();
            $totalTasksCompleted = $allTasks->where('status', 'Done')->count();
        } else {
            $entity = Project::find($task->project_id);
            $allTasks = Task::where('project_id', $entity->id)->where('parent_task_id', null)->get();
            $totalTasksCompleted = $allTasks->where('status', 'Done')->count();
        }

        if ($totalTasksCompleted == 0) {
            $progress = 0;
        } else {
            $progress = $totalTasksCompleted / $allTasks->count() * 100;
        }

        $entity->progress = $progress;
        $entity->save();
    }
}
