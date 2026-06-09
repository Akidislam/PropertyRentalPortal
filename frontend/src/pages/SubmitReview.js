import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { FaStar, FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaCommentAlt, FaPenNib } from 'react-icons/fa';

const SubmitReview = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyTitle: '',
    propertyAddress: '',
    review: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [hoveredRating, setHoveredRating] = useState(0);

  const ratingDescriptions = {
    5: 'Exemplary — Beyond expectations',
    4: 'Superb — Minimal friction encountered',
    3: 'Satisfactory — Standard quality service',
    2: 'Mediocre — Several points of concern',
    1: 'Deficient — Significant improvement required'
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Identity required';
    if (!formData.email.trim()) newErrors.email = 'Digital address required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid format';
    if (!formData.phone.trim()) newErrors.phone = 'Contact line required';
    if (!formData.propertyTitle.trim()) newErrors.propertyTitle = 'Property designation required';
    if (!formData.propertyAddress.trim()) newErrors.propertyAddress = 'Location details required';
    if (!formData.review.trim()) newErrors.review = 'Narrative required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('error', '🛑 Please complete all required fields to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/api/reviews/submit`, formData);
      showToast('success', '✨ Narrative recorded. Thank you for contributing to our community intelligence.');
      setTimeout(() => navigate('/view-reviews'), 2000);
    } catch (error) {
      showToast('error', '⚠️ Submission failed. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-slate-900 text-white text-3xl mb-6 shadow-2xl">
             <FaPenNib className="text-primary-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
             Share Your <span className="text-primary-600">Narrative</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
             Your authentic feedback helps us maintain the gold standard of property rental excellence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-16 space-y-12">

            {/* Identity Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                 <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em]">01. Your Identity</span>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name"
                      className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border ${errors.name ? 'border-red-300 bg-red-50/30' : 'border-transparent'} focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-bold text-slate-900`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Digital Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com"
                      className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border ${errors.email ? 'border-red-300 bg-red-50/30' : 'border-transparent'} focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-bold text-slate-900`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Property Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                 <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em]">02. Asset Details</span>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Property Title</label>
                  <div className="relative">
                    <FaBuilding className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type="text" name="propertyTitle" value={formData.propertyTitle} onChange={handleChange} placeholder="Listing name"
                      className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border ${errors.propertyTitle ? 'border-red-300 bg-red-50/30' : 'border-transparent'} focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-bold text-slate-900`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Location</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type="text" name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} placeholder="Asset address"
                      className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border ${errors.propertyAddress ? 'border-red-300 bg-red-50/30' : 'border-transparent'} focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-bold text-slate-900`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                 <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em]">03. Community Intelligence</span>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500 via-transparent to-transparent"></div>
                <label className="block text-xs font-black text-primary-500 uppercase tracking-[0.2em] mb-6">Overall Rating</label>
                <div className="flex justify-center gap-3 mb-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button key={rating} type="button" 
                      onClick={() => setFormData(p => ({...p, rating}))}
                      onMouseEnter={() => setHoveredRating(rating)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-all transform hover:scale-125 focus:outline-none"
                    >
                      <FaStar className={`text-4xl ${rating <= (hoveredRating || formData.rating) ? 'text-amber-400 fill-current' : 'text-white/10'}`} />
                    </button>
                  ))}
                </div>
                <p className="text-white font-black uppercase text-xs tracking-widest opacity-60">
                  {ratingDescriptions[hoveredRating || formData.rating]}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Detailed Narrative</label>
                <textarea name="review" value={formData.review} onChange={handleChange} rows="6" placeholder="Share your comprehensive experience here..."
                  className={`w-full px-8 py-6 rounded-[2rem] bg-slate-50 border ${errors.review ? 'border-red-300 bg-red-50/30' : 'border-transparent'} focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-medium text-slate-600 resize-none`} />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-6 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-2xl text-xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-primary-600/20 active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaPenNib size={20} />
                  <span>Transmit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SubmitReview;
 