import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Navigation, ShieldAlert, Clock, CheckCircle2, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { useStadium } from '../context/StadiumContext';
import SelectionGuard from '../components/SelectionGuard';
import { motion, AnimatePresence } from 'framer-motion';

const Emergency = () => {
  const { selectedStadium, activeSOS, setActiveSOS, seatInfo } = useStadium();
  const [showNavSteps, setShowNavSteps] = useState(null); // 'exit' | 'medical' | 'security' | null

  const handleSOS = (type) => {
    const newSOS = {
      type,
      status: 'Requested',
      timestamp: new Date().toLocaleTimeString(),
      location: seatInfo || 'Block C, Row 12, Seat 45'
    };
    setActiveSOS(newSOS);

    // Simulation logic
    setTimeout(() => setActiveSOS(prev => prev ? { ...prev, status: 'Assigned' } : null), 3000);
    setTimeout(() => setActiveSOS(prev => prev ? { ...prev, status: 'On the way' } : null), 7000);
    setTimeout(() => setActiveSOS(prev => prev ? { ...prev, status: 'Arrived' } : null), 12000);
  };

  const getSteps = (type) => {
    if (type === 'exit') return [
      "Exit your current row towards the stairs",
      "Head to Level 1 Concourse",
      "Follow green EXIT signs to Gate 4",
      "Proceed through Gate 4 to the Assembly Point"
    ];
    if (type === 'medical') return [
      "Walk towards the nearest elevator",
      "Go to Ground Floor",
      "Turn left after the Food Court",
      "Medical Room is next to Security Office"
    ];
    return [
      "Locate the nearest staff member",
      "Head to the Security Hub at Gate 1",
      "Show your digital ID for verification"
    ];
  };

  if (!selectedStadium) {
    return <SelectionGuard message="Without selecting a stadium, we can’t provide emergency assistance or seat-specific SOS alerts. Please choose a stadium to continue." />;
  }

  if (showNavSteps) {
    return (
      <div className="p-6 pt-10 flex flex-col gap-6 h-full text-slate-100">
        <header className="flex items-center gap-4">
          <button onClick={() => setShowNavSteps(null)} className="p-2 bg-slate-800 rounded-xl text-slate-400">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black uppercase tracking-tight">Navigation: {showNavSteps}</h2>
        </header>

        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-stadium-red/10 border border-stadium-red/30 p-4 rounded-2xl flex items-center gap-3">
            <AlertTriangle className="text-stadium-red" size={20} />
            <p className="text-xs font-bold text-slate-200">Emergency Route Active. Follow these steps immediately.</p>
          </div>

          <div className="flex flex-col gap-3">
            {getSteps(showNavSteps).map((step, idx) => (
              <div key={idx} className="glass-panel p-4 flex gap-4 items-start border-slate-800">
                <div className="w-6 h-6 rounded-full bg-stadium-red/20 text-stadium-red flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-stadium-red/30">
                  {idx + 1}
                </div>
                <p className="text-sm font-medium text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setShowNavSteps(null)}
          className="w-full py-5 rounded-2xl bg-slate-800 text-white font-black text-sm uppercase"
        >
          Exit Navigation
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pt-10 flex flex-col gap-6 h-full text-slate-100 relative overflow-hidden">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="text-stadium-red" size={28} /> Emergency & Safety
        </h1>
        <p className="text-slate-400 text-sm mt-1">Get immediate assistance inside the stadium.</p>
      </header>

      {/* SOS Status Tracking */}
      <AnimatePresence>
        {activeSOS && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="glass-panel border-stadium-red/40 bg-stadium-red/5 overflow-hidden"
          >
            <div className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-stadium-red animate-pulse" />
                    <h3 className="font-black text-xs uppercase tracking-widest text-stadium-red">SOS Active: {activeSOS.type}</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">Request sent at {activeSOS.timestamp}</p>
                </div>
                <button onClick={() => setActiveSOS(null)} className="text-slate-600 hover:text-white"><X size={16} /></button>
              </div>

              {/* Progress Tracker */}
              <div className="flex justify-between relative px-2">
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800" />
                {['Requested', 'Assigned', 'On the way', 'Arrived'].map((status, i) => {
                  const stages = ['Requested', 'Assigned', 'On the way', 'Arrived'];
                  const currentIdx = stages.indexOf(activeSOS.status);
                  const isPast = i < currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div key={status} className="flex flex-col items-center gap-2 relative z-10">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                        isPast ? 'bg-stadium-red border-stadium-red text-white' : 
                        isCurrent ? 'bg-slate-950 border-stadium-red text-stadium-red shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 
                        'bg-slate-950 border-slate-800 text-slate-700'
                      }`}>
                        {isPast ? <CheckCircle2 size={14} /> : i + 1}
                      </div>
                      <span className={`text-[8px] font-black uppercase ${isCurrent ? 'text-white' : 'text-slate-600'}`}>{status}</span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="p-2 bg-stadium-red/10 rounded-lg">
                  <Clock size={16} className="text-stadium-red" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-200 uppercase tracking-tight">Status: {activeSOS.status}</p>
                  <p className="text-[9px] text-slate-500">Security personnel are informed of your seat: <b>{activeSOS.location}</b></p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeSOS && (
        <div className="flex flex-col items-center justify-center py-4">
          <button 
            onClick={() => handleSOS('Security')}
            className="relative group w-48 h-48 rounded-full flex items-center justify-center bg-stadium-red/10 border-4 border-stadium-red border-dashed hover:border-solid hover:bg-stadium-red/20 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-full animate-ping bg-stadium-red/20 opacity-75"></div>
            <div className="w-40 h-40 bg-stadium-red shadow-[0_0_40px_rgba(239,68,68,0.5)] rounded-full flex flex-col items-center justify-center gap-2 text-white group-active:scale-95 transition-transform cursor-pointer">
              <AlertTriangle size={48} strokeWidth={2.5} />
              <span className="font-bold text-xl uppercase tracking-widest">SOS</span>
            </div>
          </button>
          <p className="text-xs text-slate-400 mt-6 text-center max-w-xs">
            Pressing the SOS button instantly alerts stadium security to your current seat location <b>({seatInfo || "Block C, Row 12, Seat 45"})</b>.
          </p>
        </div>
      )}

      {/* Quick Escape Route */}
      <div className="glass-panel p-4 border border-stadium-red/30 relative overflow-hidden bg-gradient-to-br from-slate-900 to-stadium-red/10">
        <h3 className="font-semibold text-sm mb-3 uppercase tracking-widest text-[10px] text-slate-400">Nearest Safe Exit</h3>
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-3">
             <div className="bg-stadium-green/20 text-stadium-green p-2 rounded-xl border border-stadium-green/30">
               <Navigation size={20} />
             </div>
             <div>
               <p className="font-bold">Gate 4 Stairs</p>
               <p className="text-[10px] text-slate-300">120 meters away • 2 min walk</p>
             </div>
           </div>
           <button 
            onClick={() => setShowNavSteps('exit')}
            className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-lg shadow-md hover:bg-slate-200 transition-colors"
           >
              Navigate
           </button>
        </div>
      </div>

      {/* Help Contacts */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div 
          onClick={() => setShowNavSteps('medical')}
          className="glass-panel p-4 hover:border-blue-500/50 cursor-pointer flex flex-col gap-2 group transition-all"
        >
           <div className="text-blue-400 bg-blue-400/10 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-blue-400 group-hover:text-slate-950 transition-all">
             <MapPin size={16} />
           </div>
           <h4 className="font-semibold text-sm">Medical Room</h4>
           <p className="text-[10px] text-slate-400">Ground floor, Gate 1.</p>
        </div>
        <a 
          href="tel:100"
          className="glass-panel p-4 hover:border-stadium-yellow/50 cursor-pointer flex flex-col gap-2 group transition-all"
        >
           <div className="text-stadium-yellow bg-stadium-yellow/10 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-stadium-yellow group-hover:text-slate-950 transition-all">
             <Phone size={16} />
           </div>
           <h4 className="font-semibold text-sm transition-all">Call Security</h4>
           <p className="text-[10px] text-slate-400">Direct helpline.</p>
        </a>
      </div>

    </div>
  );
};

export default Emergency;
