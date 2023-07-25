<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comments_comments', function (Blueprint $table) {
            $table->unsignedBigInteger('comment_id')->nullable(false);
            $table->unsignedBigInteger('parent_comment_id')->nullable(false);

            $table->foreign('comment_id')
                ->references('id')
                ->on('comments')
                ->onDelete('cascade');

            $table->foreign('parent_comment_id')
                ->references('id')
                ->on('comments')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments_comments');
    }
};