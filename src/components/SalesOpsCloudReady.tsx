"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const imgEmptyRoom = '/images/old_rooms/19.png';

// Обновленный маппинг картинок согласно визуальным метафорам
const ROOM_IMAGES: Record<string, string> = {
  "Sales Team Chat": '/images/old_rooms/6.png',
  "Preconfigured CRM": '/images/old_rooms/11.png',
  "Call Recording & QA": '/images/old_rooms/12.png',
  "Sales Operations": '/images/old_rooms/8.png',
  "SalesOps Dashboards": '/images/old_rooms/7.png',
  "Global Payroll": '/images/old_rooms/16.png',
  "Recruiting & Screening": '/images/old_rooms/10.png',
  "Onboarding & Training": '/images/old_rooms/3.png',
};

const FEATURES = [
  { 
    id: 'chat',
    customIcon: '/images/salesopscloudready/icon_chat.png', 
    title: "Sales Team Chat", 
    desc: "Secure, centralized messaging workspace for your team.",
    whatItIs: "A secure, centralized messaging workspace built specifically for your sales team.",
    theResult: "See exactly what your team is doing and how they collaborate, without ever chasing them for updates.",
  },
  { 
    id: 'crm',
    customIcon: '/images/salesopscloudready/icon_crm.png', 
    title: "Preconfigured CRM", 
    desc: "Ready-to-go database with automated lead routing.",
    whatItIs: "A ready-to-go database with strict data-entry guardrails and automated lead routing.",
    theResult: "Zero lost leads, zero duplicates, and a 100% accurate sales pipeline you can actually trust.",
  },
  { 
    id: 'qa',
    customIcon: '/images/salesopscloudready/icon_qa.png', 
    title: "Call Recording & QA", 
    desc: "Auto-record calls and use AI to transcribe and score.",
    whatItIs: "An engine that auto-records calls and uses AI to transcribe, score, and flag pitch errors.",
    theResult: "Audit a full week of sales calls in 15 minutes and fix rookie mistakes before they cost you deals.",
  },
  { 
    id: 'ops',
    customIcon: '/images/salesopscloudready/icon_ops.png', 
    title: "Sales Operations", 
    desc: "Mandatory, step-by-step rulebook for your sales engine.",
    whatItIs: "A mandatory, step-by-step rulebook for everything from cold calling to CRM data entry.",
    theResult: "Your revenue machine keeps running perfectly, even if top reps leave or new ones join tomorrow.",
  },
  { 
    id: 'dashboards',
    customIcon: '/images/salesopscloudready/icon_dash.png', 
    title: "SalesOps Dashboards", 
    desc: "Live, automated tracking of daily activities and revenue.",
    whatItIs: "Live, automated tracking of daily activities, conversion rates, and revenue output.",
    theResult: "Stop waiting for monthly reports—manage your team's performance based on real-time numbers, not vibes.",
  },
  { 
    id: 'payroll',
    customIcon: '/images/salesopscloudready/icon_payroll.png', 
    title: "Global Payroll", 
    desc: "Compliance for international taxes and commissions.",
    whatItIs: "Compliance software that calculates international taxes and commissions for remote reps.",
    theResult: "Legally pay your global team in 150+ countries with a single invoice and zero accounting headaches.",
  },
  { 
    id: 'recruiting',
    customIcon: '/images/salesopscloudready/icon_recruiting.png', 
    title: "Recruiting & Screening", 
    desc: "Auto-sources and tests candidates.",
    whatItIs: "An automated pipeline that sources, background-checks, and tests sales candidates for you.",
    theResult: "Skip the hiring grind and only interview elite, pre-vetted reps who are ready to sell on Day\u00A01.",
  },
  { 
    id: 'training',
    customIcon: '/images/salesopscloudready/icon_training.png', 
    title: "Onboarding & Training", 
    desc: "Built-in learning hub with pitch scorecards and mock calls.",
    whatItIs: "A built-in learning hub with pitch scorecards, mock calls, and continuous skill certifications.",
    theResult: "Cut new-hire ramp-up time in half and protect your active pipeline from costly beginner mistakes.",
  }
];

export function SalesOpsCloudReady() {
  const [activeFeatureTitle, setActiveFeatureTitle] = useState<string | null>(null);

  const leftFeatures = FEATURES.slice(0, 4);
  const rightFeatures = FEATURES.slice(4, 8);

  const currentRoomImage = activeFeatureTitle ? ROOM_IMAGES[activeFeatureTitle] : imgEmptyRoom;

  return (
    <section className="py-16 md:py-24 bg-background-primary relative z-30 border-t border-border-primary transition-theme">
      
      {/* Hidden preloader */}
      <div className="hidden aria-hidden">
        <Image src={imgEmptyRoom} alt="" width={10} height={10} priority />
        {Object.values(ROOM_IMAGES).map((src) => (
          <Image key={src} src={src} alt="" width={10} height={10} priority />
        ))}
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-4 md:mb-6 transition-theme"
          >
            SalesOps Cloud <span className="text-blue-600 dark:text-blue-400">Ready</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed transition-theme px-4"
          >
            Skip 6 months of setup. Deploy a fully configured, enterprise-grade sales engine on day one.
          </motion.p>
        </div>

        {/* 3-Column Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(300px,350px)_1fr_minmax(300px,350px)] gap-6 xl:gap-8 items-center relative">
          
          {/* Left Column (4 items) */}
          <div className="flex flex-col gap-3 sm:gap-4 w-full order-2 lg:order-1 relative z-40">
            {leftFeatures.map((feature, idx) => (
              <FeatureCard 
                key={feature.id} 
                feature={feature} 
                position="left"
                isActive={activeFeatureTitle === feature.title} 
                onClick={() => setActiveFeatureTitle(activeFeatureTitle === feature.title ? null : feature.title)}
                delay={idx * 0.05}
              />
            ))}
          </div>

          {/* Center Column: Interactive 3D Room Only */}
          <div className="w-full order-1 lg:order-2 flex flex-col justify-center mb-6 lg:mb-0 relative z-10">
            <div className="relative w-full h-[280px] sm:h-[400px] lg:h-[450px] xl:h-[500px] max-w-[750px] mx-auto">
              <AnimatePresence>
                <motion.div
                  key={currentRoomImage}
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center"
                >
                  <Image 
                    src={currentRoomImage} 
                    alt="SalesOps Control Room" 
                    fill
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-contain object-center drop-shadow-xl dark:drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column (4 items) */}
          <div className="flex flex-col gap-3 sm:gap-4 w-full order-3 lg:order-3 relative z-40">
            {rightFeatures.map((feature, idx) => (
              <FeatureCard 
                key={feature.id} 
                feature={feature} 
                position="right"
                isActive={activeFeatureTitle === feature.title} 
                onClick={() => setActiveFeatureTitle(activeFeatureTitle === feature.title ? null : feature.title)}
                delay={idx * 0.05}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// Static Card Component with Built-in Popover
function FeatureCard({ 
  feature, 
  isActive, 
  onClick, 
  delay, 
  position
}: { 
  feature: any, 
  isActive: boolean, 
  onClick: () => void, 
  delay: number, 
  position: 'left' | 'right'
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.2 }}
      className={`relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all duration-150 cursor-pointer min-h-[5rem] sm:min-h-[6rem] overflow-visible ${
        isActive
          ? 'bg-background-primary border-blue-500 shadow-lg dark:shadow-[0_10px_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20 z-50'
          : 'bg-background-secondary border-border-primary hover:border-blue-300 hover:bg-background-surface shadow-sm z-10'
      }`}
      onClick={onClick}
    >
      {/* Floating 3D Icon */}
      <div className={`w-10 h-10 sm:w-14 sm:h-14 shrink-0 relative flex items-center justify-center transition-transform duration-150 ${isActive ? 'scale-110 drop-shadow-[0_4px_8px_rgba(59,130,246,0.3)]' : 'drop-shadow-sm group-hover:scale-105'}`}>
        <Image 
          src={feature.customIcon} 
          alt={feature.title} 
          fill
          quality={75}
          sizes="(max-width: 640px) 40px, 56px"
          className="object-contain" 
        />
      </div>
      
      {/* Text Info */}
      <div className={`flex-1 min-w-0 transition-all duration-150 ${isActive ? 'pr-[65px] sm:pr-[80px]' : 'pr-1'}`}>
        <h3 className={`font-bold text-sm sm:text-[15px] mb-0.5 leading-snug whitespace-nowrap transition-colors duration-150 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-text-primary'}`}>
          {feature.title}
        </h3>
        <p className="text-text-secondary text-[10px] sm:text-[11px] leading-snug transition-theme duration-150 line-clamp-2">
          {feature.desc}
        </p>
      </div>

      {/* Dynamic Right Side: ONLY shows Order Now button when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="btn-order"
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20"
          >
            <Link 
              href="/setup" 
              onClick={(e) => e.stopPropagation()} 
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[9px] sm:text-[10px] uppercase tracking-wide transition-all shadow-md shadow-blue-900/20 active:scale-95 whitespace-nowrap inline-block"
            >
              ORDER
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solid Popover / Tooltip */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="popover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-[100] w-[260px] sm:w-[300px] p-4 sm:p-5 bg-background-primary border border-border-primary rounded-xl sm:rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.8)] cursor-default
              max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:top-[calc(100%+0.5rem)]
              ${position === 'left' ? 'lg:left-[calc(100%+1.25rem)]' : 'lg:right-[calc(100%+1.25rem)]'}
              lg:top-1/2 lg:-translate-y-1/2
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="font-extrabold text-text-primary text-sm sm:text-base mb-2 sm:mb-3">{feature.title}</h5>
            <div className="space-y-2.5 sm:space-y-3 text-[11px] sm:text-xs">
              <p className="text-text-secondary leading-relaxed transition-theme">
                <strong className="text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[9px] block mb-0.5">What it is</strong>
                {feature.whatItIs}
              </p>
              <p className="text-text-primary font-medium leading-relaxed transition-theme">
                <strong className="text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-[9px] block mb-0.5">Result</strong>
                {feature.theResult}
              </p>
            </div>
            
            {/* Directional Arrow (Desktop only) */}
            <div className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-background-primary border-border-primary transform rotate-45
              ${position === 'left' ? '-left-[6.5px] border-b border-l' : '-right-[6.5px] border-t border-r'}
            `} />
            
            {/* Mobile Arrow */}
            <div className="lg:hidden absolute -top-[6.5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-background-primary border-border-primary transform rotate-45 border-t border-l" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}