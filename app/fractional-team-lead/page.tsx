"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ArrowRight, BarChart4, ChevronRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const teamLeadHeroImg = '/images/fractional-team-lead/hero.jpg';

export default function FractionalTeamLeadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    salesReps: '1-2',
    socialLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

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

  const handleTierClick = (tier: string) => {
    setSelectedTier(tier);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'tier_card_click', {
        event_category: 'engagement',
        event_label: tier
      });
    }
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
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
      const res = await fetch('/api/fractional-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'fractional_tl_lead_submit', {
            event_category: 'form',
            event_label: 'fractional_team_lead'
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

  return (
    <div className="bg-background-primary min-h-screen text-text-primary font-sans selection:bg-purple-100 dark:selection:bg-purple-500/30 transition-theme">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-background-secondary transition-theme border-b border-border-primary">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-200/50 dark:bg-purple-600/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
          <div className="absolute top-1/3 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-fuchsia-200/50 dark:bg-fuchsia-600/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center flex-col-reverse lg:flex-row">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left mx-auto lg:mx-0 max-w-2xl"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.1] text-text-primary transition-theme">
                Systemic Sales Team Lead for your startup in 48 hours. <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500 dark:from-purple-400 dark:to-fuchsia-400">Part-time.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium transition-theme">
                Why overpay for a full-time director? An experienced Fractional Team Lead will take control of your SDRs/AEs, set up CRM hygiene, implement daily syncs, and conduct call listening. Increase funnel conversion for 30% of the cost of an in-house executive.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <a 
                  href="#lead-form" 
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(147,51,234,0.39)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.23)] active:scale-95"
                >
                  Hire a Fractional Team Lead <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-fuchsia-100 dark:from-purple-600/20 dark:to-fuchsia-500/20 rounded-3xl blur-[60px] md:blur-[80px] transform -rotate-6 opacity-60 dark:opacity-100 transition-theme pointer-events-none"></div>
              
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-border-primary bg-background-primary/50 backdrop-blur-sm shadow-2xl p-1.5 sm:p-2 transition-theme z-10">
                <div className="rounded-xl md:rounded-2xl overflow-hidden relative border border-border-primary aspect-[4/3] sm:aspect-auto sm:h-[350px] lg:h-[450px] transition-theme bg-background-secondary">
                  <Image 
                    src={teamLeadHeroImg} 
                    alt="Fractional Team Lead Dashboard" 
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">The Symptoms of Sales Chaos</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">What happens inside your sales department right now without dedicated leadership.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                image: '/images/fractional-team-lead/icon_pain_graveyard.png', title: 'CRM is a Graveyard', 
                problem: 'Sales reps don\'t fill custom fields, forget to move deals through pipeline stages, and skip call summaries. Your analytics are completely blind.',
                tag: 'Blind Analytics'
              },
              { 
                image: '/images/fractional-team-lead/icon_pain_calls.png', title: 'No One Listens to Calls', 
                problem: 'Managers blow leads at the Discovery stage, make critical errors in scripts, and fail to handle Enterprise objections. The same mistakes repeat daily.',
                tag: 'Lost Revenue'
              },
              { 
                image: '/images/fractional-team-lead/icon_pain_micromanagement.png', title: 'Founder Micromanagement', 
                problem: 'Instead of focusing on strategy and raising investments, the founder personally runs sales syncs, polices discipline, and calculates KPIs manually.',
                tag: 'Wasted Time'
              }
            ].map((Pain, i) => (
              <div key={i} className="bg-background-secondary p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border-primary flex flex-col h-full hover:shadow-xl hover:border-rose-500/30 transition-all duration-300 group transition-theme">
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
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium flex-grow transition-theme">{Pain.problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions / Responsibilities */}
      <section className="py-16 md:py-24 bg-background-secondary relative overflow-hidden transition-theme border-t border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">Fractional Team Lead Responsibilities</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">How tasks are distributed under a part-time contract (10-20 hours per week).</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              { 
                title: 'Discipline & Rhythm', image: '/images/fractional-team-lead/icon_lead_discipline.png',
                desc: 'Daily 15-minute morning standups (reviewing SDR/AE daily plans) and a weekly deep-dive pipeline review.' 
              },
              { 
                title: 'QA & Call Quality', image: '/images/fractional-team-lead/icon_lead_qa.png',
                desc: 'Regular listening and scoring of demo call recordings in Gong / tl;dv / Fireflies. Adapting scripts to market feedback.' 
              },
              { 
                title: 'RevOps & Dashboards', image: '/images/fractional-team-lead/icon_lead_revops.png',
                desc: 'Building transparent reporting in CRM (HubSpot / Pipedrive). Monitoring Activity Rate, Reply Rate, Booking Rate, Close Rate.' 
              },
              { 
                title: 'Coaching & Development', image: '/images/fractional-team-lead/icon_lead_coaching.png',
                desc: 'Conducting live role-plays with reps, breaking down complex Enterprise cases, and helping close stuck late-stage deals.' 
              }
            ].map((step, i) => (
              <div key={i} className="bg-background-primary/80 backdrop-blur-sm border border-border-primary p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 sm:gap-8 hover:shadow-xl hover:border-purple-500/30 transition-all duration-300 group transition-theme">
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 relative drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_10px_15px_rgba(147,51,234,0.2)] transition-transform duration-500">
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

          <div className="mt-10 sm:mt-12 bg-background-primary bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/40 dark:to-fuchsia-900/40 border border-purple-200 dark:border-purple-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center max-w-4xl mx-auto shadow-xl dark:shadow-2xl relative overflow-hidden transition-theme">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 sm:mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-text-primary transition-theme">
              <BarChart4 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 shrink-0" /> 
              The Core Financial Advantage
            </h3>
            <p className="text-text-secondary leading-relaxed max-w-3xl mx-auto font-medium text-sm sm:text-lg transition-theme">
              You get the Senior-level expertise of a top manager (whom the startup cannot afford full-time) for the exact amount of hours needed to control your current mini-team. <strong className="text-purple-700 dark:text-purple-400 font-extrabold transition-theme">No payroll taxes, no equity grants, no drawn-out firing processes.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing / Packages */}
      <section className="py-16 md:py-24 bg-background-primary border-t border-border-primary/50 overflow-hidden transition-theme">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">Transparent Engagement Models</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">Select the tier that matches your current team size and growth phase.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Operational Lead */}
            <div 
              onClick={() => handleTierClick('operational')}
              className={`bg-background-secondary border ${selectedTier === 'operational' ? 'border-purple-500 shadow-xl dark:shadow-[0_0_30px_rgba(147,51,234,0.3)]' : 'border-border-primary hover:border-purple-400 shadow-md dark:shadow-none'} rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer transition-theme flex flex-col group`}
            >
              <div className="mb-6 sm:mb-8">
                <span className="px-3 sm:px-4 py-1.5 bg-background-primary text-text-secondary text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-full border border-border-primary mb-4 sm:mb-6 inline-block shadow-sm transition-theme">Best for Early Stage</span>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 transition-theme">Operational Lead</h3>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500 dark:from-purple-400 dark:to-fuchsia-400">
                  $1,000 <span className="text-base sm:text-lg font-medium text-text-secondary transition-theme">/ mo</span>
                </div>
              </div>
              
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Time Allocation</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">10 hours per week</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Team Size</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Up to 2-3 SDR/AE</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Tech Integration</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Basic CRM audit & hygiene</span>
                  </div>
                </li>
              </ul>
              <button className={`w-full py-3 sm:py-4 rounded-xl font-bold tracking-wide transition-all text-sm sm:text-base ${selectedTier === 'operational' ? 'bg-purple-600 text-white shadow-md' : 'bg-background-primary text-text-primary border border-border-primary hover:bg-background-surface'}`}>
                Select Package
              </button>
            </div>

            {/* Scale & Growth */}
            <div 
              onClick={() => handleTierClick('scale')}
              className={`bg-background-secondary border ${selectedTier === 'scale' ? 'border-purple-500 shadow-xl dark:shadow-[0_0_30px_rgba(147,51,234,0.3)]' : 'border-border-primary hover:border-purple-400 shadow-md dark:shadow-none'} rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer transition-theme flex flex-col relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-purple-100 dark:bg-purple-500/10 rounded-bl-full pointer-events-none transition-theme"></div>
              
              <div className="mb-6 sm:mb-8 relative z-10">
                <span className="px-3 sm:px-4 py-1.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-full border border-purple-200 dark:border-purple-500/30 mb-4 sm:mb-6 inline-block shadow-sm transition-theme">Recommended</span>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 transition-theme">Scale & Growth</h3>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500 dark:from-purple-400 dark:to-fuchsia-400">
                  $2,500 <span className="text-base sm:text-lg font-medium text-text-secondary transition-theme">/ mo</span>
                </div>
              </div>
              
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow relative z-10">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Time Allocation</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">20 hours per week</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Team Size</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Up to 5-6 SDR/AE + Recruiting support</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Tech Integration</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Deep RevOps automation + Gong</span>
                  </div>
                </li>
              </ul>
              <button className={`w-full py-3 sm:py-4 rounded-xl font-bold tracking-wide transition-all text-sm sm:text-base relative z-10 ${selectedTier === 'scale' ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-600/30 border border-purple-200 dark:border-purple-500/50'}`}>
                Select Package
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="py-16 md:py-32 bg-background-secondary relative overflow-hidden border-t border-border-primary/50 transition-theme">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-purple-200 dark:bg-purple-600/10 blur-[80px] md:blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background-primary/90 backdrop-blur-2xl border border-border-primary p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-2xl relative z-10 transition-theme">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-text-primary transition-theme leading-tight">Book Express Audit</h2>
              <p className="text-sm sm:text-base text-text-secondary font-medium transition-theme">Get a 15-minute breakdown of your current team structure and a roadmap for part-time management implementation.</p>
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
                  className={`w-full bg-background-surface border ${emailError ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-border-primary focus:border-purple-500 focus:ring-purple-500/50'} rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:ring-2 transition-all placeholder:text-text-secondary`}
                  placeholder="founder@yourstartup.com"
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
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Current Sales Reps Count</label>
                <div className="relative">
                  <select 
                    value={formData.salesReps}
                    onChange={(e) => setFormData({...formData, salesReps: e.target.value})}
                    className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none font-medium"
                  >
                    <option value="0" className="bg-background-primary text-text-primary">0 (Starting from scratch)</option>
                    <option value="1-2" className="bg-background-primary text-text-primary">1 - 2 Reps</option>
                    <option value="3-5" className="bg-background-primary text-text-primary">3 - 5 Reps</option>
                    <option value="5+" className="bg-background-primary text-text-primary">More than 5 Reps</option>
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
                className="w-full py-3.5 sm:py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-background-surface disabled:text-text-secondary text-white rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(147,51,234,0.39)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.23)] disabled:shadow-none mt-6 sm:mt-8 flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? 'Booking Audit...' : 'Book 15-Min Strategy Session'}
              </button>
              
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 text-[10px] sm:text-xs font-bold text-text-secondary transition-theme">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Strict NDA on all shared data.
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}