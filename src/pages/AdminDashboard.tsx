import React, { useState } from 'react';
import { useApp } from '../App';
import { UserProfile, Event, Book, Schedule } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  Clock, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Upload
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { 
    t, 
    user,
    students, setStudents, 
    events, setEvents, 
    books, setBooks, 
    schedules, setSchedules,
    aboutSections, setAboutSections,
    theme,
    setNotification
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('overview');

  // Form states
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '' });
  const [bookForm, setBookForm] = useState({ title: '', fileURL: '' });
  const [scheduleForm, setScheduleForm] = useState({ class: 1, course: '', weekend: '' });
  const [aboutForm, setAboutForm] = useState({ titleKey: 'mission', content: '', iconName: 'Target', color: 'from-emerald-500/20 to-transparent' });
  const [editingAboutId, setEditingAboutId] = useState<string | null>(null);

  const handleApprove = (uid: string) => {
    setStudents(prev => prev.map(s => s.uid === uid ? { ...s, status: 'approved' } : s));
    setNotification({ message: t('studentApproved'), type: 'success' });
  };

  const handleReject = (uid: string) => {
    setStudents(prev => prev.map(s => s.uid === uid ? { ...s, status: 'rejected' } : s));
    setNotification({ message: t('studentRejected'), type: 'error' });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: eventForm.title,
      description: eventForm.description,
      date: new Date(eventForm.date).toISOString(),
      createdBy: user?.uid || 'admin',
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [newEvent, ...prev]);
    setEventForm({ title: '', description: '', date: '' });
    setNotification({ message: t('eventCreated'), type: 'success' });
  };

  const handleBookFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookForm(prev => ({ ...prev, fileURL: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.fileURL) {
      setNotification({ message: t('noFileSelected'), type: 'error' });
      return;
    }
    const newBook: Book = {
      id: Math.random().toString(36).substr(2, 9),
      title: bookForm.title,
      fileURL: bookForm.fileURL,
      uploadedBy: user?.uid || 'admin',
      createdAt: new Date().toISOString()
    };
    setBooks(prev => [newBook, ...prev]);
    setBookForm({ title: '', fileURL: '' });
    setNotification({ message: t('bookUploaded'), type: 'success' });
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: Schedule = {
      id: Math.random().toString(36).substr(2, 9),
      ...scheduleForm,
      class: Number(scheduleForm.class)
    };
    setSchedules(prev => [...prev, newSchedule]);
    setScheduleForm({ class: 1, course: '', weekend: '' });
    setNotification({ message: t('scheduleUpdated'), type: 'success' });
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAboutId) {
      setAboutSections(prev => prev.map(s => s.id === editingAboutId ? { ...s, ...aboutForm } : s));
      setEditingAboutId(null);
      setNotification({ message: t('aboutUpdated'), type: 'success' });
    } else {
      const newSection = {
        id: Math.random().toString(36).substr(2, 9),
        ...aboutForm
      };
      setAboutSections(prev => [...prev, newSection]);
      setNotification({ message: t('aboutAdded'), type: 'success' });
    }
    setAboutForm({ titleKey: 'mission', content: '', iconName: 'Target', color: 'from-emerald-500/20 to-transparent' });
  };

  const { heroImage, setHeroImage, brandName, setBrandName } = useApp();
  const [heroImageUrl, setHeroImageUrl] = useState(heroImage || '');
  const [localBrandName, setLocalBrandName] = useState(brandName);
  const [wallpaperSource, setWallpaperSource] = useState<'url' | 'file'>('url');

  const handleUpdateHeroImage = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroImage(heroImageUrl);
    setNotification({ message: t('heroUpdated'), type: 'success' });
  };

  const handleUpdateBrandName = (e: React.FormEvent) => {
    e.preventDefault();
    setBrandName(localBrandName);
    setNotification({ message: t('settingsUpdated'), type: 'success' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setHeroImage(base64String);
        setHeroImageUrl(base64String);
        setNotification({ message: t('heroUpdated'), type: 'success' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteHeroImage = () => {
    if (window.confirm(t('confirmDeleteHero'))) {
      setHeroImage(null);
      setHeroImageUrl('');
      setNotification({ message: t('heroRemoved'), type: 'error' });
    }
  };

  const handleEditAbout = (section: any) => {
    setAboutForm({
      titleKey: section.titleKey,
      content: section.content,
      iconName: section.iconName,
      color: section.color
    });
    setEditingAboutId(section.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (coll: 'users' | 'events' | 'books' | 'schedules' | 'about', id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      if (coll === 'users') setStudents(prev => prev.filter(s => s.uid !== id));
      if (coll === 'events') setEvents(prev => prev.filter(e => e.id !== id));
      if (coll === 'books') setBooks(prev => prev.filter(b => b.id !== id));
      if (coll === 'schedules') setSchedules(prev => prev.filter(s => s.id !== id));
      if (coll === 'about') setAboutSections(prev => prev.filter(s => s.id !== id));
    }
  };

  const tabs = [
    { id: 'overview', name: t('overview'), icon: <LayoutDashboard size={20} /> },
    { id: 'students', name: t('students'), icon: <Users size={20} /> },
    { id: 'events', name: t('events'), icon: <Calendar size={20} /> },
    { id: 'books', name: t('books'), icon: <BookOpen size={20} /> },
    { id: 'schedules', name: t('schedule'), icon: <Clock size={20} /> },
    { id: 'about', name: t('about'), icon: <LayoutDashboard size={20} /> },
    { id: 'settings', name: t('settings'), icon: <Upload size={20} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className={`border rounded-3xl p-4 space-y-2 sticky top-24 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-section border-app-lavender shadow-xl shadow-app-purple/5'
          }`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-app-purple text-white shadow-lg shadow-app-purple/20' 
                    : theme === 'dark' 
                      ? 'text-slate-400 hover:bg-white/5 hover:text-white'
                      : 'text-app-gray hover:bg-app-section hover:text-app-navy'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('overview')}</h1>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title={t('totalStudents')} value={students.length} icon={<Users className="text-app-purple" />} theme={theme} variant="lavender" />
                    <StatCard title={t('pending')} value={students.filter(s => s.status === 'pending').length} icon={<Clock className="text-app-gold" />} theme={theme} variant="olive" />
                    <StatCard title={t('approved')} value={students.filter(s => s.status === 'approved').length} icon={<Check className="text-emerald-500" />} theme={theme} variant="lavender" />
                    <StatCard title={t('books')} value={books.length} icon={<BookOpen className="text-app-purple" />} theme={theme} variant="olive" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className={`p-8 rounded-[2.5rem] border transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-section border-app-lavender shadow-lg shadow-app-purple/5'
                    }`}>
                      <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('classDistribution')}</h3>
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map(c => (
                          <div key={c} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className={theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}>{t(`class${c}`)}</span>
                              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{students.filter(s => s.class === c).length} {t('students')}</span>
                            </div>
                            <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-app-bg'}`}>
                              <div 
                                className="h-full bg-app-gold rounded-full" 
                                style={{ width: `${(students.filter(s => s.class === c).length / (students.length || 1)) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`p-8 rounded-[2.5rem] border transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-section border-app-lavender shadow-lg shadow-app-purple/5'
                    }`}>
                      <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('genderDistribution')}</h3>
                      <div className="flex items-center justify-around h-48">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-app-purple">{students.filter(s => s.gender === 'Male').length}</div>
                          <div className={theme === 'dark' ? 'text-slate-500' : 'text-app-gray'}>{t('male')}</div>
                        </div>
                        <div className={`w-px h-24 ${theme === 'dark' ? 'bg-white/10' : 'bg-app-section'}`} />
                        <div className="text-center">
                          <div className="text-4xl font-bold text-app-gold">{students.filter(s => s.gender === 'Female').length}</div>
                          <div className={theme === 'dark' ? 'text-slate-500' : 'text-app-gray'}>{t('female')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('students')}</h1>
                  </div>

                  <div className={`border rounded-3xl overflow-hidden transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-section border-app-lavender shadow-lg shadow-app-purple/5'
                  }`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className={`border-b transition-colors duration-300 ${
                            theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-app-section bg-app-section'
                          }`}>
                            <th className={`px-6 py-4 text-sm font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('fullName')}</th>
                            <th className={`px-6 py-4 text-sm font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('email')}</th>
                            <th className={`px-6 py-4 text-sm font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('class')}</th>
                            <th className={`px-6 py-4 text-sm font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('status')}</th>
                            <th className={`px-6 py-4 text-sm font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('actions')}</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y transition-colors duration-300 ${
                          theme === 'dark' ? 'divide-white/5' : 'divide-app-section'
                        }`}>
                          {students.map((student) => (
                            <tr key={student.uid} className={`transition-colors ${
                              theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-app-section'
                            }`}>
                              <td className="px-6 py-4">
                                <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-app-navy'}`}>{student.name}</div>
                                <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-app-gray'}`}>{student.gender === 'Male' ? t('male') : t('female')}, {student.age} {t('age')}</div>
                              </td>
                              <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-app-navy'}`}>{student.email}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-lg bg-app-gold/10 text-app-gold text-xs font-bold">
                                  {t(`class${student.class}`)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                  student.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                  student.status === 'pending' ? 'bg-app-gold/10 text-app-gold' :
                                  'bg-red-500/10 text-red-500'
                                }`}>
                                  {t(student.status).toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  {student.status === 'pending' && (
                                    <>
                                      <button 
                                        onClick={() => handleApprove(student.uid)}
                                        className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                                      >
                                        <Check size={16} />
                                      </button>
                                      <button 
                                        onClick={() => handleReject(student.uid)}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                      >
                                        <X size={16} />
                                      </button>
                                    </>
                                  )}
                                  <button 
                                    onClick={() => handleDelete('users', student.uid)}
                                    className={`p-2 rounded-lg transition-all ${
                                      theme === 'dark' ? 'bg-white/5 text-slate-500 hover:bg-red-500 hover:text-white' : 'bg-app-bg text-app-gray hover:bg-red-500 hover:text-white'
                                    }`}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('events')}</h1>
                  </div>

                  <form onSubmit={handleAddEvent} className={`p-8 rounded-3xl border grid md:grid-cols-3 gap-6 items-end transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-section border-app-lavender shadow-lg shadow-app-purple/5'
                  }`}>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('fullName')}</label>
                      <input
                        type="text"
                        required
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        className={`w-full border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-colors ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('date')}</label>
                      <input
                        type="datetime-local"
                        required
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        className={`w-full border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-colors ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('description')}</label>
                      <input
                        type="text"
                        required
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        className={`w-full border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-colors ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                        }`}
                      />
                    </div>
                    <button type="submit" className="md:col-span-3 py-3 rounded-xl bg-app-purple hover:bg-app-purple/90 text-white font-bold transition-all flex items-center justify-center space-x-2">
                      <Plus size={20} />
                      <span>{t('createEvent')}</span>
                    </button>
                  </form>

                  <div className="grid gap-4">
                    {events.map((event) => (
                      <div key={event.id} className={`p-6 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-bg border-app-section'
                      }`}>
                        <div>
                          <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>
                            {event.titleKey ? t(event.titleKey) : event.title}
                          </h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-app-gray'}`}>{format(new Date(event.date), 'PPP p')}</p>
                        </div>
                        <button 
                          onClick={() => handleDelete('events', event.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'books' && (
                <div className="space-y-8">
                  <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('books')}</h1>
                  
                  <form onSubmit={handleUploadBook} className={`p-8 rounded-3xl border grid md:grid-cols-2 gap-6 items-end transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-section border-app-lavender shadow-lg shadow-app-purple/5'
                  }`}>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('title')}</label>
                      <input
                        type="text"
                        required
                        value={bookForm.title}
                        onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                        className={`w-full border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-colors ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('uploadBook')} (PDF)</label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleBookFileUpload}
                        className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold transition-colors ${
                          theme === 'dark' 
                            ? 'text-slate-400 file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20' 
                            : 'text-app-gray file:bg-app-gold/10 file:text-app-gold hover:file:bg-app-gold/20'
                        }`}
                      />
                    </div>
                    <button type="submit" className="md:col-span-2 py-3 rounded-xl bg-app-purple hover:bg-app-purple/90 text-white font-bold transition-all flex items-center justify-center space-x-2">
                      <Upload size={20} />
                      <span>{t('uploadBook')}</span>
                    </button>
                  </form>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                      <div key={book.id} className={`p-6 rounded-2xl border flex flex-col transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-lavender border-app-section shadow-lg shadow-app-purple/5'
                      }`}>
                        <div className="w-12 h-12 rounded-xl bg-app-gold/20 flex items-center justify-center text-app-gold mb-4">
                          <BookOpen size={24} />
                        </div>
                        <h3 className={`font-bold mb-4 line-clamp-1 ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>
                          {book.titleKey ? t(book.titleKey) : book.title}
                        </h3>
                        <div className="flex items-center justify-between mt-auto">
                          <button 
                            onClick={() => {
                              if (book.fileURL && book.fileURL !== '#') {
                                try {
                                  if (book.fileURL.startsWith('data:')) {
                                    const parts = book.fileURL.split(',');
                                    const mime = parts[0].match(/:(.*?);/)?.[1];
                                    const b64 = atob(parts[1]);
                                    let n = b64.length;
                                    const u8arr = new Uint8Array(n);
                                    while (n--) {
                                      u8arr[n] = b64.charCodeAt(n);
                                    }
                                    const blob = new Blob([u8arr], { type: mime });
                                    const url = URL.createObjectURL(blob);
                                    window.open(url, '_blank');
                                    setTimeout(() => URL.revokeObjectURL(url), 10000);
                                  } else {
                                    window.open(book.fileURL, '_blank');
                                  }
                                } catch (e) {
                                  console.error('Error opening file:', e);
                                  alert(t('errorOpeningFile'));
                                }
                              } else {
                                alert(t('noFileAvailable'));
                              }
                            }} 
                            className="text-xs text-app-gold hover:underline"
                          >
                            {t('viewFile')}
                          </button>
                          <button 
                            onClick={() => handleDelete('books', book.id)}
                            className={`p-2 rounded-lg transition-all ${
                              theme === 'dark' ? 'bg-white/5 text-slate-500 hover:bg-red-500 hover:text-white' : 'bg-app-bg text-app-gray hover:bg-red-500 hover:text-white'
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'schedules' && (
                <div className="space-y-8">
                  <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('schedule')}</h1>

                  <form onSubmit={handleAddSchedule} className={`p-8 rounded-3xl border grid md:grid-cols-4 gap-4 items-end transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-section border-app-lavender shadow-lg shadow-app-purple/5'
                  }`}>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('class')}</label>
                      <select
                        value={scheduleForm.class}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, class: Number(e.target.value) })}
                        className={`w-full border rounded-xl py-2 px-4 focus:outline-none transition-colors ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                        }`}
                      >
                        {[1, 2, 3, 4].map(c => <option key={c} value={c} className={theme === 'dark' ? 'bg-slate-900' : 'bg-app-bg'}>{t(`class${c}`)}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('courseName')}</label>
                      <input
                        type="text"
                        required
                        value={scheduleForm.course}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, course: e.target.value })}
                        className={`w-full border rounded-xl py-2 px-4 focus:outline-none transition-colors ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                        }`}
                        placeholder="e.g. Bible Stories"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('weekend')}</label>
                      <input
                        type="text"
                        required
                        value={scheduleForm.weekend}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, weekend: e.target.value })}
                        className={`w-full border rounded-xl py-2 px-4 focus:outline-none transition-colors ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                        }`}
                        placeholder="e.g. March 28-29"
                      />
                    </div>
                    <button type="submit" className="md:col-span-1 py-3 rounded-xl bg-app-purple hover:bg-app-purple/90 text-white font-bold transition-all">
                      {t('submit')}
                    </button>
                  </form>

                  <div className="grid md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(c => (
                      <div key={c} className={`p-6 rounded-3xl border transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-section border-app-lavender shadow-lg shadow-app-purple/5'
                      }`}>
                        <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t(`class${c}`)}</h3>
                        <div className="space-y-2">
                          {schedules.filter(s => s.class === c).map(s => (
                            <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors duration-300 ${
                              theme === 'dark' ? 'bg-white/5' : 'bg-app-bg'
                            }`}>
                              <div>
                                <div className={`font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-app-navy'}`}>{s.course}</div>
                                <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-app-gray'}`}>{s.weekend}</div>
                              </div>
                              <button 
                                onClick={() => handleDelete('schedules', s.id)}
                                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-8">
                  <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('about')}</h1>
                  
                  <form onSubmit={handleSaveAbout} className={`p-8 rounded-3xl border space-y-6 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-section border-app-lavender shadow-lg shadow-app-purple/5'
                  }`}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('sectionType')}</label>
                        <select
                          value={aboutForm.titleKey}
                          onChange={(e) => setAboutForm({ ...aboutForm, titleKey: e.target.value })}
                          className={`w-full border rounded-xl py-2 px-4 focus:outline-none transition-colors ${
                            theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                          }`}
                        >
                          <option value="mission" className={theme === 'dark' ? 'bg-slate-900' : 'bg-app-bg'}>{t('mission')}</option>
                          <option value="vision" className={theme === 'dark' ? 'bg-slate-900' : 'bg-app-bg'}>{t('vision')}</option>
                          <option value="history" className={theme === 'dark' ? 'bg-slate-900' : 'bg-app-bg'}>{t('history')}</option>
                          <option value="achievements" className={theme === 'dark' ? 'bg-slate-900' : 'bg-app-bg'}>{t('achievements')}</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('icon')}</label>
                        <select
                          value={aboutForm.iconName}
                          onChange={(e) => setAboutForm({ ...aboutForm, iconName: e.target.value })}
                          className={`w-full border rounded-xl py-2 px-4 focus:outline-none transition-colors ${
                            theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                          }`}
                        >
                          <option value="Target" className={theme === 'dark' ? 'bg-slate-900' : 'bg-app-bg'}>Target ({t('mission')})</option>
                          <option value="Eye" className={theme === 'dark' ? 'bg-slate-900' : 'bg-app-bg'}>Eye ({t('vision')})</option>
                          <option value="History" className={theme === 'dark' ? 'bg-slate-900' : 'bg-app-bg'}>History ({t('history')})</option>
                          <option value="Award" className={theme === 'dark' ? 'bg-slate-900' : 'bg-app-bg'}>Award ({t('achievements')})</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('description')}</label>
                      <textarea
                        required
                        rows={4}
                        value={aboutForm.content}
                        onChange={(e) => setAboutForm({ ...aboutForm, content: e.target.value })}
                        className={`w-full border rounded-xl py-2 px-4 focus:outline-none transition-colors ${
                          theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                        }`}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button type="submit" className="flex-1 py-3 rounded-xl bg-app-purple hover:bg-app-purple/90 text-white font-bold transition-all">
                        {editingAboutId ? t('updateSection') : t('addSection')}
                      </button>
                      {editingAboutId && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingAboutId(null);
                            setAboutForm({ titleKey: 'mission', content: '', iconName: 'Target', color: 'from-emerald-500/20 to-transparent' });
                          }}
                          className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-app-bg text-app-gray hover:bg-app-section'
                          }`}
                        >
                          {t('cancel')}
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="grid md:grid-cols-2 gap-6">
                    {aboutSections.map((section) => (
                      <div key={section.id} className={`p-6 rounded-3xl border transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-section border-app-lavender shadow-lg shadow-app-purple/5'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t(section.titleKey)}</h3>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditAbout(section)}
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete('about', section.id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className={`text-sm line-clamp-3 ${theme === 'dark' ? 'text-slate-400' : 'text-app-navy'}`}>
                          {section.contentKey ? t(section.contentKey) : section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('settings')}</h1>
                  
                  <div className={`p-8 rounded-3xl border space-y-6 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-section border-app-lavender shadow-lg shadow-app-purple/5'
                  }`}>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('heroSettings')}</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>
                      {t('heroSettingsDesc')}
                    </p>
                    
                    <div className="flex space-x-4 mb-6">
                      <button
                        onClick={() => setWallpaperSource('url')}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                          wallpaperSource === 'url'
                            ? 'bg-app-purple text-white'
                            : theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-app-bg text-app-gray'
                        }`}
                      >
                        {t('onlineUrl')}
                      </button>
                      <button
                        onClick={() => setWallpaperSource('file')}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                          wallpaperSource === 'file'
                            ? 'bg-app-purple text-white'
                            : theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-app-bg text-app-gray'
                        }`}
                      >
                        {t('localUpload')}
                      </button>
                    </div>
                    
                    {wallpaperSource === 'url' ? (
                      <form onSubmit={handleUpdateHeroImage} className="space-y-4">
                        <div className="space-y-2">
                          <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('heroImage')}</label>
                          <div className="flex gap-4">
                            <input
                              type="url"
                              required
                              value={heroImageUrl}
                              onChange={(e) => setHeroImageUrl(e.target.value)}
                              className={`flex-1 border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-colors ${
                                theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                              }`}
                              placeholder="https://example.com/image.jpg"
                            />
                            <button type="submit" className="px-6 py-2 rounded-xl bg-app-purple hover:bg-app-purple/90 text-white font-bold transition-all">
                              {t('update')}
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('heroImage')}</label>
                          <div className="flex items-center justify-center w-full">
                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                              theme === 'dark' 
                                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                                : 'bg-app-bg border-app-section hover:bg-app-section'
                            }`}>
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-app-gold" />
                                <p className={`mb-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>
                                  <span className="font-semibold">{t('browse')}</span> {t('selectFile')}
                                </p>
                              </div>
                              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Brand Name Settings */}
                    <div className="mt-12 pt-12 border-t border-white/10">
                      <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>
                        {t('brandNameLabel')}
                      </h3>
                      <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>
                        {t('brandNameDesc')}
                      </p>
                      
                      <form onSubmit={handleUpdateBrandName} className="space-y-4">
                        <div className="space-y-2">
                          <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-app-gray'}`}>{t('brandNameLabel')}</label>
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={localBrandName}
                              onChange={(e) => setLocalBrandName(e.target.value)}
                              className={`flex-1 border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-colors ${
                                theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-app-bg border-app-section text-app-navy'
                              }`}
                              placeholder="e.g. Bethel"
                            />
                            <button type="submit" className="px-6 py-2 rounded-xl bg-app-purple hover:bg-app-purple/90 text-white font-bold transition-all">
                              {t('update')}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    {heroImage && (
                      <div className="space-y-4">
                        <div className="relative group rounded-2xl overflow-hidden border border-white/10 aspect-video">
                          <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={handleDeleteHeroImage}
                              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all transform hover:scale-110"
                            >
                              <Trash2 size={24} />
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={handleDeleteHeroImage}
                          className="text-sm text-red-500 hover:underline flex items-center space-x-1"
                        >
                          <Trash2 size={14} />
                          <span>{t('delete')} {t('heroImage')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, theme, variant = 'lavender' }: { title: string, value: number | string, icon: React.ReactNode, theme: 'light' | 'dark', variant?: 'lavender' | 'olive' }) {
  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-white/5 border-white/10' 
        : variant === 'lavender' 
          ? 'bg-app-lavender border-app-section shadow-lg shadow-app-purple/5'
          : 'bg-app-section border-app-lavender shadow-lg shadow-app-purple/5'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-app-bg'}`}>{icon}</div>
      </div>
      <div className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{value}</div>
      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-app-gray'}`}>{title}</div>
    </div>
  );
}
