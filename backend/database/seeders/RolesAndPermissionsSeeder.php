<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::create(['name' => 'manage roles']);
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'view all leaves']);
        Permission::create(['name' => 'approve team leaves']);
        Permission::create(['name' => 'view all attendance']);

        // create roles and assign created permissions
        $roleAdmin = Role::create(['name' => 'Admin']);
        $roleAdmin->givePermissionTo(Permission::all());

        $roleHr = Role::create(['name' => 'HR Manager']);
        $roleHr->givePermissionTo(['manage users', 'view all leaves', 'view all attendance']);

        $roleLead = Role::create(['name' => 'Team Lead']);
        $roleLead->givePermissionTo(['approve team leaves']);

        $roleEmployee = Role::create(['name' => 'Employee']);

        // Create Departments
        $engDept = Department::create(['name' => 'Engineering']);
        $backendDept = Department::create(['name' => 'Backend Team', 'parent_id' => $engDept->id]);

        // Create Users
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole($roleAdmin);

        $hr = User::create([
            'name' => 'HR Manager',
            'email' => 'hr@example.com',
            'password' => Hash::make('password'),
        ]);
        $hr->assignRole($roleHr);

        $lead = User::create([
            'name' => 'Tech Lead',
            'email' => 'lead@example.com',
            'department_id' => $backendDept->id,
            'password' => Hash::make('password'),
        ]);
        $lead->assignRole($roleLead);
        $backendDept->manager_id = $lead->id;
        $backendDept->save();

        $employee = User::create([
            'name' => 'Regular Employee',
            'email' => 'employee@example.com',
            'department_id' => $backendDept->id,
            'password' => Hash::make('password'),
        ]);
        $employee->assignRole($roleEmployee);
    }
}
