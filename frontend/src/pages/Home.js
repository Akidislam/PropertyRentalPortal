import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaShieldAlt, FaChartLine, FaStar, FaSignInAlt, FaBuilding } from 'react-icons/fa';
import rental1 from '../assets/p1.jpg';
import rental2 from '../assets/p2.jpg';
import rental3 from '../assets/p3.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalProps, setTotalProps] = useState(0);
  const images = [rental1, rental2, rental3];

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/properties/all`);
      setTotalProps(res.data.length);
    } catch (error) {
      console.error('Error fetching home stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const features = [
    {
      icon: <FaSearch />,
      title: "Smart Discovery",
      description: "Find exactly what you need with our ultra-precise location and property type filtering system."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Ecosystem",
      description: "Every transaction is protected by our integrated wallet and verification protocols for total peace of mind."
    },
    {
      icon: <FaChartLine />,
      title: "Wealth Management",
      description: "Landlords can track growth, manage requests, and optimize their property portfolio effortlessly."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-slate-50 w-full"
    >
      {/* Dynamic Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.1
              }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <img src={img} alt="Property" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
            </motion.div>
          ))}
        </div>

        {/* Centered Explore Feature */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 backdrop-blur-md border border-primary-500/30 rounded-full mb-8">
              <FaStar className="text-primary-500 text-[10px]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-100">Premium Rental Experience</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] uppercase">
              Explore Your <br />
              <span className="text-primary-500">Dream Sanctuary</span>
            </h1>

            <p className="text-sm md:text-lg text-slate-300 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
              Discover a curated collection of premium properties designed for the modern lifestyle. Secure, seamless, and sophisticated.
            </p>

            {/* Compact Auth Action Feature */}
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-[2rem] border border-white/20 shadow-2xl max-w-sm mx-auto group mb-16">
              <div className="bg-white/10 rounded-[1.8rem] p-2 flex items-center gap-2">
                <Link to="/register" className="flex-1 px-6 py-4 bg-primary-600/90 hover:bg-primary-600 text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm">
                  <FaUserPlus />
                  <span>Register</span>
                </Link>
                <Link to="/login" className="flex-1 px-6 py-4 bg-slate-900/80 hover:bg-slate-900 text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm border border-white/10">
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Updated Floating Stats */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 hidden lg:flex justify-around items-center text-white/40">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-white">{totalProps}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">Verified <br />Assets</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-white">Active</span>
            <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">Community <br />Members</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-white">100%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">Secure <br />Payments</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Redefining the Journey</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              We've engineered a sophisticated platform that eliminates complexity and prioritizes your experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl text-primary-600 mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Action Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9]">Ready to <br /><span className="text-primary-500">Upgrade</span> Your Life?</h2>
                <p className="text-sm text-slate-400 font-medium">Join thousands of others who have found their perfect living space through our platform.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="px-10 py-5 bg-primary-600 text-white font-black rounded-2xl text-lg hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/20 active:scale-95">Create Account</Link>
                <Link to="/login" className="px-10 py-5 bg-white/10 text-white font-black rounded-2xl text-lg border border-white/20 hover:bg-white/20 transition-all active:scale-95">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-200">
              <FaBuilding className="text-white text-xs" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">
              Property<span className="text-primary-600">Wave</span>
            </span>
          </div>

          <div className="flex flex-col md:items-end">
            <p className="text-slate-900 font-black uppercase tracking-[0.2em] text-[8px]">
              © 2026. PropertyWave Portal
            </p>
            <p className="text-slate-400 font-bold text-[7px] uppercase tracking-widest mt-0.5">
              The Gold Standard in Property Management
            </p>
          </div>
        </div>
      </footer>

    </motion.div>
  );
};

export default Home;
