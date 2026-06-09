import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  FaUserPlus, FaSearch, FaShieldAlt, FaChartLine, FaStar,
  FaSignInAlt, FaBuilding, FaMapMarkerAlt, FaCheckShadow,
  FaRocket, FaQuoteLeft, FaGlobe, FaArrowRight, FaHome
} from 'react-icons/fa';
import heroImg from '../assets/hero_modern.png';

const Home = () => {
  const [totalProps, setTotalProps] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

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
  }, []);

  const features = [
    {
      icon: <FaSearch />,
      title: "Intelligent Search",
      description: "Our proprietary algorithm analyzes thousands of parameters to find your perfect property match in seconds."
    },
    {
      icon: <FaShieldAlt />,
      title: "Verified Security",
      description: "Proprietary vetting process for every landlord and tenant. 100% secure escrow-style wallet system."
    },
    {
      icon: <FaChartLine />,
      title: "Portfolio Growth",
      description: "Landlords gain access to real-time analytics, ROI tracking, and automated rental management suites."
    }
  ];

  return (
    <div className="relative min-h-screen bg-white">
      {/* Hero Section with Parallax */}
      <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img src={heroImg} alt="Luxury Real Estate" className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900"></div>
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/90">Global Real Estate Network</span>
            </div>

            <h1 className="text-6xl md:text-9xl font-black text-white mb-10 leading-[0.85] tracking-tighter uppercase">
              The Art of <br />
              <span className="text-gradient">Modern Living.</span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-300 mb-14 max-w-3xl mx-auto font-medium leading-relaxed opacity-90">
              Experience the pinnacle of luxury rental management. Discover curated properties that redefine sophistication and comfort.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register" className="group flex items-center gap-4 px-10 py-5 bg-white text-slate-900 font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-2xl shadow-black/20 transform hover:-translate-y-1">
                <span>Begin Journey</span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/view-reviews" className="flex items-center gap-4 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-white/20 transition-all transform hover:-translate-y-1">
                Customer Stories
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-24 bg-slate-900 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { val: totalProps, label: "Exclusive Assets", color: "text-primary-500" },
              { val: "24/7", label: "Smart Support", color: "text-indigo-400" },
              { val: "100%", label: "Secure Vetting", color: "text-emerald-400" },
              { val: "5-Star", label: "Client Satisfaction", color: "text-amber-400" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`text-4xl md:text-6xl font-black mb-3 ${stat.color} tracking-tighter`}>{stat.val}</div>
                <div className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-24">
            <div className="max-w-2xl">
              <span className="text-primary-600 font-black uppercase tracking-[0.4em] text-[10px] block mb-4">Ecosystem of Excellence</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-6">Designed for <br />Destinction.</h2>
            </div>
            <p className="max-w-md text-slate-500 font-medium text-lg leading-relaxed mb-4">
              We've synthesized decades of real estate expertise into a single, seamless digital environment. Sophistication meets efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative p-12 rounded-[4rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-700 h-full"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-3xl text-primary-600 mb-10 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 transform group-hover:-rotate-12">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight uppercase">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.description}</p>
                <div className="mt-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-3 text-primary-600 font-black uppercase text-[10px] tracking-widest">
                    Learn More <FaArrowRight />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Showcase / Mock App */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="relative bg-slate-900 rounded-[5rem] overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="grid lg:grid-cols-2 gap-20 p-20 items-center">
              <div className="relative z-10">
                <blockquote className="space-y-10">
                  <FaQuoteLeft className="text-primary-500 text-6xl opacity-30" />
                  <p className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight uppercase italic">
                    "PropertyWave transformed our real estate portfolio from a logistical nightmare into a sleek, automated wealth machine."
                  </p>
                  <footer className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-primary-600 overflow-hidden">
                      <img src="https://ui-avatars.com/api/?name=James+M&background=0284c7&color=fff" alt="James" />
                    </div>
                    <div>
                      <div className="text-white font-black uppercase tracking-widest">James McArthur</div>
                      <div className="text-primary-500 text-[10px] font-black tracking-[0.4em] uppercase">Private Equity Investor</div>
                    </div>
                  </footer>
                </blockquote>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary-600/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[4rem] relative z-10">
                  <h4 className="text-white font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                    <FaChartLine className="text-primary-500" /> Premium Analytics
                  </h4>
                  <div className="space-y-6">
                    {[
                      { label: "Asset Yield", val: "12.4%", width: "w-[90%]" },
                      { label: "Occupancy Rate", val: "98.2%", width: "w-[98%]" },
                      { label: "Market Growth", val: "+4.5%", width: "w-[75%]" }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>{stat.label}</span>
                          <span>{stat.val}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: stat.width.split('[')[1].split(']')[0] }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-primary-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence CTA */}
      <section className="py-40 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase mb-12">
              Ready to claim your <br />
              <span className="text-gradient">Territory?</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
              Join an elite network of landlords and tenants worldwide. Secure your next property or manage your portfolio with professional precision.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register" className="px-14 py-6 bg-slate-900 text-white font-black rounded-3xl text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl active:scale-95">Open Free Account</Link>
              <Link to="/support" className="px-14 py-6 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-3xl text-sm uppercase tracking-widest hover:border-slate-900 transition-all active:scale-95">Contact Advisor</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Footer */}
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                <FaHome className="text-white text-lg" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                Property<span className="text-primary-600">Wave</span>
              </span>
            </div>
            <div className="flex gap-10">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">Terms</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">Security</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">Network</div>
            </div>
          </div>

          <div className="flex flex-col md:items-end text-center md:text-right">
            <div className="text-slate-900 font-black uppercase tracking-[0.2em] text-[10px]">
              © 2026 PropertyWave International.
            </div>
            <div className="text-slate-400 font-bold text-[8px] uppercase tracking-[0.5em] mt-3">
              Elite Property Management Ecosystem
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
