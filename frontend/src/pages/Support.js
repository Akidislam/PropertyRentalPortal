import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { FaHeadset, FaEnvelope, FaPhone, FaUser, FaComment, FaPaperPlane, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/support/submit`, formData);
      if (res.data.success) {
        showToast('success', '✨ Transmission successful! Our elite support squad is on the case.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        showToast('error', '🛑 Connection interrupted. Please re-verify your details and try again.');
      }
    } catch (err) {
      showToast('error', '⚠️ System glitch detected. Our engineers are notified, but please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <FaPhone />, title: "Direct Line", detail: "+880 1234 567 890", sub: "Available Mon-Fri, 9am - 6pm" },
    { icon: <FaEnvelope />, title: "Digital Correspondence", detail: "concierge@propertywave.com", sub: "Priority support for all members" },
    { icon: <FaMapMarkerAlt />, title: "Headquarters", detail: "123 Elite Square, Gulshan", sub: "Dhaka, Bangladesh" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-slate-900 text-white text-4xl mb-8 shadow-2xl"
          >
            <FaHeadset className="text-primary-500" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
            Concierge <span className="text-primary-600">Support</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience the gold standard in client care. Our dedicated specialists are standing by to resolve any inquiry with precision.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8 px-2">
               <div className="w-1.5 h-8 bg-primary-600 rounded-full"></div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Channels</h2>
            </div>
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-xl hover:border-primary-100 transition-all group"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 text-xl flex-shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                  {info.icon}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 mb-1 uppercase text-xs tracking-widest opacity-40">{info.title}</h4>
                  <p className="text-slate-900 font-bold text-lg mb-1">{info.detail}</p>
                  <p className="text-slate-400 text-sm font-medium">{info.sub}</p>
                </div>
              </motion.div>
            ))}
            
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl"></div>
               <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary-500 mb-4">Response Time</h4>
               <p className="text-slate-300 font-medium leading-relaxed">Our average response time is currently <span className="text-white font-bold">under 2 hours</span> for verified members.</p>
            </div>
          </div>

          {/* Support Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="p-10 md:p-16">
                <div className="flex items-center gap-3 mb-10">
                   <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                      <FaComment />
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Secure Correspondence</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                      <div className="relative">
                        <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                          placeholder="Your identity"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                          placeholder="your@email.com"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                      <div className="relative">
                        <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                          placeholder="+880..."
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Subject</label>
                      <div className="relative">
                        <FaInfoCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                          type="text"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                          placeholder="Nature of inquiry"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Message Detail</label>
                    <textarea
                      name="message"
                      required
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-medium text-slate-600 resize-none placeholder:text-slate-300"
                      placeholder="Please provide exhaustive details regarding your request..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-2xl text-xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-primary-600/20 active:scale-[0.98] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <FaPaperPlane className="text-sm" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Support;
