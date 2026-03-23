import React from 'react';
import { useApp } from '../App';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Bell } from 'lucide-react';
import { format } from 'date-fns';

export default function EventsPage() {
  const { t, events, schedules, theme } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Events Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center space-x-3 mb-8">
            <Bell className="text-app-gold" size={32} />
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('events')}</h1>
          </div>

          {events.length === 0 ? (
            <div className={`p-12 rounded-3xl border text-center transition-colors duration-300 ${
              theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-app-lavender border-app-section text-app-gray'
            }`}>
              No upcoming events at the moment.
            </div>
          ) : (
            <div className="grid gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-3xl border transition-all group duration-300 ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 hover:border-blue-500/30' 
                      : 'bg-app-lavender border-app-section hover:border-app-gold/30 shadow-lg shadow-app-purple/5'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h2 className={`text-xl font-bold group-hover:text-app-gold transition-colors ${
                        theme === 'dark' ? 'text-white' : 'text-app-purple'
                      }`}>{event.titleKey ? t(event.titleKey) : event.title}</h2>
                      <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-app-navy'} line-clamp-2`}>
                        {event.descriptionKey ? t(event.descriptionKey) : event.description}
                      </p>
                    </div>
                    <div className={`flex flex-col items-end text-sm shrink-0 ${
                      theme === 'dark' ? 'text-slate-500' : 'text-app-gray'
                    }`}>
                      <div className="flex items-center space-x-2 text-app-gold font-bold">
                        <CalendarIcon size={16} />
                        <span>{format(new Date(event.date), 'PPP')}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock size={16} />
                        <span>{format(new Date(event.date), 'p')}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule Sidebar */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3 mb-8">
            <Clock className="text-app-gold" size={32} />
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('schedule')}</h1>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((classNum) => (
              <div key={classNum} className={`p-6 rounded-3xl border transition-colors duration-300 ${
                theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-lavender border-app-section shadow-lg shadow-app-purple/5'
              }`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${
                  theme === 'dark' ? 'text-white' : 'text-app-purple'
                }`}>
                  <span className="w-8 h-8 rounded-lg bg-app-gold/20 text-app-gold flex items-center justify-center text-sm font-bold">
                    {classNum}
                  </span>
                  <span>{t(`class${classNum}`)}</span>
                </h3>
                <div className="space-y-3">
                  {schedules.filter(s => s.class === classNum).length === 0 ? (
                    <p className={`text-xs italic ${theme === 'dark' ? 'text-slate-600' : 'text-app-gray'}`}>No schedule set</p>
                  ) : (
                    schedules.filter(s => s.class === classNum).map((s) => (
                      <div key={s.id} className={`flex items-center justify-between text-sm p-3 rounded-xl transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-white/5' : 'bg-app-bg'
                      }`}>
                        <div className="flex flex-col">
                          <span className={`font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-app-navy'}`}>{s.course}</span>
                          <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-app-gray'}`}>{s.weekend}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
