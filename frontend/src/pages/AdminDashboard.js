import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion } from 'framer-motion';
import { isAdminAuthenticated } from '../utils/adminAuth';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/DashboardSidebar';
import {
  FaUsers, FaHome, FaUserShield, FaHeadset, FaComments, FaInfoCircle, FaChartBar, FaShieldAlt
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: '0',
    totalProperties: '0',
    totalApplications: '0',
    totalReviews: '0'
  });
  const [, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${adminToken}` } };
      const [usersRes, propsRes, rentalsRes, reviewsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/users`, config),
        axios.get(`${BASE_URL}/api/properties/all`, config),
        axios.get(`${BASE_URL}/api/admin/rentals`, config),
        axios.get(`${BASE_URL}/api/reviews/all`, config)
      ]);

      setStats({
        totalUsers: usersRes.data.length.toString(),
        totalProperties: propsRes.data.length.toString(),
        totalApplications: rentalsRes.data.data.length.toString(),
        totalReviews: reviewsRes.data.length.toString()
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      showToast('error', '⚠️ Failed to synchronize network intelligence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      showToast('error', '🛑 Access restricted. Administrative clearance required.');
      navigate('/admin');
      return;
    }

    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated successfully.');
    navigate('/admin');
  };

  const statCards = [
    { title: 'Global Members', value: stats.totalUsers, icon: <FaUsers />, color: 'bg-blue-50 text-blue-600' },
    { title: 'Asset Inventory', value: stats.totalProperties, icon: <FaHome />, color: 'bg-green-50 text-green-600' },
    { title: 'Market Activity', value: stats.totalApplications, icon: <FaChartBar />, color: 'bg-purple-50 text-purple-600' },
    { title: 'Community Intel', value: stats.totalReviews, icon: <FaComments />, color: 'bg-amber-50 text-amber-600' },
  ];

  const adminActions = [
    { name: 'User Details', path: '/user-details', icon: <FaUsers />, desc: 'Registry of all system participants' },
    { name: 'User Management', path: '/user-management', icon: <FaUserShield />, desc: 'Access control and role management' },
    { name: 'Approvals', path: '/admin-approval', icon: <FaShieldAlt />, desc: 'Asset audit and listing validation' },
    { name: 'Support', path: '/admin-support', icon: <FaHeadset />, desc: 'Client support and inquiries' },
    { name: 'Reviews', path: '/admin/reviews', icon: <FaComments />, desc: 'Community sentiment moderation' },
    { name: 'About', path: '/admin-about', icon: <FaInfoCircle />, desc: 'Global configuration and narrative' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <DashboardSidebar role="admin" onLogout={handleLogout} />

      <main className="flex-grow ml-64 p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Executive Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Executive <span className="text-primary-600">Console</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Global System Oversight & Infrastructure Control</p>
          </div>

          {/* High-Contrast Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">System Infrastructure</h2>
            <div className="h-px flex-grow bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminActions.map((action, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                onClick={() => navigate(action.path)}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-primary-100 transition-all cursor-pointer group relative overflow-hidden"
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
      </main>
    </div>
  );
};

export default AdminDashboard;
