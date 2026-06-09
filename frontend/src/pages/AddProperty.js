import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { FaInfoCircle, FaHome, FaMoneyBillWave, FaUser, FaImage, FaRocket } from 'react-icons/fa';

const AddProperty = () => {
   const [formData, setFormData] = useState({
      title: '',
      description: '',
      type: 'Apartment',
      address: '',
      location: '',
      area: '',
      rooms: '',
      bathrooms: '',
      price: '',
      advance: '',
      phone: '',
      rentType: 'Monthly',
      uploaderName: '',
      uploaderEmail: ''
   });

   const [images, setImages] = useState([]);
   const [loading, setLoading] = useState(false);
   const { showToast } = useToast();

   // Get user or admin from localStorage
   const user = JSON.parse(localStorage.getItem('user'));
   const admin = JSON.parse(localStorage.getItem('admin'));
   const currentUser = user || admin;
   const role = user ? user.role : 'admin';

   useEffect(() => {
      if (currentUser) {
         setFormData(prev => ({
            ...prev,
            uploaderName: currentUser.name || currentUser.username || '',
            uploaderEmail: currentUser.email || (admin ? 'admin@propertywave.com' : '')
         }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [showToast]);

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleImageChange = (e) => {
      setImages(e.target.files);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
         form.append(key, value);
      });
      for (let i = 0; i < images.length; i++) {
         form.append('images', images[i]);
      }

      try {
         await axios.post(`${BASE_URL}/api/properties/add`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
         });
         showToast('success', '✨ Asset successfully registered in our premium network.');
         // Reset form
         setFormData({
            title: '', description: '', type: 'Apartment', address: '',
            location: '', area: '', rooms: '', bathrooms: '', price: '',
            advance: '', phone: '', rentType: 'Monthly',
            uploaderName: currentUser?.name || '',
            uploaderEmail: currentUser?.email || ''
         });
         setImages([]);
      } catch (err) {
         showToast('error', '🛑 Registration failed. Please audit your data inputs.');
      } finally {
         setLoading(false);
      }
   };

   const handleLogout = () => {
      localStorage.clear();
      showToast('success', '✨ Session terminated successfully.');
      window.location.href = '/login';
   };

   return (
      <div className="min-h-screen bg-slate-50 flex">
         <DashboardSidebar role={role} onLogout={handleLogout} />

         <main className="flex-grow ml-64 p-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-5xl mx-auto"
            >
               {/* Header */}
               <div className="mb-12">
                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Register <span className="text-primary-600">Asset</span></h1>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Introduce a new premium property to the ecosystem</p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                  {/* Basic Info */}
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                     <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                           <FaInfoCircle size={14} />
                        </div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Asset Foundation</h2>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Property Designation</label>
                           <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Skyline Penthouse" required className="input-unique" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Classification</label>
                           <select name="type" value={formData.type} onChange={handleChange} className="input-unique appearance-none cursor-pointer">
                              <option>Apartment</option>
                              <option>Villa</option>
                              <option>Studio</option>
                              <option>Commercial</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Region / Location</label>
                           <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Gulshan-2" required className="input-unique" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Physical Address</label>
                           <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Full street details" required className="input-unique" />
                        </div>
                     </div>
                  </div>

                  {/* Metrics */}
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                     <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                           <FaHome size={14} />
                        </div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Spatial Metrics</h2>
                     </div>

                     <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Area (SQFT)</label>
                           <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder="0" required className="input-unique" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Room Count</label>
                           <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} placeholder="0" required className="input-unique" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Bathrooms</label>
                           <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="0" required className="input-unique" />
                        </div>
                     </div>
                  </div>

                  {/* Financials */}
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                     <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                           <FaMoneyBillWave size={14} />
                        </div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Financial Structure</h2>
                     </div>

                     <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Monthly Yield (৳)</label>
                           <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0" required className="input-unique" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Advance Lock (৳)</label>
                           <input type="number" name="advance" value={formData.advance} onChange={handleChange} placeholder="0" required className="input-unique" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Cycle</label>
                           <select name="rentType" value={formData.rentType} onChange={handleChange} className="input-unique appearance-none cursor-pointer">
                              <option>Monthly</option>
                              <option>Yearly</option>
                              <option>Contract</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                     <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                           <FaUser size={14} />
                        </div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Contact Information</h2>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Contact Phone</label>
                           <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +880 1XXX XXXXXX" required className="input-unique" />
                        </div>
                     </div>
                  </div>

                  {/* Media & Narrative */}
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                     <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                           <FaImage size={14} />
                        </div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Media & Narrative</h2>
                     </div>

                     <div className="space-y-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Visual Evidence (Primary Image)</label>
                           <div className="relative group">
                              <input type="file" name="images" multiple onChange={handleImageChange} accept="image/*" required
                                 className="w-full px-6 py-10 rounded-2xl border-2 border-dashed border-slate-100 group-hover:border-primary-500 transition-all text-xs font-bold text-slate-400" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Asset Narrative</label>
                           <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Highlight the luxury and unique features..." required
                              className="input-unique !h-auto resize-none py-6" />
                        </div>
                     </div>
                  </div>

                  <button type="submit" disabled={loading}
                     className="w-full btn-primary !py-6 !rounded-[2rem] flex items-center justify-center gap-4"
                  >
                     {loading ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                     ) : (
                        <>
                           <FaRocket size={18} />
                           <span>Execute Asset Registration</span>
                        </>
                     )}
                  </button>
               </form>
            </motion.div>
         </main>
      </div>
   );
};

export default AddProperty;
