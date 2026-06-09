import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPlus, FaTimes, FaInfoCircle, FaBullseye, FaLightbulb, FaRocket, FaUsers, FaEnvelope } from 'react-icons/fa';
import { isAdminAuthenticated } from '../utils/adminAuth';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/DashboardSidebar';

const AdminAbout = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const initialFormData = {
    title: '',
    subquote: '',
    mission: '',
    vision: '',
    features: [],
    forTenant: '',
    forLandlord: '',
    contact: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  };

  const [formData, setFormData] = useState(initialFormData);
  const [newFeature, setNewFeature] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      showToast('error', 'Please login to access admin features');
      navigate('/admin');
      return;
    }
    fetchAboutContent();
  }, [navigate]);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.get(`${BASE_URL}/api/about`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (response?.data?.data) {
        const data = response.data.data;
        setFormData({
          title: data.title || '',
          subquote: data.subquote || '',
          mission: data.mission || '',
          vision: data.vision || '',
          features: Array.isArray(data.features) ? data.features : [],
          forTenant: data.forTenant || '',
          forLandlord: data.forLandlord || '',
          contact: data.contact || '',
          socialLinks: {
            facebook: data.socialLinks?.facebook || '',
            twitter: data.socialLinks?.twitter || '',
            linkedin: data.socialLinks?.linkedin || '',
            instagram: data.socialLinks?.instagram || ''
          }
        });
      }
    } catch (error) {
      showToast('error', 'Failed to fetch about content');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
      showToast('success', 'Feature added');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.post(`${BASE_URL}/api/about`, formData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (response.data.success) {
        showToast('success', 'System information updated successfully');
      }
    } catch (error) {
      showToast('error', 'Failed to update system information');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', 'Admin logged out');
    navigate('/admin');
  };

  if (loading && !formData.title) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar role="admin" onLogout={handleLogout} />

      <main className="flex-grow ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">System Information</h1>
              <p className="text-slate-500 mt-1 font-medium">Manage public About page content</p>
            </div>
            <button 
              onClick={handleSubmit}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98]"
            >
              Save All Changes
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FaInfoCircle />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Headline & Quote</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Page Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required 
                    className="w-full px-6 py-3.5 rounded-2xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Sub-headline / Quote</label>
                  <input type="text" name="subquote" value={formData.subquote} onChange={handleChange} required 
                    className="w-full px-6 py-3.5 rounded-2xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-slate-600" />
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <FaBullseye />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
                </div>
                <textarea name="mission" value={formData.mission} onChange={handleChange} required 
                  className="w-full h-40 px-6 py-5 rounded-[2rem] border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none text-slate-600 leading-relaxed" />
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <FaLightbulb />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Our Vision</h2>
                </div>
                <textarea name="vision" value={formData.vision} onChange={handleChange} required 
                  className="w-full h-40 px-6 py-5 rounded-[2rem] border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none text-slate-600 leading-relaxed" />
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <FaRocket />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Key Features</h2>
              </div>
              <div className="flex gap-3 mb-6">
                <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Add a new feature tag..." 
                  className="flex-grow px-6 py-3.5 rounded-2xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all" />
                <button type="button" onClick={handleAddFeature} className="bg-slate-900 text-white font-bold px-8 rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2">
                  <FaPlus /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700">
                    {feature}
                    <button type="button" onClick={() => handleRemoveFeature(index)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* User Target Info */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FaUsers />
                </div>
                <h2 className="text-xl font-bold text-slate-900">User Value Proposition</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">For Tenants</label>
                  <textarea name="forTenant" value={formData.forTenant} onChange={handleChange} required 
                    className="w-full h-32 px-6 py-4 rounded-[1.5rem] border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none text-sm text-slate-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">For Landlords</label>
                  <textarea name="forLandlord" value={formData.forLandlord} onChange={handleChange} required 
                    className="w-full h-32 px-6 py-4 rounded-[1.5rem] border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none text-sm text-slate-600" />
                </div>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <FaEnvelope />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Contact & Social</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Contact Summary</label>
                  <textarea name="contact" value={formData.contact} onChange={handleChange} required 
                    className="w-full h-full min-h-[150px] px-6 py-4 rounded-[1.5rem] border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none text-sm text-slate-600" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><FaFacebook className="text-blue-600" /> Facebook</label>
                    <input type="url" name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleChange} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><FaTwitter className="text-sky-400" /> Twitter</label>
                    <input type="url" name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleChange} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><FaLinkedin className="text-blue-700" /> LinkedIn</label>
                    <input type="url" name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><FaInstagram className="text-pink-600" /> Instagram</label>
                    <input type="url" name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminAbout; 
 