import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Employees() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    department_id: ''
  });
  const [error, setError] = useState('');

  const fetchData = () => {
    api.get('/users').then(res => setUsers(res.data)).catch(console.error);
    api.get('/departments').then(res => setDepartments(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/users', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'Employee', department_id: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating employee');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Employees Directory</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary px-5 py-2.5 rounded-xl shadow-md flex items-center space-x-2"
        >
          <span className="text-lg font-bold leading-none mb-0.5">+</span>
          <span>Add Employee</span>
        </button>
      </div>

      <div className="glass-table">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gray-50/50 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-lg bg-indigo-100/80 text-indigo-700 border border-indigo-200">
                    {user.roles?.[0]?.name || 'Employee'}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/50 transform scale-100 transition-all">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Employee</h2>
            {error && <div className="mb-6 text-sm text-red-600 bg-red-50/80 p-4 rounded-xl border border-red-100 font-medium">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input required type="text" className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input required type="email" className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Temporary Password</label>
                <input required type="password" minLength={6} className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                  <select required className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})}>
                    <option value="">Select...</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                  <select required className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="Employee">Employee</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-6 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3 rounded-xl">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
