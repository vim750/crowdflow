import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, AlertCircle } from 'lucide-react';

const SelectionGuard = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 max-w-sm shadow-2xl"
      >
        <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20 mx-auto mb-6">
          <AlertCircle size={32} className="text-yellow-400" />
        </div>
        
        <h2 className="text-xl font-black text-white mb-3">Selection Required</h2>
        
        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          {message || "Without selecting a stadium, we can’t provide further details. Please choose a stadium to continue."}
        </p>

        <button
          onClick={() => navigate('/navigate')}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold py-4 rounded-xl shadow-lg hover:from-cyan-300 transition-all active:scale-[0.98]"
        >
          <MapPin size={18} />
          Select Stadium
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
};

export default SelectionGuard;
