"use client";

import React from 'react';
import Image from 'next/image';
import { Users, Zap, CheckCircle2, Clock, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function ReadyTalentPool() {
  return (
    <section className="py-16 md:py-24 bg-background-primary border-b border-border-primary overflow-hidden relative flex items-center transition-theme">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6 md:gap-8"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <div className="flex -space-x-3 md:-space-x-4">
                  {[12, 33, 47, 51, 62, 22].map((imgId, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[2px] md:border-[3px] border-background-primary shadow-sm relative transition-theme overflow-hidden"
                      style={{ zIndex: 10 - i }}
                    >
                      <Image 
                        src={`https://i.pravatar.cc/150?img=${imgId}`} 
                        alt="Expert"
                        fill
                        unoptimized={true}
                        quality={75}
                        sizes="(max-width: 768px) 40px, 48px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5 md:gap-1">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="text-xs md:text-sm font-medium text-text-secondary mt-0.5 md:mt-1 transition-theme">
                    <span className="font-bold text-text-primary transition-theme">30,000+</span> experts ready
                  </div>
                </div>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.1] transition-theme">
                Your sales team <br className="hidden sm:block" />
                <span className="text-blue-600 dark:text-blue-400"> is waiting.</span>
              </h2>
            </div>
            
            <p className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed max-w-lg transition-theme">
              You are hiring people who are already selling right now and have been vetted by us.
            </p>

            <ul className="space-y-4 md:space-y-6 mt-2 md:mt-4">
              {[
                { icon: ShieldCheck, text: "Top 3% Acceptance Rate", sub: "Rigorous cognitive and live-roleplay vetting." },
                { icon: Clock, text: "48-Hour Deployment", sub: "From matching to making live dials." },
                { icon: CheckCircle2, text: "Zero Onboarding Friction", sub: "Pre-trained on our ecosystem and standard SOPs." }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 md:gap-5">
                  <div className="mt-1 bg-background-secondary rounded-xl p-2 md:p-2.5 border border-border-primary shrink-0 shadow-sm transition-theme">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <strong className="block text-base md:text-lg text-text-primary mb-0.5 md:mb-1 transition-theme">{item.text}</strong>
                    <span className="text-sm md:text-base text-text-secondary transition-theme">{item.sub}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Visual Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="bg-background-secondary rounded-3xl border border-border-primary shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-4 sm:p-6 md:p-8 relative overflow-hidden transition-theme">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-emerald-400" />

              <div className="space-y-3 md:space-y-4 pt-2">
                {/* Mock Profiles */}
                {[
                  { name: "Michael Davis", role: "Enterprise Account Executive", exp: "8 Yrs", win: "32% Win Rate", status: "Available Now", img: 11 },
                  { name: "Sarah Chen", role: "Sr. SDR / BDR", exp: "4 Yrs", win: "120% Quota", status: "Available in 2 days", img: 32 },
                  { name: "James Wilson", role: "Sales Ops Manager", exp: "6 Yrs", win: "RevOps Cert", status: "Available Now", img: 59 },
                  { name: "Elena Rodriguez", role: "Mid-Market Closer", exp: "5 Yrs", win: "Top 5% Performer", status: "Available Now", img: 44 }
                ].map((profile, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 md:p-4 rounded-2xl border border-border-primary/50 bg-background-primary/50 hover:bg-background-primary hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="relative shrink-0">
                        {/* Удален group-hover:scale-105 */}
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-background-secondary shadow-sm transition-all duration-300 relative overflow-hidden">
                          <Image 
                            src={`https://i.pravatar.cc/150?img=${profile.img}`}
                            alt={profile.name}
                            fill
                            unoptimized={true}
                            quality={75}
                            sizes="(max-width: 768px) 40px, 48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 border-background-secondary shadow-sm transition-theme" />
                      </div>
                      <div>
                        <div className="font-bold text-text-primary text-sm md:text-base flex items-center gap-1.5 md:gap-2 mb-0.5 transition-theme">
                          {profile.name} 
                          <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <div className="text-[11px] md:text-sm text-text-secondary font-medium transition-theme">{profile.role} • {profile.exp}</div>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block shrink-0 pl-2">
                      <div className="text-sm font-bold text-text-primary mb-1 transition-theme">{profile.win}</div>
                      <div className="text-[10px] md:text-[11px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                        {profile.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-border-primary flex justify-center transition-theme">
                <button className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-5 py-2.5 md:px-6 md:py-3 rounded-xl flex items-center gap-2 transition-colors">
                  <Users className="w-4 h-4" /> View 30,000+ More Profiles
                </button>
              </div>
            </div>
            
            {/* Decorative Floating UI Elements - Hidden on smaller screens to avoid layout breaks */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-6 -bottom-6 lg:-right-8 lg:-bottom-8 bg-background-secondary p-4 md:p-5 rounded-2xl border border-border-primary shadow-2xl hidden md:block transition-theme"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] md:text-xs text-text-secondary uppercase font-bold tracking-wider mb-0.5 md:mb-1 transition-theme">Average Ramp Time</div>
                  <div className="text-lg md:text-xl font-extrabold text-text-primary transition-theme">14 Days</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}