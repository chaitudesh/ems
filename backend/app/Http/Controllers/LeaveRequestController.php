<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\User;

class LeaveRequestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string'
        ]);

        $user = $request->user();
        $days = \Carbon\Carbon::parse($validated['start_date'])->diffInDays(\Carbon\Carbon::parse($validated['end_date'])) + 1;

        if ($user->leave_balance < $days) {
            return response()->json(['message' => 'Insufficient leave balance. You have ' . $user->leave_balance . ' days remaining.'], 400);
        }

        $leave = LeaveRequest::create([
            'user_id' => $user->id,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'reason' => $validated['reason'],
            'status' => 'pending'
        ]);

        $user->decrement('leave_balance', $days);

        return response()->json($leave, 201);
    }

    public function myLeaves(Request $request)
    {
        return LeaveRequest::where('user_id', $request->user()->id)->get();
    }

    public function teamLeaves(Request $request)
    {
        $managerDept = $request->user()->department_id;
        $teamUserIds = User::where('department_id', $managerDept)->pluck('id');
        
        return LeaveRequest::with('user')->whereIn('user_id', $teamUserIds)->get();
    }

    public function index()
    {
        return LeaveRequest::with('user')->orderBy('created_at', 'desc')->get();
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate(['status' => 'required|in:approved,rejected']);
        $leave = LeaveRequest::findOrFail($id);
        
        if ($validated['status'] === 'rejected' && $leave->status !== 'rejected') {
            $days = \Carbon\Carbon::parse($leave->start_date)->diffInDays(\Carbon\Carbon::parse($leave->end_date)) + 1;
            $leave->user->increment('leave_balance', $days);
        } elseif ($validated['status'] !== 'rejected' && $leave->status === 'rejected') {
            $days = \Carbon\Carbon::parse($leave->start_date)->diffInDays(\Carbon\Carbon::parse($leave->end_date)) + 1;
            $leave->user->decrement('leave_balance', $days);
        }

        $leave->update([
            'status' => $validated['status'],
            'approved_by' => $request->user()->id
        ]);

        return response()->json($leave);
    }
}
