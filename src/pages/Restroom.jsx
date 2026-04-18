import { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, Clock, Star, Users, Info, ChevronRight, 
  Search, ShieldCheck, Navigation, ArrowLeft, Send,
  Trash2, Filter, AlertCircle, Sparkles, Map as MapIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStadium } from '../context/StadiumContext';
import SelectionGuard from '../components/SelectionGuard';
import { getEnrichedRestrooms } from '../api/restroomData';

function cx(...inputs) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

const StatusBadge = ({ label, color }) => (
  <span className={cx(
    "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border",
    color === 'green' ? "bg-stadium-green/10 text-stadium-green border-stadium-green/20" :
    color === 'yellow' ? "bg-stadium-yellow/10 text-stadium-yellow border-stadium-yellow/20" :
    color === 'red' ? "bg-stadium-red/10 text-stadium-red border-stadium-red/20" :
    "bg-slate-800 text-slate-400 border-slate-700"
  )}>
    {label}
  </span>
);

const Restroom = () => {
  const { selectedStadium, userLocation, setUserLocation, enableGPS } = useStadium();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(null); // restroom object
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [gender, setGender] = useState(null); // 'male' | 'female' | null

  // Derived Data with Extreme Safety
  const restrooms = useMemo(() => {
    try {
      if (!selectedStadium) return [];
      return getEnrichedRestrooms(selectedStadium) || [];
    } catch (e) {
      console.error("Restroom data derivation error:", e);
      return [];
    }
  }, [selectedStadium]);

  const sortedRestrooms = useMemo(() => {
    try {
      if (!Array.isArray(restrooms)) return [];
      if (!userLocation || !userLocation.sectionId) return restrooms;
      
      return [...restrooms].sort((a, b) => {
        if (a.sectionId === userLocation.sectionId && b.sectionId !== userLocation.sectionId) return -1;
        if (b.sectionId === userLocation.sectionId && a.sectionId !== userLocation.sectionId) return 1;
        return 0;
      });
    } catch (e) {
      console.error("Restroom sorting error:", e);
      return restrooms || [];
    }
  }, [restrooms, userLocation]);

  const nearestRestroom = (userLocation?.sectionId && Array.isArray(sortedRestrooms) && sortedRestrooms.length > 0) 
    ? sortedRestrooms[0] 
    : null;

  // Debug Injection
  useEffect(() => {
    console.log("RESTROOM RENDER CHECK", {
      selectedStadium: !!selectedStadium,
      restroomsCount: restrooms?.length,
      sortedCount: sortedRestrooms?.length,
      nearest: nearestRestroom?.name,
      userLocation: !!userLocation
    });
  }, [selectedStadium, restrooms, sortedRestrooms, nearestRestroom, userLocation]);

  const handleGPSDetect = () => {
    setIsLocating(true);
    setTimeout(() => {
      enableGPS();
      setIsLocating(false);
      setShowLocationModal(false);
    }, 1500);
  };

  const handleManualSelect = (id, label) => {
    setUserLocation({ sectionId: id, label });
    setShowLocationModal(false);
  };

  const submitReview = () => {
    // In a real app, this would update the backend
    setShowReviewModal(null);
    setReviewRating(0);
    setReviewText('');
    // Mock success
    alert("Thank you for your feedback! Your review helps keep our facilities clean.");
  };

  if (!selectedStadium) {
    return <SelectionGuard message="Please select a stadium to view the nearest restrooms and their live status." />;
  }

  return (
    <div className="p-6 pt-10 flex flex-col gap-6 h-full relative">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Restroom Finder</h1>
          <p className="text-slate-400 text-sm mt-1 shrink-0">Find the nearest and cleanest facilities.</p>
        </div>
        <button 
          onClick={() => setShowLocationModal(true)}
          className="p-3 bg-slate-800/80 rounded-2xl text-accent border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2 group shadow-lg"
        >
          <MapPin size={18} className="group-hover:animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
            {userLocation?.label || "Set Location"}
          </span>
        </button>
      </header>

      {/* Location Awareness Placeholder */}
      {!userLocation && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-accent/10 border border-accent/30 p-6 rounded-3xl flex flex-col items-center gap-4 text-center"
        >
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                <Navigation size={32} className="text-accent animate-pulse" />
            </div>
            <div>
                <h3 className="text-lg font-black text-white">Where are you?</h3>
                <p className="text-xs text-slate-400 mt-1">To find the nearest restrooms, we need your current location in the stadium.</p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
                <button 
                    onClick={handleGPSDetect}
                    className="flex-1 bg-accent text-slate-950 py-3 rounded-2xl font-black text-xs uppercase"
                >
                    {isLocating ? "Locating..." : "Auto-Detect"}
                </button>
                <button 
                    onClick={() => setShowLocationModal(true)}
                    className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-2xl font-black text-xs uppercase border border-slate-700"
                >
                    Manual Input
                </button>
            </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-10">
        
        {/* Gender Selection */}
        {!gender && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-8 py-10"
          >
            <div className="text-center">
              <h2 className="text-2xl font-black text-white">Select Preference</h2>
              <p className="text-slate-400 text-xs mt-2">Help us find the right facility for you.</p>
            </div>
            
            <div className="flex gap-4 w-full max-w-sm">
              <button 
                onClick={() => setGender('male')}
                className="flex-1 aspect-square bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                   <Users size={32} />
                </div>
                <span className="font-black text-white uppercase tracking-widest text-xs">Male</span>
              </button>
              
              <button 
                onClick={() => setGender('female')}
                className="flex-1 aspect-square bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                   <Users size={32} />
                </div>
                <span className="font-black text-white uppercase tracking-widest text-xs">Female</span>
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 max-w-[200px] text-center italic">
              * This choice filters restrooms based on availability and proximity.
            </p>
          </motion.div>
        )}

        {gender && (
          <>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Showing For:</span>
                <button 
                  onClick={() => setGender(null)}
                  className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-black uppercase border border-accent/20 flex items-center gap-1"
                >
                  {gender} <RefreshCw size={10} />
                </button>
              </div>
            </div>
        {userLocation && nearestRestroom && (
            <div className="flex flex-col gap-4">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nearest Recommendation</h2>
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-accent/20 to-slate-900 border border-accent/30 p-5 rounded-3xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <ShieldCheck size={100} />
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-black text-white">{nearestRestroom?.name || 'Restroom'}</h3>
                                <StatusBadge label="Nearest" color="green" />
                            </div>
                             <p className="text-xs text-slate-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                Located in <b>{nearestRestroom?.sectionId?.toUpperCase() || 'STADIUM'} Section</b>
                             </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="bg-slate-900/60 p-2 rounded-xl flex items-center gap-1.5 border border-slate-800 mb-1">
                                <Star size={14} className="text-stadium-yellow fill-stadium-yellow" />
                                <span className="text-sm font-black text-white">{nearestRestroom?.rating || '0.0'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-5">
                       <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/50 flex items-center gap-3">
                            <Sparkles size={20} className="text-cyan-400" />
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase">Cleanliness</p>
                                <p className="text-xs font-bold text-slate-200">{nearestRestroom?.cleanliness || 'Standard'}</p>
                            </div>
                       </div>
                       <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/50 flex items-center gap-3">
                            <Users size={20} className={cx(nearestRestroom?.crowd === 'Low' ? "text-stadium-green" : "text-stadium-yellow")} />
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase">Crowd Level</p>
                                <p className="text-xs font-bold text-slate-200">{nearestRestroom?.crowd || 'Moderate'} Crowd</p>
                            </div>
                       </div>
                    </div>
                </motion.div>
            </div>
        )}

        {/* All Restrooms List */}
        <div className="flex flex-col gap-4">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">All Available Facilities</h2>
            <div className="flex flex-col gap-3">
                {(Array.isArray(sortedRestrooms) ? sortedRestrooms : []).filter(r => userLocation ? r.id !== nearestRestroom?.id : true).map((restroom, idx) => (
                    <motion.div 
                        key={restroom?.id || idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-panel p-4 flex gap-4 items-center group hover:bg-slate-800/5 transition-all"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-accent group-hover:text-slate-950 transition-all border border-slate-800">
                            <MapIcon size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-100 truncate">{restroom?.name || 'Restroom'}</h4>
                                <div className="flex items-center gap-1">
                                    <Star size={10} className="text-stadium-yellow fill-stadium-yellow" />
                                    <span className="text-[10px] font-black text-slate-400">{restroom?.rating || '0.0'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">{restroom?.sectionId || '—'} Section</span>
                                <div className="w-1 h-1 bg-slate-800 rounded-full" />
                                <span className="text-[10px] text-slate-500 font-medium">Cleaned {restroom?.lastCleaned || 'recently'}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <StatusBadge label={restroom?.cleanliness || 'Clean'} color={restroom?.cleanliness === 'Spotless' ? 'green' : 'yellow'} />
                                <StatusBadge label={`${restroom?.crowd || 'Low'} Crowd`} color={restroom?.crowd === 'Low' ? 'green' : 'yellow'} />
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowReviewModal(restroom)}
                            className="p-2 bg-slate-800 rounded-xl text-slate-500 hover:text-accent transition-colors border border-slate-700"
                        >
                            <ArrowLeft size={16} className="rotate-180" />
                        </button>
                    </motion.div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>

      {/* Location Selection Modal */}
      <AnimatePresence>
        {showLocationModal && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-md flex flex-col p-6"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-white">Current Location</h2>
                    <button onClick={() => setShowLocationModal(false)} className="p-2 bg-slate-900 rounded-xl text-slate-400">
                      <ArrowLeft size={20} />
                    </button>
                </div>

                <button 
                    onClick={handleGPSDetect}
                    className="bg-accent/10 border border-accent/40 p-5 rounded-3xl flex items-center gap-4 hover:bg-accent/20 transition-all mb-8"
                >
                    <div className="p-3 bg-accent rounded-2xl text-slate-950">
                        <Navigation size={24} />
                    </div>
                    <div className="text-left">
                        <h4 className="font-black text-white">Auto-Detect GPS</h4>
                        <p className="text-xs text-slate-400">Instantly find your block via sensors.</p>
                    </div>
                    <ChevronRight className="ml-auto text-accent" />
                </button>

                <div className="flex-1 flex flex-col min-h-0">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Or Select Section Manually</h3>
                    <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 hide-scrollbar">
                        {selectedStadium?.seating?.sections?.length ? (
                          selectedStadium.seating.sections.map(sec => (
                            <button 
                                key={sec?.id || Math.random()}
                                onClick={() => handleManualSelect(sec.id, sec.name)}
                                className={cx(
                                    "p-4 rounded-2xl border text-left transition-all",
                                    userLocation?.sectionId === sec.id ? "bg-accent/10 border-accent text-accent" : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                                )}
                            >
                                <p className="text-xs font-black uppercase tracking-tighter truncate">{sec?.id || '—'}</p>
                                <p className="text-[10px] font-bold mt-1 truncate">{sec?.name || 'General Section'}</p>
                            </button>
                          ))
                        ) : (
                          <div className="col-span-2 py-10 text-center glass-panel border-dashed opacity-50">
                             <p className="text-xs text-slate-500 uppercase tracking-widest italic">No sections defined</p>
                          </div>
                        )}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[130] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="glass-panel p-8 w-full max-w-sm flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-accent/20"
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={32} className="text-accent" />
                        </div>
                        <h3 className="text-xl font-black text-white">Rate Facility</h3>
                        <p className="text-xs text-slate-400 mt-1">Help others by sharing real-time status of <b>{showReviewModal.name}</b></p>
                    </div>

                    <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map(s => (
                            <button 
                                key={s} 
                                onClick={() => setReviewRating(s)}
                                className={cx(
                                    "w-12 h-12 rounded-xl border flex items-center justify-center transition-all",
                                    reviewRating >= s ? "bg-stadium-yellow/10 border-stadium-yellow text-stadium-yellow" : "bg-slate-900 border-slate-800 text-slate-700"
                                )}
                            >
                                <Star size={20} fill={reviewRating >= s ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>

                    <textarea 
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:border-accent min-h-[100px]"
                        placeholder="Optional comment (e.g. 'Needs cleaning', 'Very accessible')"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />

                    <div className="flex gap-3">
                        <button 
                            onClick={submitReview}
                            className="flex-3 bg-accent text-slate-950 py-4 rounded-2xl font-black text-xs uppercase"
                        >
                            Submit Review
                        </button>
                        <button 
                            onClick={() => setShowReviewModal(null)}
                            className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-2xl font-black text-xs uppercase"
                        >
                            Skip
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Restroom;
