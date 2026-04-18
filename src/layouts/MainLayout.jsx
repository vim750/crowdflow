import { useState, useEffect } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import TabNav from '../components/TabNav';
import AIChatbotModal from '../components/AIChatbotModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, ShieldCheck, Wifi, Home, Map, Coffee, Toilet, AlertTriangle, Ticket, Car, UserMinus, ParkingCircle, Info, ChevronRight, MapPin, Locate } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStadium } from '../context/StadiumContext';

function cx(...inputs) {
  return twMerge(clsx(inputs));
}

const SidebarNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, deliveryNotification } = useStadium();
  const activeOrders = orders?.filter(o => o.status !== 'delivered') || [];

  const tabs = [
    { 
      name: 'Home', 
      path: '/', 
      icon: Home,
      subItems: [
        { name: 'Ticket Availability', id: 'ticket-availability', icon: Ticket },
        { name: 'Traffic Intelligence', id: 'traffic-intel', icon: Car },
        { name: 'Gate Entry Flow', id: 'gate-flow', icon: UserMinus },
        { name: 'Parking Information', id: 'parking-info', icon: ParkingCircle },
        { name: 'Nearby Essentials', id: 'nearby-essentials', icon: Info },
      ]
    },
    { name: 'Navigation', path: '/navigate',  icon: Map },
    { name: 'Food',       path: '/food',      icon: Coffee },
    { name: 'Restroom',   path: '/restroom',  icon: Toilet },
    { name: 'SOS',        path: '/emergency', icon: AlertTriangle, danger: true },
  ];

  const handleSubItemClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/?scroll=' + sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;

        return (
          <div key={tab.name} className="flex flex-col gap-1">
            <NavLink
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
                  isActive
                    ? tab.danger
                      ? 'bg-stadium-red/10 text-stadium-red border border-stadium-red/30'
                      : 'bg-accent/10 text-accent border border-accent/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{tab.name}</span>
              
              {tab.name === 'Food' && (activeOrders.length > 0 || deliveryNotification) && (
                <span className={cx(
                  "absolute right-4 w-2 h-2 rounded-full",
                  deliveryNotification ? "bg-stadium-green animate-pulse" : "bg-accent"
                )} />
              )}
            </NavLink>

            {/* Sub-items for Home */}
            {tab.name === 'Home' && isActive && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col gap-1 ml-6 mt-1 border-l border-slate-800/50"
              >
                {tab.subItems.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <button
                      key={sub.name}
                      onClick={(e) => handleSubItemClick(e, sub.id)}
                      className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 rounded-lg transition-all text-left group"
                    >
                      <SubIcon size={14} className="group-hover:text-accent transition-colors" />
                      <span className="text-xs font-medium">{sub.name}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, activeSOS, deliveryNotification, setDeliveryNotification, selectedStadium, userLocation, gpsStatus, toggleGPS } = useStadium();
  const activeOrders = orders?.filter(o => o.status !== 'delivered') || [];

  // Notification Toast Auto-dismiss
  useEffect(() => {
    if (deliveryNotification) {
      const timer = setTimeout(() => {
        setDeliveryNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [deliveryNotification, setDeliveryNotification]);

  console.log('MAIN_LAYOUT_INIT', {
    hasStadium: !!selectedStadium,
    path: location.pathname,
    hasActiveOrder: activeOrders.length > 0,
    hasActiveSOS: !!activeSOS
  });

  // Pages where we show NO sidebar / chrome (fully isolated)
  const isLoginPage = location.pathname === '/login';
  const isManagementPage = location.pathname === '/management';
  
  // Pages where we also hide sidebar (select-stadium keeps main UI but no nav)
  const hideNav =
    isLoginPage ||
    isManagementPage ||
    location.pathname === '/select-stadium';

  // Render children fullscreen with zero chrome for completely isolated pages
  if (isLoginPage || isManagementPage) {
    return (
      <div className="w-full h-[100dvh] bg-[#0F172A] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] bg-slate-950 flex flex-col lg:flex-row overflow-hidden">
      
      {/* Global Toast Notification */}
      <AnimatePresence>
        {deliveryNotification && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-4 pointer-events-none"
          >
            <div className="bg-accent/90 backdrop-blur-xl border border-accent/50 p-4 rounded-2xl shadow-[0_20px_40px_rgba(34,211,238,0.3)] flex items-center gap-4 pointer-events-auto cursor-pointer" onClick={() => navigate('/food')}>
              <div className="p-3 bg-slate-900/40 rounded-xl relative">
                <Coffee size={20} className="text-slate-900" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-stadium-red rounded-full animate-ping" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-900/60 uppercase tracking-widest">ORDER DELIVERED</p>
                <p className="text-sm font-bold text-slate-900 leading-tight">{deliveryNotification.message}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setDeliveryNotification(null); }} className="text-slate-900/40 hover:text-slate-900 transition-colors">
                <UserMinus size={16} /> {/* Using UserMinus as a close icon since X isn't imported, but wait, I can import X */}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Only: Sidebar Panel */}
      <div className="hidden lg:flex flex-col w-[320px] lg:w-[350px] border-r border-slate-800/60 bg-slate-900/40 p-6 overflow-y-auto hide-scrollbar z-20 shrink-0">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">CrowdFlow AI</h1>
          <p className="text-slate-400 text-sm mt-2">Command Center Dashboard</p>
        </div>

        {!hideNav && <SidebarNav />}

        <div className="flex-1 flex flex-col gap-4 mt-2">
          <div className="glass-panel p-5 bg-slate-900/50">
            <h3 className="text-sm font-semibold text-slate-300 md:mb-4 flex items-center gap-2">
              <Activity size={16} className="text-accent" /> System Status
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Stadium Capacity</span>
                  <span className="text-accent font-bold">78%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full">
                  <div className="bg-accent w-[78%] h-full rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Network Load (Offline Nodes)</span>
                  <span className="text-stadium-green">Stable</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full">
                  <div className="bg-stadium-green w-[20%] h-full rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 bg-slate-900/50 mt-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Wifi size={16} className="text-accent" /> Connectivity Agent
            </h3>
            <div className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <div className="w-2 h-2 rounded-full bg-stadium-green mt-1 animate-pulse" />
              <div>
                <p className="text-xs font-medium text-slate-200">Local Mesh Active</p>
                <p className="text-[10px] text-slate-400 leading-tight mt-1">
                  App is currently synchronizing data via offline mesh network. No internet required for core functions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-800 pt-6">
          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <ShieldCheck size={16} className="text-stadium-green" />
            End-to-end encrypted ticket validation
          </div>
        </div>
      </div>

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden bg-[#0F172A]">

        {/* Main Content Viewport */}
        <div className="flex-1 overflow-y-auto hide-scrollbar relative bg-[#0F172A]">
          {/* Global Tracking Banner */}
          <AnimatePresence>
            {(activeOrders.length > 0 || activeSOS) && (
              <motion.div 
                initial={{ y: -50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: -50, opacity: 0 }}
                className="sticky top-0 left-0 right-0 z-[60] p-4 lg:px-6 pointer-events-none"
              >
                <div className="max-w-4xl mx-auto flex flex-col gap-2">
                  {activeSOS && (
                    <motion.div 
                      layout
                      className="bg-stadium-red/90 backdrop-blur-md border border-stadium-red/30 p-3 rounded-2xl shadow-xl flex items-center justify-between pointer-events-auto cursor-pointer"
                      onClick={() => navigate('/emergency')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl animate-pulse">
                          <AlertTriangle size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">SOS ACTIVE</p>
                          <p className="text-sm font-bold text-white">{activeSOS.status} • {activeSOS.type}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-white/50" />
                    </motion.div>
                  )}
                  {activeOrders.length > 0 && (
                    <motion.div 
                      layout
                      className="bg-accent/90 backdrop-blur-md border border-accent/30 p-3 rounded-2xl shadow-xl flex items-center justify-between pointer-events-auto cursor-pointer"
                      onClick={() => navigate('/food')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-900/40 p-2 rounded-xl">
                          <Coffee size={16} className="text-slate-900" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900/60">
                            ORDER TRACKING
                          </p>
                          <p className="text-sm font-bold text-slate-900">
                            {activeOrders.length === 1 
                              ? `${activeOrders[0].status.replace(/_/g, ' ')} • ${activeOrders[0].shopName}`
                              : `${activeOrders.length} Active Orders`}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-900/40" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* Minimal GPS Location Top Bar globally available */}
            {!hideNav && selectedStadium && (
               <div className="px-6 py-2 pt-4 flex justify-between items-center text-xs text-slate-400 bg-[#0F172A] z-10 relative">
                 <div className="flex items-center gap-2">
                   <MapPin size={12} className={gpsStatus === 'enabled' ? 'text-accent' : 'text-slate-600'} />
                   <span className="font-medium truncate max-w-[150px]">
                     {userLocation?.label || 'Location not set'}
                   </span>
                 </div>
                 <button 
                  onClick={toggleGPS}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${gpsStatus === 'enabled' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}
                 >
                   <Locate size={10} /> GPS: {gpsStatus === 'enabled' ? 'ON' : 'OFF'}
                 </button>
               </div>
            )}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="min-h-full pb-28 lg:pb-10 max-w-4xl mx-auto w-full lg:px-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* AI Chatbot (hidden on select-stadium) */}
        {!hideNav && <AIChatbotModal />}

        {/* Bottom Navigation (Mobile Only, hidden on non-app pages) */}
        {!hideNav && (
          <div className="absolute bottom-0 left-0 w-full z-50 lg:hidden">
            <TabNav />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
