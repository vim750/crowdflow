import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/stadiumData';

const StadiumContext = createContext();

export const useStadium = () => useContext(StadiumContext);

export const StadiumProvider = ({ children }) => {
  const [selectedStadium, setSelectedStadium] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedStadium');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  
  // Dynamic Real-time states
  const [trafficData, setTrafficData] = useState(null);
  const [crowdData, setCrowdData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [outsideIntel, setOutsideIntel] = useState(null);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Global Navigation & Food States
  const [userLocation, setUserLocation] = useState(null); // { sectionId, label }
  const [seatInfo, setSeatInfo] = useState(() => {
    try {
      return localStorage.getItem('seatInfo') || '';
    } catch { return ''; }
  });
  const [gpsStatus, setGpsStatus] = useState(() => {
    try {
      return localStorage.getItem('gpsStatus') || 'prompted'; // 'enabled' | 'disabled' | 'prompted'
    } catch { return 'prompted'; }
  });
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('orders');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [activeSOS, setActiveSOS] = useState(null); // { type, status, arrivalTime }
  const [deliveryNotification, setDeliveryNotification] = useState(null);

  // Monitor online/offline Status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Persist selection & preferences
  useEffect(() => {
    if (selectedStadium) {
      localStorage.setItem('selectedStadium', JSON.stringify(selectedStadium));
    }
  }, [selectedStadium]);

  useEffect(() => {
    localStorage.setItem('seatInfo', seatInfo);
  }, [seatInfo]);

  useEffect(() => {
    localStorage.setItem('gpsStatus', gpsStatus);
  }, [gpsStatus]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Order Status Simulation Logic
  useEffect(() => {
    if (!orders || orders.length === 0) return;

    let hasChanges = false;
    let newNotifications = [];
    const stages = ['received', 'preparing', 'out_for_delivery', 'delivered'];
    
    const updatedOrders = orders.map(order => {
      if (order.status === 'delivered') return order;
      
      const currentIdx = stages.indexOf(order.status);
      if (currentIdx === -1 || currentIdx === stages.length - 1) return order;

      hasChanges = true;
      const nextStatus = stages[currentIdx + 1];
      const updatedOrder = { ...order, status: nextStatus };
      
      if (nextStatus === 'delivered') {
        newNotifications.push({
          id: Date.now() + Math.random(),
          message: `Your order #${order.id} from ${order.shopName} has been delivered!`,
          shopName: order.shopName
        });
      }
      return updatedOrder;
    });

    if (hasChanges) {
      const timer = setTimeout(() => {
        setOrders(updatedOrders);
        if (newNotifications.length > 0) {
          setDeliveryNotification(newNotifications[0]);
        }
      }, 8000); // 8 seconds per stage for demo purposes

      return () => clearTimeout(timer);
    }
  }, [orders]);

  // Load cached dynamic data on mount/stadium change
  useEffect(() => {
    if (selectedStadium) {
      const cached = localStorage.getItem(`cache_${selectedStadium.id}`);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          setTrafficData(data.traffic);
          setCrowdData(data.crowd);
          setGraphData(data.graph);
          setTicketStatus(data.tickets);
          setOutsideIntel(data.outside);
        } catch (e) { console.error("Cache parse error", e); }
      }
    }
  }, [selectedStadium]);

  // When a new stadium is selected, immediately fetch data and start polling
  useEffect(() => {
    if (!selectedStadium) return;

    let isMounted = true;
    let pollInterval;

    const fetchDynamicData = async () => {
      // Don't try to fetch if offline, just rely on cache
      if (!navigator.onLine) return;

      try {
        setIsUpdating(true);
        const [traffic, crowd, graph, tickets, outside] = await Promise.all([
          api.getDynamicTraffic(selectedStadium.id),
          api.getDynamicGateCongestion(selectedStadium.id),
          api.getStadiumGraph(selectedStadium.id),
          api.getTicketStatus(selectedStadium.id),
          api.getOutsideIntelligence(selectedStadium.id)
        ]);
        
        if (isMounted) {
          setTrafficData(traffic);
          setCrowdData(crowd);
          setGraphData(graph);
          setTicketStatus(tickets);
          setOutsideIntel(outside);

          // Update cache
          localStorage.setItem(`cache_${selectedStadium.id}`, JSON.stringify({
            traffic, crowd, graph, tickets, outside, timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error("Error fetching dynamic stadium data:", error);
      } finally {
        if (isMounted) setIsUpdating(false);
      }
    };

    // Initial fetch
    fetchDynamicData();

    // Poll every 10 seconds to simulate real-time API changes
    pollInterval = setInterval(() => {
      fetchDynamicData();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [selectedStadium]);

  // --- GPS Global Methods ---
  const enableGPS = () => {
    setGpsStatus('enabled');
    // Mock detecting location ONCE globally
    if (!userLocation && selectedStadium?.seating?.sections?.length) {
      const randomSection = selectedStadium.seating.sections[0];
      setUserLocation({ sectionId: randomSection.id, label: `GPS: ${randomSection.name}` });
    } else if (!userLocation) {
      setUserLocation({ sectionId: 'mock-sec', label: 'GPS: Auto-Detected' });
    }
  };

  const disableGPS = () => {
    setGpsStatus('disabled');
    setUserLocation(null);
  };

  const toggleGPS = () => {
    if (gpsStatus === 'enabled') {
      disableGPS();
    } else {
      enableGPS();
    }
  };

  const setManualLocation = (loc) => {
    if (gpsStatus === 'enabled') return; // Ignore if GPS is forcibly enabled
    setUserLocation(loc);
  };

  const value = {
    selectedStadium,
    setSelectedStadium,
    trafficData,
    crowdData,
    graphData,
    ticketStatus,
    outsideIntel,
    isUpdating,
    isOffline,
    userLocation,
    setUserLocation: setManualLocation,
    seatInfo,
    setSeatInfo,
    gpsStatus,
    setGpsStatus,
    enableGPS,
    disableGPS,
    toggleGPS,
    orders,
    setOrders,
    activeSOS,
    setActiveSOS,
    deliveryNotification,
    setDeliveryNotification
  };

  return (
    <StadiumContext.Provider value={value}>
      {children}
    </StadiumContext.Provider>
  );
};

