<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Dyrynda\Database\Support\CascadeSoftDeletes;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory, SoftDeletes, CascadeSoftDeletes;

    protected $cascadeDeletes = ['comments'];
    protected $dates = ['deleted_at'];

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
        return $this->belongsToMany(Tag::class, 'comments_tags');
    }

    // public function parentComment() {
    //     return $this->belongsTo(Comment::class, 'parent_comment_id');
    // }

    // public function comments() {
    //     return $this->belongsToMany(Comment::class, 'comments_comments', 'comment_id', 'parent_comment_id')->with('comments', 'tags', 'user');
    // }

    public function scopeChildless($q) {
        return $q->whereNull('parent_comment_id');
    }

    public function comments() {
        return $this->hasMany(Comment::class, 'parent_comment_id')->with('comments', 'tags', 'user');
        // $allComments = Comment::all();
        // $rootComments = $allComments->whereNull('parent_comment_id');
        // foreach ($rootComments as $rootComment) {
        //     $rootComment->comments = $allComments->where('parent_comment_id', $rootComment->id);
        // }
    }
}
