import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { FaUserPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaIdCard, FaPhone, FaCalendarAlt, FaUserShield, FaHistory } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', password: '', birthDate: '', nid: '', phoneNumber: '', role: 'tenant',
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const getConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
  });

  const fetchUsers = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/api/admin/users`, getConfig())
      .then((res) => { setUsers(res.data); setLoading(false); })
      .catch(() => { showToast('error', 'Failed to fetch users.'); setLoading(false); });
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', birthDate: '', nid: '', phoneNumber: '', role: 'tenant', });
    setEditingUserId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingUserId ? `${BASE_URL}/api/admin/users/${editingUserId}` : `${BASE_URL}/api/admin/users`;
    const method = editingUserId ? axios.put : axios.post;

    method(url, form, getConfig())
      .then(() => {
        showToast('success', `User ${editingUserId ? 'updated' : 'created'} successfully.`);
        fetchUsers();
        resetForm();
      })
      .catch((err) => {
        showToast('error', err.response?.data?.message || 'Operation failed.');
      });
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name, email: user.email, password: '', birthDate: user.birthDate?.substring(0, 10),
      nid: user.nid, phoneNumber: user.phoneNumber, role: user.role,
    });
    setEditingUserId(user._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`${BASE_URL}/api/admin/users/${id}`, getConfig())
        .then(() => { showToast('success', 'User deleted successfully.'); fetchUsers(); })
        .catch(() => { showToast('error', 'Deletion failed.'); });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated.');
    navigate('/admin');
  };

  const groupedUsers = users.reduce((acc, user) => {
    acc[user.role] = acc[user.role] || [];
    acc[user.role].push(user);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <DashboardSidebar role="admin" onLogout={handleLogout} />
      
      <main className="flex-grow ml-64 p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">User <span className="text-primary-600">Management</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Manage tenants and landlords</p>
          </div>

          {/* User Form Card */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 mb-16">
            <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <FaUserShield size={14} />
              </div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{editingUserId ? 'Edit User' : 'Register New User'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleInputChange} required className="input-unique pl-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Digital Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="email" name="email" placeholder="email@domain.com" value={form.email} onChange={handleInputChange} required className="input-unique pl-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Access Token</label>
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleInputChange} required={!editingUserId} className="input-unique" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">National ID</label>
                <div className="relative">
                  <FaIdCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="text" name="nid" placeholder="NID Number" value={form.nid} onChange={handleInputChange} required className="input-unique pl-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Line</label>
                <div className="relative">
                  <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="text" name="phoneNumber" placeholder="+880..." value={form.phoneNumber} onChange={handleInputChange} required className="input-unique pl-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Birth Cycle</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="date" name="birthDate" value={form.birthDate} onChange={handleInputChange} required className="input-unique pl-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Strategic Role</label>
                <select name="role" value={form.role} onChange={handleInputChange} className="input-unique appearance-none cursor-pointer">
                  <option value="tenant">Tenant</option>
                  <option value="landlord">Landlord</option>
                </select>
              </div>

              <div className="lg:col-span-2 flex items-end gap-3">
                <button type="submit" className="flex-grow btn-primary !py-4">
                  {editingUserId ? 'Modify Identity' : 'Register Member'}
                </button>
                {editingUserId && (
                  <button type="button" onClick={resetForm} className="btn-secondary !bg-slate-100 !text-slate-600 !py-4">
                    Abort
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Users List */}
          {['landlord', 'tenant'].map((role) => (
            <div key={role} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{role}s</h3>
                   <div className="h-px w-20 bg-slate-100"></div>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{groupedUsers[role]?.length || 0} Users</span>
                </div>
              </div>
              
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                        <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Communication</th>
                        <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Authentication</th>
                        <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {groupedUsers[role]?.length > 0 ? (
                        groupedUsers[role].map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs">
                                  {u.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-[11px] font-black text-slate-900 uppercase">{u.name}</div>
                                  <div className="text-[9px] text-slate-400 font-bold">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="text-[10px] font-bold text-slate-700">{u.email}</div>
                              <div className="text-[9px] text-slate-400 font-medium">{u.phoneNumber}</div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="text-[10px] font-bold text-slate-700">NID: {u.nid}</div>
                              <div className="text-[9px] text-slate-400 font-medium">DOB: {new Date(u.birthDate).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => navigate(`/user-details/${u._id}`)} className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center" title="View History">
                                  <FaHistory size={10} />
                                </button>
                                <button onClick={() => handleEdit(u)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center">
                                  <FaEdit size={10} />
                                </button>
                                <button onClick={() => handleDelete(u._id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">
                                  <FaTrash size={10} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Registry Empty</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default UserManagement;
