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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_task_id')->nullable();
            $table->foreign('parent_task_id')->references('id')->on('tasks')->after('id');
            $table->unsignedBigInteger('project_id')->nullable(false);
            $table->foreign('project_id')->references('id')->on('projects')->after('name');
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->string('alias')->unique()->nullable();
            $table->string('status')->nullable(false);
            $table->date('initial_date')->nullable();
            $table->date('final_date')->nullable();
            $table->string('time_spend')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
