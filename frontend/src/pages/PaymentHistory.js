import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePaymentHistoryPDF } from '../utils/pdfGenerator';
import { FaDownload, FaMapMarkerAlt, FaTimes, FaEye, FaFileInvoiceDollar } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/DashboardSidebar';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { showToast } = useToast();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/wallet/history/${user._id}`);
      setPayments(res.data);
    } catch (err) {
      showToast('error', '🛑 Transaction registry synchronization failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      showToast('error', '🛑 Authentication required. Please re-login.');
      window.location.href = '/login';
      return;
    }
    fetchPaymentHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownloadPDF = (payment) => {
    const doc = generatePaymentHistoryPDF(payment, user);
    doc.save(`PropertyWave_Receipt_${payment._id.slice(-8)}.pdf`);
    showToast('success', '✨ Transaction statement generated.');
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated.');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <DashboardSidebar role={user?.role} onLogout={handleLogout} />

      <main className="flex-grow ml-64 p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Transaction <span className="text-primary-600">Audit</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Comprehensive registry of all financial executions and rental payments</p>
          </div>

          {loading ? (
            <div className="py-32 text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Accessing Transaction Logs...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-sm">
              <FaFileInvoiceDollar size={60} className="text-slate-100 mx-auto mb-8" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Logs Clear</h3>
              <p className="text-slate-400 text-xs font-medium mt-2">No transaction history detected in the primary ledger.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence>
                {payments.map((p) => (
                  <motion.div layout key={p._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col"
                  >
                    <div className="p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-[8px] font-black uppercase tracking-[0.2em]">Executed</span>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight truncate mb-1">{p.propertyId?.title || 'Unknown Asset'}</h3>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          <FaMapMarkerAlt size={10} className="text-primary-500" /> {p.propertyId?.location || 'Unspecified'}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-[2rem] border border-transparent group-hover:border-slate-100 transition-all">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1">Transaction Value</span>
                        <span className="text-2xl font-black text-slate-900">৳{p.amount}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => { setSelectedPayment(p); setShowDetailsModal(true); }} className="btn-outline !py-3 !rounded-xl flex items-center justify-center gap-2">
                          <FaEye size={10} /> Audit
                        </button>
                        <button onClick={() => handleDownloadPDF(p)} className="btn-secondary !py-3 !rounded-xl flex items-center justify-center gap-2">
                          <FaDownload size={10} /> Statement
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailsModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-12">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                      <FaFileInvoiceDollar size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Receipt <span className="text-primary-600">Deep-Audit</span></h2>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Transaction ID: {selectedPayment._id.toUpperCase()}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowDetailsModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-all">
                    <FaTimes size={18} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <span className="text-[9px] font-black text-primary-600 uppercase tracking-[0.3em] block mb-4">Asset Matrix</span>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Title</span>
                          <span className="text-[10px] font-black text-slate-900 uppercase">{selectedPayment.propertyId?.title}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Class</span>
                          <span className="text-[10px] font-black text-slate-900 uppercase">{selectedPayment.propertyId?.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Region</span>
                          <span className="text-[10px] font-black text-slate-900 uppercase">{selectedPayment.propertyId?.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <span className="text-[9px] font-black text-primary-600 uppercase tracking-[0.3em] block mb-4">Finance Protocol</span>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Value</span>
                          <span className="text-[10px] font-black text-slate-900 uppercase">৳{selectedPayment.amount}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Method</span>
                          <span className="text-[10px] font-black text-slate-900 uppercase">Wallet Coin</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                          <span className="text-[10px] font-black text-green-600 uppercase">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button onClick={() => setShowDetailsModal(false)} className="flex-1 btn-outline !py-4 !rounded-2xl">Close Audit</button>
                  <button onClick={() => handleDownloadPDF(selectedPayment)} className="flex-[2] btn-primary !py-4 !rounded-2xl flex items-center justify-center gap-3">
                    <FaDownload /> Download Transmittal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentHistory;