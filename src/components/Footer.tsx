"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Linkedin, Twitter, Github, Youtube, ArrowRight, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { USClosersLogo } from './USClosersLogo';
import { motion, AnimatePresence } from 'framer-motion';

export function Footer() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  // Subscribe Form States
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const email = emailInput.value;
    
    const freeDomains = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@icloud.com', '@mail.ru', '@yandex.ru'];
    const isFreeDomain = freeDomains.some(domain => email.toLowerCase().endsWith(domain));

    if (isFreeDomain) {
      setSubscribeStatus('error');
      setSubscribeMessage('Please use a corporate/business email address.');
      return;
    }
    
    setSubscribeStatus('loading');
    setSubscribeMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setSubscribeStatus('success');
        setSubscribeMessage('Subscribed successfully!');
        form.reset();
      } else {
        const data = await res.json();
        setSubscribeStatus('error');
        setSubscribeMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setSubscribeStatus('error');
      setSubscribeMessage('Network error. Please try again later.');
    }
  };

  const MobileAccordion = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => {
    const isOpen = openAccordion === id;
    
    return (
      <div className="border-b border-border-primary lg:border-none lg:block transition-theme">
        <button 
          onClick={() => toggleAccordion(id)}
          className="w-full py-4 flex items-center justify-between lg:hidden text-text-primary font-bold transition-theme"
          aria-expanded={isOpen}
        >
          {title}
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <h4 className="hidden lg:block text-text-primary font-bold mb-6 text-sm transition-theme">{title}</h4>
        
        <AnimatePresence initial={false}>
          {(isOpen || isDesktop) && (
            <motion.div
              initial={isDesktop ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={isDesktop ? { opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:!h-auto lg:!opacity-100 overflow-hidden"
              style={{ contentVisibility: !isDesktop && !isOpen ? 'hidden' : 'auto' }}
            >
              <div className="pb-4 lg:pb-0">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <footer className="bg-background-primary text-text-secondary border-t border-border-primary transition-theme">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1.5fr_1.5fr] gap-6 lg:gap-12 mb-12 lg:mb-16">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="flex flex-col space-y-5 lg:space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <USClosersLogo className="w-6 h-6 lg:w-7 lg:h-7 drop-shadow-md transition-theme" />
              <span className="text-xl lg:text-2xl font-bold tracking-tight text-text-primary transition-theme">USClosers</span>
            </Link>
            
            <p className="text-sm leading-relaxed max-w-sm transition-theme">
              Complete cloud sales ecosystem. Infrastructure, automated data operations, global fintech rails, and pre-vetted fractional talent deployed in hours.
            </p>

            <form onSubmit={handleSubscribe} className="relative w-full max-w-xs sm:max-w-sm mt-2">
              <input 
                type="email" 
                name="email"
                placeholder="Enter your business email"
                required
                disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                // text-base on mobile prevents iOS Safari auto-zoom, sm:text-sm restores size on desktop
                className="w-full bg-background-secondary border border-border-primary text-text-primary rounded-lg py-3 lg:py-2.5 pl-4 pr-12 text-base sm:text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-theme"
              />
              <button 
                type="submit"
                disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 lg:p-1.5 text-text-secondary hover:text-blue-500 disabled:opacity-50 disabled:hover:text-text-secondary transition-colors"
              >
                {subscribeStatus === 'loading' ? (
                  <div className="w-4 h-4 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
                ) : subscribeStatus === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 lg:w-4 lg:h-4 text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <ArrowRight className="w-5 h-5 lg:w-4 lg:h-4" />
                )}
              </button>
            </form>

            <AnimatePresence>
              {subscribeMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`text-xs font-medium flex items-center gap-1.5 -mt-3 lg:-mt-4 transition-theme ${subscribeStatus === 'success' ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}
                >
                  {subscribeStatus === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {subscribeMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 pt-2">
              {/* Social Icons Stubs */}
              <div className="text-text-secondary/50 cursor-default transition-theme hover:text-text-primary">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="text-text-secondary/50 cursor-default transition-theme hover:text-text-primary">
                <Twitter className="w-5 h-5" />
              </div>
              <div className="text-text-secondary/50 cursor-default transition-theme hover:text-text-primary">
                <Github className="w-5 h-5" />
              </div>
              <div className="text-text-secondary/50 cursor-default transition-theme hover:text-text-primary">
                <Youtube className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Column 2: SalesOps Cloud */}
          <MobileAccordion id="salesops" title="SalesOps Cloud">
            <nav className="flex flex-col space-y-3 text-sm">
              <Link href="/recruiting-screening" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Recruiting & Screening</Link>
              <Link href="/preconfigured-crm" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Preconfigured CRM</Link>
              <Link href="/call-recording-qa" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Call Recording & QA</Link>
              <Link href="/global-payroll" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Global Payroll</Link>
              <Link href="/data-scraping" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Data Scraping</Link>
              <Link href="/predictable-pipeline" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Predictable Pipeline</Link>
            </nav>
          </MobileAccordion>

          {/* Column 3: Talent & Growth */}
          <MobileAccordion id="solutions" title="Talent & Growth">
            <nav className="flex flex-col space-y-3 text-sm">
              <Link href="/fractional-scout" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Fractional Scout</Link>
              <Link href="/fractional-sdr" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Fractional SDR</Link>
              <Link href="/fractional-closer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Fractional Closer</Link>
              <Link href="/fractional-team-lead" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Fractional Team Lead</Link>
              <Link href="/ai-digital-closer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Digital Closer</Link>
            </nav>
          </MobileAccordion>

          {/* Column 4: Company & Trust (Stubs) */}
          <MobileAccordion id="company" title="Company & Trust">
            <nav className="flex flex-col space-y-3 text-sm">
              <span className="text-text-secondary/70 cursor-default transition-theme">Case Studies</span>
              <span className="text-text-secondary/70 cursor-default transition-theme">About Us</span>
              <span className="text-text-secondary/70 cursor-default transition-theme">Careers</span>
              <span className="text-text-secondary/70 cursor-default transition-theme">Contact Support</span>
            </nav>
          </MobileAccordion>

        </div>

        {/* Sub-footer */}
        <div className="pt-6 lg:pt-8 border-t border-border-primary flex flex-col md:flex-row items-center justify-between gap-6 transition-theme">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-xs text-text-secondary text-center md:text-left transition-theme">
            <span>© {new Date().getFullYear()} USClosers Inc. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-text-primary transition-colors">Terms of Service</Link>
              <Link href="/cookie-settings" className="hover:text-text-primary transition-colors">Cookie Settings</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
          </div>
        </div>

      </div>
    </footer>
  );
}