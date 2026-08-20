"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const crmImg = '/images/preconfigured-crm/hero.jpg';

const FREE_PROVIDERS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'mail.ru', 'yandex.ru'];

export default function PreconfiguredCRMPage() {
  const [formData, setFormData] = useState({
    email: '',
    crmType: 'HubSpot',
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
      alert('Thank you! We will contact you shortly to calculate your CRM configuration.');
    }, 1500);
  };

  return (
    <div className="bg-background-primary min-h-screen text-text-primary selection:bg-amber-100 selection:text-amber-900 dark:selection:bg-amber-500/30 dark:selection:text-amber-200 transition-theme">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-border-primary bg-background-secondary transition-theme">
        {/* Soft Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[500px] bg-amber-100/50 dark:bg-amber-900/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none transition-theme"></div>
        <div className="absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[250px] md:h-[400px] bg-orange-50/50 dark:bg-orange-900/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none transition-theme"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center flex-col-reverse lg:flex-row">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 text-text-primary leading-[1.1] transition-theme">
                <span className="block mb-1 sm:mb-2">Preconfigured</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-400">
                  CRM
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-text-secondary mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 transition-theme">
                Ready-to-go database with automated lead routing. We build a fully customized CRM workspace configured to your sales motion, deployed in days instead of months.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-amber-600 hover:bg-amber-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(217,119,6,0.39)] hover:shadow-[0_6px_20px_rgba(217,119,6,0.23)] flex items-center justify-center gap-2 active:scale-95"
                >
                  Configure CRM 
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-text-secondary transition-theme">
                <div className="flex items-center gap-1.5 sm:gap-2 transition-theme">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background-surface transition-theme">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 transition-theme" />
                  </div>
                  Automated Routing
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 transition-theme">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background-surface transition-theme">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 transition-theme" />
                  </div>
                  Pipeline Dashboards
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 transition-theme">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background-surface transition-theme">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 transition-theme" />
                  </div>
                  Plug-and-Play
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
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 to-orange-100 dark:from-amber-600/20 dark:to-orange-500/20 rounded-3xl blur-[60px] md:blur-[80px] transform -rotate-6 opacity-60 dark:opacity-100 transition-theme pointer-events-none"></div>
              
              {/* Clean Image Container with Amber Shadows */}
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-amber-100/50 dark:border-amber-500/20 bg-background-primary/50 backdrop-blur-sm shadow-2xl shadow-amber-600/20 dark:shadow-amber-500/10 p-1.5 sm:p-2 transition-theme z-10">
                <div className="rounded-xl md:rounded-2xl overflow-hidden relative border border-border-primary aspect-[4/3] sm:aspect-auto sm:h-[350px] lg:h-[400px] transition-theme bg-background-secondary">
                  <Image 
                    src={crmImg} 
                    alt="Preconfigured CRM Workflow" 
                    fill
                    priority
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Clean Stats Row Below Image */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
                <div className="bg-background-primary/80 backdrop-blur-sm border border-amber-100/50 dark:border-amber-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-lg shadow-amber-600/10 dark:shadow-amber-500/5 transition-theme">
                  <div className="font-black text-xl sm:text-2xl text-text-primary mb-0.5 transition-theme">Smart Routing</div>
                  <div className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-widest transition-theme">Zero Manual Entry</div>
                </div>
                <div className="bg-background-primary/80 backdrop-blur-sm border border-amber-100/50 dark:border-amber-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-lg shadow-amber-600/10 dark:shadow-amber-500/5 transition-theme">
                  <div className="font-black text-xl sm:text-2xl text-text-primary mb-0.5 transition-theme">48 Hours</div>
                  <div className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-widest transition-theme">Deployment Time</div>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary tracking-tight transition-theme">How the CRM Setup Works</h2>
            <p className="text-base sm:text-lg text-text-secondary transition-theme">
              Stop fighting your database. We build a CRM that actually works for your sales team out of the box.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-background-secondary border border-border-primary hover:border-amber-200 dark:hover:border-amber-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-600/20 dark:hover:shadow-amber-500/10 transition-all duration-500 group flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <div className="w-full h-32 sm:h-40 md:h-48 mb-6 sm:mb-8 relative flex items-center justify-center drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_20px_rgba(245,158,11,0.2)] transition-all duration-500">
                <Image 
                  src="/images/preconfigured-crm/icon_architecture.png" 
                  alt="CRM Architecture" 
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">1. Architecture</h3>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-medium transition-theme">
                We design custom objects, properties, and pipelines that mirror your exact sales process and terminology.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-background-secondary border border-border-primary hover:border-amber-200 dark:hover:border-amber-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-600/20 dark:hover:shadow-amber-500/10 transition-all duration-500 group flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <div className="w-full h-32 sm:h-40 md:h-48 mb-6 sm:mb-8 relative flex items-center justify-center drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_20px_rgba(245,158,11,0.2)] transition-all duration-500">
                <Image 
                  src="/images/preconfigured-crm/icon_automation.png" 
                  alt="CRM Automation" 
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">2. Automation</h3>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-medium transition-theme">
                Set up complex workflows for lead routing, task creation, data enrichment, and SLA tracking.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-background-secondary border border-border-primary hover:border-amber-200 dark:hover:border-amber-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-600/20 dark:hover:shadow-amber-500/10 transition-all duration-500 group flex flex-col items-center text-center sm:items-start sm:text-left sm:col-span-2 md:col-span-1"
            >
              <div className="w-full h-32 sm:h-40 md:h-48 mb-6 sm:mb-8 relative flex items-center justify-center drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_20px_rgba(245,158,11,0.2)] transition-all duration-500">
                <Image 
                  src="/images/preconfigured-crm/icon_analytics.png" 
                  alt="CRM Analytics" 
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">3. Analytics</h3>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-medium transition-theme">
                Pre-built executive dashboards for forecasting, rep performance, and revenue attribution.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="lead-form" className="py-16 md:py-32 relative overflow-hidden bg-background-secondary transition-theme">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-amber-100 dark:bg-amber-900/10 blur-[100px] md:blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-background-primary border border-amber-100/50 dark:border-amber-500/20 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-2xl shadow-amber-600/20 dark:shadow-amber-500/10 relative z-10 transition-theme"
          >
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-text-primary transition-theme">Upgrade Your Sales Stack</h2>
              <p className="text-sm sm:text-base text-text-secondary transition-theme">Get a custom deployment plan for your ideal CRM architecture.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Corporate Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  className={`w-full bg-background-surface border ${emailError ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-border-primary focus:border-amber-500 focus:ring-amber-500/50'} rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:ring-2 transition-all placeholder:text-text-secondary`}
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
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Preferred CRM</label>
                <div className="relative">
                  <select 
                    value={formData.crmType}
                    onChange={(e) => setFormData({...formData, crmType: e.target.value})}
                    className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all appearance-none font-medium"
                  >
                    <option value="HubSpot" className="bg-background-primary text-text-primary">HubSpot</option>
                    <option value="Salesforce" className="bg-background-primary text-text-primary">Salesforce</option>
                    <option value="Pipedrive" className="bg-background-primary text-text-primary">Pipedrive</option>
                    <option value="Custom" className="bg-background-primary text-text-primary">Custom / Not Sure</option>
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
                  className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-text-secondary"
                  placeholder="@username or linkedin.com/in/..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !!emailError}
                className="w-full py-3.5 sm:py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-background-surface disabled:text-text-secondary text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_4px_14px_0_rgba(217,119,6,0.39)] hover:shadow-[0_6px_20px_rgba(217,119,6,0.23)] disabled:shadow-none mt-6 sm:mt-8 flex items-center justify-center gap-2 active:scale-95"
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