import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, CheckCircle2, XCircle, Globe, MapPin, ExternalLink } from 'lucide-react';
import { useStadium } from '../context/StadiumContext';
import { bookingLinks } from '../api/bookingLinks';

const BookingCard = ({ type, icon: Icon, available, total, isSoldOut, onBook }) => {
  return (
    <div className={`flex flex-col gap-4 p-6 rounded-3xl border-2 transition-all ${
      isSoldOut 
        ? 'bg-red-500/5 border-red-500/20 opacity-80' 
        : 'bg-emerald-500/5 border-emerald-500/20'
    }`}>
      <div className="flex items-center justify-between">
        <div className={`p-4 rounded-2xl ${isSoldOut ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
          <Icon size={32} />
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
          isSoldOut ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'
        }`}>
          {isSoldOut ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
          {isSoldOut ? 'Sold Out' : 'Available'}
        </div>
      </div>
      
      <div>
        <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">{type} Booking</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-white">{available.toLocaleString()}</span>
          <span className="text-sm text-slate-500 font-bold">/ {total.toLocaleString()}</span>
        </div>
      </div>
      
      {!isSoldOut && (
        <button 
          onClick={onBook}
          className="w-full mt-2 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-xl border border-emerald-500/30 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
        >
          Book Now <ExternalLink size={14} />
        </button>
      )}
    </div>
  );
};

const TicketStatus = ({ data }) => {
  const { selectedStadium } = useStadium();
  if (!data) return null;

  const handleBooking = () => {
    if (!selectedStadium) return;
    
    const stadiumName = selectedStadium.name;
    const sportName = selectedStadium.activeSport || 'Cricket'; // Default to Cricket for demo
    
    const link = bookingLinks[stadiumName]?.[sportName];
    
    if (link) {
      window.open(link, '_blank');
    } else {
      alert(`Official booking link not available for ${stadiumName} (${sportName}). Please check official sources.`);
    }
  };

  const { total, online, onSpot, booked } = data;
  
  // Example logic for "Available" vs "Sold out"
  // Assuming 'online' and 'onSpot' are the counts already booked? 
  // Actually, the previous component used it as booked. 
  // Let's assume total_online = total * 0.7, total_onspot = total * 0.3
  const totalOnline = Math.floor(total * 0.7);
  const totalOnSpot = Math.floor(total * 0.3);
  
  const availableOnline = Math.max(0, totalOnline - (online || 0));
  const availableOnSpot = Math.max(0, totalOnSpot - (onSpot || 0));

  const isOnlineSoldOut = availableOnline === 0;
  const isOnSpotSoldOut = availableOnSpot === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-black text-white flex items-center gap-3">
          <Ticket className="text-cyan-400" /> Ticket Availability
        </h3>
        <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-slate-700">
          Updated: Live
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BookingCard 
          type="Online" 
          icon={Globe} 
          available={availableOnline} 
          total={totalOnline} 
          isSoldOut={isOnlineSoldOut} 
          onBook={handleBooking}
        />
        <BookingCard 
          type="On-Spot" 
          icon={MapPin} 
          available={availableOnSpot} 
          total={totalOnSpot} 
          isSoldOut={isOnSpotSoldOut} 
          onBook={handleBooking}
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center gap-4">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Stadium Occupancy</p>
        <div className="w-full max-w-md bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700">
           <div 
             className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" 
             style={{ width: `${(booked / total) * 100}%` }}
           />
        </div>
        <p className="text-2xl font-black text-white">
          {((booked / total) * 100).toFixed(1)}% <span className="text-sm font-bold text-slate-500">Full</span>
        </p>
      </div>
    </div>
  );
};

export default TicketStatus;
