import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, User, Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('user');

  const handleValidation = () => {
    if (role === 'user') {
      if (!formData.name.trim()) return "Name cannot be empty.";
      if (!formData.email.trim()) return "Gmail cannot be empty.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) return "Enter a valid email address.";
    } else {
      if (!formData.email.trim()) return "Admin Email or ID cannot be empty.";
    }
    if (!formData.password.trim()) return "Password cannot be empty.";
    return null;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const validationError = handleValidation();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (role === 'admin') {
      if (formData.email !== 'admin123@gmail.com' || formData.password !== '12345') {
        setError("Invalid admin credentials");
        return;
      }
    }

    setIsLoading(true);
    setError('');
    
    // Simulate auth
    localStorage.setItem('currentUser', JSON.stringify({ 
      name: role === 'user' ? formData.name : 'Administrator', 
      email: formData.email, 
      role 
    }));
    
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin') {
        navigate('/management');
      } else {
        navigate('/');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-blue-600/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/3 blur-[120px]" />
      </div>

      {/* Top branding area */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 relative z-10"
      >
        {/* Logo Icon */}
        <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl mx-auto mb-5 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.35)]">
          <ShieldAlert size={38} className="text-[#0F172A]" />
        </div>

        {/* Welcome Message */}
        <h1 className="text-4xl font-black text-white tracking-tight">
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            CrowdFlow AI
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-cyan-400 font-semibold text-base mt-2 tracking-wide">
          Your Smart Stadium Companion
        </p>

        {/* Supporting description */}
        <p className="text-slate-400 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
          Log in to explore stadium navigation, live assistance, and smart event guidance.
        </p>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 bg-red-500/10 border border-red-500/40 text-red-400 text-xs p-3 rounded-xl flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Role Selection */}
            <div className="flex p-1 bg-slate-800/60 rounded-xl mb-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  role === 'user' 
                    ? 'bg-cyan-500 text-slate-900 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  role === 'admin' 
                    ? 'bg-cyan-500 text-slate-900 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Name Input */}
            {role === 'user' && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="text"
                  id="login-name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800/60 border border-slate-700 focus:border-cyan-400 text-white rounded-xl p-4 pl-12 focus:outline-none transition-all duration-200 placeholder:text-slate-600 focus:bg-slate-800"
                />
              </div>
            )}

            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                type="text"
                id="login-email"
                placeholder={role === 'user' ? "Gmail" : "Admin Email or ID"}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-800/60 border border-slate-700 focus:border-cyan-400 text-white rounded-xl p-4 pl-12 focus:outline-none transition-all duration-200 placeholder:text-slate-600 focus:bg-slate-800"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                type="password"
                id="login-password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-800/60 border border-slate-700 focus:border-cyan-400 text-white rounded-xl p-4 pl-12 focus:outline-none transition-all duration-200 placeholder:text-slate-600 focus:bg-slate-800"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="mt-3 w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold py-4 rounded-xl hover:from-cyan-300 hover:to-blue-400 transition-all shadow-[0_0_25px_rgba(34,211,238,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Enter CrowdFlow <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Feature badges */}
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            {['Smart Nav', 'Live AI', 'Offline Ready'].map((badge) => (
              <span key={badge} className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800/60 border border-slate-700/60 px-3 py-1 rounded-full">
                <Zap size={9} className="text-cyan-400" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
