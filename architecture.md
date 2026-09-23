# Architecture Notes: Employee Management System v2

## System Overview
The application follows a standard decoupled architecture with a RESTful API backend serving a Single Page Application (SPA) frontend.

### 1. Backend (Laravel)
- **Framework:** Laravel provides a robust foundation for building the REST API.
- **Authentication:** Laravel Sanctum or Passport for secure API token-based authentication.
- **RBAC Engine:** The `spatie/laravel-permission` package is used to manage roles and permissions dynamically via the database, avoiding hardcoded permission logic.
- **Database Modeling:**
  - `users`: Core user table.
  - `roles` & `permissions`: Managed by Spatie.
  - `departments`: Features a `parent_id` for recursive/nested relationships to support hierarchy.
  - `leave_requests`: Relates to `users` and tracks status (pending, approved, rejected) and workflow.
  - `attendance_logs`: Time-series data for check-ins/outs.

### 2. Frontend (React)
- **Framework:** React.js bootstrapped with Vite or Next.js for high performance.
- **State Management:** Context API or Redux (with RTK Query) to manage global user state and cache API responses.
- **Role-Based Routing:** Protected routes that verify the user's role before rendering specific components (e.g., preventing an Employee from accessing the `/admin/payroll` route).
- **UI Components:** Reusable components structured around a design system (e.g., Tailwind CSS).
- **Dashboards:** Recharts or Chart.js integrated for data visualization (headcount trends, attendance summaries).

### 3. Database (PostgreSQL / MySQL)
- Highly relational structure to ensure data integrity between nested departments, assigned roles, and user actions (leaves, attendance).
