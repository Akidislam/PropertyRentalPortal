import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaHeadset, FaComments, FaBars, FaTimes, FaRocket, FaBuilding, FaSignOutAlt, FaPlus, FaUsers, FaWallet, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const user = JSON.parse(localStorage.getItem('user'));
  const admin = JSON.parse(localStorage.getItem('admin'));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'About', path: '/about', icon: <FaInfoCircle /> },
    { name: 'Reviews', path: '/view-reviews', icon: <FaComments /> },
    { name: 'Support', path: '/support', icon: <FaHeadset /> },
  ];

  const dashboardLinks = admin ? [
    { name: 'Overview', path: '/admin-dashboard', icon: <FaRocket /> },
    { name: 'User Management', path: '/user-management', icon: <FaUsers /> },
    { name: 'Approvals', path: '/admin-approval', icon: <FaBuilding /> },
  ] : user?.role === 'landlord' ? [
    { name: 'Overview', path: '/landlord-dashboard', icon: <FaRocket /> },
    { name: 'Add Property', path: '/add-property', icon: <FaPlus /> },
    { name: 'Approvals', path: '/landlord-approval-rental', icon: <FaBuilding /> },
    { name: 'Wallet', path: '/landlord-wallet', icon: <FaWallet /> },
  ] : user?.role === 'tenant' ? [
    { name: 'Overview', path: '/tenant-dashboard', icon: <FaRocket /> },
    { name: 'Browse', path: '/property-list', icon: <FaBuilding /> },
    { name: 'Approved', path: '/tenant-approved-requests', icon: <FaCheckCircle /> },
    { name: 'Wallet', path: '/tenant-wallet', icon: <FaWallet /> },
  ] : [];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled || !isHomePage ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${isScrolled || !isHomePage ? 'bg-primary-600 rotate-0' : 'bg-white/10 backdrop-blur-md rotate-[-10deg] group-hover:rotate-0'}`}>
              <FaBuilding className={`${isScrolled || !isHomePage ? 'text-white' : 'text-primary-600'} text-lg md:text-xl`} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className={`text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none ${isScrolled || !isHomePage ? 'text-slate-900' : 'text-white'}`}>
              Property<span className={`${isScrolled || !isHomePage ? 'text-primary-600' : 'text-primary-400'}`}>Wave</span>
            </span>
            <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-[0.4em] mt-1 ${isScrolled || !isHomePage ? 'text-slate-400' : 'text-slate-300'}`}>Elite Realty</span>
          </div>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex flex-1 justify-center px-8">
          <div className={`flex items-center gap-1 p-1 rounded-full border transition-all duration-500 ${isScrolled || !isHomePage ? 'bg-slate-100/80 border-slate-200' : 'bg-white/10 border-white/20 backdrop-blur-xl'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${location.pathname === link.path
                  ? (isScrolled || !isHomePage ? 'bg-white text-primary-600 shadow-sm' : 'bg-white text-slate-900 shadow-xl shadow-black/20')
                  : (isScrolled || !isHomePage ? 'text-slate-600 hover:text-primary-600' : 'text-slate-200 hover:text-white hover:bg-white/10')
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth Actions - Right Aligned */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user || admin ? (
            <div className="flex items-center gap-3">
              <Link
                to={admin ? "/admin-dashboard" : user.role === 'landlord' ? "/landlord-dashboard" : "/tenant-dashboard"}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${isScrolled || !isHomePage ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-slate-50 shadow-white/10'}`}
              >
                <FaRocket className="animate-pulse text-xs" />
                <span>Console</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-500 flex items-center justify-center shadow-md active:scale-95"
              >
                <FaSignOutAlt className="text-sm" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className={`text-[10px] font-black uppercase tracking-widest transition-colors px-4 ${isScrolled || !isHomePage ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-6 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${isScrolled || !isHomePage ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-white text-slate-900 hover:bg-slate-50 shadow-white/10'}`}
              >
                Register
              </Link>
            </div>
          )}
        </div>



        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isScrolled || !isHomePage ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'}`}
        >
          {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>


      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-y-0 right-0 w-80 bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.05)] z-[60] flex flex-col p-10"
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setIsMenuOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                <FaTimes size={22} />
              </button>
            </div>

            <div className="flex-grow space-y-8 overflow-y-auto custom-scrollbar pr-2">
              {/* Primary Links */}
              <div className="space-y-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Navigation</span>
                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between group"
                    >
                      <span className={`text-lg font-black uppercase tracking-tighter transition-colors ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-300 group-hover:text-slate-900'}`}>
                        {link.name}
                      </span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${location.pathname === link.path ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                        {link.icon}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Dashboard Specific Links (Only if logged in) */}
              {(user || admin) && dashboardLinks.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest pl-1">Management Hub</span>
                  <div className="space-y-4">
                    {dashboardLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between group"
                      >
                        <span className={`text-lg font-black uppercase tracking-tighter transition-colors ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-300 group-hover:text-slate-900'}`}>
                          {link.name}
                        </span>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${location.pathname === link.path ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                          {link.icon}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col gap-3">
              {user || admin ? (
                <button onClick={handleLogout} className="w-full py-4 rounded-2xl bg-red-50 text-red-500 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all">
                  <FaSignOutAlt /> Terminate Session
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 rounded-2xl bg-slate-50 text-slate-900 font-black uppercase tracking-widest text-center text-[10px]">Login</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-4 rounded-2xl bg-primary-600 text-white font-black uppercase tracking-widest text-center text-[10px]">Register</Link>
                </>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
