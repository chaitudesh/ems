<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->hasRole('Admin')) {
            return Project::with('teamLead', 'members')->get();
        }
        if ($user->hasRole('Team Lead')) {
            return Project::with('teamLead', 'members')->where('team_lead_id', $user->id)->get();
        }
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    public function store(Request $request)
    {
        if (!$request->user()->hasRole('Admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'team_lead_id' => 'required|exists:users,id'
        ]);

        $project = Project::create($validated);
        $project->load('teamLead', 'members');

        return response()->json($project, 201);
    }

    public function assignMembers(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $user = $request->user();
        
        // Only Admin or the assigned Team Lead can assign members
        if (!$user->hasRole('Admin') && $project->team_lead_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $project->members()->sync($validated['user_ids'] ?? []);

        $project->load('teamLead', 'members');
        return response()->json($project);
    }
}
