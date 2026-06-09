import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaIdCard, FaPhone, FaUserShield, FaArrowRight, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import p4 from '../assets/p4.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    nid: '',
    phoneNumber: '',
    role: 'tenant',
  });

  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
      return 'strong';
    }
    return 'medium';
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, formData);
      setShowOtpField(true);
      showToast('success', 'OTP has been sent to your email!');
    } catch (err) {
      showToast('error', err.response?.data?.msg || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp,
      });
      showToast('success', 'Successfully Registered! You can now login.');
      setShowOtpField(false);
      setOtp('');
      setFormData({
        name: '',
        email: '',
        password: '',
        birthDate: '',
        nid: '',
        phoneNumber: '',
        role: 'tenant',
      });
    } catch (err) {
      showToast('error', err.response?.data?.msg || 'OTP Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const strengthConfig = {
    weak: { color: 'bg-red-500', text: 'Weak', width: '33%' },
    medium: { color: 'bg-amber-500', text: 'Medium', width: '66%' },
    strong: { color: 'bg-green-500', text: 'Strong', width: '100%' },
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* Left Side - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
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

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
              Create <span className="text-primary-600">Account</span>
            </h2>
            <p className="mt-2 text-slate-500 font-medium">Join the premier property rental platform.</p>
          </div>

          <AnimatePresence mode="wait">
            {!showOtpField ? (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSendOtp}
                className="space-y-6"
              >
                {/* Role Selection centered in its own box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <label className="block text-xs font-black text-slate-400 text-center mb-3 uppercase tracking-widest">Account Type</label>
                  <div className="flex justify-center gap-4">
                    {['tenant', 'landlord'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData({ ...formData, role })}
                        className={`flex-1 py-3 rounded-xl text-sm font-black capitalize transition-all duration-300 border-2 ${formData.role === role
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

                <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors z-20">
                        <FaUser />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-all duration-200 font-medium"
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-all duration-200 font-medium"
                      />
                    </div>
                  </div>

                  {/* Password */}
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
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-all duration-200 font-medium"
                      />
                    </div>
                    {passwordStrength && (
                      <div className="px-1 pt-1.5">
                        <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: strengthConfig[passwordStrength].width }}
                            className={`h-full ${strengthConfig[passwordStrength].color} transition-all duration-300`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors z-20">
                        <FaPhone />
                      </div>
                      <input
                        type="text"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-all duration-200 font-medium"
                      />
                    </div>
                  </div>

                  {/* NID */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">NID Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors z-20">
                        <FaIdCard />
                      </div>
                      <input
                        type="text"
                        name="nid"
                        required
                        value={formData.nid}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-all duration-200 font-medium"
                      />
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Birth Date</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors z-20">
                        <FaCalendarAlt />
                      </div>
                      <input
                        type="date"
                        name="birthDate"
                        required
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none transition-all duration-200 font-medium text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 mt-8 bg-primary-600 hover:bg-primary-700 text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-xl transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl shadow-primary-600/20 active:scale-95"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Construct Account</span>
                      <FaArrowRight className="text-sm animate-pulse" />
                    </>
                  )}
                </button>

              </motion.form>
            ) : (
              <motion.form
                key="otp-form"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleVerifyOtp}
                className="space-y-8 py-4"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 text-primary-600 text-4xl mb-6">
                    <FaEnvelope />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Verify Your Email</h3>
                  <p className="text-slate-500 mt-2">We've sent a 6-digit verification code to <br /><span className="font-bold text-slate-700">{formData.email}</span></p>
                </div>

                <div className="max-w-xs mx-auto">
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center text-3xl tracking-[1rem] font-bold py-4 rounded-xl border-2 border-slate-200 focus:border-primary-600 focus:ring-0 outline-none transition-all"
                    maxLength={6}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-primary-600/20 active:scale-95"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Verify & Complete</span>
                        <FaCheckCircle />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOtpField(false)}
                    className="text-slate-500 hover:text-slate-700 text-xs font-bold transition-colors uppercase tracking-widest mt-4"
                  >
                    Edit Email Address
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center lg:text-left border-t border-slate-100 pt-8">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center lg:text-left">
            <Link to="/" className="text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors inline-flex items-center gap-2 uppercase tracking-widest">
              ← Return to Home
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
        <img
          src={p4}
          alt="Luxury Property"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <div className="relative z-10 flex flex-col justify-between h-full p-16 w-full text-right">
          <div className="flex justify-end">
            <Link to="/" className="flex items-center gap-3">
              <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
                Property<span className="text-primary-500">Wave</span>
              </span>
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                <FaBuilding className="text-white text-lg" />
              </div>
            </Link>
          </div>

          <div className="text-right">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6">
              Join the Network
            </span>
            <h1 className="text-5xl font-black text-white mb-6 tracking-tighter leading-[1.1] uppercase">
              Discover <br />
              <span className="text-primary-500">Exceptional</span> Living.
            </h1>
            <p className="text-lg text-slate-300 font-medium max-w-md ml-auto">
              Join thousands of landlords and tenants experiencing the future of property management.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;
