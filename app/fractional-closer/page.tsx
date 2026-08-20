"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, CheckCircle2, XCircle, ArrowRight, ChevronRight, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const closerHeroImg = '/images/fractional-closer/hero.jpg';

export default function FractionalCloserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    averageCheck: '$3k - $10k',
    socialLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const bannedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mail.ru', 'yandex.ru', 'icloud.com', 'aol.com'];
    const domain = email.split('@')[1];
    if (domain && bannedDomains.includes(domain.toLowerCase())) {
      return 'Please enter a valid corporate email address.';
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
      const res = await fetch('/api/fractional-closer-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'fractional_closer_lead_submit', {
            event_category: 'form',
            event_label: 'fractional_closer'
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

  const handleAuditClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'winrate_audit_click', {
        event_category: 'engagement',
        event_label: 'hero_cta'
      });
    }
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-background-primary min-h-screen text-text-primary font-sans selection:bg-orange-100 dark:selection:bg-orange-500/30 transition-theme">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-background-secondary transition-theme border-b border-border-primary">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-orange-200/50 dark:bg-orange-600/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
          <div className="absolute top-1/3 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-rose-200/50 dark:bg-rose-600/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:items-start flex-col-reverse lg:flex-row">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left mx-auto lg:mx-0 max-w-2xl lg:pt-2"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.1] text-text-primary transition-theme">
                Top Closer (Senior AE) on demand. <br className="hidden sm:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-500 dark:from-orange-400 dark:to-rose-400">Commission-heavy.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium transition-theme">
                Hand over demo calls and contract closing to professionals with experience in $100k+ deals. A Fractional Closer steps in part-time, takes over the pipeline from your calendar, and squeezes leads until payment. Low base + high commission on actual cash collected.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button 
                  onClick={handleAuditClick}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.23)] active:scale-95"
                >
                  Connect a Closer to Pipeline <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </motion.div>

            {/* Visual Trigger: Clean 3D Image Output */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-[500px] mx-auto lg:max-w-none mt-8 lg:mt-0"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-rose-100 dark:from-orange-600/20 dark:to-rose-500/20 rounded-3xl blur-[60px] md:blur-[80px] transform -rotate-6 opacity-60 dark:opacity-100 transition-theme pointer-events-none"></div>
              
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-border-primary bg-background-primary/50 backdrop-blur-sm shadow-2xl p-1.5 sm:p-2 transition-theme z-10">
                <div className="rounded-xl md:rounded-2xl overflow-hidden relative border border-border-primary aspect-[4/3] sm:aspect-auto sm:h-[350px] lg:h-[450px] transition-theme bg-background-secondary">
                  <Image 
                    src={closerHeroImg} 
                    alt="Fractional Closer Dashboard" 
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
      <section className="py-16 md:py-24 bg-background-primary border-t border-border-primary/50 transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">The Demo Bottleneck</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">Financial inefficiencies of hiring a classic full-time Enterprise AE.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                image: '/images/fractional-closer/icon_pain_base.png', title: 'Expensive Full-Time Base', 
                problem: 'Senior AEs demand a steady $4,000–$8,000 base salary before they even make their first sale. The startup bears massive cash flow risks during long sales cycles.',
                tag: 'Cash Flow Risk'
              },
              { 
                image: '/images/fractional-closer/icon_pain_gap.png', title: 'The "Demo-to-Close" Gap', 
                problem: 'Marketers and SDRs fill the calendar with meetings, but junior reps don\'t know how to handle Enterprise objections, security teams, and procurement. Leads burn up.',
                tag: 'Burnt Leads'
              },
              { 
                image: '/images/fractional-closer/icon_pain_founder.png', title: 'Founder as Eternal Salesman', 
                problem: 'The CEO personally conducts 4-5 demos a day. The business stops growing because the founder has no time for product, strategy, and fundraising.',
                tag: 'Growth Stagnation'
              }
            ].map((Pain, i) => (
              <div key={i} className="bg-background-secondary p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border-primary flex flex-col h-full hover:shadow-xl dark:hover:border-rose-500/30 transition-all duration-300 group transition-theme">
                <div className="w-full h-32 sm:h-40 mb-5 sm:mb-6 relative flex items-center justify-center drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-xl transition-all duration-500">
                  <Image 
                    src={Pain.image} 
                    alt={Pain.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain" 
                  />
                </div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 px-2.5 sm:px-3 py-1 rounded-full border border-rose-100 dark:border-transparent transition-theme">{Pain.tag}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">{Pain.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium flex-grow transition-theme">{Pain.problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions / How it works */}
      <section className="py-16 md:py-24 bg-background-secondary relative overflow-hidden transition-theme border-t border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">How the Fractional Closer Loop Works</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">The operational pipeline of integrating a part-time closer from our platform.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16">
            {[
              { 
                title: 'Instant Onboarding', image: '/images/fractional-closer/icon_closer_onboarding.png',
                desc: 'The Closer studies your Playbook, product, and Value Proposition in 3 days, followed by a live certification.' 
              },
              { 
                title: 'Calendar Management', image: '/images/fractional-closer/icon_closer_calendar.png',
                desc: 'Lead Routing setup: SDR books a meeting -> the slot automatically drops into the assigned Fractional AE\'s calendar.' 
              },
              { 
                title: 'Closing the Deal', image: '/images/fractional-closer/icon_closer_deal.png',
                desc: 'The Closer runs Discovery/Demo, qualifies via BANT/MEDDIC, prepares custom proposals, negotiates with legal, and secures signatures.' 
              },
              { 
                title: 'Full Transparency (QA)', image: '/images/fractional-closer/icon_closer_qa.png',
                desc: 'Every call is recorded in Gong / tl;dv. The founder can see negotiation logs and deal status in the CRM at any time.' 
              }
            ].map((step, i) => (
              <div key={i} className="bg-background-primary/80 backdrop-blur-sm border border-border-primary p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 sm:gap-8 hover:shadow-xl dark:hover:border-orange-500/30 transition-all duration-300 group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 relative drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_10px_15px_rgba(249,115,22,0.2)] transition-transform duration-500">
                  <Image 
                    src={step.image} 
                    alt={step.title} 
                    fill
                    sizes="(max-width: 640px) 96px, 128px"
                    className="object-contain" 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-text-primary transition-theme">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-medium transition-theme">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-background-primary bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-900/40 dark:to-rose-900/40 border border-orange-200 dark:border-orange-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xl dark:shadow-2xl relative overflow-hidden transition-theme">
             <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-[0.03] dark:opacity-10 pointer-events-none transition-theme">
              <TrendingUp className="w-24 h-24 sm:w-32 sm:h-32 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6 text-text-primary text-center transition-theme">Symbiosis of Motivation (Financial Model)</h3>
            <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto relative z-10">
              <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-background-primary rounded-xl border border-border-primary/50 shadow-sm transition-theme">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-text-secondary font-medium transition-theme">The base retainer is minimal (only covers hours spent on call availability and CRM management).</p>
              </div>
              <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-background-primary rounded-xl border border-border-primary/50 shadow-sm transition-theme">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-text-secondary font-medium transition-theme">The Closer&apos;s primary income is a strict % of closed and paid contracts. They are directly motivated to squeeze the absolute maximum out of every demo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Packages Comparison */}
      <section className="py-16 md:py-24 bg-background-primary border-t border-border-primary/50 overflow-hidden transition-theme">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">Engagement Models Compared</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">See why startups are switching to Fractional Closers.</p>
          </div>

          {/* Mobile Tabs, Desktop Table */}
          <div className="bg-background-secondary border border-border-primary rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl transition-theme">
            {/* Header Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border-primary bg-background-surface transition-theme">
               <div className="hidden md:block p-4 sm:p-6 text-[10px] sm:text-xs font-extrabold text-text-secondary uppercase tracking-wider transition-theme">Criteria</div>
               <div className="p-4 sm:p-6 text-center border-b md:border-b-0 md:border-l border-border-primary bg-background-primary transition-theme">
                 <h4 className="text-base sm:text-lg font-extrabold text-text-primary transition-theme">In-House AE <br className="md:hidden"/>(Full-time)</h4>
               </div>
               <div className="p-4 sm:p-6 text-center md:border-l border-border-primary bg-orange-50 dark:bg-orange-900/20 relative transition-theme">
                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 to-rose-500"></div>
                 <h4 className="text-base sm:text-lg font-extrabold text-orange-600 dark:text-orange-400">Fractional Closer</h4>
               </div>
            </div>

            {/* Rows */}
            {[
              {
                label: 'Fixed Compensation (Base)',
                inHouse: 'High ($4,000 – $8,000)',
                fractional: 'Low ($1,000 – $1,500)'
              },
              {
                label: 'Bonus Structure (% OTE)',
                inHouse: 'Standard (5-10%)',
                fractional: 'Elevated (15-25% of Cash-in)'
              },
              {
                label: 'Closing Experience (Grade)',
                inHouse: 'Usually Middle (budget constrained)',
                fractional: 'Strictly Tier-1 / Senior (vetted)'
              },
              {
                label: 'Termination Risk',
                inHouse: 'Severance payouts, legal risks, 3 months lost',
                fractional: 'Replace or disconnect in 24 hrs, zero cost'
              }
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 border-b border-border-primary/50 last:border-0 hover:bg-background-surface transition-theme">
                <div className="p-4 sm:p-5 md:p-6 text-xs sm:text-sm font-bold text-text-primary flex items-center md:items-start bg-background-surface md:bg-transparent border-b border-border-primary/30 md:border-0 transition-theme">
                  {row.label}
                </div>
                <div className="p-4 sm:p-5 md:p-6 text-xs sm:text-sm font-medium text-text-secondary md:border-l border-border-primary/50 text-center md:text-left transition-theme">
                  <span className="md:hidden font-extrabold text-text-secondary mr-2 text-[10px] sm:text-xs transition-theme">In-House:</span> 
                  {row.inHouse}
                </div>
                <div className="p-4 sm:p-5 md:p-6 text-xs sm:text-sm font-bold text-orange-700 dark:text-white bg-orange-50/50 dark:bg-orange-900/5 md:bg-transparent md:border-l border-border-primary/50 text-center md:text-left transition-theme">
                  <span className="md:hidden font-extrabold text-orange-600 dark:text-orange-500/50 mr-2 text-[10px] sm:text-xs transition-theme">Fractional:</span>
                  {row.fractional}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="py-16 md:py-32 bg-background-secondary relative overflow-hidden border-t border-border-primary/50 transition-theme">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-orange-200 dark:bg-orange-600/10 blur-[80px] md:blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background-primary/90 backdrop-blur-2xl border border-border-primary p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-2xl relative z-10 transition-theme">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-text-primary transition-theme">Request a Win Rate Audit</h2>
              <p className="text-sm sm:text-base text-text-secondary font-medium transition-theme">Get an express analysis of your closing funnel and let us match you with a Fractional Closer.</p>
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
                  className={`w-full bg-background-surface border ${emailError ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-border-primary focus:border-orange-500 focus:ring-orange-500/50'} rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:ring-2 transition-all placeholder:text-text-secondary`}
                  placeholder="ceo@yourstartup.com"
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
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Average B2B Deal Size ($)</label>
                <div className="relative">
                  <select 
                    value={formData.averageCheck}
                    onChange={(e) => setFormData({...formData, averageCheck: e.target.value})}
                    className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all appearance-none font-medium"
                  >
                    <option value="Under $3k" className="bg-background-primary text-text-primary">Under $3,000</option>
                    <option value="$3k - $10k" className="bg-background-primary text-text-primary">$3,000 - $10,000</option>
                    <option value="$10k - $50k" className="bg-background-primary text-text-primary">$10,000 - $50,000</option>
                    <option value="$50k+" className="bg-background-primary text-text-primary">More than $50,000</option>
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
                  className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-text-secondary"
                  placeholder="@username or linkedin.com/in/..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !!emailError}
                className="w-full py-3.5 sm:py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-background-surface disabled:text-text-secondary text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.23)] disabled:shadow-none mt-6 sm:mt-8 flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? 'Processing...' : 'Get Win Rate Audit'}
              </button>
              
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 text-[10px] sm:text-xs font-bold text-text-secondary transition-theme">
                <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Secure request. Protected by Cloudflare.
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}