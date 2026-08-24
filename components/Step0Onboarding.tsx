"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useWizard } from '../contexts/WizardContext';
import * as LucideIcons from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Image from "next/image";

const SEGMENTS = ['Startups', 'SMB', 'Enterprise'] as const;
type Segment = typeof SEGMENTS[number];

// Helper to render dynamic icons by name
const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.Box;
  return Icon;
};

export function Step0Onboarding({ dbPresets = [] }: { dbPresets?: any[] }) {
  const { applyDynamicSolution, setStep } = useWizard();
  const searchParams = useSearchParams();
  const [activeSegment, setActiveSegment] = useState<Segment>('SMB');
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const presetId = searchParams.get('preset');

    if (presetId && dbPresets.length > 0) {
      const template = dbPresets.find(t => t.id === presetId);
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
  }, [searchParams, dbPresets]);

  const activeTemplates = dbPresets.filter(t => t.segment === activeSegment);

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

  // Helper to format S3 URL
  const getS3Url = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL || "";
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pt-8 pb-20 px-4">
      {/* Header Section */}
      <div className="flex-shrink-0 text-center mb-10">
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
      <div className="relative w-full max-w-full group">
        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 custom-scrollbar hide-scrollbar items-stretch"
          style={{ scrollbarWidth: 'none' }}
        >
          {activeTemplates.length === 0 && (
            <div className="w-full text-center py-20 text-slate-500">
              No presets available for this segment yet.
            </div>
          )}

          {activeTemplates.map(template => {
            const Icon = getIconComponent(template.icon);
            return (
              <div 
                key={template.id}
                ref={el => { cardRefs.current[template.id] = el; }}
                className="snap-center shrink-0 w-[85vw] md:w-[350px] lg:w-[380px] min-h-[500px] relative group/card cursor-pointer rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-800"
                onClick={() => applyDynamicSolution(template)}
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent z-10" />
                  {template.imageUrl && (
                    <Image 
                      src={getS3Url(template.imageUrl)} 
                      alt={template.name}
                      fill
                      sizes="(max-width: 768px) 85vw, 400px"
                      className="object-cover object-center group-hover/card:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                
                {/* Content Layer */}
                <div className="relative z-20 h-full p-6 pb-10 flex flex-col justify-end">
                  
                  {/* Top Badge (Icon) */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 text-white shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  {/* Content Wrapper */}
                  <div className="transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl font-extrabold text-white mb-2 leading-tight tracking-tight">
                      {template.name}
                    </h3>
                    <p className="text-indigo-200 font-medium mb-4 text-sm uppercase tracking-wide">
                      {template.subtitle}
                    </p>
                    
                    {/* Animated Description */}
                    <div className="grid grid-rows-[0fr] group-hover/card:grid-rows-[1fr] transition-all duration-500 opacity-0 group-hover/card:opacity-100 mb-6">
                      <div className="overflow-hidden">
                        <p className="text-slate-300 text-sm leading-relaxed pb-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-white mb-6">
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                        <LucideIcons.Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold">Launch: {template.timeEstimate}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                         <span className="text-sm font-bold text-amber-300">{template.costEstimate}</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-colors">
                      Apply Architecture <LucideIcons.ChevronRight className="w-5 h-5" />
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
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-5 w-12 h-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white dark:hover:bg-slate-800 z-30"
            >
              <LucideIcons.ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-5 w-12 h-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white dark:hover:bg-slate-800 z-30"
            >
              <LucideIcons.ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}