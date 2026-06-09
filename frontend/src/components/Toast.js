import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle, FaInfoCircle, FaTimes, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const Toast = ({ type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, onClose]);

  const config = {
    success: {
      icon: <FaCheckCircle className="text-emerald-500" />,
      bg: 'bg-white',
      border: 'border-emerald-500',
      text: 'text-emerald-700',
      progress: 'bg-emerald-500'
    },
    error: {
      icon: <FaExclamationCircle className="text-rose-500" />,
      bg: 'bg-white',
      border: 'border-rose-500',
      text: 'text-rose-700',
      progress: 'bg-rose-500'
    },
    warning: {
      icon: <FaExclamationTriangle className="text-amber-500" />,
      bg: 'bg-white',
      border: 'border-amber-500',
      text: 'text-amber-700',
      progress: 'bg-amber-500'
    },
    info: {
      icon: <FaInfoCircle className="text-sky-500" />,
      bg: 'bg-white',
      border: 'border-sky-500',
      text: 'text-sky-700',
      progress: 'bg-sky-500'
    }
  };

  const { icon, bg, border, text, progress } = config[type] || config.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex items-center p-4 mb-4 ${bg} border-l-4 ${border} rounded-r-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] min-w-[320px] max-w-md pointer-events-auto relative overflow-hidden`}
    >
      <div className="flex-shrink-0 text-2xl mr-3">{icon}</div>
      <div className={`mr-8 text-sm font-semibold tracking-wide ${text}`}>{message}</div>
      <button
        onClick={onClose}
        className={`ml-auto -mr-1 rounded-lg p-1.5 inline-flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600`}
      >
        <FaTimes size={14} />
      </button>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-1 ${progress} opacity-40`}
      />
    </motion.div>
  );
};

export default Toast;
