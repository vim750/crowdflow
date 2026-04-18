import React, { useState } from 'react';
import { User, LogOut, Settings, LayoutDashboard, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"name":"Guest","role":"user"}');
  const [editName, setEditName] = useState(currentUser.name);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...currentUser, name: editName };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setShowEditModal(false);
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400 hover:bg-slate-700 transition-all shadow-lg focus:outline-none"
      >
        <User size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-12 right-0 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="p-4 bg-slate-800/40 border-b border-slate-800">
              <p className="text-sm font-black text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold mt-0.5" style={{ color: currentUser.role === 'admin' ? '#ef4444' : '#22d3ee' }}>
                {currentUser.role === 'admin' ? 'Administrator' : 'Normal User'}
              </p>
            </div>
            <div className="p-2 flex flex-col gap-1">
              {currentUser.role !== 'admin' && (
                <button 
                  onClick={() => { setIsOpen(false); setShowEditModal(true); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors text-left"
                >
                  <Settings size={14} className="text-slate-500" /> Profile
                </button>
              )}
              {currentUser.role === 'admin' && (
                <>
                  <button 
                    onClick={() => { setIsOpen(false); setShowEditModal(true); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors text-left"
                  >
                    <Settings size={14} className="text-slate-500" /> Profile
                  </button>
                  <button 
                    onClick={() => { setIsOpen(false); navigate('/management'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black text-cyan-400 hover:bg-slate-800 rounded-xl transition-colors text-left"
                  >
                    <LayoutDashboard size={14} className="text-cyan-400" /> Management Dashboard
                  </button>
                </>
              )}
              <div className="h-px w-full bg-slate-800 my-1" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }}
              className="bg-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-xs shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-black text-white">Edit Profile</h3>
                <button onClick={() => setShowEditModal(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Display Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <button 
                  onClick={handleSaveProfile}
                  className="w-full bg-cyan-500 text-slate-900 font-black py-3 rounded-xl mt-2 hover:bg-cyan-400 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
