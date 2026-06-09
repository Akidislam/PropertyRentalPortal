import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaQuoteLeft, FaSortAmountDown, FaComments } from 'react-icons/fa';

const ViewReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/reviews/all?sortBy=${sortBy}`);
        setReviews(response.data);
      } catch (err) {
        showToast('error', 'Failed to retrieve property testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [sortBy, showToast]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < rating ? 'fill-current' : 'text-slate-200'} size={14} />
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-black text-[10px] uppercase tracking-widest mb-4">
              <FaComments /> Community Pulse
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Member <span className="text-primary-600">Testimonials</span>
            </h1>
            <p className="text-slate-500 mt-4 text-xl font-medium max-w-xl">
              Authentic experiences shared by our community of landlords and tenants.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 px-4 py-2 border-r border-slate-100">
              <FaSortAmountDown className="text-slate-400" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Order</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-900 font-bold text-sm outline-none pr-8 py-2 appearance-none cursor-pointer"
            >
              <option value="date">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Author Alpha</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
              <FaComments size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Silence in the halls</h3>
            <p className="text-slate-500 font-medium">Be the first to share your rental narrative!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {reviews.map((review, i) => (
                <motion.div
                  layout
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col group"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-200">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 leading-none mb-1">{review.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <FaCalendarAlt /> {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-6 mb-8 flex-grow relative overflow-hidden">
                    <FaQuoteLeft className="absolute -top-2 -left-2 text-slate-100 text-6xl rotate-12" />
                    <div className="relative z-10">
                      <h5 className="font-black text-slate-900 text-sm mb-2 uppercase tracking-tight group-hover:text-primary-600 transition-colors">{review.propertyTitle}</h5>
                      <p className="text-slate-600 text-sm leading-relaxed italic font-medium">
                        "{review.review}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-slate-400">
                      <FaMapMarkerAlt className="shrink-0" size={12} />
                      <span className="text-[11px] font-bold truncate">{review.propertyAddress}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <FaEnvelope className="shrink-0" size={12} />
                      <span className="text-[11px] font-bold truncate">{review.email}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReviews;
