import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion } from 'framer-motion';
import { FaHistory, FaHome, FaCreditCard, FaArrowLeft, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/DashboardSidebar';

const MyProfile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRole = JSON.parse(localStorage.getItem('user'))?.role;

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${BASE_URL}/api/auth/history`, config);
      setData(res.data);
    } catch (err) {
      showToast('error', 'Failed to fetch profile record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return <div className="p-10 text-center">Profile not found</div>;

  const { user, properties, rentalRequests, payments } = data;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar role={userRole} onLogout={handleLogout} />

      <main className="flex-grow lg:ml-64 p-6 md:p-10">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
          <FaArrowLeft /> Return to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 mb-10">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <img
                src={user.profilePicture ? `${BASE_URL}${user.profilePicture}` : 'https://ui-avatars.com/api/?name=' + user.name + '&size=200'}
                alt={user.name}
                className="w-40 h-40 rounded-3xl object-cover ring-8 ring-slate-50 shadow-xl"
                onError={e => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + user.name + '&size=200'; }}
              />
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{user.name}</h1>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'landlord' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {user.role}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <FaEnvelope className="text-slate-300" /> {user.email}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <FaPhone className="text-slate-300" /> {user.phoneNumber}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <FaMapMarkerAlt className="text-slate-300" /> NID: {user.nid}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <FaHistory className="text-slate-300" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-center bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">My Wallet</p>
                <div className="text-4xl font-black tracking-tighter">৳{user.walletcoin || 0}</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Column 1: Activities */}
            <div className="space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <FaHome size={16} />
                  </div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{user.role === 'landlord' ? 'My Asset Portfolio' : 'My Rental Requests'}</h2>
                </div>

                <div className="space-y-4">
                  {(user.role === 'landlord' ? properties : rentalRequests).length > 0 ? (
                    (user.role === 'landlord' ? properties : rentalRequests).map((item) => (
                      <div key={item._id} className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4 hover:shadow-md transition-all group">
                        <img
                          src={user.role === 'landlord' ? `${BASE_URL}${item.images[0]}` : `${BASE_URL}${item.propertyId?.images?.[0]}`}
                          alt="Asset"
                          className="w-20 h-20 rounded-2xl object-cover"
                          onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                        />
                        <div className="flex-grow">
                          <h3 className="text-sm font-black text-slate-900 uppercase truncate">
                            {user.role === 'landlord' ? item.title : item.propertyId?.title}
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {user.role === 'landlord' ? item.location : item.propertyId?.location}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs font-black text-primary-600">৳{user.role === 'landlord' ? item.price : item.propertyPrice}</span>
                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${item.status === 'approved' || item.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-10 rounded-3xl border border-slate-100 border-dashed text-center text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                      No Records Found
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Column 2: Transactions */}
            <div>
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <FaCreditCard size={16} />
                  </div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Financial Transaction Log</h2>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Entity</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {payments.length > 0 ? (
                        payments.map((p) => (
                          <tr key={p._id} className="hover:bg-slate-50/50 transition-all">
                            <td className="px-6 py-4">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${p.type === 'rent' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                {p.type}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-[10px] font-bold text-slate-800 uppercase">{user.role === 'landlord' ? p.tenantId?.name : p.landlordId?.name}</div>
                              <div className="text-[9px] text-slate-400 font-medium lowercase truncate max-w-[100px]">{user.role === 'landlord' ? p.tenantId?.email : p.landlordId?.email}</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="text-[11px] font-black text-slate-900">৳{p.amount}</div>
                              <div className="text-[8px] font-bold text-slate-300 uppercase">{new Date(p.createdAt).toLocaleDateString()}</div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No Transactions</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default MyProfile;
