import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../App';
import { motion } from 'motion/react';
import { LogIn, UserPlus, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LandingPage() {
  const { t, user, setUser, students, theme, heroImage, brandName } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      const foundUser = students.find(s => s.email === email);
      if (foundUser) {
        setUser(foundUser);
        navigate('/events');
      } else if (email === 'admin@sabbath.com') {
        // Fallback for admin if not in students list
        const admin = {
          uid: 'admin-1',
          name: 'Admin User',
          email: 'admin@sabbath.com',
          role: 'admin' as const,
          gender: 'Male' as const,
          age: 35,
          status: 'approved' as const,
          createdAt: new Date().toISOString()
        };
        setUser(admin);
        navigate('/admin');
      } else {
        setError(t('invalidLogin'));
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-[-10]">
        <img 
          key={heroImage || 'default'}
          src={heroImage || 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}
          alt="Hero Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-slate-950/60' : 'bg-app-bg/30'}`}></div>
      </div>

      {user ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-app-purple via-app-gold to-app-purple bg-clip-text text-transparent">
            {t('welcomePrefix')} {brandName ? `${brandName} ` : ''}{t('welcomeSuffix')}, {user.name}!
          </h1>
          <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-app-navy'}`}>
            {t('tagline')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/events"
              className="px-8 py-3 rounded-full bg-app-gold hover:bg-app-gold/90 text-app-purple font-bold transition-all shadow-lg shadow-app-gold/20 flex items-center space-x-2"
            >
              <span>{t('events')}</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/store"
              className={`px-8 py-3 rounded-full font-medium transition-all border ${
                theme === 'dark' 
                  ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' 
                  : 'bg-app-section hover:bg-app-lavender text-app-navy border-app-lavender'
              }`}
            >
              {t('store')}
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full -z-10">
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] ${
              theme === 'dark' ? 'bg-blue-600/20' : 'bg-app-lavender/30'
            }`} />
            <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] ${
              theme === 'dark' ? 'bg-emerald-600/20' : 'bg-app-section/30'
            }`} />
          </div>

          <div className="max-w-6xl w-full grid md:grid-row-2 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-app-purple'
              }`}>
                {t('welcomePrefix')} {brandName ? `${brandName} ` : ''}{t('welcomeSuffix')}
              </h1>
              <p className={`text-xl mb-8 max-w-lg ${
                theme === 'dark' ? 'text-slate-400' : 'text-app-navy'
              }`}>
                {t('tagline')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transition-colors duration-300 ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-app-lavender/80 border-app-section shadow-app-purple/5'
              }`}
            >
              <h2 className={`text-2xl font-bold mb-6 flex items-center space-x-2 ${
                theme === 'dark' ? 'text-white' : 'text-app-purple'
              }`}>
                <LogIn className="text-app-gold" />
                <span>{t('login')}</span>
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center space-x-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className={`text-sm font-medium ml-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-app-gray'
                  }`}>{t('email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-app-navy/50" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-all ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 text-white' 
                          : 'bg-app-bg border-app-section text-app-navy'
                      }`}
                      placeholder="email@example.com"
                    />
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-all ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 text-white' 
                          : 'bg-app-bg border-app-section text-app-navy'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-app-purple hover:bg-app-purple/90 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-app-purple/20"
                >
                  {loading ? t('loading') : t('login')}
                </button>
              </form>

              <div className={`mt-8 pt-6 border-t text-center ${
                theme === 'dark' ? 'border-white/5' : 'border-app-section'
              }`}>
                <p className={`text-sm mb-4 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-app-gray'
                }`}>{t('dontHaveAccount')}</p>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 text-app-gold hover:text-app-gold/80 font-bold transition-colors"
                >
                  <UserPlus size={18} />
                  <span>{t('register')}</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
