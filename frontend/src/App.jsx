import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import Leaves from './pages/Leaves';
import Attendance from './pages/Attendance';
import Tasks from './pages/Tasks';
import Employees from './pages/Employees';
import Projects from './pages/Projects';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="employees" element={<ProtectedRoute allowedRoles={['Admin', 'HR Manager']}><Employees /></ProtectedRoute>} />
          <Route path="projects" element={<ProtectedRoute allowedRoles={['Admin', 'Team Lead']}><Projects /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
