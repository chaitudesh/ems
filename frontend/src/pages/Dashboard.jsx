import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user, role } = useAuth();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    api.get('/dashboard/metrics').then(res => setMetrics(res.data)).catch(console.error);
  }, []);

  const dummyData = [
    { name: 'Engineering', employees: 12 },
    { name: 'HR', employees: 3 },
    { name: 'Marketing', employees: 5 },
    { name: 'Sales', employees: 8 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
      
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">My Leave Balance</h3>
            <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600 mt-2">{12 - (metrics.my_leaves || 0)} <span className="text-lg text-gray-400 font-medium">days</span></p>
          </div>

          {(role === 'Admin' || role === 'HR Manager') && (
            <>
              <div className="glass-card p-6 flex flex-col justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Employees</h3>
                <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600 mt-2">{metrics.total_employees}</p>
              </div>
              <div className="glass-card p-6 flex flex-col justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Departments</h3>
                <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600 mt-2">{metrics.departments}</p>
              </div>
              <div className="glass-card p-6 flex flex-col justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pending Leaves</h3>
                <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-amber-500 to-orange-500 mt-2">{metrics.pending_leaves}</p>
              </div>
            </>
          )}
        </div>
      )}

      {(role === 'Admin' || role === 'HR Manager') && (
        <div className="glass-panel p-6 mt-8" style={{ height: '400px' }}>
          <h3 className="text-lg font-bold text-gray-800 mb-6">Headcount by Department</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={dummyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="employees" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
