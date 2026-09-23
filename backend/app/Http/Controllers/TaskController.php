<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Admins see all tasks
        if ($user->hasRole('Admin')) {
            return Task::with('assignee', 'assigner', 'project')->orderBy('created_at', 'desc')->get();
        }
        
        // Team Leads see tasks they assigned
        if ($user->hasRole('Team Lead')) {
            return Task::with('assignee', 'assigner', 'project')
                ->where('assigned_by', $user->id)
                ->orWhere('assigned_to', $user->id) // Just in case they are assigned a task
                ->orderBy('created_at', 'desc')
                ->get();
        }
        
        // Employees see tasks assigned to them
        return Task::with('assignee', 'assigner', 'project')
            ->where('assigned_to', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        // Only Admin and Team Lead can create tasks
        if (!$request->user()->hasRole('Admin') && !$request->user()->hasRole('Team Lead')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'required|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $validated['assigned_by'] = $request->user()->id;
        $validated['status'] = 'pending';

        $task = Task::create($validated);
        $task->load('assignee', 'assigner', 'project');

        return response()->json($task, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $user = $request->user();

        // Only Admin, the assigner, or the assignee can update the status
        if (!$user->hasRole('Admin') && $task->assigned_to !== $user->id && $task->assigned_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed'
        ]);

        $task->update(['status' => $validated['status']]);
        $task->load('assignee', 'assigner', 'project');

        return response()->json($task);
    }
}
