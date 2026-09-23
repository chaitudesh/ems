import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Download } from 'lucide-react';

export default function Attendance() {
  const { user, role } = useAuth();
  const [myAttendance, setMyAttendance] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);

  const fetchData = () => {
    api.get('/attendance/my').then(res => setMyAttendance(res.data)).catch(console.error);
    
    if (role === 'Admin' || role === 'HR Manager') {
      api.get('/attendance/all').then(res => setAllAttendance(res.data)).catch(console.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  const handleCheckIn = async () => {
    await api.post('/attendance/check-in');
    fetchData();
  };

  const handleCheckOut = async () => {
    await api.post('/attendance/check-out');
    fetchData();
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const downloadCSV = () => {
    if (allAttendance.length === 0) return;
    
    const headers = ['Date', 'Employee', 'Check In', 'Check Out'];
    const rows = allAttendance.map(log => [
      log.date,
      log.user?.name || 'Unknown',
      formatTime(log.check_in),
      formatTime(log.check_out)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(item => `"${item}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_Log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTable = (logs, showUserCol) => (
    <div className="glass-table mt-4">
      <table className="min-w-full divide-y divide-gray-200/50">
        <thead className="bg-gray-50/50 backdrop-blur-sm">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
            {showUserCol && (
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
            )}
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Check In</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Check Out</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/50">
          {logs.map(log => (
            <tr key={log.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.date}</td>
              {showUserCol && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.user?.name || 'Unknown'}</td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{formatTime(log.check_in)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{formatTime(log.check_out)}</td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan={showUserCol ? 4 : 3} className="px-6 py-4 text-center text-gray-500">No attendance records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Attendance Tracking</h1>
        
        {/* Actions */}
        <div className="glass-panel p-8 mb-8 max-w-lg flex space-x-6">
          <button onClick={handleCheckIn} className="flex-1 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all duration-200">
            Check In
          </button>
          <button onClick={handleCheckOut} className="flex-1 bg-gradient-to-br from-rose-400 to-rose-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-rose-500/30 transform hover:-translate-y-0.5 transition-all duration-200">
            Check Out
          </button>
        </div>

        {/* Global Attendance for Admin/HR */}
        {(role === 'Admin' || role === 'HR Manager') && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Company-wide Attendance Log</h2>
              <button 
                onClick={downloadCSV}
                className="btn-primary px-4 py-2 rounded-xl text-sm flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Download CSV</span>
              </button>
            </div>
            {renderTable(allAttendance, true)}
          </div>
        )}

        {/* My Attendance */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">My Recent Attendance</h2>
          {renderTable(myAttendance, false)}
        </div>
      </div>
    </div>
  );
}
