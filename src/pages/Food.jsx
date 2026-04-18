import { useState, useMemo, useEffect } from 'react';
import { 
  Coffee, Clock, TrendingDown, CheckCircle, Star, Utensils, 
  MapPin, ChevronRight, ShoppingCart, Trash2, ArrowLeft,
  Truck, Package, ChefHat, CheckSquare, Info, Tag, AlertCircle,
  Plus, Minus, History, Sparkles, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStadium } from '../context/StadiumContext';
import SelectionGuard from '../components/SelectionGuard';
import { getFoodCourts } from '../api/foodData';

function cx(...inputs) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

const RatingStars = ({ rating, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star 
        key={s} 
        size={size} 
        className={cx(s <= Math.round(rating) ? "text-stadium-yellow fill-stadium-yellow" : "text-slate-600")} 
      />
    ))}
    <span className="text-[10px] text-slate-400 ml-1 font-medium">{rating.toFixed(1)}</span>
  </div>
);

const Badge = ({ children, color = "accent" }) => (
  <span className={cx(
    "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
    color === "accent" ? "bg-accent/10 text-accent border border-accent/20" :
    color === "green" ? "bg-stadium-green/10 text-stadium-green border border-stadium-green/20" :
    color === "red" ? "bg-stadium-red/10 text-stadium-red border border-stadium-red/20" :
    "bg-slate-800 text-slate-400 border border-slate-700"
  )}>
    {children}
  </span>
);

const Food = () => {
  const { 
    selectedStadium, userLocation, orders, setOrders, 
    seatInfo 
  } = useStadium();

  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const completedOrders = orders.filter(o => o.status === 'delivered');

  // UX States
  const [phase, setPhase] = useState('discovery'); // discovery | fulfillment | history
  const [view, setView] = useState('shops'); // shops | menu | item-detail | confirmation
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [isOrderNow, setIsOrderNow] = useState(false); // Track if current flow is "Order Now"

  const [cart, setCart] = useState([]);
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [deliveryLocation, setDeliveryLocation] = useState(seatInfo || '');
  const [isCustomLoc, setIsCustomLoc] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [lastOrderInfo, setLastOrderInfo] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [ratings, setRatings] = useState({ taste: 0, hygiene: 0, service: 0 });

  // Load shops for current stadium
  const allShops = useMemo(() => {
    if (!selectedStadium) return [];
    return getFoodCourts(selectedStadium.id);
  }, [selectedStadium]);

  const sortedShops = useMemo(() => {
    if (!userLocation || !userLocation.sectionId) return allShops;
    return [...allShops].sort((a, b) => {
      if (a.sectionId === userLocation.sectionId && b.sectionId !== userLocation.sectionId) return -1;
      if (b.sectionId === userLocation.sectionId && a.sectionId !== userLocation.sectionId) return 1;
      return 0;
    });
  }, [allShops, userLocation]);



  // Cart logic
  const updateQuantity = (item, delta) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(i => i.id !== item.id);
        return prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i);
      }
      if (delta > 0) return [...prev, { ...item, quantity: 1 }];
      return prev;
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const activeItems = isOrderNow ? [{ ...selectedItem, quantity: itemQuantity }] : cart;
  const subTotal = activeItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = subTotal > 500 ? subTotal * 0.1 : 0;
  const finalTotal = subTotal - discount + (deliveryType === 'delivery' ? 20 : 0);

  // Validation Logic for Location
  const validateLocation = (loc) => {
    if (!loc.trim()) return "Please select or enter a location.";
    const zones = ['Stand', 'Gate', 'Block', 'Section', 'Row', 'Seat', 'Court'];
    const lowerLoc = loc.toLowerCase();
    const outsideKeywords = ['home', 'hotel', 'street', 'road', 'city'];
    if (outsideKeywords.some(k => lowerLoc.includes(k))) return "Delivery is not supported outside the stadium.";
    const isValidZone = zones.some(z => lowerLoc.includes(z.toLowerCase())) || (selectedStadium.zones && selectedStadium.zones.some(z => lowerLoc.includes(z.toLowerCase())));
    if (!isValidZone && isCustomLoc) return "Delivery may not be available at this location. Please confirm.";
    return null;
  };

  const handlePlaceOrder = () => {
    const error = deliveryType === 'delivery' ? validateLocation(deliveryLocation) : null;
    if (error && !error.includes("confirm")) {
      setLocationError(error);
      return;
    }

    const newOrder = {
      id: Math.floor(1000 + Math.random() * 9000),
      shopName: selectedShop.name,
      items: activeItems,
      total: finalTotal,
      status: 'received',
      type: deliveryType,
      location: deliveryType === 'delivery' ? deliveryLocation : selectedShop.location,
      createdAt: Date.now(),
      timestamp: Date.now(),
      estTime: selectedShop.avgTime
    };

    setOrders(prev => [newOrder, ...prev]);
    if (!isOrderNow) setCart([]); // Clear cart ONLY if it was a cart order
    setPhase('discovery');
    setView('shops');
  };

  const submitFeedback = () => {
    setShowFeedback(false);
    setPhase('discovery');
    setView('shops');
    setSelectedShop(null);
  };

  if (!selectedStadium) {
    return <SelectionGuard message="Please select a stadium to continue." />;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Discovery: Views (Shops -> Menu -> Item Detail)
  // ─────────────────────────────────────────────────────────────────────────────

  const ShopListView = () => (
    <>
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Smart Dining</h1>
        <p className="text-slate-400 text-sm mt-1">Gourmet meals delivered to your seat.</p>
      </header>

      <div className="flex gap-3">
        <button onClick={() => setPhase('history')} className="flex-1 glass-panel p-4 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
          <History size={18} className="text-accent" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">History</span>
        </button>
        <div className="flex-1 glass-panel p-4 flex items-center justify-center gap-2">
          <Sparkles size={18} className="text-stadium-yellow" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Offers</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Food Courts</h2>
        {sortedShops.map((shop, idx) => (
          <motion.div key={shop.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            onClick={() => { if(shop.status === 'Open') { setSelectedShop(shop); setView('menu'); } }}
            className={cx("glass-panel p-3 flex gap-4 items-center group transition-all relative overflow-hidden", shop.status === 'Open' ? "cursor-pointer hover:bg-slate-800/80 active:scale-[0.98]" : "opacity-60 grayscale cursor-not-allowed")}>
            <div className="w-24 h-24 rounded-2xl overflow-hidden relative flex-shrink-0 border border-slate-700 shadow-xl">
              <img src={shop.img} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              {shop.status === 'Closed' && <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center"><span className="text-[10px] font-black text-white uppercase">Closed</span></div>}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-slate-100 truncate group-hover:text-accent transition-colors">{shop.name}</h3>
              <div className="flex items-center gap-2 my-1">
                <Badge color={shop.crowd === 'Low' ? 'green' : shop.crowd === 'High' ? 'red' : 'accent'}>{shop.crowd} Crowd</Badge>
                <RatingStars rating={(shop.rating.taste + shop.rating.hygiene + shop.rating.service)/3} />
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <div className="flex items-center gap-1"><Truck size={12} className={shop.seatDelivery ? "text-stadium-green" : "text-slate-600"} /><span>{shop.seatDelivery ? "Seat Delivery" : "Pickup Only"}</span></div>
                {shop.offers && shop.offers.length > 0 && <div className="flex items-center gap-1 text-stadium-yellow font-bold uppercase"><Tag size={10} /><span>Offers</span></div>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );

  const MenuView = () => (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <button onClick={() => setView('shops')} className="p-2 bg-slate-800 rounded-xl text-slate-400"><ArrowLeft size={20} /></button>
        <div>
          <h2 className="text-xl font-black text-white">{selectedShop.name}</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{selectedShop.location}</p>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {selectedShop.items.map((item) => {
          const inCart = cart.find(i => i.id === item.id);
          return (
            <div key={item.id} className="glass-panel p-4 flex justify-between items-center group hover:border-accent/30 transition-colors">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2">
                  <div className={cx("w-3 h-3 border flex items-center justify-center rounded-sm flex-shrink-0", item.isVeg ? "border-green-500" : "border-red-500")}><div className={cx("w-1.5 h-1.5 rounded-full", item.isVeg ? "bg-green-500" : "bg-red-500")} /></div>
                  <h4 className="font-bold text-slate-100 text-sm">{item.name}</h4>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-accent font-black text-sm">₹{item.price}</p>
                  {item.originalPrice && <p className="text-[10px] text-slate-500 line-through">₹{item.originalPrice}</p>}
                </div>
              </div>
              {item.available ? (
                <button 
                  onClick={() => { setSelectedItem(item); setItemQuantity(1); setView('item-detail'); }}
                  className="px-4 py-2 bg-accent/10 hover:bg-accent hover:text-slate-900 border border-accent/20 rounded-xl text-xs font-black text-accent uppercase transition-all"
                >
                  ADD
                </button>
              ) : <Badge color="red">Sold Out</Badge>}
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-24 left-6 right-6 z-50">
          <button onClick={() => { setIsOrderNow(false); setPhase('fulfillment'); }} className="w-full bg-accent text-slate-900 py-4 rounded-2xl font-black text-sm flex items-center justify-between px-6 shadow-[0_10px_30px_rgba(34,211,238,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
            <span className="flex items-center gap-2"><ShoppingCart size={18} />{cart.reduce((a, b) => a + b.quantity, 0)} ITEMS</span>
            <span>₹{cartTotal} <ChevronRight size={18} className="ml-1 inline" /></span>
          </button>
        </motion.div>
      )}
    </div>
  );

  const ItemDetailView = () => {
    // Generate mock ratings breakdown
    const itemRating = {
      taste: 4.5 + Math.random() * 0.5,
      hygiene: 4.3 + Math.random() * 0.7,
      service: 4.1 + Math.random() * 0.9,
      overall: 4.6
    };

    const mockReviews = [
      { user: 'Rahul S.', comment: 'Incredibly fresh and served hot! The spices are just right.', rating: 5 },
      { user: 'Priya K.', comment: 'Perfect stadium snack. Fast delivery to my seat.', rating: 4 },
    ];

    return (
      <div className="flex flex-col gap-6 pb-32">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('menu')} className="p-2 bg-slate-800 rounded-xl text-slate-400"><ArrowLeft size={20} /></button>
          <h2 className="text-lg font-black text-white uppercase tracking-widest">Item Details</h2>
        </header>

        <div className="flex flex-col gap-6">
          {/* Card Visuals */}
          <div className="glass-panel p-6 flex flex-col items-center bg-gradient-to-b from-slate-800/50 to-transparent border-accent/10">
            <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center mb-4 border-2 border-slate-700 shadow-2xl">
              <Utensils size={64} className="text-accent/50" />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className={cx("w-3 h-3 border flex items-center justify-center rounded-sm", selectedItem.isVeg ? "border-green-500" : "border-red-500")}><div className={cx("w-1.5 h-1.5 rounded-full", selectedItem.isVeg ? "bg-green-500" : "bg-red-500")} /></div>
                <h3 className="text-2xl font-black text-white">{selectedItem.name}</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed px-4">{selectedItem.description}</p>
            </div>
          </div>

          {/* Pricing & Offers */}
          <div className="glass-panel p-5 flex justify-between items-center border-accent/20 bg-accent/5">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-white">₹{selectedItem.price}</span>
                {selectedItem.originalPrice && <span className="text-lg text-slate-500 line-through">₹{selectedItem.originalPrice}</span>}
              </div>
              <p className="text-xs font-bold text-stadium-green uppercase tracking-widest mt-1">Special Match Day Price</p>
            </div>
            <div className="text-right">
              <Badge color="accent">15% OFF</Badge>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-black">Limited Time</p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Customer Reviews</h3>
            <div className="glass-panel p-5">
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <span className="text-4xl font-black text-white">{itemRating.overall}</span>
                  <div className="mt-1"><RatingStars rating={itemRating.overall} /></div>
                </div>
                <div className="flex-1 grid grid-cols-1 gap-2 border-l border-slate-800 pl-6">
                  {['Taste', 'Hygiene', 'Service'].map(cat => (
                    <div key={cat} className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16">{cat}</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(itemRating[cat.toLowerCase()] / 5) * 100}%` }} className="h-full bg-accent" />
                      </div>
                      <span className="text-[10px] font-black text-white">{itemRating[cat.toLowerCase()].toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                {mockReviews.map((rev, i) => (
                  <div key={i} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-slate-300">{rev.user}</span>
                      <RatingStars rating={rev.rating} size={10} />
                    </div>
                    <p className="text-xs text-slate-400 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="fixed bottom-24 left-6 right-6 z-50 flex flex-col gap-3">
          <div className="glass-panel p-2 flex items-center justify-center gap-8 bg-slate-900/90 backdrop-blur-md shadow-2xl border-slate-700">
            <button onClick={() => setItemQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl text-white hover:bg-slate-700 transition-colors"><Minus size={20} /></button>
            <span className="text-2xl font-black text-white w-8 text-center">{itemQuantity}</span>
            <button onClick={() => setItemQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl text-accent hover:bg-slate-700 transition-colors"><Plus size={20} /></button>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => { updateQuantity(selectedItem, itemQuantity); setView('menu'); }}
              className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider border border-slate-700 shadow-xl"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => { 
                setIsOrderNow(true); setPhase('fulfillment');
              }}
              className="flex-[1.5] py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl transition-all bg-accent text-slate-900 active:scale-[0.98]"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ActiveOrdersList = () => {
    if (activeOrders.length === 0) return null;
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-black text-white px-2">Active Orders</h2>
        <div className="flex flex-col gap-4">
          {activeOrders.map(order => {
             const stages = [
               { id: 'received', label: 'Received', icon: CheckSquare },
               { id: 'preparing', label: 'Preparing', icon: ChefHat },
               { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck }
             ];
             const currentIdx = stages.findIndex(s => s.id === order.status);
             return (
               <div key={order.id} className="glass-panel p-5 flex flex-col gap-4 border-accent/10 relative overflow-hidden bg-slate-900/60 shadow-xl border border-slate-700/50 hover:border-accent/40 transition-colors">
                 <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                     <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-tight">Order #{order.id}</span>
                     <span className="text-sm font-black text-white leading-tight mt-0.5">{order.shopName}</span>
                   </div>
                   <Badge color="accent">{order.status.replace(/_/g, ' ')}</Badge>
                 </div>
                 
                 <div className="flex justify-between relative px-2 my-2 mt-4 z-10">
                   <div className="absolute top-4 left-6 right-6 h-1 bg-slate-800 z-0" />
                   <div className="absolute top-4 left-6 h-1 bg-accent z-0 transition-all duration-1000" style={{ width: `${(currentIdx / (stages.length - 1)) * 100}%` }} />
                   {stages.map((s, i) => (
                     <div key={s.id} className="relative z-10 flex flex-col items-center gap-2" style={{width: '33.33%'}}>
                       <div className={cx("w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-slate-950", i <= currentIdx ? "border-accent text-accent shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "border-slate-800 text-slate-600")}>
                         <s.icon size={14} />
                       </div>
                     </div>
                   ))}
                 </div>
                 
                 <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-800/50 pt-3 mt-2">
                   <div className="flex items-center gap-2 truncate max-w-[200px]">
                     <Package size={12} className="text-slate-500 shrink-0" />
                     <span className="truncate">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
                   </div>
                   <div className="flex items-center gap-1 text-white whitespace-nowrap ml-2 bg-slate-800/50 px-2 py-1 rounded-md">
                     <MapPin size={10} className="text-accent" />
                     <span>{order.location}</span>
                   </div>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    );
  };

  const DiscoveryPhase = () => (
    <div className="flex flex-col gap-6 pb-32">
      <ActiveOrdersList />
      <AnimatePresence mode="wait">
        {view === 'shops' && <motion.div key="shops" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><ShopListView /></motion.div>}
        {view === 'menu' && <motion.div key="menu" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><MenuView /></motion.div>}
        {view === 'item-detail' && <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><ItemDetailView /></motion.div>}
      </AnimatePresence>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // Phase 2: Fulfillment (Order Confirmation)
  // ─────────────────────────────────────────────────────────────────────────────

  const FulfillmentPhase = () => (
    <div className="flex flex-col gap-6 pb-32">
      <header className="flex items-center gap-4">
        <button onClick={() => { setPhase('discovery'); if(isOrderNow) setView('item-detail'); else setView('menu'); }} className="p-2 bg-slate-800 rounded-xl text-slate-400">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-black text-white">Order Summary</h2>
      </header>

      <div className="flex flex-col gap-6">
        <div className="glass-panel p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isOrderNow ? 'Direct Checkout' : 'Cart Summary'}
            </h3>
            <Badge color={isOrderNow ? 'green' : 'accent'}>{isOrderNow ? 'Instant' : 'Grouped'}</Badge>
          </div>
          
          {activeItems.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800"><Utensils size={14} className="text-slate-700" /></div>
                 <div>
                   <p className="text-sm font-bold text-slate-200">{item.name}</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.quantity} × ₹{item.price}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-sm font-black text-white">₹{item.price * item.quantity}</p>
               </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between">
             <span>Delivery Location</span>
             <div className="flex gap-4">
                <button onClick={() => setDeliveryType('delivery')} className={cx("transition-colors", deliveryType === 'delivery' ? "text-stadium-green" : "text-slate-600")}>Delivery</button>
                <button onClick={() => setDeliveryType('pickup')} className={cx("transition-colors", deliveryType === 'pickup' ? "text-accent" : "text-slate-600")}>Pickup</button>
             </div>
           </h3>

           {deliveryType === 'delivery' ? (
             <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => { setDeliveryLocation(seatInfo || ''); setIsCustomLoc(false); setLocationError(null); }} className={cx("py-3 rounded-xl text-[10px] font-black uppercase border transition-all", !isCustomLoc && deliveryLocation === seatInfo ? "bg-accent text-slate-900 border-accent shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "bg-slate-900 border-slate-800 text-slate-500")}>My Seat ({seatInfo || 'N/A'})</button>
                   <button onClick={() => { setIsCustomLoc(true); setDeliveryLocation(''); setLocationError(null); }} className={cx("py-3 rounded-xl text-[10px] font-black uppercase border transition-all", isCustomLoc ? "bg-accent text-slate-900 border-accent shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "bg-slate-900 border-slate-800 text-slate-500")}>Custom Zone</button>
                </div>
                {isCustomLoc && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                    <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-accent" onChange={(e) => { setDeliveryLocation(e.target.value); setLocationError(null); }}>
                      <option value="">Select a known zone...</option>
                      <option value="Gate 1 Entrance">Gate 1 Entrance</option>
                      <option value="North Stand - Block B">North Stand - Block B</option>
                      <option value="East Terrace Level 2">East Terrace Level 2</option>
                      <option value="Food Court A Seating">Food Court A Seating</option>
                      <option value="Parking Zone P3">Parking Zone P3</option>
                    </select>
                    <div className="relative"><Navigation size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" value={deliveryLocation} onChange={(e) => { setDeliveryLocation(e.target.value); setLocationError(null); }} placeholder="Or type specific location" className={cx("w-full bg-slate-900 border rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-colors", locationError ? "border-stadium-red" : "border-slate-800 focus:border-accent")} /></div>
                  </motion.div>
                )}
                {locationError && <p className="text-[10px] font-bold flex items-center gap-1 text-stadium-red"><AlertCircle size={12} /> {locationError}</p>}
             </div>
           ) : <div className="glass-panel p-4 bg-accent/5 border-accent/20 flex gap-3"><MapPin className="text-accent shrink-0" size={18} /><p className="text-xs text-slate-300">Self-pickup from <b>{selectedShop.name}</b> at {selectedShop.location}.</p></div>}
        </div>

        <div className="glass-panel p-5 flex flex-col gap-3 border-slate-800 bg-slate-900/40">
           <div className="flex justify-between text-xs font-bold text-slate-500"><span>Subtotal</span><span>₹{subTotal}</span></div>
           {discount > 0 && <div className="flex justify-between text-xs font-black text-stadium-green"><span>Offer Discount (10%)</span><span>-₹{discount}</span></div>}
           {deliveryType === 'delivery' && <div className="flex justify-between text-xs font-bold text-slate-500"><span>Safety & Delivery Fee</span><span>₹20</span></div>}
           <div className="flex justify-between text-lg font-black text-white border-t border-slate-800 pt-3 mt-1"><span>Total Payable</span><span className="text-accent">₹{finalTotal}</span></div>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={handlePlaceOrder} className="w-full py-5 rounded-2xl font-black text-base shadow-2xl transition-all bg-accent text-slate-900 active:scale-[0.98]">
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // Phase 3: Tracking + History + Feedback
  // ─────────────────────────────────────────────────────────────────────────────

  const HistoryPhase = () => (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <button onClick={() => setPhase('discovery')} className="p-2 bg-slate-800 rounded-xl text-slate-400"><ArrowLeft size={18} /></button>
        <h2 className="text-xl font-black text-white">Match Day History</h2>
      </header>
      <div className="flex flex-col gap-4">
        {completedOrders.length === 0 ? (
          <div className="glass-panel p-10 flex flex-col items-center gap-4 text-center opacity-50"><History size={48} className="text-slate-700" /><p className="text-sm font-bold text-slate-500">No past orders yet.</p></div>
        ) : completedOrders.map(order => (
          <div key={order.id} className="glass-panel p-4 flex flex-col gap-3 group hover:border-slate-600 transition-all">
            <div className="flex justify-between items-start">
              <div><h4 className="text-sm font-bold text-white group-hover:text-accent transition-colors">{order.shopName}</h4><p className="text-[10px] text-slate-500 font-black uppercase">{new Date(order.createdAt || order.timestamp).toLocaleTimeString()}</p></div>
              <Badge color="green">Delivered</Badge>
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-1 italic">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
            <div className="flex justify-between items-center border-t border-slate-800 pt-3">
              <span className="text-sm font-black text-white">₹{order.total}</span>
              <div className="flex gap-4">
                <button onClick={() => { setLastOrderInfo(order); setShowFeedback(true); }} className="text-[10px] font-black w-auto text-stadium-yellow uppercase tracking-widest hover:underline transition-colors">Review</button>
                <button className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline transition-colors">Reorder</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FeedbackModal = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-panel p-8 w-full max-w-sm flex flex-col gap-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-accent/20">
        <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent"><Sparkles size={32} /></div>
        <div><h2 className="text-2xl font-black text-white uppercase tracking-tight">Rate your Meal!</h2><p className="text-xs text-slate-400 mt-2">Was the food from <b>{lastOrderInfo?.shopName}</b> worth it?</p></div>
        <div className="flex flex-col gap-4 text-left">
          {['Taste', 'Hygiene', 'Service'].map((category) => (
            <div key={category} className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{category}</label>
              <div className="flex gap-2">{[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setRatings(prev => ({ ...prev, [category.toLowerCase()]: star }))} className={cx("flex-1 h-10 rounded-lg border flex items-center justify-center transition-all", ratings[category.toLowerCase()] >= star ? "bg-stadium-yellow/10 border-stadium-yellow text-stadium-yellow" : "bg-slate-900 border-slate-800 text-slate-700")}><Star size={14} fill={ratings[category.toLowerCase()] >= star ? "currentColor" : "none"} /></button>
              ))}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2"><button onClick={submitFeedback} className="w-full bg-accent text-slate-900 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl">Submit Review</button><button onClick={() => setShowFeedback(false)} className="text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest">Skip for now</button></div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="p-6 pt-10 flex flex-col gap-6 h-full relative">
      <AnimatePresence mode="wait">
        <motion.div key={phase} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex-1 min-h-0">
          {phase === 'discovery' && <DiscoveryPhase />}
          {phase === 'fulfillment' && <FulfillmentPhase />}
          {phase === 'history' && <HistoryPhase />}
        </motion.div>
      </AnimatePresence>
      {showFeedback && <FeedbackModal />}
    </div>
  );
};

export default Food;
