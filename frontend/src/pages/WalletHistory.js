import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoneyBillWave, FaCreditCard, FaHistory, FaFilter, FaWallet, FaArrowUp, FaArrowDown, FaExchangeAlt, FaHourglassHalf } from 'react-icons/fa';
import { BsCash, BsBank } from 'react-icons/bs';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/DashboardSidebar';

const WalletHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ topup: 0, payment: 0 });
  const [userInfo, setUserInfo] = useState({ email: '', role: '', walletcoin: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const { showToast } = useToast();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      showToast('error', '🛑 Authentication required. Please re-login.');
      window.location.href = '/login';
      return;
    }
    fetchWalletHistory();
  }, []);

  const fetchWalletHistory = async () => {
    try {
      const userType = user.role === 'landlord' ? 'landlord' : 'tenant';
      const res = await axios.get(
        `${BASE_URL}/api/wallet-history/${user._id}/${userType}`,
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );

      if (res.data.success) {
        setTransactions(res.data.data.transactions);
        setTotals(res.data.data.totals);
        setUserInfo(res.data.data.user);
      }
    } catch {
      showToast('error', '🛑 Ledger synchronization failed.');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'bkash': return <BsCash />;
      case 'nagad': return <FaMoneyBillWave />;
      case 'rocket': return <BsBank />;
      case 'card': return <FaCreditCard />;
      default: return <FaHistory />;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast('success', '✨ Session terminated.');
    window.location.href = '/login';
  };

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' ? true : t.transactionType === filter
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <DashboardSidebar role={user?.role} onLogout={handleLogout} />

      <main className="flex-grow ml-64 p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter text-center lg:text-left">Wallet <span className="text-primary-600">Nexus</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 text-center lg:text-left">Real-time financial activity and liquidity logs</p>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 self-center lg:self-auto">
               <div className="flex items-center gap-2 px-4 py-2 border-r border-slate-100">
                  <FaFilter className="text-slate-400" size={10} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ledger Filter</span>
               </div>
               <select value={filter} onChange={(e) => setFilter(e.target.value)}
                 className="bg-transparent text-slate-900 font-bold text-xs outline-none pr-8 py-2 appearance-none cursor-pointer">
                 <option value="all">Global History</option>
                 <option value="topup">Credit Influx</option>
                 <option value="payment">Revenue Outflux</option>
               </select>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-slate-900 rounded-[3rem] p-10 mb-12 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-center md:text-left">
                   <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] block mb-2">Available Liquidity</span>
                   <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black uppercase tracking-tight">৳{userInfo.walletcoin.toFixed(2)}</span>
                      <span className="text-primary-400 font-bold uppercase tracking-widest text-xs">Credits</span>
                   </div>
                </div>
                <div className="flex gap-6">
                   <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-green-400 mb-3 mx-auto shadow-xl"><FaArrowUp size={14} /></div>
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Total Influx</p>
                      <p className="font-black text-sm uppercase">৳{totals.topup.toFixed(0)}</p>
                   </div>
                   <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 mb-3 mx-auto shadow-xl"><FaArrowDown size={14} /></div>
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Total Outflux</p>
                      <p className="font-black text-sm uppercase">৳{totals.payment.toFixed(0)}</p>
                   </div>
                </div>
             </div>
          </div>

          {loading ? (
            <div className="py-32 text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Auditing Ledger...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-sm">
               <FaExchangeAlt size={60} className="text-slate-100 mx-auto mb-8" />
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Transactions Detected</h3>
               <p className="text-slate-400 text-xs font-medium mt-2">Financial activity will manifest here once initialized.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredTransactions.map((t) => (
                  <motion.div layout key={t._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-[2rem] transition-all group-hover:bg-primary-50"></div>

                    <div className="flex items-center justify-between mb-8">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                        t.transactionType === 'topup' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                         {getPaymentMethodIcon(t.paymentMethod)}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
                        t.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <div className="space-y-6">
                       <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Execution Type</p>
                          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{t.transactionType}</h3>
                       </div>

                       <div className="bg-slate-50 p-6 rounded-[2rem] border border-transparent group-hover:border-slate-100 transition-all">
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1">Transaction Value</span>
                          <div className="flex items-center gap-2">
                             <span className={`text-2xl font-black ${t.transactionType === 'topup' ? 'text-green-600' : 'text-slate-900'}`}>
                               {t.transactionType === 'topup' ? '+' : '-'}৳{t.amount.toFixed(0)}
                             </span>
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">credits</span>
                          </div>
                       </div>

                       <div className="flex justify-between items-end pt-4 border-t border-slate-50">
                          <div>
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Protocol</p>
                             <p className="text-[10px] font-bold text-slate-700 uppercase">{t.paymentMethod}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Timestamp</p>
                             <p className="text-[10px] font-bold text-slate-700">{new Date(t.createdAt).toLocaleDateString()}</p>
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
    </div>
  );
};

export default WalletHistory;
 