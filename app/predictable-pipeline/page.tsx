"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ShieldCheck, Target, DollarSign, Calculator, ArrowRight, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const pipelineHeroImg = '/images/predictable-pipeline/hero.jpg';

export default function PredictablePipelinePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    dealSize: '',
    socialLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Calculator State
  const [dealValue, setDealValue] = useState<number>(5000);
  const [closeRate, setCloseRate] = useState<number>(20); // 20%
  const [targetCalls, setTargetCalls] = useState<number>(10);

  const handleCalcChange = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'roi_calc_engage', {
        event_category: 'engagement',
        event_label: 'predictable_pipeline_calculator'
      });
    }
  };

  const validateEmail = (email: string) => {
    const bannedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mail.ru', 'yandex.ru', 'icloud.com', 'aol.com'];
    const domain = email.split('@')[1];
    if (domain && bannedDomains.includes(domain.toLowerCase())) {
      return 'Please enter a valid B2B corporate email address.';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, email: val });
    if (val) {
      setEmailError(validateEmail(val));
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateEmail(formData.email);
    if (error) {
      setEmailError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/predictable-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'outreach_lead_submit', {
            event_category: 'form',
            event_label: 'predictable_pipeline'
          });
        }
        router.push('/talent-thank-you'); 
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculations
  const expectedDeals = Math.floor(targetCalls * (closeRate / 100));
  const expectedRevenue = expectedDeals * dealValue;
  const leadPackageCost = targetCalls * 250; // Mock: $250 per guaranteed SQL
  const netProfit = expectedRevenue - leadPackageCost;
  const roi = leadPackageCost > 0 ? Math.floor((netProfit / leadPackageCost) * 100) : 0;

  return (
    <div className="bg-background-primary min-h-screen text-text-primary font-sans selection:bg-rose-100 dark:selection:bg-rose-500/30 transition-theme">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-background-secondary transition-theme border-b border-border-primary">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-5 pointer-events-none transition-theme"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none transition-theme">
          <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-rose-200/50 dark:bg-rose-600/20 rounded-full blur-[80px] sm:blur-[120px] transition-theme"></div>
          <div className="absolute top-1/3 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-red-200/50 dark:bg-red-600/20 rounded-full blur-[80px] sm:blur-[120px] transition-theme"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:items-start">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left mx-auto lg:mx-0 max-w-2xl lg:pt-2"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.1] text-text-primary transition-theme">
                Stable B2B Demo Calls Flow to Your Calendar.<br className="hidden sm:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-red-500 dark:from-rose-400 dark:to-red-400">Guaranteed by Contract.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium transition-theme">
                We launch a predictable cold outreach pipeline (Email, LinkedIn). We bring Sales Qualified Leads (SQL) directly to meetings with your sales team. You pay for booked demos, not &quot;clicks&quot; or &quot;databases&quot;.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <a 
                  href="#lead-form" 
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)] active:scale-95"
                >
                  Secure Lead Guarantees <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </motion.div>

            {/* Visual Trigger: Clean 3D Image Output */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-[500px] mx-auto lg:max-w-none mt-8 lg:mt-0"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-red-100 dark:from-rose-600/20 dark:to-red-500/20 rounded-3xl blur-[60px] md:blur-[80px] transform -rotate-6 opacity-60 dark:opacity-100 transition-theme pointer-events-none"></div>
              
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-rose-100/50 dark:border-rose-500/20 bg-background-primary/50 backdrop-blur-sm shadow-2xl shadow-rose-600/20 dark:shadow-rose-500/10 p-1.5 sm:p-2 transition-theme z-10">
                <div className="rounded-xl md:rounded-2xl overflow-hidden relative border border-border-primary aspect-[4/3] sm:aspect-auto sm:h-[350px] lg:h-[450px] transition-theme bg-background-secondary">
                  <Image 
                    src={pipelineHeroImg} 
                    alt="Predictable Pipeline Dashboard" 
                    fill
                    priority
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 md:py-24 bg-background-primary border-t border-border-primary transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">Why Your Sales Team is Idle</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">The inefficiency of manual, unsystematic approaches to lead generation is bleeding your revenue.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                image: '/images/predictable-pipeline/icon_pain_burnout.png', title: 'Sales Burnout', 
                problem: 'Instead of closing deals, AEs and SDRs spend 70% of their time on manual contact searches, LinkedIn spam, and sending emails.',
                impact: 'Result: 98% ignore rate and burned-out closers.',
                tag: 'Wasted Time'
              },
              { 
                image: '/images/predictable-pipeline/icon_pain_spam.png', title: 'Spam Domain Bans', 
                problem: 'Sending cold emails from your primary domain without proper technical warm-up leads to immediate corporate blacklists.',
                impact: 'Result: Crucial emails to active clients stop reaching their inboxes.',
                tag: 'Technical Risk'
              },
              { 
                image: '/images/predictable-pipeline/icon_pain_unpredictable.png', title: 'Unpredictable Results', 
                problem: 'One month word-of-mouth brings 5 deals, the next month zero. There is no systemic lever to pull for growth.',
                impact: 'Result: You cannot plan hiring or revenue effectively.',
                tag: 'No Scale'
              }
            ].map((Pain, i) => (
              <div key={i} className="bg-background-primary border border-border-primary p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col h-full hover:shadow-xl hover:border-rose-200 dark:hover:border-rose-500/30 transition-all duration-300 group">
                <div className="w-full h-32 sm:h-40 mb-5 sm:mb-6 relative flex items-center justify-center drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_20px_20px_rgba(225,29,72,0.2)] transition-all duration-500">
                  <Image 
                    src={Pain.image} 
                    alt={Pain.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain" 
                  />
                </div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-widest bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full transition-theme">{Pain.tag}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">{Pain.title}</h3>
                <div className="space-y-3 sm:space-y-4 flex-grow flex flex-col">
                  <p className="text-sm text-text-secondary font-medium leading-relaxed flex-grow transition-theme">{Pain.problem}</p>
                  <div className="pt-3 sm:pt-4 border-t border-border-primary/50 transition-theme">
                    <p className="text-[13px] sm:text-sm text-text-primary font-bold transition-theme">{Pain.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-background-secondary relative overflow-hidden transition-theme border-t border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">How Predictable Pipeline Works</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">A fully delegated, automated lead generation operation from cold contact to booked calendar slot.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              { 
                title: 'Infrastructure Setup', image: '/images/predictable-pipeline/icon_solution_infrastructure.png',
                desc: 'Purchase and configuration of 10+ donor domains, SPF/DKIM/DMARC records, and 3-week automated warm-up via Smartlead/Instantly.' 
              },
              { 
                title: 'Smart Scraping & Enrichment', image: '/images/predictable-pipeline/icon_solution_scraping.png',
                desc: 'Scraping decision-makers via Apollo.io / LinkedIn Sales Navigator, data cleaning in Clay, and 100% email validation via SMTP checkers.' 
              },
              { 
                title: 'Multichannel Outreach', image: '/images/predictable-pipeline/icon_solution_outreach.png',
                desc: 'Sequences (3-4 follow-ups) with mailbox rotation, dynamic AI-icebreakers, and automated LinkedIn actions (Expandi / Waalaxy).' 
              },
              { 
                title: 'Inbox Management & Qualification', image: '/images/predictable-pipeline/icon_solution_inbox.png',
                desc: 'Our dedicated manager filters replies, handles objections, and pushes warm leads directly to book time in your Calendly.' 
              }
            ].map((step, i) => (
              <div key={i} className="bg-background-primary/80 backdrop-blur-sm border border-border-primary p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col items-center text-center hover:shadow-xl hover:border-rose-500/30 transition-all duration-300 group">
                <div className="w-full h-32 sm:h-44 mb-5 sm:mb-6 relative flex items-center justify-center drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_20px_rgba(225,29,72,0.2)] transition-all duration-500">
                  <Image 
                    src={step.image} 
                    alt={step.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain" 
                  />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-text-primary transition-theme">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed text-sm font-medium transition-theme">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/40 dark:to-red-900/40 border border-rose-100 dark:border-rose-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-lg dark:shadow-2xl transition-theme">
            <h3 className="text-lg sm:text-xl font-extrabold mb-3 sm:mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-text-primary transition-theme">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 shrink-0 transition-theme" /> 
              Strict SQL (Sales Qualified Lead) Criteria
            </h3>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto font-medium transition-theme">
              A meeting is considered qualified ONLY if it perfectly matches your ICP (company size, geography, decision-maker title, and identified pain point). <span className="text-rose-700 dark:text-rose-400 font-extrabold transition-theme">&quot;Just talking&quot; leads are filtered out. You only speak to buyers.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ROI Calculator Widget */}
      <section className="py-16 md:py-24 bg-background-primary border-t border-border-primary/50 transition-theme">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background-secondary border border-border-primary p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl dark:shadow-2xl relative overflow-hidden transition-theme">
            <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-rose-100 dark:bg-rose-500/10 blur-[80px] sm:blur-[120px] pointer-events-none transition-theme"></div>
            
            <div className="text-center mb-10 sm:mb-12 relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-rose-100 dark:bg-rose-500/10 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border border-rose-200 dark:border-rose-500/20 shadow-sm transition-theme">
                <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-rose-600 dark:text-rose-400 transition-theme" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-text-primary transition-theme">Pipeline ROI & Guarantee Model</h2>
              <p className="text-sm sm:text-base text-text-secondary font-medium transition-theme">Calculate your breakeven point and net profit based on guaranteed SQL deliveries.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative z-10">
              <div className="space-y-8 sm:space-y-10 bg-background-primary p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border-primary/50 shadow-sm transition-theme">
                
                {/* Input 1 */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-end transition-theme">
                    <label className="text-xs sm:text-sm font-extrabold text-text-secondary uppercase tracking-wider transition-theme">Average Deal Size</label>
                    <span className="text-rose-600 dark:text-rose-400 font-black text-base sm:text-lg transition-theme">${dealValue.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="50000" 
                    step="1000"
                    value={dealValue}
                    onChange={(e) => {
                      setDealValue(Number(e.target.value));
                      handleCalcChange();
                    }}
                    className="w-full h-2 bg-background-surface rounded-lg appearance-none cursor-pointer accent-rose-600 dark:accent-rose-500 transition-theme"
                  />
                </div>
                
                {/* Input 2 */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-end transition-theme">
                    <label className="text-xs sm:text-sm font-extrabold text-text-secondary uppercase tracking-wider transition-theme">Demo-to-Close Rate</label>
                    <span className="text-rose-600 dark:text-rose-400 font-black text-base sm:text-lg transition-theme">{closeRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    step="5"
                    value={closeRate}
                    onChange={(e) => {
                      setCloseRate(Number(e.target.value));
                      handleCalcChange();
                    }}
                    className="w-full h-2 bg-background-surface rounded-lg appearance-none cursor-pointer accent-rose-600 dark:accent-rose-500 transition-theme"
                  />
                </div>

                {/* Input 3 */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-end transition-theme">
                    <label className="text-xs sm:text-sm font-extrabold text-text-secondary uppercase tracking-wider transition-theme">Target SQLs per Month</label>
                    <span className="text-rose-600 dark:text-rose-400 font-black text-base sm:text-lg transition-theme">{targetCalls} Demos</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    step="5"
                    value={targetCalls}
                    onChange={(e) => {
                      setTargetCalls(Number(e.target.value));
                      handleCalcChange();
                    }}
                    className="w-full h-2 bg-background-surface rounded-lg appearance-none cursor-pointer accent-rose-600 dark:accent-rose-500 transition-theme"
                  />
                </div>

              </div>

              {/* Output Panel */}
              <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
                <div className="bg-background-primary border border-border-primary/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm transition-theme">
                  <p className="text-[10px] sm:text-xs text-text-secondary font-extrabold mb-1 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 transition-theme">
                    <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 transition-theme" /> Expected Closed Deals
                  </p>
                  <div className="text-3xl sm:text-4xl font-black text-text-primary transition-theme">
                    {expectedDeals} <span className="text-sm sm:text-lg font-bold text-text-secondary">/ month</span>
                  </div>
                </div>

                <div className="bg-background-primary border border-border-primary/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm transition-theme">
                  <p className="text-[10px] sm:text-xs text-text-secondary font-extrabold mb-1 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 transition-theme">
                    <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 transition-theme" /> Expected Monthly Revenue
                  </p>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 transition-theme">
                    ${expectedRevenue.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-background-primary border border-border-primary/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm transition-theme">
                    <p className="text-[9px] sm:text-[10px] text-text-secondary font-extrabold mb-1 uppercase tracking-wider transition-theme">Est. Package Cost</p>
                    <div className="text-lg sm:text-xl font-bold text-text-primary transition-theme">
                      ${leadPackageCost.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm transition-theme">
                    <p className="text-[9px] sm:text-[10px] text-rose-700 dark:text-rose-400 font-extrabold mb-1 uppercase tracking-wider transition-theme">Est. Campaign ROI</p>
                    <div className="text-lg sm:text-xl font-black text-rose-700 dark:text-rose-300 transition-theme">
                      {roi > 0 ? `+${roi}%` : '0%'}
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3 shadow-sm transition-theme">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 transition-theme" />
                  <p className="text-[11px] sm:text-xs text-emerald-800 dark:text-emerald-100/80 leading-relaxed font-bold transition-theme">
                    <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold transition-theme">SLA Guarantee:</strong> If we don&apos;t deliver the agreed {targetCalls} demo calls in a reporting month, we work for free until the KPI is met 100%.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="py-16 md:py-32 bg-background-secondary relative overflow-hidden border-t border-border-primary transition-theme">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-rose-100 dark:bg-rose-600/10 blur-[80px] md:blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background-primary/90 backdrop-blur-2xl border border-border-primary p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-2xl relative z-10 transition-theme">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-text-primary transition-theme leading-tight">Book Your Funnel Audit</h2>
              <p className="text-sm sm:text-base text-text-secondary font-medium transition-theme">We will calculate a custom pipeline strategy and lock in your lead guarantees.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Corporate Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  // text-base prevents iOS Safari zoom
                  className={`w-full bg-background-surface border ${emailError ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-border-primary focus:border-rose-500 focus:ring-rose-500/50'} rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:ring-2 transition-all placeholder:text-text-secondary`}
                  placeholder="vp.sales@yourcompany.com"
                />
                <AnimatePresence>
                  {emailError && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs font-bold text-red-500 dark:text-red-400 mt-2 flex items-center gap-1 transition-theme overflow-hidden"
                    >
                      <XCircle className="w-3.5 h-3.5 shrink-0" /> {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Your Average Deal Size (B2B)</label>
                <input 
                  type="text" 
                  required
                  value={formData.dealSize}
                  onChange={(e) => setFormData({...formData, dealSize: e.target.value})}
                  className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-text-secondary"
                  placeholder="e.g. $10,000 / year"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Telegram / LinkedIn Profile</label>
                <input 
                  type="text" 
                  required
                  value={formData.socialLink}
                  onChange={(e) => setFormData({...formData, socialLink: e.target.value})}
                  className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-text-secondary"
                  placeholder="@username or linkedin.com/in/..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !!emailError}
                className="w-full py-3.5 sm:py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-background-surface disabled:text-text-secondary text-white rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)] disabled:shadow-none mt-6 sm:mt-8 flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? 'Securing Slot...' : 'Get Custom Pipeline Proposal'}
              </button>
              
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 text-[10px] sm:text-xs font-bold text-text-secondary transition-theme">
                <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Data is encrypted and secure.
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}