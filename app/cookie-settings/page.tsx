"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Check, Shield, Info, Settings } from 'lucide-react';

export default function CookieSettingsPage() {
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    preferences: false
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to local storage and update cookie consent manager
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggle = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Cannot toggle necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background-primary transition-theme">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Header */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-3xl mb-8 transition-theme">
              <Cookie className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-6 transition-theme">
              Cookie Settings
            </h1>
            <p className="text-lg text-text-secondary transition-theme">
              Manage your cookie preferences. You can choose to accept or decline certain types of cookies below.
            </p>
          </div>

          <div className="w-full h-px bg-border-primary transition-theme" />

          {/* Settings Options */}
          <div className="space-y-6">
            
            {/* Necessary Cookies */}
            <div className="bg-background-secondary p-6 md:p-8 rounded-3xl shadow-sm border border-border-primary flex flex-col md:flex-row gap-6 items-start md:items-center transition-theme">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-emerald-500" />
                  <h3 className="text-xl font-bold text-text-primary transition-theme">Strictly Necessary Cookies</h3>
                </div>
                <p className="text-text-secondary leading-relaxed transition-theme">
                  These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.
                </p>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg transition-theme">
                <Check className="w-5 h-5" />
                Always Active
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-background-secondary p-6 md:p-8 rounded-3xl shadow-sm border border-border-primary flex flex-col md:flex-row gap-6 items-start md:items-center transition-theme">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Info className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-bold text-text-primary transition-theme">Analytics Cookies</h3>
                </div>
                <p className="text-text-secondary leading-relaxed transition-theme">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.
                </p>
              </div>
              <div>
                <button 
                  onClick={() => handleToggle('analytics')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${preferences.analytics ? 'bg-blue-600' : 'bg-border-primary'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${preferences.analytics ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="bg-background-secondary p-6 md:p-8 rounded-3xl shadow-sm border border-border-primary flex flex-col md:flex-row gap-6 items-start md:items-center transition-theme">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="w-6 h-6 text-purple-500" />
                  <h3 className="text-xl font-bold text-text-primary transition-theme">Marketing Cookies</h3>
                </div>
                <p className="text-text-secondary leading-relaxed transition-theme">
                  These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.
                </p>
              </div>
              <div>
                <button 
                  onClick={() => handleToggle('marketing')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${preferences.marketing ? 'bg-blue-600' : 'bg-border-primary'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${preferences.marketing ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center gap-4 justify-end">
            {saved && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                Preferences Saved!
              </motion.span>
            )}
            <button
              onClick={() => {
                setPreferences({ necessary: true, analytics: true, marketing: true, preferences: true });
                handleSave();
              }}
              className="px-6 py-3 rounded-xl font-bold text-text-secondary hover:text-text-primary hover:bg-background-surface transition-theme w-full sm:w-auto"
            >
              Accept All
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] w-full sm:w-auto"
            >
              Save Preferences
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}