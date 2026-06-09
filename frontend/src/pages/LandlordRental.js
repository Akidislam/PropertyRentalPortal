import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { 
  FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaMoneyBillWave,
  FaHome, FaPhone, FaUser, FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaFileInvoiceDollar, FaHourglassHalf, FaDownload
} from 'react-icons/fa';
import { generateApprovalNoticePDF } from '../utils/pdfGenerator';

const LandlordRental = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [landlordEmail, setLandlordEmail] = useState('');
  const { showToast } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'landlord') {
      showToast('error', '🛑 Administrative access restricted. Landlord credentials required.');
      window.location.href = '/login';
      return;
    }
    setLandlordEmail(user.email.toLowerCase());
  }, [showToast]);

  useEffect(() => {
    if (!landlordEmail) return;
    fetchRentalRequests();
  }, [landlordEmail]);

  const fetchRentalRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/rentalrequests/landlord/${landlordEmail}`);
      setRequests(res.data);
    } catch (err) {
      showToast('error', '🛑 Intelligence retrieval failed. Registry unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(requests.length / itemsPerPage);

  const handleApproval = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/rentalrequests/approve/${id}`);
      showToast('success', '✨ Residency authorized and advance payment initiated.');
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'Approved', hasAdvanceRequest: true } : r));
    } catch { showToast('error', '🛑 Verification sequence failed.'); }
  };

  const handleRejection = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/rentalrequests/reject/${id}`);
      showToast('success', '✨ Residency invalidated. Identity purged.');
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'Rejected' } : r));
    } catch { showToast('error', '🛑 Invalidation aborted.'); }
  };

  const handleRequestAdvance = async (requestId) => {
    try {
      const request = requests.find(r => r._id === requestId);
      if (!request?.propertyId?.advance) return;

      const res = await axios.post(`${BASE_URL}/api/wallet/request-advance/${requestId}`, {
        amount: request.propertyId.advance
      });
      showToast('success', '✨ Liquidity request deployed. Awaiting verification.');
      setRequests(prev => prev.map(r => r._id === requestId ? { ...r, hasAdvanceRequest: true } : r));
    } catch { showToast('error', '🛑 Liquidity request failed.'); }
  };

  const handleDownloadPDF = (request) => {
    const doc = generateApprovalNoticePDF(request);
    doc.save(`PropertyWave_Authorization_${request._id.slice(-8)}.pdf`);
    showToast('success', '✨ Authorization record generated.');
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated.');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <DashboardSidebar role="landlord" onLogout={handleLogout} />
      
      <main className="flex-grow ml-64 p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Rent <span className="text-primary-600">Approvals</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Audit and verify tenant residency applications</p>
          </div>

          {loading ? (
            <div className="py-32 text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Accessing Application Registry...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-sm">
               <FaHourglassHalf size={60} className="text-slate-100 mx-auto mb-8" />
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Registry Empty</h3>
               <p className="text-slate-400 text-xs font-medium mt-2">No new residency applications detected.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence>
                  {currentItems.map((r) => (
                    <motion.div layout key={r._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col"
                    >
                      {/* Asset Header */}
                      <div className="relative h-48 overflow-hidden bg-slate-900">
                        <img 
                          src={r.propertyId?.images?.[0] ? `${BASE_URL}${r.propertyId.images[0]}` : 'https://via.placeholder.com/600x400?text=No+Image'} 
                          alt="Asset"
                          className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                        <div className="absolute top-6 left-6">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             r.status === 'Approved' ? 'bg-green-600 text-white' : r.status === 'Rejected' ? 'bg-red-600 text-white' : 'bg-primary-600 text-white'
                           }`}>
                             {r.status}
                           </span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                           <h3 className="text-white text-lg font-black uppercase tracking-tight truncate">{r.propertyId?.title || 'Identity Unknown'}</h3>
                           <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-wider mt-1">
                              <FaMapMarkerAlt size={10} className="text-primary-500" /> {r.propertyId?.location || 'Unknown'}
                           </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8 flex-grow space-y-8">
                         {/* Tenant Profile */}
                         <div>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-4">Applicant Profile</span>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                               <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 text-sm font-black">
                                  {r.tenantName.charAt(0)}
                               </div>
                               <div>
                                  <p className="text-[11px] font-black text-slate-900 uppercase truncate">{r.tenantName}</p>
                                  <p className="text-[10px] font-bold text-slate-400 lowercase truncate">{r.tenantEmail}</p>
                               </div>
                            </div>
                         </div>

                         {/* Financial Metrics */}
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                               <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1">Target Yield</span>
                               <span className="text-sm font-black text-slate-900 uppercase">৳{r.propertyId?.price || '0'}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                               <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1">Advance Lock</span>
                               <span className="text-sm font-black text-slate-900 uppercase">৳{r.propertyId?.advance || '0'}</span>
                            </div>
                         </div>

                         {/* Actions */}
                         <div className="pt-6 border-t border-slate-50">
                            {r.status === 'Pending' ? (
                               <div className="grid grid-cols-2 gap-3">
                                  <button onClick={() => handleApproval(r._id)} className="btn-primary !py-3 !rounded-xl flex items-center justify-center gap-2">
                                     <FaCheck size={10} /> Authorize
                                  </button>
                                  <button onClick={() => handleRejection(r._id)} className="btn-outline !py-3 !rounded-xl !text-red-500 !border-red-100 hover:!bg-red-50">
                                     <FaTimes size={10} /> Invalidate
                                  </button>
                               </div>
                            ) : (
                               <div className="flex flex-col gap-3">
                                  <button onClick={() => handleDownloadPDF(r)} className="w-full btn-outline !py-3 !rounded-xl flex items-center justify-center gap-2 !text-slate-600">
                                     <FaDownload size={10} /> Authorization Record
                                  </button>
                                  <div className="text-center py-2 bg-slate-50 rounded-xl">
                                     <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Sequence Finalized</span>
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-16">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white disabled:opacity-30 transition-all shadow-sm">
                    <FaChevronLeft size={12} />
                  </button>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-4">{String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white disabled:opacity-30 transition-all shadow-sm">
                    <FaChevronRight size={12} />
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default LandlordRental;
