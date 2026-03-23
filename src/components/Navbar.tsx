import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { LogOut, Shield, Menu, X, Languages, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, setUser, language, setLanguage, theme, setTheme, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('about'), path: '/about' },
    { name: t('events'), path: '/events' },
    { name: t('store'), path: '/store' },
  ];

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-950/80 border-white/10' 
        : 'bg-app-bg/80 border-app-section'
    } backdrop-blur-md border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-app-purple to-app-gold bg-clip-text text-transparent">
              {t('navAppName')}
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                theme === 'dark' ? 'hover:text-blue-400' : 'hover:text-app-gold'
              } ${
                location.pathname === link.path 
                  ? (theme === 'dark' ? 'text-blue-400' : 'text-app-gold') 
                  : (theme === 'dark' ? 'text-slate-300' : 'text-app-navy')
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center space-x-2 border-l border-white/10 pl-6 ml-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-app-section text-app-navy'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-app-section text-app-navy'
              }`}
              title={t('language')}
            >
              <Languages size={20} />
            </button>
          </div>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className={`p-2 rounded-full transition-colors ${
                    theme === 'dark' ? 'hover:bg-white/5 text-blue-400' : 'hover:bg-app-section text-app-gold'
                  }`}>
                    <Shield size={20} />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    theme === 'dark' ? 'text-slate-300 hover:text-red-400' : 'text-app-navy hover:text-red-600'
                  }`}
                >
                  <LogOut size={18} />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-app-gold hover:bg-app-gold/90 text-app-purple text-sm font-bold transition-all shadow-lg shadow-app-gold/20"
              >
                {t('register')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-app-section text-app-navy'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-app-section text-app-navy'
              }`}
            >
              <Languages size={20} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-app-section text-app-navy'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-b overflow-hidden transition-colors duration-300 ${
              theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-app-bg border-app-section'
            }`}
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-4 rounded-lg text-base font-medium transition-colors ${
                    theme === 'dark' 
                      ? 'text-slate-300 hover:bg-white/5 hover:text-blue-400' 
                      : 'text-app-navy hover:bg-app-section hover:text-app-gold'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-4 rounded-lg text-base font-medium transition-colors ${
                        theme === 'dark' ? 'text-blue-400 hover:bg-white/5' : 'text-app-gold hover:bg-app-section'
                      }`}
                    >
                      {t('admin')}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-4 rounded-lg text-base font-medium transition-colors ${
                      theme === 'dark' ? 'text-red-400 hover:bg-white/5' : 'text-red-600 hover:bg-app-section'
                    }`}
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-4 rounded-lg text-base font-medium transition-colors ${
                    theme === 'dark' ? 'text-blue-400 hover:bg-white/5' : 'text-app-gold hover:bg-app-section'
                  }`}
                >
                  {t('register')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
