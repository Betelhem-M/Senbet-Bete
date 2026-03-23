import React from 'react';
import { useApp } from '../App';
import { motion } from 'motion/react';
import { History, Target, Eye, Award, LucideIcon } from 'lucide-react';

const IconMap: Record<string, LucideIcon> = {
  History,
  Target,
  Eye,
  Award
};

export default function AboutPage() {
  const { t, theme, aboutSections, heroImage } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-app-purple'
        }`}>{t('about')}</h1>
        <div className="w-24 h-1 bg-app-gold mx-auto rounded-full" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {aboutSections.map((section, index) => {
          const Icon = IconMap[section.iconName] || Target;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-8 rounded-3xl border relative overflow-hidden group transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10 hover:border-white/20' 
                  : 'bg-app-lavender border-app-section hover:border-app-gold/30 shadow-xl shadow-app-purple/5'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative z-10">
                <div className={`mb-6 p-4 rounded-2xl inline-block ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-app-bg'
                }`}>
                  <Icon className="text-app-gold" size={32} />
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-app-purple'
                }`}>{t(section.titleKey)}</h2>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-app-navy'
                }`}>
                  {section.contentKey ? t(section.contentKey) : section.content}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={`mt-20 p-12 rounded-[3rem] border text-center transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border-white/10' 
            : 'bg-app-section border-app-lavender'
        }`}
      >
        <h2 className={`text-3xl font-bold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-app-purple'
        }`}>{t('joinJourney')}</h2>
        <p className={`text-xl max-w-2xl mx-auto mb-8 ${
          theme === 'dark' ? 'text-slate-300' : 'text-app-navy'
        }`}>
          {t('joinJourneyDesc')}
        </p>
        <img 
          src={heroImage || "https://picsum.photos/seed/sabbath/1200/400"} 
          alt="Community" 
          className={`rounded-3xl shadow-2xl border w-full h-64 object-cover ${
            theme === 'dark' ? 'border-white/10' : 'border-app-section'
          }`}
          referrerPolicy="no-referrer"
        />
      </motion.div>
    </div>
  );
}
