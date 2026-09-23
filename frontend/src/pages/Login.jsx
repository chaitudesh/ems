import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-10 -left-20 w-[30rem] h-[30rem] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-md w-full glass-panel p-10">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
            <Sparkles className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Sign in to the EMS v2 Portal</p>
        
        {error && <div className="bg-red-50/80 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 shadow-sm font-medium backdrop-blur-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-3 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-3 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full btn-primary py-3 px-4 rounded-xl text-lg mt-2">
            Sign In
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200/60">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-4">Demo Accounts (Password: password)</p>
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="bg-white/50 p-3 rounded-xl border border-gray-100 flex flex-col hover:bg-white/80 transition-colors cursor-pointer" onClick={() => {setEmail('admin@example.com'); setPassword('password');}}>
              <span className="font-bold text-indigo-600 text-[13px] mb-0.5">Admin</span>
              <span className="opacity-70">admin@example.com</span>
            </div>
            <div className="bg-white/50 p-3 rounded-xl border border-gray-100 flex flex-col hover:bg-white/80 transition-colors cursor-pointer" onClick={() => {setEmail('hr@example.com'); setPassword('password');}}>
              <span className="font-bold text-purple-600 text-[13px] mb-0.5">HR Manager</span>
              <span className="opacity-70">hr@example.com</span>
            </div>
            <div className="bg-white/50 p-3 rounded-xl border border-gray-100 flex flex-col hover:bg-white/80 transition-colors cursor-pointer" onClick={() => {setEmail('lead@example.com'); setPassword('password');}}>
              <span className="font-bold text-blue-600 text-[13px] mb-0.5">Team Lead</span>
              <span className="opacity-70">lead@example.com</span>
            </div>
            <div className="bg-white/50 p-3 rounded-xl border border-gray-100 flex flex-col hover:bg-white/80 transition-colors cursor-pointer" onClick={() => {setEmail('employee@example.com'); setPassword('password');}}>
              <span className="font-bold text-emerald-600 text-[13px] mb-0.5">Employee</span>
              <span className="opacity-70">employee@example.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
