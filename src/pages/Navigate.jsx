import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowRight, CornerUpRight, ArrowUpCircle, CheckCircle,
  Navigation, ImagePlus, ChevronDown, Scan, LayoutList,
  Utensils, Toilet, DoorOpen, Armchair, X, Search,
  RefreshCw, MapPin, Filter, Locate, Keyboard, LocateFixed,
  AlertCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStadium } from '../context/StadiumContext';
import { api, ALL_CITIES } from '../api/stadiumData';
import StadiumMap, { DEST_COLORS } from '../components/StadiumMap';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: destination → seating facility type
// ─────────────────────────────────────────────────────────────────────────────
const destToFacility = { food: 'food', restroom: 'restroom', exit: 'exit', seat: null };

/**
 * Given a stadium and destination type, resolve which seating section is
 * the destination. For 'seat' we default to the first section.
 */
const resolveDestSection = (stadium, destType) => {
  const facilityType = destToFacility[destType];
  if (!facilityType) return stadium?.seating?.sections?.[0]?.id || null;
  const fac = stadium?.seating?.facilities?.find(f => f.type === facilityType);
  return fac?.sectionId || null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Ticket Scan Panel (unchanged functionality)
// ─────────────────────────────────────────────────────────────────────────────
const TicketScanPanel = ({ onDetected }) => {
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef();

  const { setSeatInfo } = useStadium();

  const simulateScan = (name) => {
    setScanning(true);
    setFileName(name);
    setTimeout(() => {
      setScanning(false);
      setSeatInfo('Section B, Row 12, Seat 8'); // Simulated extraction
      onDetected({ stadiumId: 'c3', sport: 'Cricket' }); // Wankhede demo
    }, 2000);
  };

  const handleFile = (file) => {
    if (file?.type.startsWith('image/')) simulateScan(file.name);
  };

  return (
    <div
      onClick={() => !scanning && fileRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-300 ${
        dragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-600 hover:border-cyan-400/60 hover:bg-slate-800/40 bg-slate-900/40'
      }`}
    >
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
      {scanning ? (
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full border-4 border-slate-700 absolute" />
            <div className="w-16 h-16 rounded-full border-4 border-t-cyan-400 animate-spin absolute" />
          </div>
          <p className="text-cyan-400 font-semibold text-sm">Scanning ticket…</p>
          <p className="text-slate-500 text-xs truncate max-w-[200px]">{fileName}</p>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 bg-cyan-500/15 rounded-2xl flex items-center justify-center border border-cyan-400/20">
            <ImagePlus size={30} className="text-cyan-400" />
          </div>
          <div className="text-center">
            <p className="text-slate-200 font-semibold text-sm">Upload Ticket Image</p>
            <p className="text-slate-500 text-xs mt-1">Drag & drop or tap to browse</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
            <Scan size={12} className="text-cyan-400/70" />
            Auto-extracts stadium, city & sport
          </div>
        </>
      )}
    </div>
  );
};

const ConfirmScanPanel = ({ data, onConfirm, onCancel, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [seat, setSeat] = useState(data.seat);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-6 flex flex-col gap-5 border-cyan-400/30">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-400/20">
          <Scan size={24} className="text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white">Ticket Scanned!</h3>
          <p className="text-xs text-slate-400">Is this location correct?</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 flex flex-col gap-3">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Stadium & Event</label>
          <p className="text-sm font-bold text-white leading-snug">{data.stadium.name} · <span className="text-cyan-400">{data.sport}</span></p>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block flex justify-between items-center">
            Seat Location
            {!editing && <button onClick={() => setEditing(true)} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[9px]"><Keyboard size={10}/> Edit</button>}
          </label>
          {editing ? (
            <div className="flex gap-2">
              <input type="text" value={seat} onChange={e => setSeat(e.target.value)} autoFocus className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:border-cyan-400 outline-none" />
              <button onClick={() => setEditing(false)} className="bg-cyan-500 text-slate-950 px-3 py-2 rounded-lg text-xs font-bold">OK</button>
            </div>
          ) : (
            <p className="text-sm font-bold text-white capitalize">{seat || 'Not specified'}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-4 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs uppercase hover:bg-slate-700 transition-all">Cancel</button>
        <button onClick={() => onConfirm({ ...data, seat })} className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold text-xs uppercase shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:from-cyan-300 transition-all flex items-center justify-center gap-2">
          Yes, Proceed <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stadium Search Panel with live autocomplete + filters (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
const StadiumSearchPanel = ({ onSelected }) => {
  const [allStadiums, setAllStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [chosen, setChosen] = useState(null);
  const { seatInfo, setSeatInfo } = useStadium();
  const inputRef = useRef();
  const dropRef  = useRef();
  const sportTypes = ['Cricket', 'Football', 'Hockey', 'Athletics', 'Indoor Sports'];

  useEffect(() => {
    api.getStadiums().then(d => { setAllStadiums(d); setLoading(false); });
  }, []);

  const suggestions = useMemo(() => {
    if (!query && !cityFilter && !sportFilter) return [];
    const q = query.toLowerCase();
    return allStadiums.filter(s => {
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.state.toLowerCase().includes(q);
      const matchC = !cityFilter  || s.city === cityFilter;
      const matchS = !sportFilter || s.sport.toLowerCase().includes(sportFilter.toLowerCase()) || s.type.toLowerCase().includes(sportFilter.toLowerCase());
      return matchQ && matchC && matchS;
    }).slice(0, 10);
  }, [query, cityFilter, sportFilter, allStadiums]);

  const selectStadium = s => { setChosen(s); setQuery(s.name); setShowDropdown(false); setHighlighted(-1); };
  const clearChoice   = () => { setChosen(null); setQuery(''); setSelectedSport(''); inputRef.current?.focus(); };

  const handleKeyDown = e => {
    if (!showDropdown || !suggestions.length) return;
    if (e.key === 'ArrowDown')  { e.preventDefault(); setHighlighted(h => Math.min(h + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); selectStadium(suggestions[highlighted]); }
    else if (e.key === 'Escape') setShowDropdown(false);
  };

  useEffect(() => {
    const h = e => { if (!dropRef.current?.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const sc = 'w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-cyan-400 transition-colors text-sm';

  if (loading) return (
    <div className="flex justify-center py-10">
      <div className="w-8 h-8 rounded-full border-2 border-t-cyan-400 border-slate-700 animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Filter size={10} /> City</label>
          <div className="relative">
            <select value={cityFilter} onChange={e => { setCityFilter(e.target.value); setChosen(null); setQuery(''); }} className={sc}>
              <option value="">All Cities</option>
              {ALL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Filter size={10} /> Sport</label>
          <div className="relative">
            <select value={sportFilter} onChange={e => { setSportFilter(e.target.value); setChosen(null); setQuery(''); }} className={sc}>
              <option value="">All Sports</option>
              {sportTypes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Search input with autocomplete */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Search size={10} /> Search Stadium</label>
        <div ref={dropRef} className="relative">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              ref={inputRef} type="text" value={query} readOnly={!!chosen}
              placeholder="Type stadium name, city, or state…"
              onChange={e => { setQuery(e.target.value); setChosen(null); setShowDropdown(true); setHighlighted(-1); }}
              onFocus={() => { if (!chosen) setShowDropdown(true); }}
              onKeyDown={handleKeyDown}
              className={`w-full bg-slate-900 border text-white rounded-xl py-3 pl-11 pr-10 text-sm focus:outline-none transition-colors placeholder:text-slate-600 ${chosen ? 'border-cyan-400 bg-slate-800/60' : 'border-slate-700 focus:border-cyan-400'}`}
            />
            {(query || chosen) && (
              <button onClick={clearChoice} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200">
                <X size={16} />
              </button>
            )}
          </div>
          <AnimatePresence>
            {showDropdown && suggestions.length > 0 && !chosen && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                {suggestions.map((s, idx) => (
                  <button key={s.id} onMouseDown={e => { e.preventDefault(); selectStadium(s); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-slate-800 last:border-0 ${highlighted === idx ? 'bg-cyan-500/10 text-cyan-400' : 'hover:bg-slate-800 text-slate-200'}`}>
                    <MapPin size={14} className={highlighted === idx ? 'text-cyan-400' : 'text-slate-500'} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{s.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{s.city} • {s.state} • {s.sport} • {(s.capacity / 1000).toFixed(0)}k</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
            {showDropdown && query.length >= 1 && !suggestions.length && !chosen && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-4 text-center text-slate-500 text-sm shadow-2xl">
                No stadiums found for "{query}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Selected card */}
      <AnimatePresence>
        {chosen && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            className="bg-cyan-500/8 border border-cyan-400/30 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-0.5">Selected Venue</p>
                <p className="text-white font-bold text-sm leading-snug">{chosen.name}</p>
                <p className="text-slate-400 text-xs mt-1">{chosen.city}, {chosen.state} • {chosen.sport} • {(chosen.capacity / 1000).toFixed(0)}k cap</p>
              </div>
              <CheckCircle size={20} className="text-cyan-400 shrink-0 mt-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sport & Seat selector */}
      {chosen && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event / Sport</label>
            <div className="relative">
              <select value={selectedSport} onChange={e => setSelectedSport(e.target.value)} className={sc}>
                <option value="">Select sport for this event…</option>
                {sportTypes.map(sp => <option key={sp} value={sp}>{sp}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Armchair size={10} /> Seat Number (Optional)
            </label>
            <input 
              type="text" 
              value={seatInfo}
              onChange={e => setSeatInfo(e.target.value)}
              placeholder="e.g. Section B, Row 12, Seat 8"
              className={sc}
            />
          </div>
        </motion.div>
      )}

      <button onClick={() => { if (chosen && selectedSport) onSelected({ stadium: chosen, sport: selectedSport }); }}
        disabled={!chosen || !selectedSport}
        className={`mt-1 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          chosen && selectedSport ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:from-cyan-300' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
        }`}>
        <Navigation size={18} /> Load Navigation
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Location Setup Panel (Phase 2.5) — GPS or manual
// ─────────────────────────────────────────────────────────────────────────────
const LocationSetupPanel = ({ stadium, onLocationReady }) => {
  const { gpsStatus, setGpsStatus, enableGPS, disableGPS: globalDisableGPS, userLocation } = useStadium();
  const [gpsState, setGpsState]     = useState(gpsStatus === 'enabled' ? 'granted' : 'idle');
  const [gpsCoords, setGpsCoords]   = useState(null);
  const [manualText, setManualText] = useState('');
  const [manualMode, setManualMode] = useState(gpsStatus === 'disabled');
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    if (gpsStatus === 'enabled' && gpsState === 'idle') {
      requestGPS();
    }
  }, [gpsStatus]);

  // Resolve GPS coords into nearest gate/section
  const resolveGpsSection = coords => {
    const firstSec = stadium?.seating?.sections?.[0]?.id || null;
    return firstSec;
  };

  const requestGPS = () => {
    setGpsState('requesting');
    // Simulate detecting
    setTimeout(() => {
      enableGPS();
      setGpsState('granted');
      setSelectedSection(userLocation?.sectionId || stadium?.seating?.sections?.[0]?.id);
    }, 1500);
  };

  const handleDisableGPS = () => {
    globalDisableGPS();
    setGpsState('idle');
    setManualMode(true);
  };

  // Parse manual location text into a section ID
  const resolveManualSection = text => {
    if (!text.trim() || !stadium?.seating) return null;
    const lc = text.toLowerCase();
    // Try to match gate → section
    const gateMatch = lc.match(/gate\s*(\d+)/i);
    if (gateMatch) {
      const gateLabel = `Gate ${gateMatch[1]}`;
      const sec = stadium.seating.sections.find(s => s.gates?.some(g => g === gateLabel));
      if (sec) return sec.id;
    }
    // Try to match section name
    const sec = stadium.seating.sections.find(s =>
      s.name.toLowerCase().includes(lc) || s.shortName?.toLowerCase().includes(lc)
    );
    return sec?.id || stadium.seating.sections[0]?.id || null;
  };

  const handleManualConfirm = () => {
    const secId = resolveManualSection(manualText) || stadium?.seating?.sections?.[0]?.id;
    setSelectedSection(secId);
    onLocationReady({ sectionId: secId, label: manualText || 'Stadium Entrance' });
  };

  const handleGPSConfirm = () => {
    onLocationReady({ sectionId: selectedSection, label: userLocation?.label || `GPS: Detected` });
  };

  const sections = stadium?.seating?.sections || [];

  return (
    <div className="flex flex-col gap-5">
      {/* GPS Button */}
      {!manualMode && gpsState !== 'granted' && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            Enable GPS so we can detect your location inside or near the stadium and guide you more precisely.
          </p>
          <button
            onClick={requestGPS}
            disabled={gpsState === 'requesting'}
            className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-[0_0_20px_rgba(34,211,238,0.25)] active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {gpsState === 'requesting' ? (
              <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Locating…</>
            ) : (
              <><LocateFixed size={20} /> Enable GPS Location</>
            )}
          </button>

          <button
            onClick={() => setManualMode(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition-all"
          >
            <Keyboard size={16} /> Type my location manually
          </button>
        </div>
      )}

      {/* GPS denied — show manual fallback message */}
      {gpsState === 'denied' && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-3 flex items-start gap-2 text-xs text-yellow-400">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          Location access was denied. Please type your current location below.
        </div>
      )}

      {/* GPS granted */}
      {gpsState === 'granted' && gpsStatus === 'enabled' && (
        <div className="flex flex-col gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
            <LocateFixed size={18} className="text-green-400 shrink-0" />
            <div className="flex-1">
              <p className="text-white font-bold text-sm">GPS Tracking Active</p>
              <p className="text-slate-400 text-[10px] mt-0.5">Auto-adjusting based on movement.</p>
              <button 
                onClick={handleDisableGPS}
                className="mt-2 text-cyan-400 text-[10px] font-bold uppercase tracking-widest hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <RefreshCw size={10} /> Disable Tracking
              </button>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">Nearest entrance: {sections[0]?.name || 'Stadium Entrance'}</p>
          </div>

          {/* Let user refine by clicking a section */}
          <p className="text-xs text-slate-500">Tap your section on the map below to refine your start location:</p>
          <StadiumMap
            stadium={stadium}
            userSectionId={selectedSection}
            destSectionId={null}
            destType={null}
            onSectionClick={id => setSelectedSection(id)}
          />

          <button onClick={handleGPSConfirm}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)] active:scale-[0.98] transition-all">
            Continue with this location <ChevronRight size={18} />
          </button>
          <button onClick={() => { setGpsState('idle'); setManualMode(true); }}
            className="text-slate-500 hover:text-slate-300 text-sm text-center transition-colors">
            Switch to manual entry →
          </button>
        </div>
      )}

      {/* Manual location entry */}
      {manualMode && gpsState !== 'granted' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Your Current Location</label>
            <input
              type="text"
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              placeholder="e.g. Gate 3, Block A, Near Food Court…"
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-600"
            />
            <p className="text-[10px] text-slate-600 mt-1.5">Enter your gate number, section, or landmark</p>
          </div>

          {/* Quick-select from section list */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Or tap your section below:</p>
            <div className="grid grid-cols-2 gap-2">
              {sections.map(s => (
                <button key={s.id}
                  onClick={() => { setSelectedSection(s.id); setManualText(s.name); }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedSection === s.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}>
                  {(s.gates?.[0] || s.id).toUpperCase()}&nbsp;·&nbsp;{s.shortName?.replace('\n', ' ') || s.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleManualConfirm}
            disabled={!manualText.trim() && !selectedSection}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              manualText.trim() || selectedSection
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}>
            <Navigation size={18} /> Confirm Location
          </button>

          <button onClick={() => { setManualMode(false); setGpsState('idle'); }}
            className="text-slate-500 hover:text-slate-300 text-sm text-center transition-colors">
            ← Try GPS instead
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Destination definitions
// ─────────────────────────────────────────────────────────────────────────────
const destinations = [
  { id: 'seat',     label: 'My Seat',    icon: Armchair, color: 'cyan'   },
  { id: 'food',     label: 'Food Court', icon: Utensils, color: 'orange' },
  { id: 'restroom', label: 'Restroom',   icon: Toilet,   color: 'blue'   },
  { id: 'exit',     label: 'Exit / Gate',icon: DoorOpen, color: 'green'  },
];
const colorMap = {
  cyan:   { bg:'bg-cyan-500/12',   border:'border-cyan-400/30',   text:'text-cyan-400',   activeBg:'bg-cyan-500/20'   },
  orange: { bg:'bg-orange-500/12', border:'border-orange-400/30', text:'text-orange-400', activeBg:'bg-orange-500/20' },
  blue:   { bg:'bg-blue-500/12',   border:'border-blue-400/30',   text:'text-blue-400',   activeBg:'bg-blue-500/20'   },
  green:  { bg:'bg-green-500/12',  border:'border-green-400/30',  text:'text-green-400',  activeBg:'bg-green-500/20'  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Build step-by-step instructions (real stand names when available)
// ─────────────────────────────────────────────────────────────────────────────
const buildSteps = (stadium, sport, destination, userLocation) => {
  const seating     = stadium?.seating;
  const sections    = seating?.sections || [];
  const destSecId   = resolveDestSection(stadium, destination);
  const destSec     = sections.find(s => s.id === destSecId);
  const destGate    = destSec?.gates?.[0] || 'the nearest gate';
  const destName    = destSec?.name || destination;
  const userLabel   = userLocation?.label || 'the stadium entrance';

  const base = [
    { text: `Start from ${userLabel} inside ${stadium?.name || 'the stadium'}.`, icon: Navigation },
    { text: `Follow internal signage toward ${destGate}.`, icon: ArrowUpCircle },
    { text: `Head through the concourse. Look for colour-coded direction signs.`, icon: CornerUpRight },
    { text: `You are approaching the ${destName} area.`, icon: ArrowUpCircle },
  ];

  if (destination === 'seat') {
    base.push({ text: `Locate your row and seat number in ${destName}. Check your ticket for exact details.`, icon: Armchair });
    base.push({ text: `You have reached your seat! Enjoy the ${sport || 'event'}!`, icon: CheckCircle });
  } else if (destination === 'food') {
    base.push({ text: `Follow orange "Food Court" signs into ${destName}. Multiple vendors available.`, icon: Utensils });
    base.push({ text: `You have arrived at the Food Court. Enjoy your meal!`, icon: CheckCircle });
  } else if (destination === 'restroom') {
    base.push({ text: `Follow blue "Restroom" signs near ${destGate}. Accessible facilities nearby.`, icon: Toilet });
    base.push({ text: `Restrooms are on your right. Return via the same corridor.`, icon: CheckCircle });
  } else if (destination === 'exit') {
    base.push({ text: `Follow green "Exit" signs toward ${destGate}. Use the nearest concourse exit.`, icon: DoorOpen });
    base.push({ text: `You have reached the exit. Thank you for visiting — have a safe journey!`, icon: CheckCircle });
  }

  return base;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Navigate Component
// ─────────────────────────────────────────────────────────────────────────────
const Navigate = () => {
  const { selectedStadium, setSelectedStadium, crowdData, userLocation, setUserLocation, gpsStatus, enableGPS } = useStadium();

  const [inputTab, setInputTab]     = useState('ticket');
  const [sessionStadium, setSessionStadium] = useState(selectedStadium || null);
  const [sessionSport, setSessionSport]     = useState(selectedStadium?.activeSport || '');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [confirmingScan, setConfirmingScan] = useState(null); // { stadium, sport, seat }

  // Location
  const [locationReady, setLocationReady]   = useState(false);

  useEffect(() => {
    // If GPS is globally enabled and destination is picked, auto-ready the location!
    if (selectedDestination && !locationReady && gpsStatus === 'enabled' && userLocation) {
      setLocationReady(true);
    }
  }, [gpsStatus, userLocation, selectedDestination, locationReady]);

  const { setSeatInfo, seatInfo } = useStadium();

  // Navigation steps
  const [navStarted, setNavStarted]         = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = useMemo(
    () => buildSteps(sessionStadium, sessionSport, selectedDestination, userLocation),
    [sessionStadium, sessionSport, selectedDestination, userLocation]
  );

  const destSectionId = useMemo(
    () => resolveDestSection(sessionStadium, selectedDestination),
    [sessionStadium, selectedDestination]
  );

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleTicketDetected = async ({ stadiumId, sport }) => {
    try {
      const stadium = await api.getStadiumById(stadiumId);
      // instead of applyStadium, we show confirmation
      setConfirmingScan({ stadium, sport, seat: 'Section B, Row 12, Seat 8' });
    } catch {
      const stadium = { id: stadiumId, name: 'Wankhede Stadium', city: 'Mumbai', gates: 7, seating: null };
      setConfirmingScan({ stadium, sport, seat: 'Section B, Row 12, Seat 8' });
    }
  };

  const handleConfirmScan = ({ stadium, sport, seat }) => {
    setSeatInfo(seat);
    applyStadium(stadium, sport);
    setConfirmingScan(null);
  };

  const applyStadium = (stadium, sport) => {
    const enriched = { ...stadium, activeSport: sport };
    setSessionStadium(enriched);
    setSessionSport(sport);
    setSelectedStadium(enriched);
    setUserLocation(null);
    setLocationReady(false);
  };

  const handleManualSelected = ({ stadium, sport }) => applyStadium(stadium, sport);

  const handleLocationReady = loc => {
    setUserLocation(loc);
    setLocationReady(true);
  };

  const changeStadium = () => {
    setNavStarted(false);
    setSelectedDestination(null);
    setCurrentStepIndex(0);
    setSessionStadium(null);
    setSessionSport('');
    setUserLocation(null);
    setLocationReady(false);
    setSelectedStadium(null);
  };

  const resetDest = () => {
    setNavStarted(false);
    setSelectedDestination(null);
    setCurrentStepIndex(0);
    setUserLocation(null);
    setLocationReady(false);
  };

  const isLastStep = currentStepIndex === steps.length - 1;

  const ChangeBtn = () => (
    <button onClick={changeStadium}
      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 transition-all">
      <RefreshCw size={12} /> Change
    </button>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 1: Stadium selection
  // ═══════════════════════════════════════════════════════════════════════════
  if (!sessionStadium) {
    return (
      <div className="flex flex-col min-h-full bg-[#0F172A] p-6 pt-10 overflow-y-auto pb-32">
        <header className="mb-6">
          <h1 className="text-2xl font-black text-white">Stadium Selection</h1>
          <p className="text-sm text-slate-400 mt-1">Please select your stadium or scan your ticket to get personalized assistance.</p>
        </header>

        <div className="flex bg-slate-900 rounded-2xl p-1 mb-6 border border-slate-800">
          {[{ key:'ticket', label:'Scan Ticket', icon: Scan }, { key:'manual', label:'Manual Select', icon: LayoutList }].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setInputTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                inputTab === key ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.25)]' : 'text-slate-400 hover:text-slate-200'
              }`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={inputTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {inputTab === 'ticket' ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-400 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 leading-relaxed">
                  <span className="text-cyan-400 font-semibold">🎟️ Ticket Scan: </span>
                  Upload your ticket image and we'll automatically extract the stadium, city, and sport.
                </p>
                <TicketScanPanel onDetected={handleTicketDetected} />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-400 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 leading-relaxed">
                  <span className="text-cyan-400 font-semibold">🔽 Manual Selection: </span>
                  Filter by city or sport. Covers 24+ verified stadiums across India.
                </p>
                <StadiumSearchPanel onSelected={handleManualSelected} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2: Destination picker
  // ═══════════════════════════════════════════════════════════════════════════
  if (!selectedDestination) {
    return (
      <div className="flex flex-col min-h-full bg-[#0F172A] p-6 pt-10 overflow-y-auto pb-32">
        <header className="mb-5 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-white">Where to?</h1>
            <p className="text-sm text-slate-400 mt-1">{sessionStadium.name} · <span className="text-cyan-400 font-semibold">{sessionSport}</span></p>
          </div>
          <ChangeBtn />
        </header>

        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle size={18} className="text-green-400 shrink-0" />
          <div>
            <p className="text-green-400 font-semibold text-sm">Stadium Loaded — Real Seating Chart</p>
            <p className="text-slate-400 text-xs mt-0.5">{sessionStadium.name} · {sessionStadium.city} · {(sessionStadium.capacity / 1000).toFixed(0)}k cap</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {destinations.map(({ id, label, icon: Icon, color }) => {
            const c = colorMap[color];
            return (
              <motion.button key={id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedDestination(id)}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border ${c.bg} ${c.border} transition-all`}>
                <div className={`w-12 h-12 rounded-xl ${c.activeBg} border ${c.border} flex items-center justify-center`}>
                  <Icon size={24} className={c.text} />
                </div>
                <span className="text-sm font-semibold text-slate-200">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2.5: Location setup
  // ═══════════════════════════════════════════════════════════════════════════
  if (!locationReady) {
    const dest = destinations.find(d => d.id === selectedDestination);
    return (
      <div className="flex flex-col min-h-full bg-[#0F172A] p-6 pt-10 overflow-y-auto pb-32">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-white">Your Location</h1>
            <p className="text-sm text-slate-400 mt-1">Where are you right now in the stadium?</p>
          </div>
          <ChangeBtn />
        </header>

        <div className={`bg-${dest.color === 'cyan' ? 'cyan' : dest.color}-500/10 border border-${dest.color === 'cyan' ? 'cyan' : dest.color}-500/30 rounded-2xl p-3 mb-5 flex items-center gap-3`}>
          {(() => { const DestIcon = dest.icon; return <DestIcon size={16} className={colorMap[dest.color].text} />; })()}
          <p className="text-xs text-slate-300">Navigating to: <span className={`font-semibold ${colorMap[dest.color].text}`}>{dest.label}</span></p>
        </div>

        <LocationSetupPanel stadium={sessionStadium} onLocationReady={handleLocationReady} />

        <button onClick={() => setSelectedDestination(null)} className="mt-6 text-slate-500 hover:text-slate-300 text-sm text-center transition-colors">
          ← Choose a different destination
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3: Confirm start (now shows mini-map preview)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!navStarted) {
    const dest  = destinations.find(d => d.id === selectedDestination);
    const c     = colorMap[dest.color];
    const DestIcon = dest.icon;
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col min-h-full bg-[#0F172A] p-6 pt-10 overflow-y-auto pb-32">
        <header className="mb-5 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-white">Route Preview</h1>
            <p className="text-sm text-slate-400 mt-1">{sessionStadium.name}</p>
          </div>
          <ChangeBtn />
        </header>

        {/* Stadium Map Preview */}
        {sessionStadium?.seating && (
          <div className="mb-5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Stadium Map — Tap a section to update your start</p>
            <StadiumMap
              stadium={sessionStadium}
              userSectionId={userLocation?.sectionId}
              destSectionId={destSectionId}
              destType={selectedDestination}
              onSectionClick={id => {
                const loc = { sectionId: id, label: sessionStadium.seating.sections.find(s => s.id === id)?.name || userLocation?.label };
                setLocalUserLocation(loc);
                setGlobalUserLocation(loc);
              }}
            />
          </div>
        )}

        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 text-center mb-5 shadow-lg">
          <div className={`w-14 h-14 ${c.activeBg} border ${c.border} rounded-2xl mx-auto mb-3 flex items-center justify-center`}>
            <DestIcon size={28} className={c.text} />
          </div>
          <h2 className="text-lg font-bold text-slate-100 mb-1">Navigate to {dest.label}</h2>
          <p className="text-slate-400 text-xs">
            From: <span className="text-cyan-400 font-semibold">{userLocation?.label || 'Stadium Entrance'}</span>
            {' '} · Via Gate {crowdData?.recommendedGate || sessionStadium?.seating?.facilities?.find(f => f.type === destToFacility[selectedDestination])?.sectionId || '—'}
          </p>
        </div>

        <button onClick={() => { setCurrentStepIndex(0); setNavStarted(true); }}
          className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold py-5 rounded-2xl text-lg hover:from-cyan-300 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] active:scale-[0.98] flex items-center justify-center gap-3">
          Start Navigation <ArrowRight size={22} />
        </button>

        <button onClick={() => setSelectedDestination(null)} className="mt-4 text-slate-500 hover:text-slate-300 text-sm text-center transition-colors">
          ← Choose different destination
        </button>
      </motion.div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4: Map + Step-by-step guidance
  // ═══════════════════════════════════════════════════════════════════════════
  const destColor = DEST_COLORS[selectedDestination] || '#22d3ee';

  return (
    <div className="flex flex-col min-h-full bg-[#0F172A] overflow-y-auto pb-32">
      {/* ── Header ── */}
      <div className="flex justify-between items-center px-6 pt-10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Navigation</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            To: <span className="font-semibold" style={{ color: destColor }}>{destinations.find(d => d.id === selectedDestination)?.label}</span>
          </p>
        </div>
        <ChangeBtn />
      </div>

      {/* ── Map View ── */}
      {sessionStadium?.seating && (
        <div className="px-6 mb-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <MapPin size={10} /> Live Route Map
          </p>
          <StadiumMap
            stadium={sessionStadium}
            userSectionId={userLocation?.sectionId}
            destSectionId={destSectionId}
            destType={selectedDestination}
            onSectionClick={id => {
              const loc = { ...userLocation, sectionId: id };
              setLocalUserLocation(loc);
              setGlobalUserLocation(loc);
            }}
          />
        </div>
      )}

      {/* ── All Navigation Steps ── */}
      <div className="px-6 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Step-by-Step Directions</h3>
           <span className="text-[10px] font-bold text-cyan-400/70">Tap a step to mark your progress</span>
        </div>

        <div className="flex flex-col">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isUpcoming = idx > currentStepIndex;

            return (
              <div key={idx} className="flex gap-4 group cursor-pointer" onClick={() => setCurrentStepIndex(idx)}>
                {/* Timeline visual elements */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                    isCurrent ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] text-slate-950' :
                    isCompleted ? 'bg-slate-800 border-green-500 text-green-500' :
                    'bg-slate-900 border-slate-700 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle size={16} /> : <span className="text-xs font-black">{idx + 1}</span>}
                  </div>
                  {idx !== steps.length - 1 && (
                    <div className={`w-0.5 h-full my-1 transition-all duration-300 ${
                      isCompleted ? 'bg-green-500/50' : 'bg-slate-800'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-8 transition-all duration-300 ${isUpcoming ? 'opacity-40' : 'opacity-100'}`}>
                  <div className={`flex items-center gap-3 mb-1.5 ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-green-400' : 'text-slate-400'}`}>
                    <Icon size={16} className={isCurrent ? 'animate-pulse' : ''} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {isCurrent ? 'Current Position' : isCompleted ? 'Passed' : 'Upcoming'}
                    </span>
                  </div>
                  <p className={`text-base font-black transition-colors leading-snug ${
                    isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {step.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={resetDest}
          className="mt-2 w-full bg-slate-900 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-400 font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-2 group">
          <X size={18} className="group-hover:rotate-90 transition-transform duration-300" /> End Navigation
        </button>
      </div>
    </div>
  );
};

export default Navigate;
