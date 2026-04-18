import { QrCode, Share2, Download, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Ticket = () => {
  return (
    <div className="p-6 pt-10 flex flex-col items-center justify-center min-h-[85vh]">
      <header className="w-full mb-6">
        <h1 className="text-2xl font-bold text-slate-100 text-center">Fast Entry</h1>
      </header>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm bg-slate-100 rounded-[2rem] overflow-hidden relative shadow-[0_20px_50px_rgba(34,211,238,0.15)] pb-6"
      >
        <div className="bg-slate-900 p-6 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-stadium-green/20 rounded-full blur-2xl"></div>
          
          <h2 className="text-accent font-bold tracking-widest text-sm uppercase relative z-10">Match Day 14</h2>
          <h3 className="text-white text-xl font-bold mt-1 text-center relative z-10">Chennai Super Kings <br/><span className="text-slate-400 text-sm">vs</span><br/> Mumbai Indians</h3>
        </div>

        {/* Ticket Perforated Line Simulation */}
        <div className="relative flex justify-between items-center -mt-3 z-20">
          <div className="w-6 h-6 bg-[#0F172A] rounded-full -ml-3"></div>
          <div className="flex-1 border-t-2 border-dashed border-slate-300 mx-2"></div>
          <div className="w-6 h-6 bg-[#0F172A] rounded-full -mr-3"></div>
        </div>

        <div className="p-6 text-slate-900 flex flex-col items-center">
          <div className="w-full grid grid-cols-3 gap-2 text-center border-b border-slate-200 pb-4 mb-5">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Gate</p>
              <p className="font-black text-xl text-slate-800">04</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Block</p>
              <p className="font-black text-xl text-slate-800">C</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Seat</p>
              <p className="font-black text-xl text-slate-800">45</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            {/* Mock QR Code using LucideIcon since generating actual QR needs a library */}
            <div className="w-48 h-48 border-[4px] border-slate-900 rounded-xl flex items-center justify-center p-2 relative">
                <QrCode size={160} strokeWidth={1} className="text-slate-900" />
                {/* Scanner bar animation */}
                <motion.div 
                  className="absolute top-0 left-0 w-full h-1 bg-accent/80 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                />
            </div>
          </div>
          <p className="text-[10px] font-medium text-slate-500 mt-3 text-center">
            Brightness auto-increased for scanning.<br/> Hold near the scanner.
          </p>

          <div className="flex justify-center gap-4 mt-6 w-full">
            <button className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
              <Share2 size={16}/> Share
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg">
              <Download size={16}/> Save
            </button>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
        <Info size={14} className="text-accent"/>
        Works offline. Pre-loaded on your device.
      </div>

    </div>
  );
};

export default Ticket;
