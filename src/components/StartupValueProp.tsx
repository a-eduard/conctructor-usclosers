"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function StartupValueProp() {
  return (
    <section className="py-16 md:py-24 bg-slate-900 relative overflow-hidden transition-colors border-y border-slate-800">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      </div>
      
      {/* Glow effects - Responsive width */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-3/4 h-full md:h-1/2 bg-blue-500/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="mb-0 md:mb-4"
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="text-blue-400 font-bold tracking-widest uppercase text-[10px] sm:text-xs mb-4 sm:mb-6 block"
          >
            Built for Fast Growth
          </motion.span>
          
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.2] sm:leading-tight"
          >
            Start with <span className="text-blue-400">one caller</span> today. <br className="hidden sm:block" />
            Build a multi-channel revenue engine tomorrow.
          </motion.h2>
        </motion.div>
      </div>
    </section>
  );
}