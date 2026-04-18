import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStadium } from '../context/StadiumContext';
import { getFoodCourts } from '../api/foodData';
import {
  Users, Coffee, Map, AlertTriangle, MessageSquare,
  Activity, Toilet, CheckCircle2, XCircle, Clock,
  ShieldCheck, AlertCircle, BarChart3, TrendingUp, TrendingDown,
  LogOut, Lightbulb, UsersRound, ThumbsUp, ThumbsDown
} from 'lucide-react';

const Badge = ({ children, color = "cyan" }) => (
  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
    color === "cyan" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20" :
    color === "green" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
    color === "red" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
    color === "yellow" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
    "bg-slate-800 text-slate-400 border border-slate-700"
  }`}>
    {children}
  </span>
);

const KPICard = ({ label, value, icon: Icon, color, trend }) => (
   <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
         <div className={`p-2 rounded-xl ${color}`}>
            <Icon size={20} />
         </div>
         {trend && (
            <div className={`flex items-center gap-1 text-[10px] font-bold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
               {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
               {Math.abs(trend)}%
            </div>
         )}
      </div>
      <div>
         <h4 className="text-3xl font-black text-white">{value}</h4>
         <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">{label}</p>
      </div>
   </div>
);

const Management = () => {
  const navigate = useNavigate();
  const { selectedStadium, activeSOS } = useStadium();
  
  // Real-time Simulation State
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTicker(t => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  // --- MOCK DATA FOR METRICS ---
  
  // A. Top Summary
  const liveMetrics = {
    users: 28450 + (ticker % 5) * 10,
    orders: 450 + (ticker % 3) * 5,
    navUsers: 12500,
    sos: activeSOS ? 1 : 2,
    reviews: 1420
  };

  // B. System Monitoring
  const allShops = useMemo(() => {
    if (!selectedStadium) return getFoodCourts('m_chinnaswamy_stadium');
    return getFoodCourts(selectedStadium.id);
  }, [selectedStadium]);

  const reviewAnalyzer = {
     food: { positive: 88, negative: 12, commonIssue: 'Long wait times during breaks' },
     restroom: { positive: 76, negative: 24, commonIssue: 'Hygiene in Level 2 East' }
  };

  const navRoutes = [
     { dest: 'Gate 3 Exit', count: 4200, status: 'Congested' },
     { dest: 'Food Court A', count: 3100, status: 'Normal' },
     { dest: 'Restroom L1', count: 1800, status: 'Normal' }
  ];

  // C. Staff & Performance
  const staffMetrics = {
    responseTime: '2.4 mins',
    tasksCompleted: 145,
    tasksPending: 12,
    performance: 'Good' // Good, Average, Needs Attention
  };

  const aiInsights = [
    "Increase staff presence at Gate 3 due to navigation congestion.",
    "Restroom Level 2 East generating hygiene complaints. Dispatch cleaning team.",
    "Food Court B overloaded. Sub-optimal wait times (+15m) detected."
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] p-6 pb-24 overflow-y-auto w-full font-sans">
      <header className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
         <div className="flex items-center gap-4">
           <div>
             <h1 className="text-2xl font-black text-white tracking-tight">System Intelligence</h1>
             <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest mt-0.5 flex items-center gap-2">
                Management Dashboard <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" />
             </p>
           </div>
         </div>
         <div className="flex items-center gap-4">
            <button 
               onClick={handleLogout}
               className="flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            >
               <LogOut size={16} /> Exit System
            </button>
         </div>
      </header>

      <div className="space-y-8">
        
        {/* ================= SECTION A: TOP SUMMARY ================= */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             <KPICard label="Active Users" value={liveMetrics.users.toLocaleString()} icon={Users} color="bg-blue-500/10 text-blue-400 border border-blue-500/20" trend={2.4} />
             <KPICard label="Food Orders" value={liveMetrics.orders} icon={Coffee} color="bg-orange-500/10 text-orange-400 border border-orange-500/20" trend={5.1} />
             <KPICard label="Nav Usage" value={liveMetrics.navUsers.toLocaleString()} icon={Map} color="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" trend={-1.2} />
             <KPICard label="SOS Requests" value={liveMetrics.sos} icon={AlertTriangle} color="bg-red-500/10 text-red-400 border border-red-500/20" trend={0} />
             <KPICard label="Reviews Submitted" value={liveMetrics.reviews.toLocaleString()} icon={MessageSquare} color="bg-purple-500/10 text-purple-400 border border-purple-500/20" trend={8.4} />
          </div>
        </section>

        {/* ================= SECTION B: SYSTEM MONITORING ================= */}
        <section>
           <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
             <Activity size={16} /> Structural System Monitoring
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* 1. Food System */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-white flex items-center gap-2"><Coffee size={18} className="text-orange-400" /> Food System</h3>
                    <Badge color="green">Operational</Badge>
                 </div>
                 
                 <div className="space-y-4 mb-6">
                    {allShops.slice(0, 3).map((shop, i) => (
                       <div key={i} className="flex justify-between items-center border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                          <div>
                             <p className="text-sm font-bold text-slate-200">{shop.name}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 text-orange-400/80">{Math.floor(Math.random() * 20)+5} Active Orders</p>
                          </div>
                          <span className="text-xs font-black text-slate-400">{i===0?'Burgers':i===1?'Cold Drinks':'Popcorn'} (Top)</span>
                       </div>
                    ))}
                 </div>

                 {/* Review Analyzer for Food */}
                 <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-1"><BarChart3 size={12}/> Smart Review Analyzer</h4>
                    <div className="flex gap-4 items-center mb-3 text-xs font-bold">
                       <div className="flex-1 flex gap-2 items-center text-green-400">
                          <ThumbsUp size={14} /> {reviewAnalyzer.food.positive}%
                       </div>
                       <div className="flex-1 flex gap-2 items-center text-red-400">
                          <ThumbsDown size={14} /> {reviewAnalyzer.food.negative}%
                       </div>
                    </div>
                    <p className="text-[10px] text-yellow-400 bg-yellow-500/10 p-2 rounded-lg font-bold border border-yellow-500/20">
                       <span className="text-slate-400">Common Issue:</span> {reviewAnalyzer.food.commonIssue}
                    </p>
                 </div>
              </div>

              {/* 2. Restroom System */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-white flex items-center gap-2"><Toilet size={18} className="text-cyan-400" /> Restroom System</h3>
                    <Badge color="yellow">Needs Attention</Badge>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 text-center">
                       <p className="text-2xl font-black text-white">8.4k</p>
                       <p className="text-[9px] uppercase font-bold text-slate-500 mt-1">Total Usage Today</p>
                    </div>
                    <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center">
                       <p className="text-2xl font-black text-red-400">12</p>
                       <p className="text-[9px] uppercase font-bold text-red-500/80 mt-1">Cleanliness Complaints</p>
                    </div>
                 </div>

                 {/* Review Analyzer for Restroom */}
                 <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-1"><BarChart3 size={12}/> Smart Review Analyzer</h4>
                    <div className="flex gap-4 items-center mb-3 text-xs font-bold">
                       <div className="flex-1 flex gap-2 items-center text-green-400">
                          <ThumbsUp size={14} /> {reviewAnalyzer.restroom.positive}%
                       </div>
                       <div className="flex-1 flex gap-2 items-center text-red-400">
                          <ThumbsDown size={14} /> {reviewAnalyzer.restroom.negative}%
                       </div>
                    </div>
                    <p className="text-[10px] text-red-400 bg-red-500/10 p-2 rounded-lg font-bold border border-red-500/20 items-start flex flex-col">
                       <span className="text-slate-400">Common Issue:</span> {reviewAnalyzer.restroom.commonIssue}
                    </p>
                 </div>
              </div>

              {/* 3. Navigation Intelligence */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-white flex items-center gap-2"><Map size={18} className="text-blue-400" /> Navigation Flow</h3>
                    <Badge color="blue">Active Tracking</Badge>
                 </div>
                 
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                       <Map size={20} className="text-blue-400 animate-pulse" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-300">Live Routing</p>
                       <p className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">{liveMetrics.navUsers.toLocaleString()} Active Sessions</p>
                    </div>
                 </div>

                 <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Top Destinations</h4>
                 <div className="space-y-3">
                    {navRoutes.map((route, i) => (
                       <div key={i} className="flex justify-between text-xs font-bold bg-slate-800/40 p-3 rounded-xl">
                          <span className="text-slate-300">{route.dest}</span>
                          <span className={route.status === 'Congested' ? 'text-red-400' : 'text-green-400'}>{route.status}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* 4. SOS Monitoring */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
                 {liveMetrics.sos > 0 && <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full" />}
                 <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-lg font-black text-white flex items-center gap-2"><AlertTriangle size={18} className="text-red-400" /> SOS Network</h3>
                    <Badge color={liveMetrics.sos > 0 ? 'red' : 'green'}>{liveMetrics.sos > 0 ? 'Urgent' : 'Clear'}</Badge>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                    <div className="border-l-2 border-slate-700 pl-3">
                       <p className="text-2xl font-black text-white">{liveMetrics.sos}</p>
                       <p className="text-[9px] uppercase font-bold text-slate-500 mt-1">Active Calls</p>
                    </div>
                    <div className="border-l-2 border-slate-700 pl-3">
                       <p className="text-2xl font-black text-white">1.8m</p>
                       <p className="text-[9px] uppercase font-bold text-slate-500 mt-1">Avg Response Time</p>
                    </div>
                 </div>

                 <div className="space-y-2 relative z-10">
                    {activeSOS ? (
                       <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex justify-between items-center">
                          <div>
                             <p className="text-xs font-black text-white">{activeSOS.type}</p>
                             <p className="text-[9px] text-red-300 font-bold uppercase mt-1">Medical Team Dispatched</p>
                          </div>
                          <Badge color="red">1m ago</Badge>
                       </div>
                    ) : (
                       <div className="bg-slate-800/40 border border-slate-700 p-3 rounded-xl flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-green-500" />
                          <p className="text-xs font-bold text-slate-400">All emergency channels clear.</p>
                       </div>
                    )}
                 </div>
              </div>

           </div>
        </section>

        {/* ================= SECTION C: STAFF & PERFORMANCE ================= */}
        <section>
           <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
             <ShieldCheck size={16} /> Operations & Intelligence
           </h2>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Staff Stats */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-center">
                 <h3 className="text-sm font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2"><UsersRound size={16} className="text-slate-400" /> Staff Performance</h3>
                 
                 <div className="space-y-5">
                    <div>
                       <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Avg Response</span>
                          <span className="text-lg font-black text-white">{staffMetrics.responseTime}</span>
                       </div>
                    </div>
                    
                    <div>
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Tasks Overview</span>
                          <span className="text-xs font-black text-white">{staffMetrics.tasksCompleted} / {staffMetrics.tasksCompleted + staffMetrics.tasksPending}</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(staffMetrics.tasksCompleted / (staffMetrics.tasksCompleted + staffMetrics.tasksPending)) * 100}%` }} />
                       </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl flex items-center justify-between">
                       <span className="text-xs font-bold text-green-400">Performance Status</span>
                       <Badge color="green">{staffMetrics.performance}</Badge>
                    </div>
                 </div>
              </div>

              {/* AI Insights & Alerts */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                 <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Lightbulb size={16} className="text-yellow-400" /> AI Insights / Suggestions</h3>
                 <div className="space-y-3">
                    {aiInsights.map((insight, idx) => (
                       <div key={idx} className="flex items-start gap-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                          <div className="p-1.5 bg-yellow-500/10 rounded-lg text-yellow-400 mt-0.5">
                             <AlertCircle size={14} />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-300 leading-relaxed">{insight}</p>
                             <p className="text-[9px] uppercase font-bold text-slate-500 mt-1.5 tracking-wider font-mono">Auto-generated via live metrics</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </section>

      </div>
    </div>
  );
};

export default Management;
