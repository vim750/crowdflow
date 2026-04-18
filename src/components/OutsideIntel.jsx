import React from 'react';
import { motion } from 'framer-motion';
import { Car, UserMinus, ParkingCircle, Info, ExternalLink, MapPin, Utensils, Droplets, HeartPulse } from 'lucide-react';

const OutsideIntel = ({ data, stadiumName }) => {
  if (!data) return null;

  const { traffic, gateFlow, parking, essentials } = data;

  const openInGoogleMaps = (type, name) => {
    const query = encodeURIComponent(`${type} near ${stadiumName} ${name || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Traffic Around Stadium */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5" id="traffic-intel">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
            <Car size={24} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-100 uppercase tracking-wide">Traffic Intelligence</h3>
            <p className="text-sm text-slate-300 font-bold uppercase tracking-[0.1em]">Surrounding Arteries</p>
          </div>
        </div>
        <div className="space-y-3">
          {traffic.map((road, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm font-bold text-white truncate">{road.road}</p>
                <p className="text-xs text-slate-300 leading-tight">Est: {road.time}m ({road.delay}m delay)</p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase text-center min-w-[80px] ${
                road.status === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 
                road.status === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' : 
                'bg-green-500/20 text-green-400 border border-green-500/40'
              }`}>
                {road.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gate Entry Flow */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5" id="gate-flow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <UserMinus size={24} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-100 uppercase tracking-wide">Gate Entry Flow</h3>
            <p className="text-sm text-slate-300 font-bold uppercase tracking-[0.1em]">Security Check Dynamics</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {gateFlow.slice(0, 3).map((gate, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex flex-col items-center justify-center border border-slate-600/30">
                <p className="text-[10px] text-slate-400 font-bold">GATE</p>
                <p className="text-sm font-black text-white">{gate.gate.split(' ')[1]}</p>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-bold text-slate-200">Queue: {gate.queueLen}</p>
                  <p className="text-xs font-bold text-slate-300">{gate.delayMins}m</p>
                </div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                   <div className={`h-full rounded-full ${gate.delayMins > 20 ? 'bg-red-500' : gate.delayMins > 10 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(gate.delayMins * 4, 100)}%` }} />
                </div>
                <p className="text-xs text-slate-300 mt-1 uppercase font-bold tracking-tight">Security: {gate.security}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parking Availability */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5" id="parking-info">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <ParkingCircle size={24} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-100 uppercase tracking-wide">Parking Information</h3>
            <p className="text-sm text-slate-300 font-bold uppercase tracking-[0.1em]">Availability Near Gates</p>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {parking.map((p, i) => (
            <div key={i} className="flex-shrink-0 w-32 bg-slate-800/40 rounded-xl border border-slate-700/30 p-3">
              <p className="text-xs font-black text-white mb-1">{p.name}</p>
              <div className={`text-xs font-bold mb-2 ${p.status === 'Full' ? 'text-red-400' : 'text-green-400'}`}>
                {p.status}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin size={10} />
                <span className="text-xs font-bold text-slate-300">{p.distance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Essentials */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5" id="nearby-essentials">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Info size={24} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-100 uppercase tracking-wide">Nearby Essentials</h3>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.1em]">Within 500m radius</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {essentials.map((item, i) => (
            <button 
              key={i} 
              onClick={() => openInGoogleMaps(item.type, item.name)}
              className="flex items-center justify-between p-3 bg-slate-800/40 hover:bg-slate-800/60 rounded-xl border border-slate-700/30 group transition-all"
            >
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                   item.type === 'food' ? 'bg-orange-500/10 text-orange-400' : 
                   item.type === 'water' ? 'bg-blue-500/10 text-blue-400' : 
                   'bg-red-500/10 text-red-400'
                 }`}>
                   {item.type === 'food' ? <Utensils size={18} /> : item.type === 'water' ? <Droplets size={18} /> : <HeartPulse size={18} />}
                 </div>
                 <div className="text-left">
                   <p className="text-xs font-bold text-slate-200">{item.name}</p>
                   <p className="text-[10px] text-slate-500">{item.dist} away · ⭐ {item.rating}</p>
                 </div>
              </div>
              <ExternalLink size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutsideIntel;
