"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useWizard } from '../contexts/WizardContext';
import { Rocket, Building2, TrendingUp, Magnet, Phone, DollarSign, Settings, ChevronRight, Clock, ChevronLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const TEMPLATES = [
  {
    id: 'founder_led',
    name: 'Founder-Led Automation',
    subtitle: 'Outbound emails + AI SDR. You do the demos.',
    description: 'Perfect for early-stage founders. Setup includes AI agents for qualification and direct calendar booking.',
    icon: Rocket,
    segment: 'Startups',
    timeEstimate: '2 Days',
    costEstimate: 'From $2,000',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80'
  },
  {
    id: 'fundraising',
    name: 'Fundraising Pipeline',
    subtitle: 'Target investors, pitch deck, data room prep.',
    description: 'Get your startup funded. Visually stunning pitch deck combined with aggressive investor outreach.',
    icon: DollarSign,
    segment: 'Startups',
    timeEstimate: '14 Days',
    costEstimate: 'From $4,900',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80'
  },
  {
    id: 'scale_up',
    name: 'The Scale-Up Machine',
    subtitle: 'Human SDRs + AEs + SalesOps for rapid growth.',
    description: 'Full team deployment for rapid scaling. Includes strict BANT qualification and contract management.',
    icon: TrendingUp,
    segment: 'SMB',
    timeEstimate: '30 Days',
    costEstimate: 'From $13,700',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'
  },
  {
    id: 'inbound_closer',
    name: 'Inbound Closer',
    subtitle: 'Setup for handling incoming hot leads via Ads/SEO.',
    description: 'Don\'t let warm leads slip. Professional closing combined with instant AI qualification.',
    icon: Magnet,
    segment: 'SMB',
    timeEstimate: '10 Days',
    costEstimate: 'From $8,300',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80'
  },
  {
    id: 'cold_calling',
    name: 'Cold Calling Machine',
    subtitle: 'Aggressive outbound calling for B2B',
    description: 'Conservative niches. Phone parsing + Live calls + Professional Closer.',
    icon: Phone,
    segment: 'SMB',
    timeEstimate: '21 Days',
    costEstimate: 'From $9,700',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80'
  },
  {
    id: 'high_ticket',
    name: 'High-Ticket Enterprise',
    subtitle: 'Long cycles, MEDDIC, Full human team setup.',
    description: 'Targeting F500. Comprehensive market analysis, senior AEs, and advanced CRM operations.',
    icon: Building2,
    segment: 'Enterprise',
    timeEstimate: '30 Days',
    costEstimate: 'From $12,300',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'
  },
  {
    id: 'turnkey',
    name: 'Turnkey Department',
    subtitle: 'Everything done for you. Max infrastructure & team.',
    description: 'We build your entire sales department from scratch. Includes consulting, sourcing, and closing.',
    icon: Settings,
    segment: 'Enterprise',
    timeEstimate: '45 Days',
    costEstimate: 'From $15,500',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80'
  }
];

const SEGMENTS = ['Startups', 'SMB', 'Enterprise'] as const;
type Segment = typeof SEGMENTS[number];

export function Step0Onboarding() {
  const { applyGlobalTemplate, setStep } = useWizard();
  const searchParams = useSearchParams();
  const [activeSegment, setActiveSegment] = useState<Segment>('SMB');
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    // Replaced window.location manual parsing with Next.js useSearchParams
    const presetId = searchParams.get('preset');

    if (presetId) {
      const template = TEMPLATES.find(t => t.id === presetId);
      if (template) {
        setActiveSegment(template.segment as Segment);
        
        setTimeout(() => {
          const cardElement = cardRefs.current[presetId];
          if (cardElement && carouselRef.current) {
            cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }, 100);
      }
    }
  }, [searchParams]);

  const activeTemplates = TEMPLATES.filter(t => t.segment === activeSegment);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full">
      <div className="flex-shrink-0 text-center mb-8 pt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
          Select Your Business Scale
        </h1>
        
        {/* Segment Selector Toggle */}
        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full shadow-inner mb-6">
          {SEGMENTS.map(segment => (
            <button
              key={segment}
              onClick={() => setActiveSegment(segment)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeSegment === segment 
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md scale-105' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
            >
              {segment}
            </button>
          ))}
        </div>
        
        <div>
          <button
            onClick={() => setStep(1)}
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors underline underline-offset-4 decoration-slate-300 dark:decoration-slate-700"
          >
            Or build your own architecture from scratch &rarr;
          </button>
        </div>
      </div>

      {/* Immersive Carousel */}
      <div className="relative flex-1 min-h-0 w-[calc(100vw-3rem)] max-w-full -ml-6 md:ml-0 md:w-full overflow-hidden mb-8 group">
        <div 
          ref={carouselRef}
          className="flex gap-6 h-full overflow-x-auto snap-x snap-mandatory px-6 md:px-0 custom-scrollbar hide-scrollbar items-stretch"
          style={{ scrollPadding: '0 24px', scrollbarWidth: 'none' }}
        >
          {activeTemplates.map(template => {
            const Icon = template.icon;
            return (
              <div 
                key={template.id}
                ref={el => { cardRefs.current[template.id] = el; }}
                className="snap-center shrink-0 w-[85vw] md:w-[400px] lg:w-[calc(33.333%-16px)] h-full relative group/card cursor-pointer rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-800"
                onClick={() => applyGlobalTemplate(template.id)}
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-700"
                  />
                </div>
                
                {/* Content Layer */}
                <div className="relative z-20 h-full p-8 flex flex-col justify-end">
                  
                  {/* Top Badge (Icon) */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 text-white shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="transform translate-y-12 group-hover/card:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl font-extrabold text-white mb-2 leading-tight tracking-tight">
                      {template.name}
                    </h3>
                    <p className="text-indigo-200 font-medium mb-4 text-sm uppercase tracking-wide">
                      {template.subtitle}
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-100 h-0 overflow-hidden group-hover/card:h-auto">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-white mb-6">
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold">Launch: {template.timeEstimate}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                         <span className="text-sm font-bold text-amber-300">{template.costEstimate}</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-colors">
                      Apply Architecture <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Carousel Navigation Arrows */}
        {activeTemplates.length > 3 && (
          <>
            <button 
              onClick={scrollLeft}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white dark:hover:bg-slate-800 z-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollRight}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white dark:hover:bg-slate-800 z-30"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}