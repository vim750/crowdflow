import { NavLink } from 'react-router-dom';
import { Home, Map, Coffee, Toilet, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStadium } from '../context/StadiumContext';

function cx(...inputs) {
  return twMerge(clsx(inputs));
}

const TabNav = () => {
  const { orders, deliveryNotification } = useStadium();
  const hasActiveOrders = orders?.some(o => o.status !== 'delivered');
  const tabs = [
    { name: 'Home',     path: '/',          icon: Home },
    { name: 'Navigate', path: '/navigate',  icon: Map },
    { name: 'Food',     path: '/food',      icon: Coffee },
    { name: 'Restroom', path: '/restroom',  icon: Toilet },
    { name: 'SOS',      path: '/emergency', icon: AlertTriangle, danger: true },
  ];

  return (
    <div className="px-4 pb-6 pt-6 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/90 to-transparent">
      <div className="flex justify-between items-center glass-panel px-4 py-3 rounded-full border-slate-700/60 bg-slate-900/60 shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                cx(
                  'relative flex flex-col items-center justify-center gap-1 transition-all duration-300 min-w-0 flex-1',
                  isActive ? (tab.danger ? 'text-stadium-red' : 'text-accent') : 'text-slate-400 hover:text-slate-200',
                  isActive && !tab.danger && 'drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                  <span className="text-[9px] font-medium tracking-wide relative z-10 truncate">{tab.name}</span>
                  
                  {tab.name === 'Food' && (hasActiveOrders || deliveryNotification) && (
                    <span className={cx(
                      "absolute top-0 right-1/2 translate-x-4 w-2 h-2 rounded-full z-20",
                      deliveryNotification ? "bg-stadium-green animate-pulse" : "bg-accent"
                    )} />
                  )}

                  {isActive && (
                    <div
                      className={cx(
                        'absolute top-0 w-10 h-10 -mt-2 rounded-full blur-md opacity-30 -z-10',
                        tab.danger ? 'bg-stadium-red' : 'bg-accent'
                      )}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default TabNav;
