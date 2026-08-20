"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const scoutImg = '/images/fractional_scout_specialist_1783204112243.jpg';
const sdrImg = '/images/fractional_sdr_manager_1782761308492.jpg';
const closerImg = '/images/fractional_closer_1782761418911.jpg';

const STATES = [
  {
    id: 1,
    key: 'scout',
    link: '/fractional-scout',
    image: scoutImg,
    stepName: "1.\nFractional Scout",
    badge: "Fractional Scout",
    title: "Lead Qualification",
    situation: "Your CRM is cluttered with unqualified leads and spam. You waste hours chasing bad prospects instead of talking to ready buyers.",
    whenToBuy: "You need an expert to sift through signups, filter out the noise, and hand over only verified, highly-qualified leads ready for a real conversation.",
    whenNotToBuy: "Do not buy if you lack inbound volume. A scout cannot qualify leads if there is no traffic entering your funnel in the first place."
  },
  {
    id: 2,
    key: 'sdr',
    link: '/fractional-sdr',
    image: sdrImg,
    stepName: "2.\nFractional SDR",
    badge: "Fractional SDR",
    title: "Outbound Prospecting",
    situation: "Your product is solid and inbound is steady, but you need proactive outreach to tap into cold audiences and fill the calendar predictably.",
    whenToBuy: "You are ready to target specific accounts. An SDR will run targeted cold campaigns, handle objections, and book high-intent meetings on your calendar.",
    whenNotToBuy: "Do not buy if you have not validated your market. Cold outreach with an unproven offer will only burn through your potential customer base."
  },
  {
    id: 3,
    key: 'closer',
    link: '/fractional-closer',
    image: closerImg,
    stepName: "3.\nFractional Closer",
    badge: "Fractional Closer",
    title: "Deal Closing",
    situation: "Your calendar is packed with qualified meetings, leaving you no time to run the business. You are stuck as a full-time sales rep.",
    whenToBuy: "You have a repeatable sales script and proven conversion rate. A closer will take over your demos, allowing you to step back from selling.",
    whenNotToBuy: "Do not buy if you have not closed deals yourself. A closer scales what works, they cannot invent a working sales motion from scratch."
  }
];

export function StartSlowScaleSmart() {
  const [activeState, setActiveState] = useState(0);
  const router = useRouter();

  return (
    <section className="py-16 md:py-24 bg-background-primary text-text-primary border-b border-border-primary transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight text-text-primary transition-theme">
            Start Slow
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed transition-theme">
            You don&apos;t need a massive sales department on day one. Fix your immediate bottleneck today, preserve your cash flow, and add new modules only when your pipeline is ready.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Interactive Workspace */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            
            {/* Navigation Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 mb-2 md:mb-6">
              {STATES.map((state, idx) => (
                <React.Fragment key={state.id}>
                  <button
                    onClick={() => setActiveState(idx)}
                    onMouseEnter={() => setActiveState(idx)}
                    className={`flex-1 min-w-[100px] py-2.5 sm:py-3 px-2 md:px-3 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold whitespace-pre-line transition-all duration-300 border ${
                      activeState === idx 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] scale-100 sm:scale-[1.05] z-10' 
                        : 'bg-background-secondary text-text-secondary border-border-primary hover:border-blue-400 hover:bg-background-surface'
                    }`}
                  >
                    {state.stepName}
                  </button>
                  {idx < STATES.length - 1 && (
                    <div className="hidden sm:block flex-shrink-0 text-border-primary transition-theme">
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Content Box */}
            <div className="bg-background-secondary rounded-3xl border border-border-primary p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden flex-1 min-h-[450px] md:min-h-[500px] grid transition-theme">
              <AnimatePresence>
                <motion.div
                  key={activeState}
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col h-full col-start-1 row-start-1 z-10"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
                    <div className="text-2xl sm:text-3xl font-extrabold text-text-primary pointer-events-none transition-theme">
                      {STATES[activeState].badge}
                    </div>
                    <button
                      onClick={() => window.location.href = 'https://usclosers-wizard.vercel.app/en'}
                      className="shrink-0 w-full sm:w-auto flex items-center justify-center px-5 py-2.5 rounded-lg text-[11px] font-bold tracking-wide uppercase transition-all duration-300 bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg pointer-events-auto"
                    >
                      Order Now
                    </button>
                  </div>

                  <div className="flex flex-col gap-6 md:gap-8">
                    {/* When to buy */}
                    <div>
                      <div className="flex items-center gap-3 mb-3 md:mb-4">
                        <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 shrink-0">
                          <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
                        </div>
                        <h4 className="text-[11px] md:text-xs font-bold tracking-widest uppercase text-text-primary transition-theme">
                          When To Buy
                        </h4>
                      </div>
                      <p className="text-sm sm:text-base md:text-[17px] text-text-secondary leading-relaxed font-medium transition-theme">
                        {STATES[activeState].whenToBuy}
                      </p>
                    </div>

                    <div className="w-full h-px bg-border-primary transition-theme" />

                    {/* When NOT to buy */}
                    <div>
                      <div className="flex items-center gap-3 mb-3 md:mb-4">
                        <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-background-surface text-text-secondary border border-border-primary transition-theme shrink-0">
                          <X className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
                        </div>
                        <h4 className="text-[11px] md:text-xs font-bold tracking-widest uppercase text-text-secondary transition-theme">
                          When Not To Buy
                        </h4>
                      </div>
                      <p className="text-sm sm:text-base md:text-[17px] text-text-secondary leading-relaxed font-medium transition-theme">
                        {STATES[activeState].whenNotToBuy}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Visual Asset */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] md:min-h-[500px] lg:h-auto rounded-3xl overflow-hidden border border-border-primary shadow-xl group transition-theme">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10 pointer-events-none" />
             
            <AnimatePresence>
              <motion.div
                key={activeState}
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src={STATES[activeState].image}
                  alt={STATES[activeState].badge}
                  fill
                  quality={65}
                  priority={activeState === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Bottom Floating Info Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 z-20 grid">
              <AnimatePresence>
                <motion.div
                  key={activeState}
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-background-secondary rounded-2xl p-4 sm:p-6 border border-border-primary shadow-lg col-start-1 row-start-1"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-auto">
                    <div className="flex-1">
                      <div className="text-text-primary text-xl sm:text-2xl font-extrabold transition-theme">
                        {STATES[activeState].title}
                      </div>
                      <div className="text-text-secondary mt-1 sm:mt-2 text-xs sm:text-sm font-medium transition-theme">
                        {STATES[activeState].situation}
                      </div>
                    </div>
                    <button
                      onClick={() => window.location.href = 'https://usclosers-wizard.vercel.app/en'}
                      className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0 flex items-center justify-center px-5 py-2.5 rounded-lg text-[11px] font-bold tracking-wide uppercase transition-all duration-300 bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg"
                    >
                      Order Now
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}