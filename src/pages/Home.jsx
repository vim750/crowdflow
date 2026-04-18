import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Utensils, Toilet, Phone,
  Activity, Users, ChevronRight, Radio,
  AlertCircle, Armchair, Info, WifiOff
} from 'lucide-react';
import { useStadium } from '../context/StadiumContext';
import { useLanguage } from '../context/LanguageContext';
import StadiumMap from '../components/StadiumMap';

import TicketStatus from '../components/TicketStatus';
import OutsideIntel from '../components/OutsideIntel';
import ProfileDropdown from '../components/ProfileDropdown';

// ─── Crowd level helper ───────────────────────────────────────────────────────
const crowdLevel = (density) => {
  if (!density) return { label: 'Unknown', color: 'text-slate-400', bar: 'bg-slate-600', pct: 0 };
  const map = {
    light:    { label: 'Low',    color: 'text-green-400',  bar: 'bg-green-400',  pct: 28  },
    moderate: { label: 'Medium', color: 'text-yellow-400', bar: 'bg-yellow-400', pct: 58  },
    dense:    { label: 'High',   color: 'text-red-400',    bar: 'bg-red-400',    pct: 88  },
  };
  return map[density] || map.moderate;
};

// ─── Stadium Snapshot ─────────────────────────────────────────────────────────
const StadiumSnapshot = ({ stadium, crowdData, isUpdating }) => {
  const crowd = crowdLevel(crowdData?.overallDensity);

  if (!stadium) {
    return (
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
            <MapPin size={20} className="text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-300">No Stadium Selected</p>
            <p className="text-xs text-slate-500 mt-0.5">Go to Navigation to select your venue</p>
          </div>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/60 border border-cyan-400/20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.06)]"
    >
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-600" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-2">Current Venue</p>
            <h2 className="text-xl font-black text-white leading-snug truncate">{stadium.name}</h2>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
              <MapPin size={12} className="shrink-0" />
              {stadium.city}, {stadium.state}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-full px-2.5 py-1 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${isUpdating ? 'bg-cyan-400' : 'bg-green-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isUpdating ? 'bg-cyan-400' : 'bg-green-400'}`} />
            </span>
            <span className="text-xs font-bold text-slate-300">LIVE</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { label: stadium.sport || stadium.type },
            { label: `Cap: ${(stadium.capacity / 1000).toFixed(0)}k` },
          ].map((tag, i) => (
            <span key={i} className="text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full">
              {tag.label}
            </span>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Users size={12} /> Crowd Level
            </p>
            <span className={`text-xs font-black ${crowd.color}`}>{crowd.label}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${crowd.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${crowd.pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Quick Action Card ────────────────────────────────────────────────────────
const ActionCard = ({ icon: Icon, label, iconBg, iconColor, borderColor, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -4 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-3 bg-slate-900 border ${borderColor} hover:brightness-110 p-6 rounded-2xl transition-all w-full shadow-lg h-32 group`}
  >
    <div className={`p-4 rounded-2xl ${iconBg} shrink-0 group-hover:scale-110 transition-transform`}>
      <Icon size={32} className={iconColor} />
    </div>
    <p className="text-sm font-black text-slate-100 text-center leading-snug uppercase tracking-wider">{label}</p>
  </motion.button>
);

// ─── Stagger animation wrapper ────────────────────────────────────────────────
const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay }
});

// ─── Home Page ────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { 
    selectedStadium, crowdData, isUpdating, 
    ticketStatus, outsideIntel, isOffline 
  } = useStadium();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollId = params.get('scroll');
    if (scrollId) {
      setTimeout(() => {
        const element = document.getElementById(scrollId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Clean up URL
          navigate('/', { replace: true });
        }
      }, 500); // Small delay to ensure components are rendered
    }
  }, [location, navigate]);

  return (
    <div className="min-h-full bg-[#0F172A] overflow-y-auto pb-32">
      {/* ── Offline Banner ── */}
      {isOffline && (
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="bg-orange-500 text-orange-950 px-6 py-2 flex items-center justify-center gap-2 overflow-hidden"
        >
          <WifiOff size={14} className="animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-widest">Offline mode: showing last updated data</p>
        </motion.div>
      )}

      {/* ── Header ── */}
      <div className="bg-gradient-to-b from-slate-900 to-transparent px-6 pt-10 pb-6 flex justify-between items-start gap-4">
        <motion.div {...fadeUp(0)} className="flex-1">
          <h1 className="text-3xl font-black text-white leading-tight">
            Navigate Smarter. <br/>
            <span className="text-cyan-400">Move Faster.</span>
          </h1>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-[90%]">
            CrowdFlow AI guides you through seats, food, facilities, and real-time crowd insights — all in one place.
          </p>
        </motion.div>

        <motion.div {...fadeUp(0)}>
          <ProfileDropdown />
        </motion.div>
      </div>

      <div className="px-6 flex flex-col gap-8">

        {/* ── 1. Quick Action Buttons ── */}
        <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionCard
            icon={Utensils}
            label="Food"
            iconBg="bg-orange-500/15"
            iconColor="text-orange-400"
            borderColor="border-orange-400/20 hover:border-orange-400/50 shadow-orange-500/5"
            onClick={() => navigate('/food')}
          />
          <ActionCard
            icon={Armchair}
            label="Find My Seat"
            iconBg="bg-cyan-500/15"
            iconColor="text-cyan-400"
            borderColor="border-cyan-400/30 hover:border-cyan-400/60 shadow-cyan-500/5"
            onClick={() => navigate('/navigate')}
          />
          <ActionCard
            icon={Toilet}
            label="Restroom"
            iconBg="bg-blue-500/15"
            iconColor="text-blue-400"
            borderColor="border-blue-400/20 hover:border-blue-400/50 shadow-blue-500/5"
            onClick={() => navigate('/restroom')}
          />
          <ActionCard
            icon={Phone}
            label="SOS"
            iconBg="bg-red-500/15"
            iconColor="text-red-400"
            borderColor="border-red-400/30 hover:border-red-400/60 shadow-red-500/5"
            onClick={() => navigate('/emergency')}
          />
        </motion.div>

        {/* stadium Snapshot / Warning */}
        {selectedStadium ? (
          <>
            <motion.div {...fadeUp(0.15)}>
              <StadiumSnapshot
                stadium={selectedStadium}
                crowdData={crowdData}
                isUpdating={isUpdating}
              />
            </motion.div>

            {/* ── 3. Ticket Availability ── */}
            <motion.div {...fadeUp(0.25)} id="ticket-availability">
               <TicketStatus data={ticketStatus} />
            </motion.div>

            {/* ── 4. Outside Stadium Intelligence ── */}
            <motion.div {...fadeUp(0.3)}>
               <div className="flex items-center gap-3 mb-5">
                  <Activity size={18} className="text-orange-400" />
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Outside Stadium Intelligence</h2>
               </div>
               <OutsideIntel data={outsideIntel} stadiumName={selectedStadium?.name} />
            </motion.div>
          </>
        ) : (
          <motion.div {...fadeUp(0.1)}
            className="flex flex-col items-center gap-6 bg-slate-900/40 border border-slate-700/50 rounded-3xl p-8 text-center shadow-xl"
          >
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-400/20">
              <MapPin size={32} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-lg font-black text-white uppercase tracking-wider mb-2">Please select your stadium</p>
              <p className="text-sm text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                Scan your ticket or choose a stadium manually to unlock real-time intelligence, maps, and tailored assistance.
              </p>
            </div>
            <button
              onClick={() => navigate('/navigate')}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:from-cyan-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Select Stadium
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Home;

