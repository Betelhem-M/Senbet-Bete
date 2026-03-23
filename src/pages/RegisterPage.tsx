import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User, Calendar, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';

export default function RegisterPage() {
  const { t, setStudents, theme } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'Male' as const,
    dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate registration
    setTimeout(() => {
      const age = calculateAge(formData.dateOfBirth);
      
      if (age < 1) {
        setError(t('ageError'));
        setLoading(false);
        return;
      }

      let assignedClass = 1;
      if (age >= 1 && age <= 7) assignedClass = 1;
      else if (age >= 8 && age <= 15) assignedClass = 2;
      else if (age >= 16 && age <= 20) assignedClass = 3;
      else assignedClass = 4;

      const newStudent: UserProfile = {
        uid: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        role: 'user',
        gender: formData.gender,
        age: age,
        dateOfBirth: formData.dateOfBirth,
        class: assignedClass,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      setStudents(prev => [...prev, newStudent]);
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
      setLoading(false);
    }, 1000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`max-w-md p-12 rounded-3xl border shadow-2xl transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-white/5 border-emerald-500/20 shadow-emerald-500/10' 
              : 'bg-app-bg border-emerald-200 shadow-emerald-500/5'
          }`}
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-emerald-500" size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-emerald-500">{t('registrationSuccess')}</h1>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-app-navy'} mb-8`}>
            {t('registrationPending')}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-app-gray'}`}>{t('redirectingToLogin')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-xl border rounded-3xl p-8 md:p-12 shadow-2xl transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10' 
            : 'bg-app-lavender border-app-section'
        }`}
      >
        <div className="text-center mb-10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            theme === 'dark' ? 'bg-blue-600/20' : 'bg-app-section'
          }`}>
            <UserPlus className="text-app-gold" size={32} />
          </div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('register')}</h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('joinCommunity')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center space-x-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-medium ml-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-app-gray'
              }`}>{t('fullName')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-app-navy/50" size={18} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-all ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-app-bg border-app-section text-app-navy'
                  }`}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium ml-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-app-gray'
              }`}>{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-app-navy/50" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-all ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-app-bg border-app-section text-app-navy'
                  }`}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ml-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-app-gray'
            }`}>{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-app-navy/50" size={18} />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-all ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-white' 
                    : 'bg-app-bg border-app-section text-app-navy'
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-medium ml-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-app-gray'
              }`}>{t('gender')}</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-app-navy/50" size={18} />
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-all appearance-none ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-app-bg border-app-section text-app-navy'
                  }`}
                >
                  <option value="Male" className={theme === 'dark' ? 'bg-slate-900' : 'bg-app-bg'}>{t('male')}</option>
                  <option value="Female" className={theme === 'dark' ? 'bg-slate-900' : 'bg-app-bg'}>{t('female')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium ml-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-app-gray'
              }`}>{t('dateOfBirth')}</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-app-navy/50" size={18} />
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-all ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-app-bg border-app-section text-app-navy'
                  }`}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-app-purple hover:bg-app-purple/90 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-app-purple/20"
          >
            {loading ? t('loading') : t('submit')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
