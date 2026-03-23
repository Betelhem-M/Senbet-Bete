import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation 
} from 'react-router-dom';
import { UserProfile, Language, Event, Book, Schedule, AboutSection } from './types';
import translations from './translations.json';
import { initialStudents, initialEvents, initialBooks, initialSchedules, initialAboutSections } from './mockData';

// --- Contexts ---
interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  students: UserProfile[];
  setStudents: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  aboutSections: AboutSection[];
  setAboutSections: React.Dispatch<React.SetStateAction<AboutSection[]>>;
  loading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  heroImage: string | null;
  setHeroImage: (url: string | null) => void;
  brandName: string;
  setBrandName: (name: string) => void;
  notification: { message: string, type: 'success' | 'error' } | null;
  setNotification: (notif: { message: string, type: 'success' | 'error' } | null) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// --- Components ---
import { CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import StorePage from './pages/StorePage';
import AdminDashboard from './pages/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, loading } = useApp();
  const location = useLocation();

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-950 text-white">Loading...</div>;

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [students, setStudents] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : initialStudents;
  });
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : initialEvents;
  });
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('books');
    return saved ? JSON.parse(saved) : initialBooks;
  });
  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const saved = localStorage.getItem('schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });
  const [aboutSections, setAboutSections] = useState<AboutSection[]>(() => {
    const saved = localStorage.getItem('aboutSections');
    return saved ? JSON.parse(saved) : initialAboutSections;
  });
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [heroImage, setHeroImage] = useState<string | null>(() => {
    return localStorage.getItem('heroImage');
  });
  const [brandName, setBrandName] = useState<string>(() => {
    return localStorage.getItem('brandName') || '';
  });

  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user to localStorage:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('students', JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('events', JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events to localStorage:', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('books', JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save books to localStorage:', e);
      setNotification({ message: 'Books data too large to save locally. Some data might be lost on refresh.', type: 'error' });
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem('schedules', JSON.stringify(schedules));
    } catch (e) {
      console.error('Failed to save schedules to localStorage:', e);
    }
  }, [schedules]);

  useEffect(() => {
    try {
      localStorage.setItem('aboutSections', JSON.stringify(aboutSections));
    } catch (e) {
      console.error('Failed to save aboutSections to localStorage:', e);
    }
  }, [aboutSections]);

  useEffect(() => {
    try {
      if (heroImage) {
        localStorage.setItem('heroImage', heroImage);
      } else {
        localStorage.removeItem('heroImage');
      }
    } catch (e) {
      console.error('Failed to save hero image to localStorage:', e);
      setNotification({ message: 'Hero image too large to save locally. It will be lost on refresh.', type: 'error' });
    }
  }, [heroImage]);

  useEffect(() => {
    try {
      localStorage.setItem('brandName', brandName);
    } catch (e) {
      console.error('Failed to save brandName to localStorage:', e);
    }
  }, [brandName]);

  const t = (key: string) => {
    return (translations as any)[language][key] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <ErrorBoundary>
      <AppContext.Provider value={{ 
        user, setUser, 
        students, setStudents, 
        events, setEvents, 
        books, setBooks, 
        schedules, setSchedules,
        aboutSections, setAboutSections,
        loading, 
        language, setLanguage: handleSetLanguage, 
        theme, setTheme,
        heroImage, setHeroImage,
        brandName, setBrandName,
        notification, setNotification,
        t 
      }}>
        <Router>
          <div className={`min-h-screen transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-slate-950 text-slate-100' 
              : 'bg-app-bg text-app-navy'
          } font-sans selection:bg-app-gold/30`}>
            <Navbar />
            {/* Notification Toast */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  key="notification"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
                    notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}
                >
                  {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="font-medium">{notification.message}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/events" 
                  element={<ProtectedRoute><EventsPage /></ProtectedRoute>} 
                />
                <Route 
                  path="/store" 
                  element={<ProtectedRoute><StorePage /></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/*" 
                  element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AppContext.Provider>
    </ErrorBoundary>
  );
}
