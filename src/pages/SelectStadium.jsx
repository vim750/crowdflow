import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Navigation, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { api, ALL_CITIES } from '../api/stadiumData';
import { useStadium } from '../context/StadiumContext';
import { useLanguage } from '../context/LanguageContext';

const SelectStadium = () => {
  const { t, currentLang, setCurrentLang, INDIAN_LANGUAGES } = useLanguage();
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStadiumId, setSelectedStadiumId] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { setSelectedStadium } = useStadium();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await api.getStadiums();
        setStadiums(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const cities = useMemo(() => {
    return [...new Set(stadiums.map(s => s.city))].sort();
  }, [stadiums]);

  const sports = ["Cricket", "Football", "Basketball", "Multi-purpose", "Other large-scale sports"];

  const filteredStadiums = useMemo(() => {
    return stadiums.filter(s => {
      const matchCity = selectedCity ? s.city === selectedCity : true;
      const matchSport = selectedSport && selectedSport !== "Other large-scale sports" 
        ? s.type.toLowerCase().includes(selectedSport.toLowerCase()) 
        : true;
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchSearch && matchSport;
    });
  }, [stadiums, selectedCity, searchQuery, selectedSport]);

  const handleSelect = (e) => {
    e.preventDefault();
    if (!selectedStadiumId) return;
    
    // We add the selected sport to the chosen stadium to simulate dynamic setup
    const stadium = stadiums.find(s => s.id === selectedStadiumId);
    setSelectedStadium({ ...stadium, activeSport: selectedSport || "Event" });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] p-6 pt-12 overflow-y-auto">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50 flex items-center bg-slate-900 border border-slate-700 rounded-lg p-2 pr-3">
         <Globe size={16} className="text-accent ml-2 mr-2" />
         <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none appearance-none font-medium cursor-pointer"
         >
            {INDIAN_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-slate-900">{lang.name}</option>
            ))}
         </select>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center mt-6"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <MapPin size={32} className="text-accent" />
        </div>
        <h1 className="text-3xl font-black text-white">{t('select.title')}</h1>
        <p className="text-slate-400 mt-2">{t('select.subtitle')}</p>
      </motion.div>

      <form onSubmit={handleSelect} className="flex flex-col gap-6 w-full max-w-sm mx-auto">
        
        {/* City Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">{t('select.city')}</label>
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedStadiumId('');
              }}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-4 appearance-none focus:outline-none focus:border-accent transition-colors"
            >
              <option value="">{t('select.all_cities')}</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sport Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">{t('select.sport')}</label>
          <div className="relative">
            <select
              value={selectedSport}
              onChange={(e) => {
                 setSelectedSport(e.target.value);
                 setSelectedStadiumId('');
              }}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-4 appearance-none focus:outline-none focus:border-accent transition-colors"
            >
              <option value="">{t('select.all_sports')}</option>
              {sports.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stadium Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300">{t('select.stadium')}</label>
          <div className="grid gap-3">
            {filteredStadiums.length === 0 ? (
              <div className="text-center p-4 text-slate-500 bg-slate-900 rounded-xl">No venues match your criteria</div>
            ) : (
              filteredStadiums.map(stadium => (
                <div 
                  key={stadium.id}
                  onClick={() => setSelectedStadiumId(stadium.id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                    selectedStadiumId === stadium.id 
                    ? 'bg-accent/10 border-accent shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-100">{stadium.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{stadium.city} • {stadium.type}</p>
                    </div>
                    <span className="text-[10px] font-medium bg-slate-800 px-2 py-1 rounded text-slate-300">
                      Cap: {(stadium.capacity / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 mb-6">
          <button
            type="submit"
            disabled={!selectedStadiumId}
            className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${
              selectedStadiumId
              ? 'bg-accent text-slate-900 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-[0.98]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Navigation size={20} />
            {t('select.continue')}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SelectStadium;
