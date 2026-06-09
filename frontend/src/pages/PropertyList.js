import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { 
  FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaMoneyBillWave,
  FaBuilding, FaPhone, FaHome, FaKey, FaChevronLeft, FaChevronRight, FaSearch, FaUser
} from 'react-icons/fa';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();
  const propertiesPerPage = 6;
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/properties/approved');
      setProperties(res.data);
    } catch (err) {
      showToast('error', '⚠️ Network synchronization failed. Listing unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated successfully.');
    window.location.href = '/login';
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar role={user?.role || 'tenant'} onLogout={handleLogout} />
      
      <main className="flex-grow ml-64 p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Premium <span className="text-primary-600">Inventory</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Discover curated living spaces for the modern era</p>
            </div>
            
            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
               <div className="px-4 py-2 flex items-center gap-2 text-slate-400">
                  <FaSearch size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Global Search</span>
               </div>
               <input type="text" placeholder="Locality or Type..." className="bg-slate-50 rounded-xl px-4 py-2 text-xs font-bold outline-none border border-transparent focus:border-primary-500 transition-all w-48" />
            </div>
          </div>

          {loading ? (
            <div className="py-32 text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Assets...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm">
               <FaHome size={60} className="text-slate-100 mx-auto mb-8" />
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">The Registry is Empty</h3>
               <p className="text-slate-400 text-xs font-medium mt-2">New premium assets are expected shortly.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence>
                  {currentProperties.map((property) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={property._id}
                      className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={property.images && property.images.length > 0 ? `http://localhost:5000${property.images[0]}` : 'https://via.placeholder.com/600x400?text=No+Image'} 
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                           {property.type}
                        </div>
                        <div className="absolute bottom-6 left-6 bg-primary-600 px-4 py-2 rounded-xl text-sm font-black text-white shadow-xl">
                           ৳{property.price}
                        </div>
                      </div>
                      
                      <div className="p-8 flex-grow flex flex-col">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4 group-hover:text-primary-600 transition-colors truncate">{property.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                           <div className="flex items-center gap-3 text-slate-500">
                              <FaMapMarkerAlt className="text-primary-500" size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-wider truncate">{property.location}</span>
                           </div>
                           <div className="flex items-center gap-3 text-slate-500">
                              <FaRulerCombined className="text-primary-500" size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">{property.area} sqft</span>
                           </div>
                           <div className="flex items-center gap-3 text-slate-500">
                              <FaBed className="text-primary-500" size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">{property.rooms} Rooms</span>
                           </div>
                           <div className="flex items-center gap-3 text-slate-500">
                              <FaBath className="text-primary-500" size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">{property.bathrooms} Baths</span>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex flex-col">
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Advance</span>
                              <span className="text-sm font-black text-slate-900">৳{property.advance}</span>
                           </div>
                           <button onClick={() => handleViewDetails(property)} className="btn-primary !px-6 !py-3 !rounded-xl">View Details</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-3 mt-16">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                >
                  <FaChevronLeft size={12} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-12 h-12 rounded-2xl font-black text-xs transition-all shadow-sm ${
                      currentPage === i + 1 
                        ? 'bg-primary-600 text-white shadow-primary-600/20' 
                        : 'bg-white text-slate-400 border border-slate-100 hover:border-primary-500'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            </>
          )}
        </motion.div>
      </main>

      {/* Asset Intelligence Modal */}
      <AnimatePresence>
        {showModal && selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
               {/* Close Button */}
               <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center">
                  <FaKey className="rotate-45" size={14} />
               </button>

               {/* Left: Visual Evidence */}
               <div className="md:w-1/2 relative bg-slate-900 overflow-hidden">
                  <img src={`http://localhost:5000${selectedProperty.images?.[0]}`} alt="Asset" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <div className="absolute bottom-12 left-12 right-12">
                     <span className="px-4 py-1.5 bg-primary-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Verified Asset</span>
                     <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-2">{selectedProperty.title}</h2>
                     <div className="flex items-center gap-3 text-white/60 text-xs font-bold uppercase tracking-widest">
                        <FaMapMarkerAlt className="text-primary-500" /> {selectedProperty.location}
                     </div>
                  </div>
               </div>

               {/* Right: Asset Intelligence */}
               <div className="md:w-1/2 p-12 overflow-y-auto bg-white custom-scrollbar">
                  <div className="space-y-12">
                     {/* Financials */}
                     <section>
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Financial Structure</h3>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Monthly Yield</span>
                              <span className="text-2xl font-black text-slate-900">৳{selectedProperty.price}</span>
                           </div>
                           <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Advance Lock</span>
                              <span className="text-2xl font-black text-slate-900">৳{selectedProperty.advance}</span>
                           </div>
                        </div>
                     </section>

                     {/* Spatial Metrics */}
                     <section>
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Spatial Metrics</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                           <div className="space-y-2">
                              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto"><FaRulerCombined size={16}/></div>
                              <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{selectedProperty.area} SQFT</p>
                           </div>
                           <div className="space-y-2">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto"><FaBed size={16}/></div>
                              <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{selectedProperty.rooms} Rooms</p>
                           </div>
                           <div className="space-y-2">
                              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mx-auto"><FaBath size={16}/></div>
                              <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{selectedProperty.bathrooms} Baths</p>
                           </div>
                        </div>
                     </section>

                     {/* Narrative */}
                     <section>
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Asset Narrative</h3>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{selectedProperty.description}"</p>
                     </section>

                     {/* Identity */}
                     <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
                        <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-6 text-center">Landlord Verified Identity</h3>
                        <div className="space-y-4">
                           <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                              <FaUser className="text-primary-500" />
                              <div className="flex-grow">
                                 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Uploader</p>
                                 <p className="text-xs font-black uppercase">{selectedProperty.uploaderName}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                              <FaPhone className="text-primary-500" />
                              <div className="flex-grow">
                                 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Contact</p>
                                 <p className="text-xs font-black">{selectedProperty.phone}</p>
                              </div>
                           </div>
                           <button onClick={() => window.location.href=`mailto:${selectedProperty.uploaderEmail}`} className="w-full btn-primary !py-4 !rounded-2xl flex items-center justify-center gap-3 mt-4">
                              Deploy Inquiry <FaSearch size={12}/>
                           </button>
                        </div>
                     </section>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyList;
