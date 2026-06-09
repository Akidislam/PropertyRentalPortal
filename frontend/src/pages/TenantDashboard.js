import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import UpdateProfile from '../components/UpdateProfile';
import DashboardSidebar from '../components/DashboardSidebar';
import {
  FaHome, FaWallet, FaCreditCard, FaHistory, FaStar, FaUserEdit, FaSearch, FaMapMarkerAlt, FaUser, FaCheckCircle
} from 'react-icons/fa';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const localUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(localUser);
  const [loading, setLoading] = useState(true);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const [stats, setStats] = useState({
    activeStays: '0',
    pendingApps: '0',
    totalInvestment: '৳0'
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/rentalrequests/tenant/${localUser.email}`);
      const activeStays = res.data.filter(r => r.status === 'Approved');
      const pendingApps = res.data.filter(r => r.status === 'Pending');
      const investment = activeStays.reduce((acc, curr) => acc + (Number(curr.propertyPrice) || 0), 0);

      setStats({
        activeStays: activeStays.length.toString(),
        pendingApps: pendingApps.length.toString(),
        totalInvestment: `৳${investment.toLocaleString()}`
      });
    } catch (error) {
      console.error('Error fetching tenant stats:', error);
    }
  };

  const fetchUpdatedUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/wallet/${localUser._id}`);
      const updatedUser = { ...user, walletcoin: res.data.walletcoin };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      await fetchStats();
    } catch (error) {
      showToast('error', '⚠️ Session desynchronized. Please re-login.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localUser || localUser.role !== 'tenant') {
      showToast('error', '🛑 Access denied. Tenant credentials required.');
      navigate('/login');
    } else {
      fetchUpdatedUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated successfully.');
    navigate('/login');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    showToast('success', '✨ Profile identity updated.');
  };

  const statCards = [
    { title: 'Active Stays', value: stats.activeStays, icon: <FaHome />, color: 'bg-blue-50 text-blue-600' },
    { title: 'Pending Apps', value: stats.pendingApps, icon: <FaCreditCard />, color: 'bg-amber-50 text-amber-600' },
    { title: 'Wallet Balance', value: user?.walletcoin || '0', icon: <FaWallet />, color: 'bg-green-50 text-green-600' },
    { title: 'Total Investment', value: stats.totalInvestment, icon: <FaHistory />, color: 'bg-purple-50 text-purple-600' },
  ];

  const actionCards = [
    { name: 'Browse Assets', path: '/property-list', icon: <FaSearch />, desc: 'Discover premium rental listings' },
    { name: 'New Application', path: '/tenant-rental-request', icon: <FaCreditCard />, desc: 'Submit a new stay request' },
    { name: 'Active Rentals', path: '/tenant-approved-requests', icon: <FaCheckCircle />, desc: 'Manage your current residencies' },
    { name: 'Wallet Hub', path: '/tenant-wallet', icon: <FaWallet />, desc: 'Manage your stay-related funds' },
    { name: 'Payment Logs', path: '/payment-history', icon: <FaHistory />, desc: 'Audit your transaction history' },
    { name: 'My Profile', path: '/my-profile', icon: <FaUser />, desc: 'View your full rental history record' },
    { name: 'Submit Feedback', path: '/submit-review', icon: <FaStar />, desc: 'Rate your residency experience' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <DashboardSidebar role="tenant" onLogout={handleLogout} />

      <main className="flex-grow ml-64 p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Executive Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Tenant <span className="text-primary-600">Console</span></h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Lifestyle Analytics & Stay Management</p>
            </div>

            <div className="bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-all duration-500">
              <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-slate-50">
                <img
                  src={user?.profilePicture ? `${BASE_URL}${user.profilePicture}` : 'https://ui-avatars.com/api/?name=' + user?.name + '&background=0ea5e9&color=fff'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + user?.name + '&background=0ea5e9&color=fff'; }}
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900 truncate max-w-[150px]">{user?.name}</p>
                <button onClick={() => setShowUpdateProfile(true)} className="text-[10px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-1 hover:text-primary-700 transition-colors mt-0.5">
                  <FaUserEdit size={10} /> Update Profile
                </button>
              </div>
            </div>
          </div>

          {/* High-Contrast Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            {statCards.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-2xl transition-all duration-500"
              >
                <div className={`w-14 h-14 ${stat.color.split(' ')[0]} rounded-2xl flex items-center justify-center text-xl transition-all duration-500 group-hover:scale-110`}>
                  <div className={stat.color.split(' ')[1]}>{stat.icon}</div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Operations Grid */}
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Navigation</h2>
            <div className="h-px flex-grow bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {actionCards.map((action, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                onClick={() => navigate(action.path)}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary-100 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:bg-primary-50"></div>
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 mb-8 relative z-10">
                  {action.icon}
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight group-hover:text-primary-600 transition-colors">{action.name}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{action.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {showUpdateProfile && (
          <UpdateProfile
            onClose={() => setShowUpdateProfile(false)}
            onUpdate={handleProfileUpdate}
          />
        )}
      </main>
    </div>
  );
};

export default TenantDashboard;
