import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CylinderBar = (props) => {
  const { fill, x, y, width, height } = props;
  const depth = 8;
  if (height <= 0) return null;
  return (
    <g filter="url(#dropShadow)">
      {/* Main body of cylinder */}
      <path 
        d={`M${x},${y} 
            L${x},${y + height} 
            A${width/2},${depth} 0 0,0 ${x + width},${y + height} 
            L${x + width},${y} 
            A${width/2},${depth} 0 0,1 ${x},${y} Z`} 
        fill={fill} 
      />
      {/* Top lid of cylinder */}
      <ellipse 
        cx={x + width / 2} 
        cy={y} 
        rx={width / 2} 
        ry={depth} 
        fill={fill} 
      />
      {/* Lighter overlay for the top lid to simulate light hitting it */}
      <ellipse 
        cx={x + width / 2} 
        cy={y} 
        rx={width / 2} 
        ry={depth} 
        fill="#ffffff" 
        opacity={0.15}
      />
      {/* Darker inner ring for realism */}
      <ellipse 
        cx={x + width / 2} 
        cy={y} 
        rx={width / 2 - 1} 
        ry={depth - 0.5} 
        fill="transparent" 
        stroke="rgba(0,0,0,0.1)"
        strokeWidth={1}
      />
    </g>
  );
};

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
        <div 
          className="p-8 mt-8 shadow-2xl relative overflow-hidden rounded-xl" 
          style={{ 
            height: '450px',
            background: 'linear-gradient(180deg, #244b75 0%, #152b47 100%)',
            border: '2px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Faint Grid and World Map Simulation */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
          
          {/* Subtle lighting overlay for realistic depth */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>

          <div className="flex justify-between items-center mb-12 relative z-10">
            <h3 className="text-2xl font-medium text-white tracking-wide" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              Headcount by Department
            </h3>
          </div>

          <ResponsiveContainer width="100%" height="75%" className="relative z-10">
            <BarChart data={dummyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.5" />
                </filter>
                <linearGradient id="redCylinder" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b0000" />
                  <stop offset="15%" stopColor="#d11a1a" />
                  <stop offset="35%" stopColor="#ff4d4d" />
                  <stop offset="65%" stopColor="#cc0000" />
                  <stop offset="100%" stopColor="#660000" />
                </linearGradient>
                <linearGradient id="yellowCylinder" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#b35900" />
                  <stop offset="15%" stopColor="#e68a00" />
                  <stop offset="35%" stopColor="#ffb84d" />
                  <stop offset="65%" stopColor="#ff9900" />
                  <stop offset="100%" stopColor="#994d00" />
                </linearGradient>
                <linearGradient id="greenCylinder" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#004d00" />
                  <stop offset="15%" stopColor="#008000" />
                  <stop offset="35%" stopColor="#33cc33" />
                  <stop offset="65%" stopColor="#009900" />
                  <stop offset="100%" stopColor="#003300" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.08)" />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 2 }} 
                tickLine={false} 
                tick={{fill: '#e2e8f0', fontSize: 14, fontWeight: 500}} 
                dy={15} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#e2e8f0', fontSize: 12}} 
                dx={-10}
              />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                contentStyle={{ 
                  backgroundColor: 'rgba(21, 43, 71, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  borderRadius: '4px'
                }}
              />
              <Bar 
                dataKey="employees" 
                barSize={55}
                shape={<CylinderBar />}
                isAnimationActive={false}
              >
                {
                  dummyData.map((entry, index) => {
                    const colors = ['url(#redCylinder)', 'url(#yellowCylinder)', 'url(#greenCylinder)', 'url(#redCylinder)'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
