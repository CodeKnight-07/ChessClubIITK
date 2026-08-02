import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ServerError500 = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#111111] text-white px-4 relative overflow-hidden py-16">
      {/* Dynamic Background Auras */}
      <div className="absolute top-1/4 left-1/4 w-[35%] h-[35%] rounded-full bg-[#f2ca50]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[35%] h-[35%] rounded-full bg-red-500/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-xl w-full text-center relative z-10 bg-[#1a1a1a]/80 backdrop-blur-md border border-[#4d4635]/20 p-8 md:p-12 rounded-3xl shadow-2xl">
        {/* Animated Icon Container */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] mb-8"
        >
          <span className="material-symbols-outlined text-5xl text-red-500 font-light animate-pulse">
            gavel
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-7xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-[#f2ca50]"
        >
          500
        </motion.h1>

        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-serif text-gray-200 mt-4 mb-4 font-semibold"
        >
          Page failed to load
        </motion.h2>

        {/* Message */}
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm text-gray-400 leading-relaxed mb-10 max-w-md mx-auto"
        >
          We ran out of time trying to process your request. The arbiters have been notified. Please check back in a few minutes.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all duration-300 active:scale-95"
          >
            Retry Connection
          </button>
          
          <a 
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 text-center"
          >
            Return to Home
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ServerError500;
