"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Shield, RefreshCw, Pointer, Zap } from 'lucide-react';

const imageO8 = '/images/old_rooms/8.png';
const imageO3 = '/images/old_rooms/3.png';
const imageO16 = '/images/old_rooms/16.png';

const avatarSDR = '/images/sales_avatar_1_1783204345925.jpg';
const avatarScout = '/images/sales_avatar_1_1783204345925.jpg';
const avatarOps = '/images/sales_avatar_1_1783204345925.jpg';
const avatarCloser = '/images/sales_avatar_1_1783204345925.jpg';
const avatarLead = '/images/sales_avatar_1_1783204345925.jpg';
const avatarPartner = '/images/sales_avatar_1_1783204345925.jpg';
const avatarFounder = '/images/sales_avatar_1_1783204345925.jpg'; 
const avatarDigital = '/images/sales_avatar_1_1783204345925.jpg'; 
const avatarCopilot = '/images/sales_avatar_1_1783204345925.jpg'; 

const BUNDLES = [
  {
    id: 'bundle-1',
    title: "Launch Sales from Scratch",
    subtitle: "Build a high-performing outbound engine from zero.",
    description: "Bypass months of grueling setup. We deploy targeted multi-channel cadences, source verified leads, and manage your entire top-of-funnel workflow to generate consistent, high-quality pipeline and fill your calendar with qualified meetings.",
    icon: Layers,
    image: imageO8,
    services: [
      { title: "Outbound Prospecting", description: "Targeted outreach to ideal customer profiles using multi-channel cadences.", avatar: avatarSDR, position: 'top-[18%] left-[2%] sm:left-[6%]' },
      { title: "Lead Qualification", description: "Vetting inbound and outbound leads to ensure they meet your strict criteria.", avatar: avatarScout, position: 'top-[45%] right-[2%] sm:right-[6%]' },
      { title: "Sales Ops & Strategy", description: "Data management, tooling setup, and strategic workflow optimization.", avatar: avatarOps, position: 'bottom-[20%] left-[10%] sm:left-[15%]' }
    ],
    valueHighlight: "48h to live dials • 3,000+ messages/wk • Full calendar",
  },
  {
    id: 'bundle-2',
    title: "Win Large-Scale Corporate Deals",
    subtitle: "Target key decision-makers and navigate complex procurement.",
    description: "Accelerate your enterprise sales cycle. Our specialists handle technical validations, security compliance (InfoSec), and custom RFP responses to ensure you secure high-value corporate contracts without administrative delays.",
    icon: Shield,
    image: imageO3,
    services: [
      { title: "Enterprise ABM Hunter", description: "Precision targeting of high-value accounts and key decision-makers.", avatar: avatarCloser, position: 'top-[15%] left-[2%] sm:left-[8%]' },
      { title: "Solution Engineer", description: "Technical validation and custom product demonstrations for complex requirements.", avatar: avatarDigital, position: 'top-[28%] right-[2%] sm:right-[6%]' },
      { title: "Procurement & Security", description: "Navigating complex compliance, InfoSec, and legal approvals smoothly.", avatar: avatarPartner, position: 'bottom-[35%] left-[5%] sm:left-[10%]' },
      { title: "RFP & Bid Response", description: "Crafting winning proposals for competitive corporate tenders.", avatar: avatarLead, position: 'bottom-[12%] right-[8%] sm:right-[15%]' }
    ],
    valueHighlight: "40% faster cycles • 100% IT compliance • $50k+ contracts",
  },
  {
    id: 'bundle-3',
    title: "Extract Revenue from Existing Data",
    subtitle: "Monetize your existing CRM with zero ad spend.",
    description: "Turn dormant leads into active pipeline. We revive stalled opportunities, upsell current accounts, and convert product-led free users into paying enterprise clients using data-driven re-engagement strategies.",
    icon: RefreshCw,
    image: imageO16,
    services: [
      { title: "Product-Led Converter", description: "Turning active free users into paying enterprise customers.", avatar: avatarFounder, position: 'top-[18%] left-[2%] sm:left-[6%]' },
      { title: "Pipeline Reviver", description: "Re-engaging stalled or lost opportunities hiding in your CRM.", avatar: avatarCopilot, position: 'top-[45%] right-[2%] sm:right-[6%]' },
      { title: "Account Management", description: "Expanding revenue and upselling within existing customer accounts.", avatar: avatarSDR, position: 'bottom-[20%] left-[10%] sm:left-[15%]' }
    ],
    valueHighlight: "$0 ad spend • 100% CRM re-engagement • Immediate ROI",
  }
];

export function ScaleInstantly() {
  const [activeBundleId, setActiveBundleId] = useState<string>('bundle-1');
  const [expandedService, setExpandedService] = useState<string | null>(null);
  
  const activeBundle = BUNDLES.find(b => b.id === activeBundleId) || BUNDLES[0];

  useEffect(() => {
    setExpandedService(null);
  }, [activeBundleId]);

  return (
    <section className="py-16 md:py-24 bg-background-secondary overflow-hidden border-t border-b border-border-primary transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-4 md:mb-6 transition-theme">Scale Instantly</h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed transition-theme">
            Configure specialized sales modules to build your ideal sales department. Our platform automatically handles all data, communication, and workflows.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-10 md:gap-12 items-center">
          {/* LEFT COLUMN: Controls & Info */}
          <div className="w-full xl:w-[45%] flex flex-col gap-4 md:gap-5 relative z-20">
            {BUNDLES.map((bundle) => {
              const isActive = activeBundleId === bundle.id;
              
              return (
                <div
                  key={bundle.id}
                  className={`flex flex-col rounded-2xl border transition-all overflow-hidden ${
                    isActive
                      ? 'bg-background-primary border-blue-500 shadow-xl dark:shadow-[0_10px_40px_rgba(59,130,246,0.15)]'
                      : 'bg-background-primary border-border-primary hover:border-blue-300 hover:bg-background-surface'
                  }`}
                >
                  <button
                    onClick={() => setActiveBundleId(bundle.id)}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 text-left w-full group"
                  >
                    <div className={`p-2 sm:p-2.5 rounded-xl transition-colors shrink-0 ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-background-surface text-text-secondary'}`}>
                      <bundle.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2 sm:pr-4">
                      <div className={`font-bold text-sm sm:text-base mb-0.5 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-text-primary'}`}>
                        {bundle.title}
                      </div>
                      <div className={`text-[11px] sm:text-xs transition-colors ${isActive ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                        {bundle.subtitle}
                      </div>
                    </div>
                    <div 
                      className={`shrink-0 ml-auto flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-wide uppercase transition-all duration-300 ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:bg-blue-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]' 
                          : 'bg-background-surface text-text-secondary group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation(); 
                        window.location.href = '/setup';
                      }}
                    >
                      Order
                    </div>
                  </button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-3 sm:px-4 pb-3 sm:pb-4 overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-5 leading-relaxed">
                          {bundle.description}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 bg-blue-50/50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-theme">
                          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          <div className="text-[11px] sm:text-[13px] font-bold text-text-primary leading-tight transition-theme">
                            {bundle.valueHighlight}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Image Composition & Interactive Cards */}
          <div className="w-full xl:w-[55%] relative flex items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl opacity-50 transition-theme" />
            
            <div className="relative w-full max-w-3xl xl:max-w-4xl mx-auto h-[350px] sm:h-[450px] lg:h-[520px] xl:h-[580px]">
              
              <AnimatePresence>
                <motion.div
                  key={activeBundle.id}
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="absolute inset-0 z-10 flex items-center justify-center"
                >
                  <Image
                    src={activeBundle.image}
                    alt={activeBundle.title}
                    fill
                    quality={75}
                    priority={activeBundle.id === 'bundle-1'}
                    sizes="(max-width: 1280px) 100vw, 60vw"
                    className="object-contain drop-shadow-xl dark:drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Floating Service Cards */}
              <div className="absolute inset-0 z-30 pointer-events-none">
                <AnimatePresence>
                  {activeBundle.services.map((service, idx) => {
                    const isExpanded = expandedService === service.title;
                    return (
                      <motion.div
                        key={`${activeBundle.id}-${idx}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className={`absolute ${service.position} pointer-events-auto origin-center scale-90 sm:scale-100 ${isExpanded ? 'z-50' : 'z-40'}`}
                      >
                        <div
                          onClick={() => setExpandedService(isExpanded ? null : service.title)}
                          // Убраны layout-пропсы, теперь ширина меняется быстро и гладко через transition-all
                          className={`group cursor-pointer bg-background-primary border transition-all duration-200 rounded-2xl overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${
                            isExpanded 
                              ? 'border-blue-500 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.4)] w-[260px] sm:w-[280px]' 
                              : 'border-border-primary hover:shadow-xl hover:border-blue-400 w-max max-w-[240px] pr-3 sm:pr-4'
                          }`}
                        >
                          <div className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-background-primary shadow-sm shrink-0 relative transition-theme">
                              <Image 
                                src={service.avatar} 
                                alt={service.title} 
                                fill 
                                quality={75}
                                sizes="(max-width: 640px) 32px, 40px"
                                className="object-cover" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-xs sm:text-sm font-bold leading-tight transition-colors duration-200 ${isExpanded ? 'text-blue-600 dark:text-blue-400 whitespace-normal' : 'text-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate'}`}>
                                {service.title}
                              </h4>
                              {!isExpanded && (
                                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-0.5 sm:mt-1">
                                  <Pointer className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Click
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className="px-3 sm:px-4 pb-3 sm:pb-4 text-[11px] sm:text-xs font-medium text-text-secondary leading-relaxed border-t border-border-primary pt-2 sm:pt-3 transition-theme"
                              >
                                {service.description}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}