<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function checkIn(Request $request)
    {
        $today = Carbon::today()->toDateString();
        $userId = $request->user()->id;

        $attendance = Attendance::firstOrCreate(
            ['user_id' => $userId, 'date' => $today],
            ['check_in' => Carbon::now()]
        );

        if (!$attendance->wasRecentlyCreated && !$attendance->check_in) {
            $attendance->update(['check_in' => Carbon::now()]);
        }

        return response()->json($attendance);
    }

    public function checkOut(Request $request)
    {
        $today = Carbon::today()->toDateString();
        $attendance = Attendance::where('user_id', $request->user()->id)
            ->where('date', $today)
            ->first();

        if ($attendance) {
            $attendance->update(['check_out' => Carbon::now()]);
            return response()->json($attendance);
        }

        return response()->json(['message' => 'No check-in found today'], 400);
    }

    public function myAttendance(Request $request)
    {
        return Attendance::where('user_id', $request->user()->id)
            ->orderBy('date', 'desc')
            ->take(30)
            ->get();
    }

    public function index()
    {
        return Attendance::with('user')->orderBy('date', 'desc')->get();
    }
}
