import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion } from 'framer-motion';
import { FaWallet, FaEnvelope, FaPhone, FaUserTie, FaUser, FaAddressCard } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/DashboardSidebar';

const UserDetails = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tenants, setTenants] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const admin = JSON.parse(localStorage.getItem('admin'));

  const fetchUsers = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${adminToken}` } };
      const res = await axios.get(`${BASE_URL}/api/admin/users`, config);
      const allUsers = res.data;

      setTenants(allUsers.filter(u => u.role === 'tenant'));
      setLandlords(allUsers.filter(u => u.role === 'landlord'));
    } catch { showToast('error', 'Data synchronization failed.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!admin || !adminToken) { showToast('error', 'Administrative clearance required.'); navigate('/admin'); return; }

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated.');
    navigate('/admin');
  };

  const renderTable = (data, title, icon) => (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm transition-transform hover:scale-110">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{title} Directory</h2>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Registry of verified {title.toLowerCase()} accounts</p>
          </div>
        </div>
        <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{data.length} Entities</span>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Wallet Balance</th>
                <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.length > 0 ? (
                data.map((u) => (
                  <tr
                    key={u._id}
                    onClick={() => navigate(`/user-details/${u._id}`)}
                    className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <img
                          src={u.profilePicture ? `${BASE_URL}${u.profilePicture}` : 'https://ui-avatars.com/api/?name=' + u.name + '&background=f8fafc&color=cbd5e1'}
                          alt={u.name}
                          className="w-12 h-12 rounded-xl object-cover ring-4 ring-slate-50 group-hover:ring-white transition-all shadow-sm"
                          onError={e => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + u.name + '&background=f8fafc&color=cbd5e1'; }}
                        />
                        <div>
                          <div className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[150px]">{u.name}</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                            <FaAddressCard size={10} className="text-primary-500" /> NID: {u.nid}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                          <FaEnvelope className="text-slate-200" size={10} />
                          {u.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                          <FaPhone className="text-slate-200" size={10} />
                          {u.phoneNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-xl font-black text-[11px] border border-amber-100/50 uppercase tracking-tighter">
                        <FaWallet size={10} />
                        {u.walletcoin} <span className="opacity-40 text-[9px]">Credits</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Registry Segment Empty</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <DashboardSidebar role="admin" onLogout={handleLogout} />

      <main className="flex-grow ml-64 p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">User <span className="text-primary-600">Details</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Comprehensive list of all system participants</p>
          </div>

          {loading ? (
            <div className="py-32 text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Loading User Data...</p>
            </div>
          ) : (
            <>
              {renderTable(landlords, 'Landlord', <FaUserTie />)}
              {renderTable(tenants, 'Tenant', <FaUser />)}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default UserDetails;
