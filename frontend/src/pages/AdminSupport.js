import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaUser, FaComment, FaTimes, FaHeadset, FaSearch, FaFilter, FaCalendarAlt, FaRocket, FaCheckCircle } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [solution, setSolution] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/support/tickets`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setTickets(res.data.data);
    } catch { showToast('error', '🛑 Ticket synchronization failed.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitSolution = async (ticketId) => {
    if (!solution.trim()) { showToast('error', '🛑 Resolution narrative required.'); return; }
    try {
      const res = await axios.put(`${BASE_URL}/api/support/tickets/${ticketId}`,
        { solution: solution.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      if (res.data.success) {
        showToast('success', '✨ Resolution transmitted. Inquiry finalized.');
        setSelectedTicket(null); setSolution(''); fetchTickets();
      }
    } catch { showToast('error', '🛑 Transmission error.'); }
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated.');
    navigate('/admin');
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <DashboardSidebar role="admin" onLogout={handleLogout} />

      <main className="flex-grow ml-64 p-10 text-slate-900">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Resolution <span className="text-primary-600">Desk</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Global user inquiry and conflict resolution hub</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Filter inquiries..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:border-primary-500 outline-none transition-all w-64 shadow-sm text-xs font-bold" />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-11 pr-8 py-3 bg-white border border-slate-100 rounded-2xl focus:border-primary-500 outline-none transition-all appearance-none text-xs font-bold text-slate-600 shadow-sm cursor-pointer">
                  <option value="all">Global</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-32 text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Accessing Secure Logs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredTickets.map((t) => (
                  <motion.div layout key={t._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all p-8 flex flex-col group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-[2rem] transition-all group-hover:bg-primary-50"></div>
                    <div className="flex items-center justify-between mb-8">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${t.status === 'resolved' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                        {t.status}
                      </span>
                      <div className="text-[9px] font-black text-slate-300 flex items-center gap-1 uppercase tracking-widest relative z-10">
                        <FaCalendarAlt /> {new Date(t.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
                          <FaUser size={10} />
                        </div>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate">{t.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
                          <FaEnvelope size={10} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 truncate">{t.email}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-[1.5rem] p-6 mb-8 flex-grow">
                      <div className="flex gap-2 text-slate-300 mb-3">
                        <FaComment size={10} className="mt-1" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">User Transmission</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-4 font-medium">"{t.message}"</p>
                    </div>

                    {t.solution ? (
                      <div className="bg-green-50 rounded-[1.5rem] p-6 border border-green-100/50">
                        <div className="flex gap-2 text-green-600 mb-3">
                          <FaCheckCircle size={10} className="mt-1" />
                          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Resolution Logic</span>
                        </div>
                        <p className="text-xs text-green-700 font-bold line-clamp-3 leading-relaxed">{t.solution}</p>
                      </div>
                    ) : (
                      <button onClick={() => setSelectedTicket(t)} className="w-full btn-primary !py-4 !rounded-[1.5rem]">
                        Deploy Resolution
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {filteredTickets.length === 0 && !loading && (
            <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100">
              <FaHeadset size={60} className="text-slate-100 mx-auto mb-8" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Queue Clear</h3>
              <p className="text-slate-400 text-xs font-medium mt-2">All user inquiries have been synthesized.</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTicket(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-12">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm">
                      <FaHeadset size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Issue <span className="text-primary-600">Resolution</span></h2>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Ticket ID: {selectedTicket._id.slice(-8)}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTicket(null)} className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-all">
                    <FaTimes size={18} />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary-500 via-transparent to-transparent"></div>
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                      <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Inquiry Vector</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic font-medium relative z-10">"{selectedTicket.message}"</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Resolution Matrix</label>
                    <textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Describe the deployment steps..."
                      className="w-full h-44 px-8 py-6 rounded-[2rem] bg-slate-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none text-sm font-bold text-slate-700 placeholder:text-slate-300" />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setSelectedTicket(null)} className="flex-1 btn-secondary !bg-slate-100 !text-slate-500 !rounded-[1.5rem]">Dismiss</button>
                    <button onClick={() => handleSubmitSolution(selectedTicket._id)} className="flex-[2] btn-primary !rounded-[1.5rem] flex items-center justify-center gap-3">
                      <FaRocket /> Deploy Solution
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSupport;