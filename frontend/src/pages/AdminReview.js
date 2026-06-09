import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaTrash, FaSearch, FaSort, FaStar, FaBuilding, FaQuoteLeft, FaComments } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchReviews(); }, [sortBy, searchTerm]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      const res = await axios.get(`http://localhost:5000/api/reviews/admin/all?sortBy=${sortBy}&search=${searchTerm}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setReviews(res.data);
    } catch { showToast('error', '🛑 Intelligence retrieval failed.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Execute narrative deletion?')) return;
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/reviews/admin/${reviewId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      showToast('success', '✨ Narrative purged from the intelligence core.');
      fetchReviews();
    } catch { showToast('error', '🛑 Operation aborted.'); }
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated.');
    navigate('/admin');
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5 text-amber-400">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className={i < rating ? 'fill-current' : 'text-slate-100'} size={10} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <DashboardSidebar role="admin" onLogout={handleLogout} />

      <main className="flex-grow ml-64 p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Community <span className="text-primary-600">Intelligence</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Moderate and analyze community sentiment and feedback</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search narratives..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:border-primary-500 outline-none transition-all w-64 shadow-sm text-xs font-bold" />
              </div>
              <div className="relative">
                <FaSort className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="pl-11 pr-8 py-3 bg-white border border-slate-100 rounded-2xl focus:border-primary-500 outline-none transition-all appearance-none text-xs font-bold text-slate-600 shadow-sm cursor-pointer">
                  <option value="date">Most Recent</option>
                  <option value="rating">Highest Tier</option>
                  <option value="name">Alpha Order</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Focus</th>
                    <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Narrative Source</th>
                    <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Sentiment</th>
                    <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                    <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                           <FaComments className="text-slate-100" size={40} />
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{loading ? 'Synthesizing...' : 'No Narrative Data Available'}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reviews.map((r) => (
                      <tr key={r._id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                              <FaBuilding size={10} />
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-slate-900 uppercase truncate max-w-[120px]">{r.propertyTitle}</div>
                              <div className="text-[9px] text-slate-400 font-medium truncate max-w-[120px]">{r.propertyAddress}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px]">
                              {r.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-slate-900 uppercase truncate max-w-[100px]">{r.name}</div>
                              <div className="text-[9px] text-slate-400 font-medium truncate max-w-[100px]">{r.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-2 max-w-xs">
                            {renderStars(r.rating)}
                            <div className="flex gap-2">
                              <FaQuoteLeft className="text-slate-100 shrink-0" size={8} />
                              <p className="text-[10px] text-slate-500 italic line-clamp-2 font-medium">"{r.review}"</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-[10px] font-bold text-slate-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5 text-right whitespace-nowrap">
                          <button onClick={() => handleDelete(r._id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center ml-auto">
                            <FaTrash size={10} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminReview;