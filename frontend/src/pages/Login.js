import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt, FaEnvelope, FaLock, FaUserShield, FaBuilding, FaArrowRight, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import p7 from '../assets/p7.jpg';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    role: 'tenant'
  });
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      if (res.data && res.data.token && res.data.user) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        showToast('success', 'Login successful! Redirecting...');
        setTimeout(() => {
          if (user.role === 'landlord') {
            navigate('/landlord-dashboard');
          } else if (user.role === 'tenant') {
            navigate('/tenant-dashboard');
          }
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
        <img 
          src={p7} 
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
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6">
              Welcome Back
            </span>
            <h1 className="text-5xl font-black text-white mb-6 tracking-tighter leading-[1.1] uppercase">
              Your Premium <br />
              <span className="text-primary-500">Dashboard</span> Awaits.
            </h1>
            <p className="text-lg text-slate-300 font-medium max-w-md">
              Sign in to manage your properties, track requests, and access your secure wallet.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
              Sign In
            </h2>
            <p className="mt-2 text-slate-500 font-medium">Please enter your details to continue</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <label className="block text-xs font-black text-slate-400 text-center mb-3 uppercase tracking-widest">Account Type</label>
              <div className="flex justify-center gap-4">
                {['tenant', 'landlord'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`flex-1 py-3 rounded-xl text-sm font-black capitalize transition-all duration-300 border-2 ${
                      formData.role === role 
                        ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/30' 
                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaUserShield className="text-base" />
                      <span>{role}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors z-20">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
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
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
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
                  <span>Sign In</span>
                  <FaSignInAlt className="text-sm" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center lg:text-left">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">
                Create one now
              </Link>
            </p>
          </div>
          
          <div className="mt-8 text-center lg:text-left">
             <Link to="/" className="text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors inline-flex items-center gap-2 uppercase tracking-widest">
               ← Return to Home
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
