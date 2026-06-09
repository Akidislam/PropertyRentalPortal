import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { FaWallet, FaCoins, FaPlus, FaTimes, FaHistory, FaArrowLeft } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import bkash from '../assets/bkash.png';
import rocket from '../assets/rocket.png';
import card from '../assets/card.jpg';
import nagad from '../assets/nagad.jpg';

const TenantWallet = () => {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showAddCoins, setShowAddCoins] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (!localUser) {
          showToast('error', 'Session expired. Please log in to manage your wallet.');
          navigate('/login');
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/wallet/${localUser._id}`);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        showToast('error', 'Unable to retrieve wallet balance. Retrying connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [showToast, navigate]);

  const handleAddCoins = async (e) => {
    e.preventDefault();
    if (!selectedPayment) {
      showToast('error', 'Payment method required to proceed with recharge.');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      showToast('error', 'A valid amount is required for wallet recharge.');
      return;
    }

    setSubmitLoading(true);

    try {
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (!localUser) {
        showToast('error', 'Session expired. Please log in to recharge your wallet.');
        navigate('/login');
        return;
      }

      const res = await axios.post(`${BASE_URL}/api/wallet/add/${localUser._id}`, {
        amount: Number(amount),
        paymentMethod: selectedPayment
      });

      const newBalance = res.data.walletcoin;
      setUser(prev => ({ ...prev, walletcoin: newBalance }));
      
      const updatedLocalUser = { ...localUser, walletcoin: newBalance };
      localStorage.setItem('user', JSON.stringify(updatedLocalUser));

      showToast('success', 'Wallet recharged successfully. Your new balance is ready.');
      setAmount('');
      setSelectedPayment('');
      setShowAddCoins(false);
    } catch (err) {
      console.error('Error adding coins:', err);
      showToast('error', 'Recharge transaction failed. Your payment method was not charged.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'bkash', name: 'bKash', img: bkash },
    { id: 'nagad', name: 'Nagad', img: nagad },
    { id: 'rocket', name: 'Rocket', img: rocket },
    { id: 'card', name: 'Bank Card', img: card }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/tenant-dashboard" className="text-sm font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest mb-2 inline-flex items-center gap-2">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">My Wallet</h1>
          </div>
          <Link to="/wallet-history" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 font-bold text-sm rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
            <FaHistory />
            <span>Transaction History</span>
          </Link>
        </div>

        {/* Balance Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20 mb-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left flex-1">
              <span className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2 mb-4">
                <FaWallet className="text-primary-500" />
                Available Balance
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-3xl md:text-5xl font-black text-primary-500">৳</span>
                <span className="text-6xl md:text-8xl font-black tracking-tighter leading-none">{user?.walletcoin || 0}</span>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-3">
              <button 
                onClick={() => setShowAddCoins(!showAddCoins)}
                className="w-full md:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-600/20 active:scale-95"
              >
                {showAddCoins ? <FaTimes /> : <FaPlus />}
                <span>{showAddCoins ? 'Cancel' : 'Top Up Wallet'}</span>
              </button>
              <Link to="/wallet-history" className="sm:hidden w-full px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                <FaHistory />
                <span>History</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Add Coins Section */}
        <AnimatePresence>
          {showAddCoins && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 mb-8">
                <div className="text-center max-w-lg mx-auto mb-10">
                  <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                    <FaCoins />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recharge Wallet</h2>
                  <p className="text-slate-500 font-medium mt-2">Add funds to securely pay rent or advance fees instantly.</p>
                </div>

                <form onSubmit={handleAddCoins} className="max-w-2xl mx-auto space-y-8">
                  
                  {/* Amount Input */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-4">Amount to Add (৳)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      required
                      min="1"
                      className="w-full text-center text-5xl md:text-6xl font-black text-slate-900 py-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all placeholder:text-slate-200"
                    />
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-4">Select Payment Method</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {paymentMethods.map((method) => (
                        <div 
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`cursor-pointer rounded-2xl border-2 transition-all p-4 flex flex-col items-center gap-3 ${
                            selectedPayment === method.id 
                              ? 'border-primary-500 bg-primary-50 shadow-md' 
                              : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 bg-white p-1">
                            <img src={method.img} alt={method.name} className="w-full h-full object-contain" />
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-wider ${selectedPayment === method.id ? 'text-primary-700' : 'text-slate-500'}`}>
                            {method.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <button 
                    type="submit" 
                    disabled={submitLoading || !amount || !selectedPayment}
                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl ${
                      submitLoading || !amount || !selectedPayment 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-slate-900/20'
                    }`}
                  >
                    {submitLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FaPlus />
                        <span>Confirm Payment of ৳{amount || '0'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default TenantWallet;
