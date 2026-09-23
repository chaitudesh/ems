import { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Calendar, Users, Clock, Sparkles, Briefcase, Menu, CheckSquare } from 'lucide-react';

export default function Layout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItem = (path, icon, label) => {
    const isActive = location.pathname.startsWith(path);
    return (
      <Link 
        to={path} 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-200 font-medium ${
          isActive 
            ? 'bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 text-slate-900' 
            : 'text-gray-500 hover:bg-white/50 hover:text-slate-900'
        }`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-transparent relative z-0">
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 bg-white/80 backdrop-blur-2xl border-r border-white/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-200/40 flex items-center space-x-3">
          <div className="bg-slate-900 p-2.5 rounded-xl shadow-md">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">EMS Workspace</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{role} Portal</p>
          </div>
        </div>
        <nav className="p-4 md:p-5 space-y-1.5 flex-1 overflow-y-auto">
          {navItem('/dashboard', <LayoutDashboard size={20} />, 'Dashboard')}
          {navItem('/leaves', <Calendar size={20} />, 'Leave Management')}
          {navItem('/attendance', <Clock size={20} />, 'Attendance')}
          {navItem('/tasks', <CheckSquare size={20} />, 'Tasks')}
          {(role === 'Admin' || role === 'HR Manager') && navItem('/employees', <Users size={20} />, 'Employees')}
          {(role === 'Admin' || role === 'Team Lead') && navItem('/projects', <Briefcase size={20} />, 'Projects')}
        </nav>
        <div className="p-5 border-t border-gray-200/40">
          <div className="bg-white/50 rounded-xl p-4 border border-white flex flex-col items-center text-center">
             <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold shadow-sm mb-2">
               {user?.name?.charAt(0).toUpperCase()}
             </div>
             <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
             <p className="text-xs text-gray-500 truncate w-full">{user?.email}</p>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col z-10 relative overflow-hidden w-full">
        <header className="bg-white/80 backdrop-blur-2xl border-b border-gray-100 px-4 md:px-10 py-4 md:py-5 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">Welcome, {user?.name?.split(' ')[0]}</h2>
          </div>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-500 hover:text-slate-900 font-semibold bg-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 text-sm md:text-base">
            <LogOut size={18} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </header>
        <div className="p-4 md:p-10 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
