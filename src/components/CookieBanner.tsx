"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem('usclosers_cookie_consent');
    if (consent) return;

    // Show banner only after the user starts scrolling
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup listener on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('usclosers_cookie_consent', 'accepted_all');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('usclosers_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4 md:p-6 pointer-events-none">
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto bg-background-secondary/95 backdrop-blur-xl border border-border-primary shadow-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 pointer-events-auto transition-theme relative"
          >
            {/* Close Icon */}
            <button 
              onClick={handleDecline}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-text-secondary hover:text-text-primary bg-background-surface hover:bg-border-primary rounded-full p-2 transition-theme"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-8">
              {/* Icon & Text */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1 pr-6 sm:pr-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-theme">
                  <Cookie className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-1.5 sm:mb-2 transition-theme">
                    We value your privacy
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed transition-theme">
                    We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
                <Link 
                  href="/cookie-settings"
                  onClick={() => setIsVisible(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-text-secondary hover:text-text-primary bg-background-surface hover:bg-border-primary rounded-xl transition-theme text-center"
                >
                  Manage Preferences
                </Link>
                <div className="flex w-full sm:w-auto gap-2.5 sm:gap-3">
                  <button
                    onClick={handleDecline}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-text-primary bg-background-surface border border-border-primary hover:border-text-secondary rounded-xl transition-theme"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 sm:flex-none px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};