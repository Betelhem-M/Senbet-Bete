import React, { useState } from 'react';
import { useApp } from '../App';
import { motion } from 'motion/react';
import { BookOpen, Download, Search, FileText } from 'lucide-react';

export default function StorePage() {
  const { t, books, theme } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => {
    const title = book.titleKey ? t(book.titleKey) : book.title || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center space-x-3">
          <BookOpen className="text-app-gold" size={32} />
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-app-purple'}`}>{t('store')}</h1>
        </div>

        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-app-navy/50" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchBooks')}
            className={`w-full border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-app-gold/50 transition-all ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 text-white' 
                : 'bg-app-bg border-app-section text-app-navy'
            }`}
          />
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className={`p-20 rounded-[3rem] border text-center transition-colors duration-300 ${
          theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-app-lavender border-app-section'
        }`}>
          <FileText className={`mx-auto mb-4 ${theme === 'dark' ? 'text-slate-700' : 'text-app-section'}`} size={64} />
          <p className={`text-xl ${theme === 'dark' ? 'text-slate-500' : 'text-app-gray'}`}>{t('noBooksFound')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => {
            const displayTitle = book.titleKey ? t(book.titleKey) : book.title;
            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`group p-6 rounded-3xl border transition-all flex flex-col duration-300 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 hover:border-blue-500/30' 
                    : 'bg-app-lavender border-app-section hover:border-app-gold/30 shadow-lg shadow-app-purple/5'
                }`}
              >
                <div className={`aspect-[3/4] rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden ${
                  theme === 'dark' ? 'bg-gradient-to-br from-blue-600/20 to-emerald-600/20' : 'bg-app-section'
                }`}>
                  <BookOpen size={64} className={`group-hover:scale-110 transition-transform duration-500 ${
                    theme === 'dark' ? 'text-white/20' : 'text-app-lavender'
                  }`} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        if (book.fileURL && book.fileURL !== '#') {
                          try {
                            // Handle Data URLs by converting to Blob for more reliable viewing
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
                              // Clean up URL object after a delay
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
                      className="p-4 rounded-full bg-white text-app-purple shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
                      title={t('viewFile')}
                    >
                      <BookOpen size={24} />
                    </button>
                    <button
                      onClick={() => {
                        if (book.fileURL && book.fileURL !== '#') {
                          try {
                            const link = document.createElement('a');
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
                              link.href = url;
                              link.download = `${displayTitle}.pdf`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              setTimeout(() => URL.revokeObjectURL(url), 10000);
                            } else {
                              link.href = book.fileURL;
                              link.download = `${displayTitle}.pdf`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          } catch (e) {
                            console.error('Error downloading file:', e);
                            alert(t('errorDownloadingFile'));
                          }
                        } else {
                          alert(t('noFileAvailable'));
                        }
                      }}
                      className="p-4 rounded-full bg-app-gold text-app-purple shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
                      title={t('download')}
                    >
                      <Download size={24} />
                    </button>
                  </div>
                </div>
                <h3 className={`text-lg font-bold mb-2 line-clamp-2 group-hover:text-app-gold transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-app-purple'
                }`}>{displayTitle}</h3>
                <p className={`text-xs mt-auto ${theme === 'dark' ? 'text-slate-500' : 'text-app-gray'}`}>
                  {t('added')} {new Date(book.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
