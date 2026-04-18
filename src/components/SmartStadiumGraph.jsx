import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Users, Map, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

const StatusTile = ({ icon: Icon, label, value, status, description }) => {
  const getColors = (status) => {
    switch (status?.toLowerCase()) {
      case 'low':
      case 'fast':
      case 'short':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'medium':
      case 'moderate':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'high':
      case 'slow':
      case 'long':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const colors = getColors(status);

  return (
    <div className={`p-5 rounded-2xl border ${colors} flex flex-col gap-2 transition-all hover:scale-[1.02] bg-slate-900/40`}>
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-xl bg-slate-800/50">
          <Icon size={24} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${colors}`}>
          {status}
        </span>
      </div>
      <div>
        <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

const SmartStadiumGraph = ({ data, isUpdating }) => {
  // Map simplified data from technical data or defaults
  const gatesStatus = {
    label: 'Gates',
    value: 'Stable Flow',
    status: 'Medium',
    description: 'Average density across Gate 1-4. Gate 2 is currently the busiest.',
    icon: Users
  };

  const pathsStatus = {
    label: 'Paths',
    value: 'Moderate Velocity',
    status: 'Moderate',
    description: 'Main corridors are moving steadily. Use Level 2 for faster transit.',
    icon: Map
  };

  const waitStatus = {
    label: 'Waiting Time',
    value: '12 Minutes',
    status: 'Medium',
    description: 'Average wait time for security and ticket scanning at all zones.',
    icon: Clock
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusTile {...gatesStatus} />
        <StatusTile {...pathsStatus} />
        <StatusTile {...waitStatus} />
      </div>

      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
             <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Live Movement Advisory</h3>
            <p className="text-sm text-slate-400">AI-driven navigation recommendations based on real-time density.</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
             <p className="text-sm font-medium text-slate-200">
               <span className="text-emerald-400 font-bold uppercase tracking-wider mr-2">Fast Route:</span> 
               Gate 1 → Section C via North Passage is currently clear (Est: 4m).
             </p>
          </div>
          <div className="flex items-start gap-4 p-3 bg-orange-500/5 border border-orange-500/20 rounded-xl">
             <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
             <p className="text-sm font-medium text-slate-200">
               <span className="text-orange-400 font-bold uppercase tracking-wider mr-2">Avoid:</span> 
               South-East Concourse is experiencing heavy grouping.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartStadiumGraph;
