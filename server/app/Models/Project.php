<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Dyrynda\Database\Support\CascadeSoftDeletes;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory, SoftDeletes, CascadeSoftDeletes;

    protected $cascadeDeletes = ['tasks'];
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name',
        'description',
        'avatar',
        'alias',
        'status',
        'initial_date',
        'final_date',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_id', 'id');
    }

    public function totalTasks() {
        return $this->hasMany(Task::class, 'project_id', 'id')->count();
    }
}
