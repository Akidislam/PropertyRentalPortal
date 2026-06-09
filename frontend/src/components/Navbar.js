import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaHeadset, FaComments, FaBars, FaTimes, FaRocket, FaBuilding, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user'));
  const admin = JSON.parse(localStorage.getItem('admin'));

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    navigate('/login');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'About', path: '/about', icon: <FaInfoCircle /> },
    { name: 'Reviews', path: '/view-reviews', icon: <FaComments /> },
    { name: 'Support', path: '/support', icon: <FaHeadset /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-xl py-3' : 'bg-white py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-slate-900 p-2 rounded-xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-slate-900/10">
            <FaBuilding className="text-primary-500 text-lg" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic text-slate-900">
            Property<span className="text-primary-600">Wave</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 relative group ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-400 hover:text-slate-900'
                }`}
            >
              <span className="text-[12px]">{link.icon}</span>
              <span>{link.name}</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-600 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </div>

        {/* Auth / User Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {user || admin ? (
            <div className="flex items-center gap-3">
              <Link
                to={admin ? "/admin-dashboard" : user.role === 'landlord' ? "/landlord-dashboard" : "/tenant-dashboard"}
                className="btn-primary !py-2.5 !px-6 flex items-center gap-2"
              >
                <FaRocket size={10} />
                <span>Console</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 flex items-center justify-center shadow-sm"
                title="Terminate Session"
              >
                <FaSignOutAlt size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary !py-2.5 !px-6">Sign In</Link>
              <Link to="/register" className="btn-primary !py-2.5 !px-6">Join</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-50 shadow-2xl overflow-hidden"
          >
            <div className="p-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between group"
                >
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-primary-600 transition-colors">{link.name}</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                    {link.icon}
                  </div>
                </Link>
              ))}
              <div className="h-px bg-slate-50 w-full"></div>
              {user || admin ? (
                <div className="space-y-4">
                  <Link
                    to={admin ? "/admin-dashboard" : user.role === 'landlord' ? "/landlord-dashboard" : "/tenant-dashboard"}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <FaRocket />
                    <span>Console</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-4 rounded-2xl bg-red-50 text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <FaSignOutAlt />
                    <span>Terminate Session</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-secondary flex items-center justify-center">Sign In</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary flex items-center justify-center">Join</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
