<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\AttendanceController;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Admin & HR can manage users
    Route::middleware('permission:manage users')->group(function () {
        Route::apiResource('users', UserController::class);
    });

    // Projects (Admin and Team Lead logic inside Controller)
    Route::apiResource('projects', \App\Http\Controllers\ProjectController::class);
    Route::post('projects/{id}/members', [\App\Http\Controllers\ProjectController::class, 'assignMembers']);

    // Tasks
    Route::get('/tasks', [\App\Http\Controllers\TaskController::class, 'index']);
    Route::post('/tasks', [\App\Http\Controllers\TaskController::class, 'store']);
    Route::put('/tasks/{id}/status', [\App\Http\Controllers\TaskController::class, 'updateStatus']);

    // Departments
    Route::get('/departments', [DepartmentController::class, 'index']);

    // Leaves
    Route::post('/leaves', [LeaveRequestController::class, 'store']);
    Route::get('/leaves/my', [LeaveRequestController::class, 'myLeaves']);
    Route::get('/leaves/team', [LeaveRequestController::class, 'teamLeaves'])->middleware('permission:approve team leaves');
    Route::post('/leaves/{id}/status', [LeaveRequestController::class, 'updateStatus'])->middleware('permission:approve team leaves|view all leaves');
    Route::get('/leaves/all', [LeaveRequestController::class, 'index'])->middleware('permission:view all leaves');

    // Attendance
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut']);
    Route::get('/attendance/my', [AttendanceController::class, 'myAttendance']);
    Route::get('/attendance/all', [AttendanceController::class, 'index'])->middleware('permission:view all attendance');
    
    // Dashboard Stats
    Route::get('/dashboard/metrics', [UserController::class, 'dashboardMetrics']);
});
