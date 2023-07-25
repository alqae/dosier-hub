<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Task extends Model
{
    use HasFactory;

    protected $fillable=[
        'parent_task_id',
        'name',
        'description',
        'alias',
        'status',
        'initial_date',
        'final_date',
        'time_spend',
        'project_id',
    ];

    public function tasks() {
        return $this->hasMany(Task::class, 'parent_task_id');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'task_users', 'task_id', 'user_id');
    }

    public function comments() {
        return $this->hasMany(Comment::class, 'task_id');
    }
}
