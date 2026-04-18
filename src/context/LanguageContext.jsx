import React, { createContext, useContext, useState, useCallback } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import ta from '../locales/ta.json';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'as', name: 'Assamese (অসমীয়া)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'brx', name: 'Bodo (बड़ो)' },
  { code: 'doi', name: 'Dogri (डोगरी)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ks', name: 'Kashmiri (कॉशुर)' },
  { code: 'kok', name: 'Konkani (कोंकणी)' },
  { code: 'mai', name: 'Maithili (मैथिली)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'mni', name: 'Manipuri (মৈতৈলোন্)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ne', name: 'Nepali (नेपाली)' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'sa', name: 'Sanskrit (संस्कृतम्)' },
  { code: 'sat', name: 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)' },
  { code: 'sd', name: 'Sindhi (सिन्धी)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ur', name: 'Urdu (اردو)' }
];

const translations = {
  en,
  hi,
  ta
};

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('en');

  // Simple nested key translator (e.g., 'home.welcome')
  const t = useCallback((key) => {
    const keys = key.split('.');
    
    // Fallback to English if translation file doesn't exist for selected language
    const langDict = translations[currentLang] || translations['en'];
    
    let result = langDict;
    for (let k of keys) {
      if (result[k] === undefined) {
        // Ultimate fallback to English if the specific key is missing
        let fallbackResult = translations['en'];
        for (let baseK of keys) {
          if (!fallbackResult[baseK]) return key; // No fallback found, return key
          fallbackResult = fallbackResult[baseK];
        }
        return fallbackResult;
      }
      result = result[k];
    }
    return result;
  }, [currentLang]);

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, t, INDIAN_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};
