"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const qaImg = '/images/call-recording-qa/hero.jpg';

const FREE_PROVIDERS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'mail.ru', 'yandex.ru'];

export default function CallRecordingQAPage() {
  const [formData, setFormData] = useState({
    email: '',
    callVolume: '100-500',
    socialLink: ''
  });
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const validateEmail = (email: string) => {
    if (!email) return '';
    const domain = email.split('@')[1]?.toLowerCase();
    if (FREE_PROVIDERS.includes(domain)) {
      return 'Please use a corporate email address (no free providers)';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({...formData, email: val});
    setEmailError(validateEmail(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateEmail(formData.email);
    if (error) {
      setEmailError(error);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you! We will contact you shortly to set up your QA system.');
    }, 1500);
  };

  return (
    <div className="bg-background-primary min-h-screen text-text-primary selection:bg-purple-100 selection:text-purple-900 dark:selection:bg-purple-500/30 dark:selection:text-purple-200 transition-theme">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-border-primary bg-background-secondary transition-theme">
        {/* Soft Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[500px] bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none transition-theme"></div>
        <div className="absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[250px] md:h-[400px] bg-fuchsia-50/50 dark:bg-fuchsia-900/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none transition-theme"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:items-start flex-col-reverse lg:flex-row">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left lg:pt-2"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 text-text-primary leading-[1.1] transition-theme">
                <span className="block mb-1 sm:mb-2">Call Recording</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500 dark:from-purple-400 dark:to-fuchsia-400">
                  & QA
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-text-secondary mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 transition-theme">
                Auto-record calls and use AI to transcribe and score. Ensure message consistency, catch objections, and automatically grade every sales conversation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-purple-600 hover:bg-purple-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(147,51,234,0.39)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.23)] flex items-center justify-center gap-2 active:scale-95"
                >
                  Start Recording 
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-text-secondary transition-theme">
                <div className="flex items-center gap-1.5 sm:gap-2 transition-theme">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background-surface transition-theme">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 transition-theme" />
                  </div>
                  Auto-Transcription
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 transition-theme">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background-surface transition-theme">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 transition-theme" />
                  </div>
                  AI Scoring
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 transition-theme">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background-surface transition-theme">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 transition-theme" />
                  </div>
                  CRM Sync
                </div>
              </div>
            </motion.div>

            {/* Right Image/Visuals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-[500px] mx-auto lg:max-w-none mt-8 lg:mt-0 flex flex-col gap-4 sm:gap-6"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-fuchsia-100 dark:from-purple-600/20 dark:to-fuchsia-500/20 rounded-3xl blur-[60px] md:blur-[80px] transform -rotate-6 opacity-60 dark:opacity-100 transition-theme pointer-events-none"></div>
              
              {/* Premium Purple Shadow added here */}
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-purple-100/50 dark:border-purple-500/20 bg-background-primary/50 backdrop-blur-sm shadow-2xl shadow-purple-600/20 dark:shadow-purple-500/10 p-1.5 sm:p-2 transition-theme z-10">
                <div className="rounded-xl md:rounded-2xl overflow-hidden relative border border-border-primary aspect-[4/3] sm:aspect-auto sm:h-[350px] lg:h-[400px] transition-theme bg-background-secondary">
                  <Image 
                    src={qaImg} 
                    alt="Call Recording & QA Workflow" 
                    fill
                    priority 
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Stats Row with Purple Shadows */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
                <div className="bg-background-primary/80 backdrop-blur-sm border border-purple-100/50 dark:border-purple-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-lg shadow-purple-600/10 dark:shadow-purple-500/5 transition-theme">
                  <div className="font-black text-xl sm:text-2xl text-text-primary mb-0.5 transition-theme">100% Coverage</div>
                  <div className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-widest transition-theme">Zero Manual Review</div>
                </div>
                <div className="bg-background-primary/80 backdrop-blur-sm border border-purple-100/50 dark:border-purple-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-lg shadow-purple-600/10 dark:shadow-purple-500/5 transition-theme">
                  <div className="font-black text-xl sm:text-2xl text-text-primary mb-0.5 transition-theme">+18.4%</div>
                  <div className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-widest transition-theme">Avg Win Rate Lift</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 md:py-24 border-b border-border-primary relative bg-background-primary transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary tracking-tight transition-theme">How AI QA Works</h2>
            <p className="text-base sm:text-lg text-text-secondary transition-theme">
              Transform every conversation into actionable data to coach reps and close more deals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-background-secondary border border-border-primary hover:border-purple-200 dark:hover:border-purple-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-600/20 dark:hover:shadow-purple-500/10 transition-all duration-500 group flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <div className="w-full h-32 sm:h-40 md:h-48 mb-6 sm:mb-8 relative flex items-center justify-center drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_20px_rgba(147,51,234,0.2)] transition-all duration-500">
                <Image 
                  src="/images/call-recording-qa/icon_capture.png" 
                  alt="Capture Everything" 
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">1. Capture Everything</h3>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-medium transition-theme">
                Seamlessly record Zoom, Google Meet, and phone calls. Get perfect transcripts automatically.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-background-secondary border border-border-primary hover:border-purple-200 dark:hover:border-purple-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-600/20 dark:hover:shadow-purple-500/10 transition-all duration-500 group flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <div className="w-full h-32 sm:h-40 md:h-48 mb-6 sm:mb-8 relative flex items-center justify-center drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_20px_rgba(147,51,234,0.2)] transition-all duration-500">
                <Image 
                  src="/images/call-recording-qa/icon_scoring.png" 
                  alt="AI Scoring" 
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">2. AI Scoring</h3>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-medium transition-theme">
                Our AI analyzes transcripts against your custom playbooks, grading reps on key behaviors and script adherence.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-background-secondary border border-border-primary hover:border-purple-200 dark:hover:border-purple-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-600/20 dark:hover:shadow-purple-500/10 transition-all duration-500 group flex flex-col items-center text-center sm:items-start sm:text-left sm:col-span-2 md:col-span-1"
            >
              <div className="w-full h-32 sm:h-40 md:h-48 mb-6 sm:mb-8 relative flex items-center justify-center drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_20px_rgba(147,51,234,0.2)] transition-all duration-500">
                <Image 
                  src="/images/call-recording-qa/icon_coach.png" 
                  alt="Coach at Scale" 
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">3. Coach at Scale</h3>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-medium transition-theme">
                Identify winning patterns and systemic weaknesses. Deliver targeted coaching precisely where it&apos;s needed.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="lead-form" className="py-16 md:py-32 relative overflow-hidden bg-background-secondary transition-theme">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-purple-100 dark:bg-purple-900/10 blur-[100px] md:blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-background-primary border border-purple-100/50 dark:border-purple-500/20 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-600/20 dark:shadow-purple-500/10 relative z-10 transition-theme"
          >
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-text-primary transition-theme">Automate Your QA</h2>
              <p className="text-sm sm:text-base text-text-secondary transition-theme">Get a custom quote for deploying AI Call Recording.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Corporate Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  className={`w-full bg-background-surface border ${emailError ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-border-primary focus:border-purple-500 focus:ring-purple-500/50'} rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:ring-2 transition-all placeholder:text-text-secondary`}
                  placeholder="founder@yourstartup.com"
                />
                <AnimatePresence>
                  {emailError && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-red-500 dark:text-red-400 mt-2 flex items-center gap-1 font-bold transition-theme overflow-hidden"
                    >
                      <XCircle className="w-3 h-3 shrink-0" /> {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Monthly Call Volume</label>
                <div className="relative">
                  <select 
                    value={formData.callVolume}
                    onChange={(e) => setFormData({...formData, callVolume: e.target.value})}
                    className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none font-medium"
                  >
                    <option value="1-100" className="bg-background-primary text-text-primary">1-100 calls</option>
                    <option value="100-500" className="bg-background-primary text-text-primary">100-500 calls</option>
                    <option value="500-2000" className="bg-background-primary text-text-primary">500-2000 calls</option>
                    <option value="2000+" className="bg-background-primary text-text-primary">2000+ calls</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary transition-theme">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Telegram / LinkedIn ID</label>
                <input 
                  type="text" 
                  required
                  value={formData.socialLink}
                  onChange={(e) => setFormData({...formData, socialLink: e.target.value})}
                  className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-text-secondary"
                  placeholder="@username or linkedin.com/in/..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !!emailError}
                className="w-full py-3.5 sm:py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-background-surface disabled:text-text-secondary text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_4px_14px_0_rgba(147,51,234,0.39)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.23)] disabled:shadow-none mt-6 sm:mt-8 flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? 'Processing...' : 'Request Deployment Plan'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}