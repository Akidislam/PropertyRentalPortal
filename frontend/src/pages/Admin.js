import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaShieldAlt, FaUserShield, FaLock, FaBuilding, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import p1 from '../assets/p1.jpg';

const Admin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', formData);
      localStorage.setItem('admin', JSON.stringify(res.data.user));
      localStorage.setItem('adminToken', res.data.token);
      showToast('success', 'Admin login successful! Redirecting...');
      setTimeout(() => navigate('/admin-dashboard'), 1000);
    } catch (err) {
      showToast('error', 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
        <img 
          src={p1} 
          alt="Luxury Property" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-between h-full p-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
              <FaBuilding className="text-white text-lg" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
              Property<span className="text-primary-500">Wave</span>
            </span>
          </Link>

          <div>
            <span className="inline-block px-4 py-2 bg-red-600/20 backdrop-blur-md border border-red-500/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-red-100 mb-6">
              Restricted Area
            </span>
            <h1 className="text-5xl font-black text-white mb-6 tracking-tighter leading-[1.1] uppercase">
              Admin <br />
              <span className="text-primary-500">Control Panel</span>.
            </h1>
            <p className="text-lg text-slate-300 font-medium max-w-md">
              Secure access for authorized administrators only. Monitor and manage the PropertyWave ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Admin Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center lg:text-left mb-10">
            <Link to="/" className="lg:hidden inline-flex items-center gap-3 justify-center mb-8">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                <FaBuilding className="text-white text-lg" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                Property<span className="text-primary-600">Wave</span>
              </span>
            </Link>
            
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
              Admin Login
            </h2>
            <p className="mt-2 text-slate-500 font-medium">Enter your credentials to access the console</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Username Field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Admin Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors z-20">
                    <FaUserShield />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors z-20">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-all duration-200 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Slider Security Check */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-6">
              <div className="relative h-14 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                <span className={`text-sm font-bold uppercase tracking-widest ${isVerified ? 'text-green-500' : 'text-slate-400'}`}>
                  {isVerified ? 'Verified' : 'Slide to Verify'}
                </span>
                
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 260 }} // Approximate width of container minus slider
                  dragElastic={0}
                  dragMomentum={false}
                  onDragEnd={(e, info) => {
                    if (info.offset.x > 200) {
                      setIsVerified(true);
                    }
                  }}
                  className={`absolute left-1 w-12 h-12 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md ${isVerified ? 'bg-green-500 text-white' : 'bg-primary-600 text-white'}`}
                >
                  {isVerified ? <FaCheckCircle /> : <FaArrowRight />}
                </motion.div>
                
                {isVerified && (
                   <motion.div 
                     initial={{ width: 0 }} 
                     animate={{ width: '100%' }} 
                     className="absolute left-0 top-0 h-full bg-green-500/10 pointer-events-none" 
                   />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isVerified}
              className={`w-full py-4 font-black text-sm uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl active:scale-95 mt-8 ${
                isVerified 
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Authenticate</span>
                  <FaShieldAlt className="text-sm" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-12 text-center lg:text-left">
             <Link to="/" className="text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors inline-flex items-center gap-2 uppercase tracking-widest">
               ← Return to Home
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
