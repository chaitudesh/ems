import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Briefcase, Users, Plus } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { role } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', description: '', team_lead_id: '' });
  const [memberIds, setMemberIds] = useState([]);
  const [error, setError] = useState('');

  const fetchData = () => {
    api.get('/projects').then(res => setProjects(res.data)).catch(console.error);
    api.get('/users').then(res => setUsers(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/projects', formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', team_lead_id: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating project');
    }
  };

  const openMembersModal = (project) => {
    setSelectedProject(project);
    setMemberIds(project.members?.map(m => m.id) || []);
    setShowMembersModal(true);
  };

  const toggleMember = (id) => {
    if (memberIds.includes(id)) {
      setMemberIds(memberIds.filter(m => m !== id));
    } else {
      setMemberIds([...memberIds, id]);
    }
  };

  const handleMembersSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/projects/${selectedProject.id}/members`, { user_ids: memberIds });
      setShowMembersModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error assigning members');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500 mt-1">Manage company projects and team assignments</p>
        </div>
        {role === 'Admin' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary px-5 py-2.5 rounded-xl shadow-md flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                  <Briefcase size={24} />
                </div>
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-lg bg-emerald-100 text-emerald-700">
                  {project.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2">{project.description || 'No description provided.'}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Team Lead:</span>
                  <span className="font-semibold text-gray-800">{project.teamLead?.name || project.team_lead?.name || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Members:</span>
                  <span className="font-semibold text-gray-800">{project.members?.length || 0} employees</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => openMembersModal(project)}
              className="w-full bg-white border border-indigo-200 text-indigo-600 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Users size={18} />
              <span>Manage Team</span>
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 font-medium glass-panel">
            No projects found. Click "New Project" to create one.
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Project</h2>
            {error && <div className="mb-6 text-sm text-red-600 bg-red-50/80 p-4 rounded-xl border border-red-100 font-medium">{error}</div>}
            
            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Name</label>
                <input required type="text" className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assign Team Lead</label>
                <select required className="w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.team_lead_id} onChange={e => setFormData({...formData, team_lead_id: e.target.value})}>
                  <option value="">Select a Lead...</option>
                  {users.filter(u => u.roles?.[0]?.name === 'Team Lead').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              
              <div className="pt-6 flex space-x-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3 rounded-xl">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Members Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-white/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Project Team</h2>
            <p className="text-gray-500 mb-6">Select employees to assign to <span className="font-bold text-indigo-600">{selectedProject?.name}</span>.</p>
            
            {error && <div className="mb-6 text-sm text-red-600 bg-red-50/80 p-4 rounded-xl border border-red-100 font-medium">{error}</div>}
            
            <form onSubmit={handleMembersSubmit}>
              <div className="max-h-60 overflow-y-auto space-y-2 mb-6 pr-2">
                {users.filter(u => u.roles?.[0]?.name === 'Employee').map(u => (
                  <label key={u.id} className="flex items-center space-x-3 p-3 hover:bg-white/50 rounded-xl cursor-pointer border border-transparent hover:border-gray-100 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      checked={memberIds.includes(u.id)}
                      onChange={() => toggleMember(u.id)}
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email} • {u.roles?.[0]?.name}</div>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200/50 flex space-x-3">
                <button type="button" onClick={() => setShowMembersModal(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3 rounded-xl">Save Team</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
