import { useEffect, useState } from 'react';
import api from '../lib/api';
import { CheckSquare, Plus, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const { role, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', project_id: '', assigned_to: '', due_date: '' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/users').catch(() => ({ data: [] })),
        api.get('/projects').catch(() => ({ data: [] })) 
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/tasks', formData);
      setShowCreateModal(false);
      setFormData({ title: '', description: '', project_id: '', assigned_to: '', due_date: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating task');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/tasks/${id}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-amber-500" />;
      case 'in_progress': return <PlayCircle size={16} className="text-blue-500" />;
      case 'completed': return <CheckCircle2 size={16} className="text-emerald-500" />;
      default: return null;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const canCreateTask = role === 'Admin' || role === 'Team Lead';

  // Compute eligible users based on role and selected project
  let eligibleUsers = [];
  if (role === 'Admin') {
    if (formData.project_id) {
      const selectedProject = projects.find(p => p.id == formData.project_id);
      eligibleUsers = selectedProject?.members || [];
    } else {
      eligibleUsers = users; // Admin sees all users if no project selected
    }
  } else if (role === 'Team Lead') {
    if (formData.project_id) {
      const selectedProject = projects.find(p => p.id == formData.project_id);
      eligibleUsers = selectedProject?.members || [];
    } else {
      // Show all members from all projects the Team Lead manages
      const allMembers = projects.flatMap(p => p.members || []);
      const uniqueMembers = [];
      const map = new Map();
      for (const item of allMembers) {
          if(!map.has(item.id)){
              map.set(item.id, true);
              uniqueMembers.push(item);
          }
      }
      eligibleUsers = uniqueMembers;
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-500 mt-1">Manage project assignments and track progress</p>
        </div>
        {canCreateTask && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow-md flex items-center space-x-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div key={task.id} className="glass-card p-6 flex flex-col justify-between h-full relative group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                    <CheckSquare size={18} />
                  </div>
                  {task.project && (
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                      {task.project.name}
                    </span>
                  )}
                </div>
                <div className={`px-2.5 py-1 flex items-center space-x-1.5 text-[11px] uppercase tracking-wider font-bold rounded-full border ${getStatusBadgeClass(task.status)}`}>
                  {getStatusIcon(task.status)}
                  <span>{task.status.replace('_', ' ')}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{task.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-3">{task.description || 'No description provided.'}</p>
              
              <div className="space-y-2 mb-6 bg-white/50 p-3 rounded-xl border border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Assigned To:</span>
                  <span className="font-semibold text-slate-800">{task.assignee?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Assigned By:</span>
                  <span className="font-semibold text-slate-800">{task.assigner?.name || 'Unknown'}</span>
                </div>
                {task.due_date && (
                  <div className="flex justify-between text-xs pt-2 border-t border-gray-100">
                    <span className="text-slate-500">Due Date:</span>
                    <span className="font-semibold text-rose-600">{task.due_date}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Update Actions - visible to assignee or admin/team lead */}
            <div className="flex space-x-2 mt-auto">
              <select 
                className="w-full text-sm font-semibold p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all shadow-sm cursor-pointer"
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 font-medium glass-panel flex flex-col items-center justify-center">
            <CheckSquare size={48} className="text-slate-300 mb-4" />
            <p>No tasks found.</p>
            {canCreateTask && <p className="text-sm mt-1">Click "New Task" to assign work.</p>}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-lg border border-white/80 my-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Assign New Task</h2>
            {error && <div className="mb-6 text-sm text-red-600 bg-red-50/80 p-4 rounded-xl border border-red-100 font-medium">{error}</div>}
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Task Title *</label>
                <input required type="text" className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="E.g., Implement login page" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Details about the task..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign To *</label>
                  <select required className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" value={formData.assigned_to} onChange={e => setFormData({...formData, assigned_to: e.target.value})}>
                    <option value="">Select Employee...</option>
                    {eligibleUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.roles?.[0]?.name || 'Employee'})</option>)}
                  </select>
                  {eligibleUsers.length === 0 && (
                    <p className="text-xs text-rose-500 mt-1">No eligible employees found for this project.</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
                  <input type="date" className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Link to Project (Optional)</label>
                <select className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" value={formData.project_id} onChange={e => setFormData({...formData, project_id: e.target.value})}>
                  <option value="">No Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              
              <div className="pt-6 flex space-x-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 bg-white border border-gray-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3 rounded-xl">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
