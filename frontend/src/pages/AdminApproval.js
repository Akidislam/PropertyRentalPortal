import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { FaCheck, FaTimes, FaHome, FaUser, FaMapMarkerAlt, FaFileContract } from 'react-icons/fa';

const AdminApproval = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      const res = await axios.get(`${BASE_URL}/api/admin/properties`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setProperties(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showToast('error', '🛑 Network synchronization failed. Registry unavailable.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const res = await axios.post(`${BASE_URL}/api/admin/approve/${id}`, { status }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setProperties(prev =>
        prev.map(p => (p._id === id ? { ...p, status: res.data.status } : p))
      );
      showToast('success', `✨ Asset ${status.toUpperCase()} in the premium directory.`);
    } catch (err) {
      showToast('error', '⚠️ Protocol error. Action could not be executed.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated successfully.');
    navigate('/admin');
  };

  const getImageUrl = (images) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return 'https://via.placeholder.com/120x80?text=No+Image';
    }
    const imageUrl = images[0];
    if (!imageUrl) return 'https://via.placeholder.com/120x80?text=No+Image';
    return imageUrl.startsWith('http')
      ? imageUrl
      : `${BASE_URL}${imageUrl.startsWith('/') ? '' : '/uploads/'}${imageUrl}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <DashboardSidebar role="admin" onLogout={handleLogout} />
      
      <main className="flex-grow ml-64 p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Asset <span className="text-primary-600">Verification</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Audit and authenticate premium property listings</p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                    <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Originator</th>
                    <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Specifications</th>
                    <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Valuation</th>
                    <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {properties.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                           <FaFileContract className="text-slate-100" size={40} />
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                             {loading ? 'Synchronizing Registry...' : 'No Assets Pending Verification'}
                           </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    properties.map((property) => (
                      <tr key={property._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <img
                              src={getImageUrl(property.images)}
                              alt={property.title}
                              className="w-16 h-12 rounded-xl object-cover shadow-sm border border-slate-100 transition-transform group-hover:scale-105"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/120x80?text=No+Image';
                              }}
                            />
                            <div>
                              <div className="text-xs font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px]">{property.title}</div>
                              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                                <FaHome className="text-primary-500" size={10} /> {property.type}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                              <FaUser size={10} />
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-slate-900 uppercase truncate max-w-[100px]">{property.uploaderName}</div>
                              <div className="text-[9px] text-slate-400 font-medium lowercase truncate max-w-[100px]">{property.uploaderEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 truncate max-w-[150px]">
                              <FaMapMarkerAlt className="text-primary-500" size={10} />
                              {property.address}
                            </div>
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                              {property.rooms}R • {property.bathrooms}B • {property.area}SQFT
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <div className="text-xs font-black text-slate-900">৳{property.price}</div>
                          <div className="text-[9px] font-bold text-slate-400 opacity-60">৳{property.advance} ADV</div>
                        </td>
                        <td className="px-6 py-5 text-center whitespace-nowrap">
                          <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
                            property.status === 'approved' 
                              ? 'bg-green-50 text-green-600 border border-green-100' 
                              : property.status === 'rejected'
                              ? 'bg-red-50 text-red-600 border border-red-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100 shadow-sm shadow-amber-600/5 animate-pulse'
                          }`}>
                            {property.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right whitespace-nowrap">
                          {property.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleAction(property._id, 'approved')}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-primary-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                                title="Authorize"
                              >
                                <FaCheck size={10} />
                              </button>
                              <button
                                onClick={() => handleAction(property._id, 'rejected')}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm active:scale-95"
                                title="Invalidate"
                              >
                                <FaTimes size={10} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest italic">Archived</span>
                          )}
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

export default AdminApproval;
