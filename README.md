# Employee Management System v2 (with RBAC)

## Overview
A comprehensive Employee Management System featuring Role-Based Access Control (RBAC), hierarchical department structuring, leave application workflows, attendance tracking, and role-scoped reporting dashboards. This project demonstrates the ability to model real-world organizational complexity and business processes.

## Key Features
- **Role-Based Access Control (RBAC):** Granular permissions using Laravel's Spatie package. Roles include Admin, HR Manager, Team Lead, and Employee.
- **Department Hierarchy:** Support for nested departments (e.g., Engineering > Backend Team) with assigned department leads.
- **Leave Management Workflow:** Employees can apply for leave, track their balance (e.g., 12 days/year), and Team Leads/Managers can approve or reject requests in real-time.
- **Attendance Tracking:** Check-in/check-out logging with monthly summaries and anomaly detection (late check-ins, missed days).
- **Simplified Payroll Engine:** Basic payroll calculator factoring in base salary and deductions for unpaid leave.
- **Role-Scoped Dashboards:** Customized views for each role using Recharts/Chart.js. Admins see company-wide stats, while employees see only their personal metrics.

## Tech Stack
- **Backend:** Laravel (PHP)
- **RBAC:** Spatie Permission Package
- **Frontend:** React.js
- **Database:** PostgreSQL / MySQL
- **Data Visualization:** Recharts / Chart.js
