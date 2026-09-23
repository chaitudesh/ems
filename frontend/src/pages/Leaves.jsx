import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function Leaves() {
  const { user, role } = useAuth();
  const [myLeaves, setMyLeaves] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [formData, setFormData] = useState({ start_date: '', end_date: '', reason: '' });
  const [leaveBalance, setLeaveBalance] = useState(user?.leave_balance ?? 20);

  const fetchData = () => {
    api.get('/auth/me').then(res => setLeaveBalance(res.data.user.leave_balance)).catch(console.error);
    api.get('/leaves/my').then(res => setMyLeaves(res.data)).catch(console.error);
    
    if (role === 'Team Lead') {
      api.get('/leaves/team').then(res => setTeamLeaves(res.data)).catch(console.error);
    }
    
    if (role === 'Admin' || role === 'HR Manager') {
      api.get('/leaves/all').then(res => setAllLeaves(res.data)).catch(console.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', formData);
      setFormData({ start_date: '', end_date: '', reason: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting leave request');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    await api.post(`/leaves/${id}/status`, { status });
    fetchData();
  };

  const renderTable = (leaves, showActions = false) => (
    <div className="glass-table mt-4">
      <table className="min-w-full divide-y divide-gray-200/50">
        <thead className="bg-gray-50/50 backdrop-blur-sm">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">End Date</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            {showActions && <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/50">
          {leaves.map(leave => (
            <tr key={leave.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.user?.name || user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.start_date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.end_date}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{leave.reason}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                  leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {leave.status}
                </span>
              </td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {leave.status === 'pending' && (
                    <div className="space-x-2">
                      <button onClick={() => handleStatusUpdate(leave.id, 'approved')} className="text-green-600 hover:text-green-900">Approve</button>
                      <button onClick={() => handleStatusUpdate(leave.id, 'rejected')} className="text-red-600 hover:text-red-900">Reject</button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
          {leaves.length === 0 && (
            <tr>
              <td colSpan={showActions ? 6 : 5} className="px-6 py-4 text-center text-gray-500">No leaves found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Leave Management</h1>
        
        {/* Request Leave Form - Everyone can request */}
        <div className="glass-panel p-8 mb-8 max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Request Leave</h2>
            <div className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
              Balance: {leaveBalance} days
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
                <input type="date" required className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
                <input type="date" required className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason</label>
              <textarea className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" rows="2" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
            </div>
            <button type="submit" className="btn-primary px-6 py-3 rounded-xl mt-2">Submit Request</button>
          </form>
        </div>

        {/* Global Leaves for Admin/HR */}
        {(role === 'Admin' || role === 'HR Manager') && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800">All Company Leaves (Action Required)</h2>
            {renderTable(allLeaves, true)}
          </div>
        )}

        {/* Team Leaves for Team Lead */}
        {role === 'Team Lead' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Team Leaves</h2>
            {renderTable(teamLeaves, false)}
          </div>
        )}

        {/* My Leaves */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">My Leave History</h2>
          {renderTable(myLeaves, false)}
        </div>
      </div>
    </div>
  );
}
