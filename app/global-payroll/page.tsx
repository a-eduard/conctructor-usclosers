"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, XCircle, DollarSign, FileText, BarChart } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const globalPayrollImg = '/images/global-payroll/hero.jpg';

const FREE_PROVIDERS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'mail.ru', 'yandex.ru'];

export default function GlobalPayrollPage() {
  const [formData, setFormData] = useState({
    email: '',
    headcount: '1-10',
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
      alert('Thank you! We will contact you shortly to calculate your custom payroll solution.');
    }, 1500);
  };

  return (
    <div className="bg-background-primary min-h-screen text-text-primary selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-200 transition-theme">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-border-primary bg-background-secondary transition-theme">
        {/* Soft Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[500px] bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none transition-theme"></div>
        <div className="absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[250px] md:h-[400px] bg-teal-50/50 dark:bg-teal-900/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none transition-theme"></div>
        
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
                <span className="block mb-1 sm:mb-2">Global</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
                  Payroll
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-text-secondary mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 transition-theme">
                Compliance for international taxes and commissions. Seamlessly manage cross-border sales compensation, ensuring full compliance and on-time payouts in multiple currencies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-emerald-600 hover:bg-emerald-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] flex items-center justify-center gap-2 active:scale-95"
                >
                  Explore Payroll 
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-text-secondary transition-theme">
                <div className="flex items-center gap-1.5 sm:gap-2 transition-theme">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background-surface transition-theme">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 transition-theme" />
                  </div>
                  Tax Compliance
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 transition-theme">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background-surface transition-theme">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 transition-theme" />
                  </div>
                  Automated Commissions
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 transition-theme">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background-surface transition-theme">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 transition-theme" />
                  </div>
                  Multi-Currency
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
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200 to-teal-100 dark:from-emerald-600/20 dark:to-teal-500/20 rounded-3xl blur-[60px] md:blur-[80px] transform -rotate-6 opacity-60 dark:opacity-100 transition-theme pointer-events-none"></div>
              
              {/* Clean Image Container */}
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-border-primary bg-background-primary/50 backdrop-blur-sm shadow-2xl p-1.5 sm:p-2 transition-theme z-10">
                <div className="rounded-xl md:rounded-2xl overflow-hidden relative border border-border-primary aspect-[4/3] sm:aspect-auto sm:h-[350px] lg:h-[400px] transition-theme bg-background-secondary">
                  <Image 
                    src={globalPayrollImg} 
                    alt="Global Payroll Workflow" 
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
                <div className="bg-background-primary/80 backdrop-blur-sm border border-border-primary rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-lg transition-theme">
                  <div className="font-black text-xl sm:text-2xl text-text-primary mb-0.5 transition-theme">On-time Payouts</div>
                  <div className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-widest transition-theme">100% Compliant</div>
                </div>
                <div className="bg-background-primary/80 backdrop-blur-sm border border-border-primary rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-lg transition-theme">
                  <div className="font-black text-xl sm:text-2xl text-text-primary mb-0.5 transition-theme">50+</div>
                  <div className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-widest transition-theme">Supported Currencies</div>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary tracking-tight transition-theme">How Global Payroll Works</h2>
            <p className="text-base sm:text-lg text-text-secondary transition-theme">
              A unified system for all your international sales reps, automating calculations, compliance, and payouts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-background-secondary border border-border-primary rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-500 group flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <div className="w-full h-32 sm:h-40 md:h-48 mb-6 sm:mb-8 relative flex items-center justify-center drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_20px_rgba(16,185,129,0.2)] transition-all duration-500">
                <Image 
                  src="/images/global-payroll/icon_compliance.png" 
                  alt="Automated Compliance" 
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">1. Automated Compliance</h3>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-medium transition-theme">
                We handle local labor laws, tax withholdings, and statutory benefits across different jurisdictions automatically.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-background-secondary border border-border-primary rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-500 group flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <div className="w-full h-32 sm:h-40 md:h-48 mb-6 sm:mb-8 relative flex items-center justify-center drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_20px_rgba(20,184,166,0.2)] transition-all duration-500">
                <Image 
                  src="/images/global-payroll/icon_commission.png" 
                  alt="Commission Tracking" 
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">2. Commission Tracking</h3>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-medium transition-theme">
                Integrate with your CRM to automatically calculate complex commission tiers, accelerators, and bonuses.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-background-secondary border border-border-primary rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-500 group flex flex-col items-center text-center sm:items-start sm:text-left sm:col-span-2 md:col-span-1"
            >
              <div className="w-full h-32 sm:h-40 md:h-48 mb-6 sm:mb-8 relative flex items-center justify-center drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_20px_rgba(59,130,246,0.2)] transition-all duration-500">
                <Image 
                  src="/images/global-payroll/icon_payouts.png" 
                  alt="1-Click Payouts" 
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">3. 1-Click Payouts</h3>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-medium transition-theme">
                Fund payroll in your native currency and pay your global team in theirs, fast and with low fees.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="lead-form" className="py-16 md:py-32 relative overflow-hidden bg-background-secondary transition-theme">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-emerald-100 dark:bg-emerald-900/10 blur-[100px] md:blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-background-primary border border-border-primary p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-2xl relative z-10 transition-theme"
          >
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-text-primary transition-theme">Simplify Your Global Sales Team</h2>
              <p className="text-sm sm:text-base text-text-secondary transition-theme">Get a custom assessment of your compliance and payroll needs.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Corporate Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  className={`w-full bg-background-surface border ${emailError ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-border-primary focus:border-emerald-500 focus:ring-emerald-500/50'} rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:ring-2 transition-all placeholder:text-text-secondary`}
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
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Sales Team Size</label>
                <div className="relative">
                  <select 
                    value={formData.headcount}
                    onChange={(e) => setFormData({...formData, headcount: e.target.value})}
                    className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none font-medium"
                  >
                    <option value="1-10" className="bg-background-primary text-text-primary">1-10</option>
                    <option value="11-50" className="bg-background-primary text-text-primary">11-50</option>
                    <option value="51-200" className="bg-background-primary text-text-primary">51-200</option>
                    <option value="200+" className="bg-background-primary text-text-primary">200+</option>
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
                  className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-text-secondary"
                  placeholder="@username or linkedin.com/in/..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !!emailError}
                className="w-full py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-background-surface disabled:text-text-secondary text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] disabled:shadow-none mt-6 sm:mt-8 flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? 'Processing...' : 'Request Assessment'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}