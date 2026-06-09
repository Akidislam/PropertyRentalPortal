import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaLightbulb, FaUserTie, FaUserFriends, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaBullseye, FaQuoteLeft, FaRocket, FaFilter, FaWallet, FaBolt, FaStar, FaHeadset } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/about`);
      if (response.data && response.data.data) {
        setAboutData(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch about content');
      console.error('Error fetching about data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl border border-red-100 max-w-md">
        <div className="text-red-500 text-6xl mb-6">⚠️</div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Connection Lost</h2>
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
        <button onClick={fetchAboutData} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg">Try Again</button>
      </div>
    </div>
  );

  if (!aboutData) return <div className="no-data">No data available</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen"
    >
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059ee742?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Real Estate"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-block px-4 py-2 bg-primary-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8 shadow-xl">Our Narrative</div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] uppercase">
              {aboutData.title}
            </h1>
            <div className="flex justify-center gap-4 mb-8">
              <FaQuoteLeft className="text-primary-500 text-2xl shrink-0" />
              <p className="text-xl md:text-2xl text-slate-300 font-medium italic leading-relaxed max-w-2xl">
                {aboutData.subquote}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-32 relative z-20 pb-32">
        {/* Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500"
          >
            <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center text-4xl text-primary-600 mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
              <FaBullseye />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight uppercase">Our Mission</h2>
            <p className="text-slate-500 leading-relaxed text-lg font-medium">{aboutData.mission}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500"
          >
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
              <FaLightbulb />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight uppercase">Our Vision</h2>
            <p className="text-slate-500 leading-relaxed text-lg font-medium">{aboutData.vision}</p>
          </motion.div>
        </div>

        {/* Features Showcase */}
        <section className="mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Why We Stand Out</h2>
            <div className="w-16 h-2 bg-primary-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.features.map((feature, index) => {
              const featureIcons = [<FaFilter size={20} />, <FaWallet size={20} />, <FaBolt size={20} />, <FaStar size={20} />, <FaHeadset size={20} />, <FaRocket size={20} />];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col items-center text-center gap-6 hover:shadow-xl hover:border-primary-100 transition-all group"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    {featureIcons[index % featureIcons.length]}
                  </div>
                  <p className="font-bold text-slate-800 text-sm leading-relaxed uppercase tracking-wide">{feature}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Strategic Partnerships */}
        <div className="space-y-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-50 text-primary-700 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">
                <FaUserFriends /> For Tenants
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[0.9] uppercase tracking-tighter">Your Lifestyle <br /><span className="text-primary-600">Reimagined.</span></h2>
              <p className="text-slate-500 text-xl leading-relaxed font-medium">{aboutData.forTenant}</p>
            </motion.div>
            <div className="bg-white p-4 rounded-[4rem] shadow-2xl overflow-hidden aspect-video relative rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Tenant" className="w-full h-full object-cover rounded-[3.5rem]" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-white p-4 rounded-[4rem] shadow-2xl overflow-hidden aspect-video relative -rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src="https://images.unsplash.com/photo-1582408921715-18e7806365c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Landlord" className="w-full h-full object-cover rounded-[3.5rem]" />
            </div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8 order-1 md:order-2"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-100 text-slate-900 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">
                <FaUserTie /> For Landlords
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[0.9] uppercase tracking-tighter">Asset Control <br /><span className="text-slate-400">Perfected.</span></h2>
              <p className="text-slate-500 text-xl leading-relaxed font-medium">{aboutData.forLandlord}</p>
            </motion.div>
          </div>
        </div>

        {/* Global Correspondence Section */}
        <section className="mt-32 bg-slate-900 rounded-[4rem] shadow-2xl border border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px]"></div>
          <div className="grid lg:grid-cols-2 relative z-10">
            <div className="p-12 md:p-20 flex flex-col justify-center">
              <h2 className="text-4xl font-black text-white mb-8 uppercase tracking-tighter">Global Headquarters</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary-500 text-2xl flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 className="font-black text-white/40 mb-1 uppercase text-[10px] tracking-widest">Office Location</h4>
                    <p className="text-white text-xl font-bold">{aboutData.contact}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                  {[
                    { icon: <FaFacebook />, link: aboutData?.socialLinks?.facebook },
                    { icon: <FaTwitter />, link: aboutData?.socialLinks?.twitter },
                    { icon: <FaLinkedin />, link: aboutData?.socialLinks?.linkedin },
                    { icon: <FaInstagram />, link: aboutData?.socialLinks?.instagram }
                  ].map((social, i) => social.link && (
                    <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all text-xl">
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-primary-600 p-12 md:p-20 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <h3 className="text-3xl md:text-5xl font-black mb-8 leading-[0.9] uppercase tracking-tighter">Begin the <br />Conversation.</h3>
              <p className="text-primary-100 text-xl mb-12 leading-relaxed font-medium">
                Our advisors are prepared to assist you with every aspect of your real estate journey.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                  <FaPhoneAlt className="text-primary-200" />
                  <span className="font-black tracking-tight text-lg">+880 1234 567 890</span>
                </div>
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                  <FaEnvelope className="text-primary-200" />
                  <span className="font-black tracking-tight text-lg">concierge@propertywave.com</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default About;
