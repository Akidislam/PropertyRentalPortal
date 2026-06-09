import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { FaCheckCircle, FaMapMarkerAlt, FaCalendarAlt, FaDownload, FaFileContract, FaCreditCard, FaHourglassHalf } from 'react-icons/fa';
import { generateApprovalNoticePDF } from '../utils/pdfGenerator';
import DashboardSidebar from '../components/DashboardSidebar';

const TenantApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { showToast } = useToast();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      showToast('error', '🛑 Authentication required. Please re-login.');
      window.location.href = '/login';
      return;
    }
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rentalrequests/tenant/${user.email}`);
      const approvedRequests = response.data.filter(request => request.status === 'Approved');

      const requestsWithAdvanceStatus = await Promise.all(
        approvedRequests.map(async (request) => {
          try {
            const advanceResponse = await axios.get(`http://localhost:5000/api/wallet/pending/${request._id}`);
            return {
              ...request,
              hasAdvanceRequest: advanceResponse.data.length > 0,
              advancePaid: advanceResponse.data.some(payment => payment.status === 'completed')
            };
          } catch (err) {
            return { ...request, hasAdvanceRequest: false, advancePaid: false };
          }
        })
      );

      setRequests(requestsWithAdvanceStatus);
    } catch (error) {
      showToast('error', '🛑 Application registry sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayAdvance = async (requestId) => {
    try {
      setLoading(true);
      const pendingPayments = await axios.get(`http://localhost:5000/api/wallet/pending/${requestId}`);
      if (!pendingPayments.data || pendingPayments.data.length === 0) {
        throw new Error('No pending payment detected.');
      }

      const paymentId = pendingPayments.data[0]._id;
      await axios.post(`http://localhost:5000/api/wallet/pay-advance/${paymentId}`, {
        tenantId: user._id
      });

      showToast('success', '✨ Advance liquidity synchronized successfully!');
      fetchApprovedRequests();
      setShowPaymentModal(false);
    } catch (err) {
      showToast('error', err.response?.data?.message || '🛑 Liquidity transfer failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (request) => {
    const doc = generateApprovalNoticePDF(request);
    doc.save(`PropertyWave_Authorization_${request._id.slice(-8)}.pdf`);
    showToast('success', '✨ Authorization document generated.');
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated.');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <DashboardSidebar role="tenant" onLogout={handleLogout} />

      <main className="flex-grow ml-64 p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Approved <span className="text-primary-600">Requests</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Verified residency authorizations and pending obligations</p>
          </div>

          {loading ? (
            <div className="py-32 text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Accessing Authorization Registry...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-sm">
               <FaFileContract size={60} className="text-slate-100 mx-auto mb-8" />
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Authorizations</h3>
               <p className="text-slate-400 text-xs font-medium mt-2">Verified residency requests will manifest here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence>
                {requests.map((r) => (
                  <motion.div layout key={r._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <img 
                        src={r.propertyId?.images?.[0] ? `http://localhost:5000${r.propertyId.images[0]}` : 'https://via.placeholder.com/600x400?text=No+Image'} 
                        alt="Asset"
                        className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                      <div className="absolute top-6 right-6">
                         <span className="px-4 py-1.5 bg-green-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                           <FaCheckCircle size={10} /> Authorized
                         </span>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                         <h3 className="text-white text-lg font-black uppercase tracking-tight truncate">{r.propertyId?.title}</h3>
                         <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-wider mt-1">
                            <FaMapMarkerAlt size={10} className="text-primary-500" /> {r.propertyId?.location}
                         </div>
                      </div>
                    </div>

                    <div className="p-8 flex-grow space-y-8">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-2xl">
                             <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1">Monthly Yield</span>
                             <span className="text-sm font-black text-slate-900">৳{r.propertyId?.price}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl">
                             <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1">Advance Lock</span>
                             <span className="text-sm font-black text-slate-900">৳{r.propertyId?.advance}</span>
                          </div>
                       </div>

                       <div className="pt-6 border-t border-slate-50">
                          <div className="flex flex-col gap-3">
                             <button onClick={() => handleDownloadPDF(r)} className="w-full btn-secondary !py-3.5 !rounded-xl flex items-center justify-center gap-2">
                                <FaDownload size={12} /> Authorization Notice
                             </button>

                             {r.hasAdvanceRequest && !r.advancePaid ? (
                               <button onClick={() => { setSelectedRequest(r); setShowPaymentModal(true); }} className="w-full btn-primary !py-3.5 !rounded-xl flex items-center justify-center gap-2 shadow-primary-600/20">
                                  <FaCreditCard size={12} /> Settle Advance
                               </button>
                             ) : r.advancePaid ? (
                               <div className="bg-green-50 py-3 rounded-xl border border-green-100 flex items-center justify-center gap-2 text-green-700 text-[10px] font-black uppercase tracking-widest">
                                  <FaCheckCircle /> Liquidity Locked
                               </div>
                             ) : null}
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-12 text-center"
            >
               <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-8 shadow-inner">
                  <FaCreditCard size={32} />
               </div>
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Liquidity Lock</h2>
               <p className="text-slate-500 text-sm font-medium mb-8">Execute advance payment for <br/><span className="text-slate-900 font-bold">"{selectedRequest.propertyId?.title}"</span></p>

               <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-10">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Transaction Value</span>
                  <span className="text-3xl font-black text-slate-900 uppercase tracking-tight">৳{selectedRequest.propertyId?.advance}</span>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setShowPaymentModal(false)} className="btn-outline !py-4 !rounded-2xl">Abort</button>
                  <button onClick={() => handlePayAdvance(selectedRequest._id)} disabled={loading} className="btn-primary !py-4 !rounded-2xl flex items-center justify-center gap-2">
                     {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Authorize <FaCheckCircle /></>}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenantApprovedRequests;
 