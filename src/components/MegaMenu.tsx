"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Target, LineChart, Database, Zap, Users, ChevronRight, ArrowRight, CheckCircle2, Handshake, Globe, Network, Search, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// SalesOps PNG Images
const recruitingImg = '/images/salesops/recruiting.png';
const crmImg = '/images/salesops/crm.png';
const qaImg = '/images/salesops/qa.png';
const globalPayrollImg = '/images/salesops/global_payroll.png';
const dataScrapingImg = '/images/salesops/data_scraping.png';
const pipelineImg = '/images/salesops/predictable_pipeline.png';

// Salesforce PNG Images
const fractionalScoutImg = '/images/salesforce/fractional_scout.png';
const fractionalSdrImg = '/images/salesforce/fractional_sdr.png';
const fractionalCloserImg = '/images/salesforce/fractional_closer.png';
const fractionalTeamLeadImg = '/images/salesforce/fractional_team_lead.png';
const aiDigitalCloserImg = '/images/salesforce/ai_digital_closer.png';

export const MEGA_MENU_ITEMS = [
  // Infrastructure & Systems (SalesOps)
  {
    id: 'recruiting',
    title: 'Recruiting & Screening',
    path: '/recruiting-screening',
    icon: Search,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Automated pipeline to source, test, and hire top sales talent.',
    bullets: ['Automated Sourcing', 'Skill Screening', 'Vetted Candidates'],
    image: recruitingImg,
    ctaText: 'Start Screening',
    subtitle: 'Automated hiring pipeline',
    tags: ['Startups', 'Scaleups']
  },
  {
    id: 'preconfigured-crm',
    title: 'Preconfigured CRM',
    path: '/preconfigured-crm',
    icon: Database,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    description: 'Ready-to-go database with automated lead routing. Configure your exact sales motion.',
    bullets: ['Automated Routing', 'Pipeline Dashboards', 'Plug-and-Play'],
    image: crmImg,
    ctaText: 'Configure CRM',
    subtitle: 'Ready-to-go database',
    tags: ['Startups', 'Scaleups']
  },
  {
    id: 'call-recording-qa',
    title: 'Call Recording & QA',
    path: '/call-recording-qa',
    icon: Network,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Auto-record calls and use AI to transcribe and score.',
    bullets: ['Auto-Transcription', 'AI Scoring', 'CRM Sync'],
    image: qaImg,
    ctaText: 'Start Recording',
    subtitle: 'AI-Powered Analysis',
    tags: ['Startups', 'Scaleups']
  },
  {
    id: 'global-payroll',
    title: 'Global Payroll',
    path: '/global-payroll',
    icon: Globe,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Compliance software to simplify international taxes and cross-border commissions.',
    bullets: ['Tax Compliance', 'Commission Tracking', 'Multi-Currency'],
    image: globalPayrollImg,
    ctaText: 'Explore Payroll',
    subtitle: 'Compliance software',
    tags: ['Startups', 'Scaleups']
  },
  {
    id: 'data-scraping',
    title: 'Data Scraping',
    path: '/data-scraping',
    icon: Database,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Automated waterfall enrichment of B2B databases to fuel outbound campaigns.',
    bullets: ['Waterfall Enrichment', 'Verified Contact Data', 'Intent Signals'],
    image: dataScrapingImg,
    ctaText: 'Start Scraping',
    subtitle: 'Automated prospect data',
    tags: ['Startups', 'Scaleups']
  },
  {
    id: 'predictable',
    title: 'Predictable Pipeline',
    path: '/predictable-pipeline',
    icon: LineChart,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    description: 'Complete sales modernization: custom cold outreach, scripts, and playbooks from scratch.',
    bullets: ['Outbound Sequences', 'CRM Playbooks', 'Target Mapping'],
    image: pipelineImg,
    ctaText: 'Build a Pipeline',
    subtitle: 'B2B Funnel',
    tags: ['Startups', 'Scaleups']
  },
  // On-Demand Fractional Talent & Solutions (Salesforce)
  {
    id: 'scout',
    title: 'Fractional Scout',
    path: '/fractional-scout',
    icon: Database,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Harvests buyer contacts, enriches CRM, and runs initial lead qualification.',
    bullets: ['Open-Source Scraping', 'CRM Data Enrichment', 'Initial Qualification'],
    image: fractionalScoutImg,
    ctaText: 'Hire a Scout',
    subtitle: 'CRM Hygiene & Scraping',
    tags: ['Startups', 'Scaleups']
  },
  {
    id: 'sdr',
    title: 'Fractional SDR',
    path: '/fractional-sdr',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Hunters manually vet prospects and continuously fill your sales pipeline.',
    bullets: ['Active Outreach', 'Qualified Demos', 'LinkedIn & Email Outreach'],
    image: fractionalSdrImg,
    ctaText: 'Hire an SDR',
    subtitle: 'Lead Generation',
    tags: ['Startups', 'Scaleups']
  },
  {
    id: 'closer',
    title: 'Fractional Closer',
    path: '/fractional-closer',
    icon: Target,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Experienced AEs handle your demos and close deals on commission.',
    bullets: ['High Win Rate', 'Strict Qualification', 'Contract Negotiation'],
    image: fractionalCloserImg,
    ctaText: 'Find a Closer',
    subtitle: 'High-Ticket Closing',
    tags: ['Startups', 'Scaleups']
  },
  {
    id: 'teamlead',
    title: 'Fractional Team Lead',
    path: '/fractional-team-lead',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Senior managers oversee your reps, run daily syncs, and QA calls.',
    bullets: ['Daily Standups', 'Call QA & Coaching', 'RevOps Control'],
    image: fractionalTeamLeadImg,
    ctaText: 'Get a Team Lead',
    subtitle: 'Sales Management',
    tags: ['Startups', 'Scaleups']
  },
  {
    id: 'ai-digital-closer',
    title: 'AI Digital Closer',
    path: '/ai-digital-closer',
    icon: Bot,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    description: 'AI conducts 24/7 discovery, runs live demos, and registers leads.',
    bullets: ['24/7 Live Demos', 'Instant Registration', 'Automated Discovery'],
    image: aiDigitalCloserImg,
    ctaText: 'Deploy AI Closer',
    subtitle: '24/7 Autonomous Sales',
    tags: ['Startups', 'Scaleups']
  },
  // Solutions (Predictable Pricing Packages)
  {
    id: 'pricing-linkedin',
    title: 'LinkedIn Outreach',
    path: '/predictable-pipeline',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Generate warm B2B leads using precise LinkedIn parsing and manual outreach.',
    bullets: ['Est. Package: $2,700', '14 Days Timeline', 'Manual Scout Outreach'],
    image: '/images/solutions/linkedin.png',
    ctaText: 'View Details',
    subtitle: 'Est. Package $2,700',
    tags: ['Startups', 'Scaleups', 'Enterprise']
  },
  {
    id: 'pricing-first-call',
    title: 'First Sales Call in 7 Days',
    path: '/predictable-pipeline',
    icon: Zap,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Book highly targeted prospect calls fast using AI and CRM enrichment.',
    bullets: ['Est. Package: $5,350', '7 Days Timeline', 'AI SDR Enrichment'],
    image: '/images/solutions/call.png',
    ctaText: 'View Details',
    subtitle: 'Est. Package $5,350',
    tags: ['Startups', 'Scaleups', 'Enterprise']
  },
  {
    id: 'pricing-mou',
    title: '10 MoU Signed in 20 Days',
    path: '/predictable-pipeline',
    icon: Handshake,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Secure strategic partnerships rapidly with an expert Closer and automated AI outreach.',
    bullets: ['Est. Package: $7,200', '20 Days Timeline', 'Expert Closer + AI'],
    image: '/images/solutions/mou.png',
    ctaText: 'View Details',
    subtitle: 'Est. Package $7,200',
    tags: ['Startups', 'Scaleups']
  }
];

const CATEGORIES = [
  {
    id: 'salesops',
    title: 'SalesOps',
    items: ['recruiting', 'preconfigured-crm', 'call-recording-qa', 'global-payroll', 'data-scraping', 'predictable']
  },
  {
    id: 'salesforce',
    title: 'Salesforce',
    items: ['scout', 'sdr', 'closer', 'teamlead', 'ai-digital-closer']
  },
  {
    id: 'solutions',
    title: 'Solutions',
    items: ['pricing-linkedin', 'pricing-first-call', 'pricing-mou']
  }
];

const getDarkStyle = (color: string) => {
  if (color.includes('blue')) return { bg: 'dark:bg-blue-500/10', text: 'dark:text-blue-400', border: 'dark:border-blue-500/20' };
  if (color.includes('emerald')) return { bg: 'dark:bg-emerald-500/10', text: 'dark:text-emerald-400', border: 'dark:border-emerald-500/20' };
  if (color.includes('indigo')) return { bg: 'dark:bg-indigo-500/10', text: 'dark:text-indigo-400', border: 'dark:border-indigo-500/20' };
  if (color.includes('cyan')) return { bg: 'dark:bg-cyan-500/10', text: 'dark:text-cyan-400', border: 'dark:border-cyan-500/20' };
  if (color.includes('purple')) return { bg: 'dark:bg-purple-500/10', text: 'dark:text-purple-400', border: 'dark:border-purple-500/20' };
  if (color.includes('orange')) return { bg: 'dark:bg-orange-500/10', text: 'dark:text-orange-400', border: 'dark:border-orange-500/20' };
  if (color.includes('amber')) return { bg: 'dark:bg-amber-500/10', text: 'dark:text-amber-400', border: 'dark:border-amber-500/20' };
  if (color.includes('rose')) return { bg: 'dark:bg-rose-500/10', text: 'dark:text-rose-400', border: 'dark:border-rose-500/20' };
  if (color.includes('red')) return { bg: 'dark:bg-red-500/10', text: 'dark:text-red-400', border: 'dark:border-red-500/20' };
  return { bg: 'dark:bg-slate-500/10', text: 'dark:text-slate-400', border: 'dark:border-slate-500/20' };
};

export function MegaMenu({ 
  isOpen, 
  onMouseEnter, 
  onMouseLeave,
  activeCategory
}: { 
  isOpen: boolean; 
  onMouseEnter: () => void; 
  onMouseLeave: () => void; 
  activeCategory?: string | null;
}) {
  const [activeItem, setActiveItem] = useState<typeof MEGA_MENU_ITEMS[0] | null>(null);

  const currentCategory = CATEGORIES.find(c => c.id === activeCategory);

  useEffect(() => {
    if (isOpen && activeCategory) {
      if (currentCategory && currentCategory.items.length > 0) {
        const item = MEGA_MENU_ITEMS.find(i => i.id === currentCategory.items[0]);
        if (item) setActiveItem(item);
      }
    }
  }, [isOpen, activeCategory, currentCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="megamenu-dropdown"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.1, ease: [0.16, 1, 0.3, 1] }} // Snappy open/close
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="fixed top-[80px] left-0 w-[100vw] bg-background-primary shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-t border-border-primary z-50 origin-top transition-theme"
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="max-w-[1400px] mx-auto w-full grid grid-cols-12 h-[460px] bg-background-primary border-x border-b border-border-primary shadow-2xl relative rounded-none transition-theme">
            
            {/* Column 1: Categories (Left) - 3/12 */}
            <div className="col-span-3 border-r border-border-primary p-5 bg-background-secondary rounded-none transition-theme">
              {currentCategory ? (
                <div key={currentCategory.id}>
                  <div className="space-y-1">
                    {currentCategory.items.map(itemId => {
                      const item = MEGA_MENU_ITEMS.find(i => i.id === itemId);
                      if (!item) return null;
                      return (
                        <Link 
                          href={item.path} 
                          prefetch={true}
                          key={item.id} 
                          className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 ${activeItem?.id === item.id ? `${item.bgColor} ${getDarkStyle(item.color).bg} shadow-sm border border-border-primary/40 ${getDarkStyle(item.color).border}` : 'hover:bg-background-surface border border-transparent'}`} 
                          onMouseEnter={() => setActiveItem(item)} 
                          onClick={onMouseLeave}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${activeItem?.id === item.id ? `shadow-sm ${item.bgColor} ${getDarkStyle(item.color).bg}` : 'bg-background-surface group-hover:shadow-sm'}`}>
                              <item.icon className={`w-4 h-4 ${activeItem?.id === item.id ? `${item.color} ${getDarkStyle(item.color).text}` : 'text-text-secondary group-hover:text-text-primary'}`} />
                            </div>
                            <div className="flex flex-col">
                              <span className={`font-bold text-[14px] transition-colors duration-150 ${activeItem?.id === item.id ? `${item.color} ${getDarkStyle(item.color).text}` : 'text-text-primary group-hover:text-text-primary'}`}>
                                {item.title}
                              </span>
                              <span className="text-[11px] font-medium text-text-secondary mt-0.5 transition-theme">
                                {item.subtitle}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 transition-all duration-150 ${activeItem?.id === item.id ? `opacity-100 translate-x-0 ${item.color} ${getDarkStyle(item.color).text}` : 'opacity-0 -translate-x-2 text-text-secondary group-hover:opacity-100 group-hover:translate-x-0'}`} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-sm font-medium text-text-secondary p-4 bg-background-surface rounded-xl border border-border-primary text-center transition-theme">
                  No active category selected
                </div>
              )}
            </div>

            {/* Column 2: Description (Center) - 5/12 */}
            <div className="col-span-5 py-8 pl-10 pr-6 flex flex-col justify-start transition-theme relative overflow-hidden">
              <AnimatePresence mode="wait">
                {activeItem ? (
                  <motion.div 
                    key={activeItem.id} 
                    initial={{ opacity: 0, filter: 'blur(4px)', y: 5 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, filter: 'blur(4px)', y: -5 }}
                    transition={{ duration: 0.1, ease: "easeOut" }} // Doubled the speed
                    className="flex flex-col h-full max-w-xl absolute inset-0 py-8 pl-10 pr-6"
                  >
                    {/* Tags */}
                    {activeItem.tags && activeItem.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2 items-center">
                        {activeItem.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase bg-background-surface text-text-secondary border border-border-primary transition-theme">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Description */}
                    <h3 className="text-[20px] lg:text-[22px] font-bold text-text-primary mb-6 leading-snug tracking-tight transition-theme">
                      {activeItem.description}
                    </h3>
                    
                    {/* Bullets */}
                    <ul className="space-y-3 mb-8">
                      {activeItem.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-text-secondary text-[14px] font-medium transition-theme">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${activeItem.color}`} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    
                    {/* CTA Button */}
                    <div className="mt-auto">
                      <Link 
                        href={activeItem.path} 
                        prefetch={true}
                        onClick={onMouseLeave} 
                        className={`inline-flex items-center gap-2 px-6 py-2.5 ${activeItem.bgColor} ${getDarkStyle(activeItem.color).bg} ${activeItem.color} ${getDarkStyle(activeItem.color).text} border border-border-primary/50 ${getDarkStyle(activeItem.color).border} hover:brightness-95 dark:hover:brightness-110 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow hover:-translate-y-0.5`}
                      >
                        {activeItem.ctaText} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Column 3: Visual (Right) - 4/12 */}
            <div className="col-span-4 p-8 flex flex-col justify-center items-center transition-theme relative">
              <AnimatePresence mode="wait">
                {activeItem ? (
                  <motion.div 
                    key={activeItem.id} 
                    initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.05 }}
                    transition={{ duration: 0.15, ease: "easeOut" }} // Doubled the speed
                    className="w-full flex flex-col items-center absolute inset-0 justify-center p-8"
                  >
                    {/* Изображение */}
                    <div className="w-full max-w-[280px] h-[250px] relative mb-6">
                      <Image 
                        src={activeItem.image} 
                        alt={activeItem.title} 
                        fill 
                        quality={75}
                        priority
                        sizes="(max-width: 1024px) 100vw, 25vw" 
                        className="object-contain object-center drop-shadow-2xl" 
                      />
                    </div>
                    {/* Подпись */}
                    <p className="text-text-primary dark:text-white font-black text-xl tracking-tight text-center whitespace-nowrap w-full transition-theme">
                      {activeItem.title}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const MOBILE_MENU_ITEMS = MEGA_MENU_ITEMS;