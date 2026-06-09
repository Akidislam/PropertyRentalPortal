import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaThLarge, FaUsers, FaWallet, FaHistory,
  FaStar, FaComments, FaHome, FaCreditCard, FaUserShield, FaInfoCircle, FaHeadset, FaPowerOff, FaPlus, FaCheckCircle
} from 'react-icons/fa';

const DashboardSidebar = ({ role, onLogout }) => {
  const location = useLocation();

  const landlordLinks = [
    { name: 'Overview', path: '/landlord-dashboard', icon: <FaThLarge /> },
    { name: 'Add Property', path: '/add-property', icon: <FaPlus /> },
    { name: 'Rent Approvals', path: '/landlord-approval-rental', icon: <FaUsers /> },
    { name: 'Wallet', path: '/landlord-wallet', icon: <FaWallet /> },
    { name: 'Payment History', path: '/payment-history', icon: <FaHistory /> },
    { name: 'Wallet History', path: '/wallet-history', icon: <FaHistory /> },
    { name: 'Submit Review', path: '/submit-review', icon: <FaStar /> },
    { name: 'View Reviews', path: '/view-reviews', icon: <FaComments /> },
    { name: 'All Users', path: '/all-users', icon: <FaUsers /> },
  ];

  const tenantLinks = [
    { name: 'Overview', path: '/tenant-dashboard', icon: <FaThLarge /> },
    { name: 'Property List', path: '/property-list', icon: <FaHome /> },
    { name: 'Request Rental', path: '/tenant-rental-request', icon: <FaCreditCard /> },
    { name: 'Approved Requests', path: '/tenant-approved-requests', icon: <FaCheckCircle /> },
    { name: 'Wallet', path: '/tenant-wallet', icon: <FaWallet /> },
    { name: 'Payment History', path: '/payment-history', icon: <FaHistory /> },
    { name: 'Wallet History', path: '/wallet-history', icon: <FaHistory /> },
    { name: 'Submit Review', path: '/submit-review', icon: <FaStar /> },
    { name: 'View Reviews', path: '/view-reviews', icon: <FaComments /> },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin-dashboard', icon: <FaThLarge /> },
    { name: 'User Details', path: '/user-details', icon: <FaUsers /> },
    { name: 'User Management', path: '/user-management', icon: <FaUserShield /> },
    { name: 'Approvals', path: '/admin-approval', icon: <FaHome /> },
    { name: 'Support', path: '/admin-support', icon: <FaHeadset /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <FaComments /> },
    { name: 'About', path: '/admin-about', icon: <FaInfoCircle /> },
  ];

  const links = role === 'admin' ? adminLinks : role === 'landlord' ? landlordLinks : tenantLinks;

  return (
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col fixed left-0 top-0 z-40 pt-20 border-r border-white/5">
      <div className="flex-grow px-4 space-y-2 mt-4">
        <div className="px-4 mb-6">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Management</span>
        </div>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${location.pathname === link.path
                ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20 translate-x-1'
                : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`}
          >
            <span className={`text-lg ${location.pathname === link.path ? 'text-white' : 'text-primary-500'}`}>{link.icon}</span>
            <span>{link.name}</span>
          </Link>
        ))}
      </div>

      <div className="p-6">
        <button
          onClick={onLogout}
          className="group flex items-center justify-between w-full px-6 py-4 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 shadow-lg shadow-red-500/5 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="font-black uppercase tracking-widest text-xs relative z-10">Terminate Session</span>
          <FaPowerOff className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
