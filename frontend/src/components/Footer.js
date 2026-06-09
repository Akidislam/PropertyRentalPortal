import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-slate-950 text-white pt-24 pb-12 overflow-hidden relative">
            {/* Decorative Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Identity */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-600/20 transform group-hover:rotate-12 transition-transform duration-500">
                                <FaHome className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic">
                                Property<span className="text-primary-500">Wave</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Redefining the real estate ecosystem with cutting-edge technology and unparalleled service. Your sanctuary, our priority.
                        </p>
                        <div className="flex gap-4">
                            {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Global Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'About', 'Properties', 'Support', 'Reviews'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group font-bold tracking-tight"
                                    >
                                        <div className="w-1 h-1 bg-primary-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Infrastructure */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Concierge Desk</h4>
                        <ul className="space-y-6">
                            <li className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    <FaPhoneAlt size={16} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Direct Line</p>
                                    <a href="tel:01790270005" className="font-black tracking-tight text-slate-200">01790270005</a>
                                </div>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    <FaEnvelope size={16} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Digital Mail</p>
                                    <a href="mailto:akidlislam7720@gmail.com" className="font-black tracking-tight text-slate-200">akidlislam7720@gmail.com</a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter / HQ */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Global Headquarters</h4>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-primary-500 flex-shrink-0">
                                <FaMapMarkerAlt size={16} />
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                Elite Realty Tower, Floor 42<br />
                                Financial District, Dhaka, BD
                            </p>
                        </div>
                        <button
                            onClick={scrollToTop}
                            className="group flex items-center gap-4 px-6 py-4 bg-primary-600/10 border border-primary-600/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 hover:bg-primary-600 hover:text-white transition-all w-full justify-center"
                        >
                            Back to Atmosphere <FaArrowUp className="group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                            © 2026. PropertyWave International. All Rights Reserved.
                        </p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.5em]">
                            The Gold Standard in Property Management
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Architected By</p>
                            <p className="text-sm font-black text-white uppercase tracking-tighter italic">
                                Lord <span className="text-primary-500">Voldemort</span>
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-primary-600/30 p-1">
                            <img
                                src="https://ui-avatars.com/api/?name=Voldemort&background=0284c7&color=fff"
                                alt="Lord Voldemort"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
