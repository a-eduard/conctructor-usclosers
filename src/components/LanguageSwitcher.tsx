"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'en', label: 'EN', flagCode: 'us' },
  { code: 'fr', label: 'FR', flagCode: 'fr' },
  { code: 'es', label: 'ES', flagCode: 'es' },
  { code: 'de', label: 'DE', flagCode: 'de' },
];

export function LanguageSwitcher({ 
  isFooter = false,
  align = 'right' 
}: { 
  isFooter?: boolean;
  align?: 'left' | 'right' | 'center';
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Hardcoded to English for now, until next-intl is integrated
  const currentLang = LANGUAGES[0]; 

  const handleLanguageChange = (code: string) => {
    if (code === 'en') {
      setIsOpen(false);
    } else {
      alert(`The ${code.toUpperCase()} language version is not yet implemented.`);
      setIsOpen(false);
    }
  };

  // Determine classes based on alignment
  const alignmentClasses = 
    align === 'left' ? 'left-0 origin-top-left' : 
    align === 'center' ? 'left-1/2 -translate-x-1/2 origin-top' : 
    'right-0 origin-top-right';

  return (
    <div 
      className="relative inline-block text-left" 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 font-bold text-sm text-text-secondary hover:text-text-primary hover:bg-background-surface border border-transparent hover:border-border-primary"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={`https://flagcdn.com/${currentLang.flagCode}.svg`} 
          alt={currentLang.code} 
          className="w-4 h-4 rounded-full object-cover opacity-90 shadow-sm shrink-0"
        />
        <span className="inline tracking-wider text-[11px] transition-theme">{currentLang.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: isFooter ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isFooter ? 5 : -5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-[100] ${alignmentClasses} ${
              isFooter ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            <div className="w-32 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-border-primary overflow-hidden transition-theme p-1.5 bg-background-primary/95 backdrop-blur-md">
              <div className="flex flex-col gap-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all
                      ${currentLang.code === lang.code 
                        ? 'bg-blue-600 text-white font-bold shadow-sm' 
                        : 'text-text-secondary hover:bg-background-surface hover:text-text-primary font-medium'}
                    `}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`https://flagcdn.com/${lang.flagCode}.svg`} 
                      alt={lang.code} 
                      className="w-4 h-4 rounded-full object-cover opacity-90 shadow-sm shrink-0"
                    />
                    <span className="flex-1 font-bold tracking-wider text-[11px] uppercase transition-theme">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}