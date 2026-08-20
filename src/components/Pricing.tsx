"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-background-secondary relative overflow-hidden transition-theme">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] md:h-[500px] bg-gradient-to-b from-background-surface to-transparent pointer-events-none opacity-50" />
      <div className="absolute -top-[100px] -right-[100px] md:-top-[200px] md:-right-[200px] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-[100px] -left-[100px] md:-bottom-[200px] md:-left-[200px] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight transition-theme"
          >
            Predictable Pricing. <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Zero Hidden Fees.
            </span>
          </motion.h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto items-stretch">
          
          {/* Card 1: LinkedIn Outreach */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="group bg-background-primary rounded-[2rem] p-6 sm:p-8 border border-border-primary shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 dark:hover:border-slate-700 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6 md:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 relative transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                <Image 
                  src="/images/solutions/linkedin.png" 
                  alt="LinkedIn Outreach" 
                  fill
                  quality={75}
                  sizes="64px"
                  className="object-contain drop-shadow-sm" 
                />
              </div>
              <span className="px-3 sm:px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-extrabold rounded-full border border-emerald-100 dark:border-emerald-500/20 tracking-wider">
                14 DAYS
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 sm:mb-4 transition-theme">LinkedIn Outreach</h3>
            <p className="text-text-secondary text-sm mb-8 sm:mb-12 flex-grow leading-relaxed font-medium transition-theme">
              Generate warm B2B leads using precise LinkedIn parsing and manual outreach.
            </p>
            
            <div className="flex items-end justify-between mt-auto">
              <div>
                <p className="text-[9px] sm:text-[10px] font-extrabold text-text-secondary uppercase tracking-widest mb-1.5 transition-theme">Est. Package</p>
                <div className="text-2xl sm:text-3xl font-black text-text-primary transition-theme">$2,700</div>
              </div>
              <a 
                href="https://usclosers-wizard.vercel.app/en" 
                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-text-primary text-background-primary rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
              >
                Launch <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: First Sales Call */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="group bg-background-primary rounded-[2rem] p-6 sm:p-8 border border-border-primary shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 dark:hover:border-slate-700 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6 md:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 relative transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                <Image 
                  src="/images/solutions/call.png" 
                  alt="First Sales Call" 
                  fill
                  quality={75}
                  sizes="64px"
                  className="object-contain drop-shadow-sm" 
                />
              </div>
              <span className="px-3 sm:px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-extrabold rounded-full border border-emerald-100 dark:border-emerald-500/20 tracking-wider">
                7 DAYS
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 sm:mb-4 transition-theme">First Sales Call</h3>
            <p className="text-text-secondary text-sm mb-8 sm:mb-12 flex-grow leading-relaxed font-medium transition-theme">
              Book highly targeted prospect calls fast using AI and CRM enrichment.
            </p>
            
            <div className="flex items-end justify-between mt-auto">
              <div>
                <p className="text-[9px] sm:text-[10px] font-extrabold text-text-secondary uppercase tracking-widest mb-1.5 transition-theme">Est. Package</p>
                <div className="text-2xl sm:text-3xl font-black text-text-primary transition-theme">$5,350</div>
              </div>
              <a 
                href="https://usclosers-wizard.vercel.app/en" 
                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-text-primary text-background-primary rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
              >
                Launch <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Card 3: 10 MoU Signed */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="group bg-background-primary rounded-[2rem] p-6 sm:p-8 border border-border-primary shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 dark:hover:border-slate-700 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6 md:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 relative transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                <Image 
                  src="/images/solutions/mou.png" 
                  alt="10 MoU Signed" 
                  fill
                  quality={75}
                  sizes="64px"
                  className="object-contain drop-shadow-sm" 
                />
              </div>
              <span className="px-3 sm:px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-extrabold rounded-full border border-emerald-100 dark:border-emerald-500/20 tracking-wider">
                20 DAYS
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 sm:mb-4 transition-theme">10 MoU Signed</h3>
            <p className="text-text-secondary text-sm mb-8 sm:mb-12 flex-grow leading-relaxed font-medium transition-theme">
              Secure strategic partnerships rapidly with an expert Closer and automated AI outreach.
            </p>
            
            <div className="flex items-end justify-between mt-auto">
              <div>
                <p className="text-[9px] sm:text-[10px] font-extrabold text-text-secondary uppercase tracking-widest mb-1.5 transition-theme">Est. Package</p>
                <div className="text-2xl sm:text-3xl font-black text-text-primary transition-theme">$7,200</div>
              </div>
              <a 
                href="https://usclosers-wizard.vercel.app/en" 
                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-text-primary text-background-primary rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
              >
                Launch <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}