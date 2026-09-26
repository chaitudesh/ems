<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Department;

class UserController extends Controller
{
    public function index()
    {
        return User::with('roles', 'department')->get();
    }

    public function store(Request $request)
    {
        // simplified user creation for prototype
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'department_id' => 'nullable|exists:departments,id',
            'role' => 'required|exists:roles,name'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'department_id' => $validated['department_id'],
        ]);
        $role = \Spatie\Permission\Models\Role::findByName($validated['role'], 'web');
        $user->assignRole($role);

        return response()->json($user, 201);
    }

    public function dashboardMetrics(Request $request)
    {
        $user = $request->user();
        if ($user->hasRole('Admin') || $user->hasRole('HR Manager')) {
            return response()->json([
                'total_employees' => User::count(),
                'departments' => Department::count(),
                'pending_leaves' => \App\Models\LeaveRequest::where('status', 'pending')->count(),
                'my_leaves' => \App\Models\LeaveRequest::where('user_id', $user->id)->count(),
            ]);
        }
        
        return response()->json([
            'my_leaves' => \App\Models\LeaveRequest::where('user_id', $user->id)->count(),
        ]);
    }
}
