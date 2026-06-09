import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaEnvelope, FaPhone, FaCalendarAlt, FaUserCircle, FaSearch, FaFilter } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/users/all');
        if (res.data) setUsers(res.data);
      } catch { showToast('error', '🛑 Network error while accessing directory.'); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, [showToast]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const grouped = filteredUsers.reduce((acc, user) => {
    acc[user.role] = acc[user.role] || [];
    acc[user.role].push(user);
    return acc;
  }, {});

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
              <FaUsers className="text-primary-600" />
              Community <span className="text-primary-600">Directory</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Discover and connect with verified system participants</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-100">
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="text" placeholder="Search Identity..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all text-[10px] font-bold uppercase tracking-widest text-slate-900" />
            </div>
            <div className="relative w-full sm:w-44">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all appearance-none text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer">
                <option value="all">Global View</option>
                <option value="landlord">Landlords</option>
                <option value="tenant">Tenants</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100">
            <FaUsers size={60} className="text-slate-100 mx-auto mb-8" />
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Participants Detected</h3>
            <p className="text-slate-400 text-xs font-medium mt-2">Adjust your filters to scan other directory segments.</p>
          </div>
        ) : (
          ['landlord', 'tenant'].map(role => grouped[role] && (
            <div key={role} className="mb-20">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">{role} Registry</h2>
                <div className="h-px flex-grow bg-slate-100"></div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{grouped[role].length} Members</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence>
                  {grouped[role].map((u) => (
                    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={u._id}
                      className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden text-center"
                    >
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative inline-block mb-8">
                        <img
                          src={u.profilePicture ? `http://localhost:5000${u.profilePicture}` : 'https://ui-avatars.com/api/?name=' + u.name + '&background=f8fafc&color=cbd5e1'}
                          alt={u.name}
                          className="w-24 h-24 rounded-[2rem] object-cover ring-8 ring-slate-50 group-hover:ring-primary-50 transition-all shadow-md"
                          onError={e => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + u.name + '&background=f8fafc&color=cbd5e1'; }}
                        />
                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg ${role === 'landlord' ? 'bg-indigo-600' : 'bg-primary-600'}`}>
                          <FaUserCircle size={14} />
                        </div>
                      </div>

                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1 truncate">{u.name}</h3>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-8">{role}</p>

                      <div className="space-y-4 pt-8 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-slate-500">
                          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 shrink-0"><FaEnvelope size={10} /></div>
                          <span className="text-[10px] font-bold truncate lowercase">{u.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 shrink-0"><FaPhone size={10} /></div>
                          <span className="text-[10px] font-bold">{u.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 shrink-0"><FaCalendarAlt size={10} /></div>
                          <span className="text-[10px] font-bold">Registry {new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllUsers;
 