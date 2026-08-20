"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, XCircle } from 'lucide-react';
import { HeroPyramid } from '../src/components/HeroPyramid';
import { StopWastingTime } from '../src/components/StopWastingTime';
import { TimeToFirstCallWidget } from '../src/components/TimeToFirstCallWidget';
import { StartSlowScaleSmart } from '../src/components/StartSlowScaleSmart';
import { StartupValueProp } from '../src/components/StartupValueProp';
import { ReadyTalentPool } from '../src/components/ReadyTalentPool';
import { ScaleInstantly } from '../src/components/ScaleInstantly';
import { Pricing } from '../src/components/Pricing';
import { SalesOpsCloudReady } from '../src/components/SalesOpsCloudReady';
import { useCalendly } from "../src/components/CalendlyModal";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function Home() {
  const router = useRouter();
  const { openCalendly } = useCalendly();

  // Footer Form State
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'mail.ru', 'hotmail.com', 'icloud.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    if (!emailDomain || publicDomains.includes(emailDomain)) {
      setFormError('A corporate email is required to book a briefing.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'cloud_lead_submit_success', {
          event_category: 'Lead',
          event_label: 'Home Footer Form'
        });
      }
      setIsSubmitting(false);
      // Temporary external redirect
      window.location.href = 'https://usclosers-wizard.vercel.app/en';
    }, 1000);
  };

  return (
    <div className="flex flex-col font-sans bg-background-primary text-text-primary selection:bg-blue-100 selection:text-blue-900 transition-theme">
      
      {/* Block 1: Hero Section */}
      <section className="relative min-h-[100dvh] lg:min-h-[calc(100vh-80px)] flex flex-col pt-8 pb-32 sm:pt-12 sm:pb-36 overflow-hidden bg-background-secondary transition-theme">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 dark:bg-blue-500/10 blur-3xl opacity-60" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-emerald-50/50 dark:bg-emerald-500/10 blur-3xl opacity-60" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-50/50 dark:bg-indigo-500/10 blur-3xl opacity-60" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-50" />
        </div>
        
        <div className="flex-1 flex flex-col justify-center w-full">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Content */}
              <motion.div
                className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left pt-12 lg:pt-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="mb-4 sm:mb-6 px-4 py-2 rounded-full bg-text-primary border border-border-primary shadow-sm transition-theme">
                  <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-background-primary tracking-[0.2em] sm:tracking-[0.25em] uppercase whitespace-nowrap transition-theme">
                    THE FUTURE OF SALES TEAMS
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight text-text-primary mb-4 sm:mb-6 leading-[1.1] transition-theme">
                  Launch your <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Sales Instantly</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed mb-8 sm:mb-10 max-w-2xl lg:max-w-xl transition-theme">
                  Stop wasting months integrating fractured software and interviewing unverified reps. Instantly launch plug-and-play B2B sales department within <span className="text-transparent font-extrabold bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">days</span>.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => window.location.href = 'https://order.usclosers.com'}
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-base sm:text-lg transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                  >
                    Launch Your Sales <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button 
                    onClick={() => openCalendly('https://calendly.com/team-usclosers/30min')}
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-background-surface hover:bg-border-primary border border-border-primary text-text-primary rounded-xl font-semibold text-base sm:text-lg transition-all shadow-sm active:scale-[0.98]"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" /> Book a Demo
                  </button>
                </div>
              </motion.div>

              {/* Right Visual */}
              <motion.div
                className="lg:col-span-6 relative flex justify-center lg:justify-end mt-8 lg:mt-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <div className="relative w-full max-w-[540px] perspective-[2000px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl opacity-60 dark:opacity-40" />
                  <div className="relative z-10 scale-100 sm:scale-[1.1] md:scale-[1.3] lg:scale-[1.5] transform origin-top lg:origin-center xl:scale-[1.8]">
                    <HeroPyramid />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Trust Logos */}
        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 md:pb-8 z-20 bg-gradient-to-t from-background-secondary to-transparent pt-12 sm:pt-16 transition-theme">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-4 md:gap-y-6 items-center opacity-80 hover:opacity-100 transition-opacity duration-300">
            {[
              { name: 'Thales', src: '/logos/thalesgroup.webp', invertDark: false },
              { name: 'ABB', src: '/logos/abb.webp', invertDark: false },
              { name: 'Ericsson', src: '/logos/ericsson.webp', invertDark: false },
              { name: '3M', src: '/logos/3M_CORPORATION.png', invertDark: false },
              { name: 'Shell', src: '/logos/Shell_logo.svg.png', invertDark: false },
              { name: 'Desjardins', src: '/logos/desjardins.png', invertDark: false },
              { name: 'Montreal', src: '/logos/montreal.webp', invertDark: false },
              { name: 'Jerusalem', src: '/logos/Emblem_of_Jerusalem.svg.png', invertDark: false },
              { name: 'Ashdod Port', src: '/logos/ashdodport.webp', invertDark: false },
              { name: 'Mivne', src: '/logos/mivne_logo_knyot.png', invertDark: false },
              { name: 'Al Marjan Island', src: '/logos/almarjanisland.webp', invertDark: false },
              { name: 'Dan Hotels', src: '/logos/Dan.webp', invertDark: true }, // Pure black logo
              { name: 'Puma', src: '/logos/Puma_complete_logo.svg', invertDark: true }, // Pure black logo
              { name: 'Yafo', src: '/logos/Yafo.webp', invertDark: false },
              { name: 'Accureference', src: '/logos/accureference.webp', invertDark: false },
              { name: 'Letico', src: '/logos/letico.webp', invertDark: true }, // Pure black logo
              { name: 'Mori', src: '/logos/mori.webp', invertDark: true }, // Pure black logo
              { name: 'Water Authority', src: '/logos/waterauthority.webp', invertDark: false }
            ].map((company) => (
              <Image 
                key={company.name}
                src={company.src}
                alt={`${company.name} logo`}
                width={120}
                height={40}
                quality={75}
                className={`h-5 sm:h-6 md:h-8 lg:h-10 w-auto object-contain transition-all duration-300 opacity-90 hover:opacity-100 ${
                  company.invertDark ? 'dark:brightness-0 dark:invert' : ''
                }`}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fully Integrated Component Blocks */}
      <StopWastingTime />
      <TimeToFirstCallWidget />
      <StartSlowScaleSmart />
      <StartupValueProp />
      <ReadyTalentPool />
      <ScaleInstantly />
      <Pricing />
      <SalesOpsCloudReady />

      {/* Block 10: Footer Capture */}
      <section id="footer-capture" className="py-16 md:py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        </div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-3/4 h-full md:h-1/2 bg-blue-500/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 leading-[1.2] sm:leading-tight tracking-tight">
             Ready to Turn Your Product into a <br className="hidden sm:block" />
             <span className="text-blue-400">Predictable Revenue Engine</span>?
           </h2>
           <p className="text-slate-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
             Stop guessing. Book your 15-minute architecture briefing and we will map out your custom cloud sales system live on screen.
           </p>
           
           <form onSubmit={handleFooterSubmit} className="max-w-xl mx-auto bg-white/5 backdrop-blur-md p-2 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-2xl relative border border-white/10">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFormError(''); }}
                placeholder="Enter corporate email..."
                // text-base prevents iOS auto-zoom
                className="flex-grow px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/5 font-medium text-base sm:text-lg placeholder-slate-400 border border-transparent transition-all"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base sm:text-lg transition-all whitespace-nowrap disabled:opacity-70 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
              >
                {isSubmitting ? 'Verifying...' : 'Book Briefing'}
              </button>
           </form>
           
           <AnimatePresence>
             {formError && (
               <motion.div 
                 initial={{ opacity: 0, y: -10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: -10, scale: 0.95 }}
                 transition={{ duration: 0.3, ease: "easeOut" }}
                 className="mt-6 text-red-200 bg-red-900/40 backdrop-blur-sm py-3 px-6 rounded-xl inline-flex items-center gap-2 text-sm font-medium border border-red-500/30"
               >
                 <XCircle className="w-5 h-5 shrink-0" /> {formError}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </section>
      
    </div>
  );
}