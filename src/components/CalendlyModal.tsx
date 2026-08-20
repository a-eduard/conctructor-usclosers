"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendlyContextType {
  openCalendly: (url?: string) => void;
  closeCalendly: () => void;
}

const CalendlyContext = createContext<CalendlyContextType | undefined>(undefined);

export function useCalendly() {
  const context = useContext(CalendlyContext);
  if (!context) {
    throw new Error('useCalendly must be used within a CalendlyProvider');
  }
  return context;
}

export function CalendlyProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState('https://calendly.com/team-usclosers/30min');
  const [isLoading, setIsLoading] = useState(true);

  const openCalendly = (url?: string) => {
    if (url) setCalendlyUrl(url);
    setIsLoading(true); // Reset loading state when opening
    setIsOpen(true);
  };

  const closeCalendly = () => {
    setIsOpen(false);
    // Optional: reset loading after a delay so it's ready for next time
    setTimeout(() => setIsLoading(true), 300);
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Allow specific domains or check event types if necessary
      if (e.data && e.data.event && e.data.event === 'calendly.event_scheduled') {
        // Close modal after a short delay so user can see confirmation
        setTimeout(() => {
          closeCalendly();
        }, 1500);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <CalendlyContext.Provider value={{ openCalendly, closeCalendly }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 bg-background-primary/80 dark:bg-slate-950/80 backdrop-blur-md"
              onClick={closeCalendly}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl h-[100dvh] sm:h-[750px] sm:max-h-[90vh] bg-background-primary rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border-0 sm:border border-border-primary"
            >
              <div className="flex items-center justify-end p-4 absolute top-0 right-0 w-full z-20 pointer-events-none">
                <button
                  onClick={closeCalendly}
                  className="p-2.5 hover:bg-background-surface rounded-full transition-colors bg-background-primary/80 backdrop-blur-md shadow-sm pointer-events-auto border border-border-primary group"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" />
                </button>
              </div>
              
              <div className="flex-1 w-full h-full relative flex items-center justify-center bg-background-primary pt-12 sm:pt-0">
                {/* Loading Spinner */}
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                    <span className="text-sm font-medium text-text-secondary animate-pulse">Loading calendar...</span>
                  </div>
                )}
                
                {/* Calendly Iframe */}
                <iframe
                  src={`${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className={`w-full h-full max-w-[1060px] relative z-10 transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  title="Calendly Scheduling Page"
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CalendlyContext.Provider>
  );
}