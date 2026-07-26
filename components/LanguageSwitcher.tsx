"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

const languages = [
  { code: "EN", name: "English", flag: "https://flagcdn.com/w40/us.png" },
  { code: "ES", name: "Español", flag: "https://flagcdn.com/w40/es.png" },
  { code: "FR", name: "Français", flag: "https://flagcdn.com/w40/fr.png" },
  { code: "DE", name: "Deutsch", flag: "https://flagcdn.com/w40/de.png" }
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const activeLanguage = 
    languages.find((l) => l.code.toLowerCase() === currentLocale) || languages[0];

  const handleSelect = (langCode: string) => {
    setIsOpen(false);
    const newLocale = langCode.toLowerCase();
    
    if (newLocale === currentLocale) return;
    
    const segments = pathname.split("/");
    segments[1] = newLocale; 
    const newPath = segments.join("/");
    
    router.push(newPath);
  };

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
        <img
          src={activeLanguage.flag}
          alt={activeLanguage.code}
          className="w-4 h-4 rounded-full shadow-sm object-cover"
        />
        <span className="hidden sm:inline">
          {activeLanguage.code}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 right-0 top-full mt-2 w-28 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5"
          >
            <div className="flex flex-col gap-1">
              {languages.map((lang) => {
                const isActive = lang.code.toLowerCase() === currentLocale;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white font-bold shadow-sm dark:bg-indigo-500"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium"
                    }`}
                  >
                    <img
                      src={lang.flag}
                      alt={lang.code}
                      className="w-4 h-4 shrink-0 rounded-full object-cover"
                    />
                    <span className="flex-1 font-bold tracking-wider">
                      {lang.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}