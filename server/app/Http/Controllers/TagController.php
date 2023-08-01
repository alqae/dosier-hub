<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function getAll()
    {
        return response()->json(Tag::all());
    }
    public function createTag(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'required',
        ]);

        $tag = Tag::create($validated);
        return response()->json($tag);
    }
}
