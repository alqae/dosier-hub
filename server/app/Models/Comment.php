<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_comment_id',
        'user_id',
        'task_id',
        'title',
        'comment',
        'tags'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function task() {
        return $this->belongsTo(Task::class);
    }

    public function tags() {
        return $this->belongsToMany(Tag::class);
    }

    public function parentComment() {
        return $this->belongsTo(Comment::class, 'parent_comment_id');
    }

    public function comments() {
        return $this->hasMany(Comment::class, 'parent_comment_id');
    }
}
