"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ArrowRight, Server, Mail, Users, ChevronRight, CheckSquare, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const sdrHeroImg = '/images/fractional-sdr/hero.jpg';

export default function FractionalSDRPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    targetGeo: 'USA/EMEA',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateEmail(formData.email);
    if (error) {
      setEmailError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/fractional-sdr-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'fractional_sdr_lead_submit', {
            event_category: 'form',
            event_label: 'fractional_sdr'
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
    <div className="bg-background-primary min-h-screen text-text-primary font-sans selection:bg-blue-100 dark:selection:bg-blue-500/30 transition-theme">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-background-secondary transition-theme border-b border-border-primary">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-200/50 dark:bg-blue-600/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
          <div className="absolute top-1/3 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-teal-200/50 dark:bg-teal-600/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
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
                Remote Fractional SDR for your B2B project in <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-400">24 hours.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium transition-theme">
                Zero costs for tech stack and training. A qualified part-time SDR generates leads, scrapes databases, sets up domains, and warms up emails from day one. You pay only for actual lead generation hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <a 
                  href="#lead-form" 
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] active:scale-95"
                >
                  Calculate SDR Test Drive <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-teal-100 dark:from-blue-600/20 dark:to-teal-500/20 rounded-3xl blur-[60px] md:blur-[80px] transform -rotate-6 opacity-60 dark:opacity-100 transition-theme pointer-events-none"></div>
              
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-border-primary bg-background-primary/50 backdrop-blur-sm shadow-2xl p-1.5 sm:p-2 transition-theme z-10">
                <div className="rounded-xl md:rounded-2xl overflow-hidden relative border border-border-primary aspect-[4/3] sm:aspect-auto sm:h-[350px] lg:h-[450px] transition-theme bg-background-secondary">
                  <Image 
                    src={sdrHeroImg} 
                    alt="Fractional SDR Dashboard" 
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">The True Cost of Full-Time SDRs</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">Why hiring an in-house Junior SDR for a startup is a financial trap.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                image: '/images/fractional-sdr/icon_pain_opex.png', title: 'Heavy Hidden OPEX', 
                problem: 'Besides the $2,500 salary, you are forced to pay for software: LinkedIn Sales Nav ($100), Apollo ($100), Instantly ($100), domains and proxies ($150). Total: +$500/mo extra.',
                tag: 'Wasted Budget'
              },
              { 
                image: '/images/fractional-sdr/icon_pain_time.png', title: 'Long Time-to-Value', 
                problem: 'Hiring takes 3-4 weeks. Onboarding and tool training takes another 2 weeks. You burn budget before the first email is even sent.',
                tag: 'Slow Execution'
              },
              { 
                image: '/images/fractional-sdr/icon_pain_churn.png', title: 'Burnout & Churn', 
                problem: 'The average lifespan of an SDR in one company is 6-9 months. After burnout, the hiring process and budget drain start all over again.',
                tag: 'High Turnover'
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
                  <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 px-2.5 sm:px-3 py-1 rounded-full border border-rose-100 dark:border-transparent transition-theme">{Pain.tag}</span>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">How the Fractional SDR Loop Works</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">A part-time specialist&apos;s onboard OS, managed by our platform.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16">
            {[
              { 
                title: 'Plug-and-Play Stack', image: '/images/fractional-sdr/icon_sdr_stack.png',
                desc: 'We provide and pay for all outreach infrastructure. The SDR enters the project with their own accounts in Apollo, Clay, and Smartlead.' 
              },
              { 
                title: 'Deep Expertise', image: '/images/fractional-sdr/icon_sdr_expertise.png',
                desc: 'No juniors. Our Fractional SDRs are trained to bypass spam filters, set up cascade data enrichment, and write high-converting CTAs.' 
              },
              { 
                title: 'Time Tracking', image: '/images/fractional-sdr/icon_sdr_tracking.png',
                desc: 'Strict control via trackers. You see minute-by-minute how much time was spent on database scraping, copywriting, and LinkedIn management.' 
              },
              { 
                title: 'Fast Scalability', image: '/images/fractional-sdr/icon_sdr_scale.png',
                desc: 'Need to test a new hypothesis in the US? We scale SDR load from 10 to 30 hours in 1 day. If it fails, pause without legal risks.' 
              }
            ].map((step, i) => (
              <div key={i} className="bg-background-primary/80 backdrop-blur-sm border border-border-primary p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 sm:gap-8 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 relative drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_10px_15px_rgba(37,99,235,0.2)] transition-transform duration-500">
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
                  <p className="text-text-secondary leading-relaxed text-sm font-medium transition-theme">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/40 dark:to-teal-900/40 bg-background-secondary border border-blue-100 dark:border-blue-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 max-w-4xl mx-auto shadow-lg dark:shadow-2xl relative overflow-hidden transition-theme">
            <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-[0.03] dark:opacity-10 pointer-events-none transition-theme">
              <CheckSquare className="w-24 h-24 sm:w-32 sm:h-32 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-6 sm:mb-8 text-text-primary transition-theme">What a Fractional SDR does in a week (15 hrs example):</h3>
            <ul className="space-y-3 sm:space-y-4 relative z-10">
              {[
                'Scraping and manual cleaning of 400 new contacts based on ICP.',
                'Rotation and deliverability monitoring of 5 donor domains.',
                'Sending 600 cold emails and 50 LinkedIn invites.',
                'Qualifying replies and passing warm leads (SQLs) to the CRM.'
              ].map((item, idx) => (
                 <li key={idx} className="flex items-start gap-3 sm:gap-4">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span className="text-text-secondary font-medium text-sm sm:text-lg transition-theme">{item}</span>
                 </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing / Packages */}
      <section className="py-16 md:py-24 bg-background-primary border-t border-border-primary overflow-hidden transition-theme">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">Tariff Model</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">Choose the load you need without overhead.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Hypothesis (Validation) */}
            <div 
              onClick={() => {
                setSelectedTier('validation');
                document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`bg-background-secondary border ${selectedTier === 'validation' ? 'border-blue-500 shadow-xl dark:shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'border-border-primary hover:border-blue-400 shadow-md dark:shadow-none'} rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer transition-theme flex flex-col group`}
            >
              <div className="mb-6 sm:mb-8">
                <span className="px-3 sm:px-4 py-1.5 bg-background-primary text-text-secondary text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-full border border-border-primary mb-4 sm:mb-6 inline-block shadow-sm transition-theme">Hypothesis (Validation)</span>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 transition-theme">Test Drive</h3>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-400">
                  $600 <span className="text-base sm:text-lg font-medium text-text-secondary transition-theme">/ mo</span>
                </div>
              </div>
              
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Work Time</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">15 hours per week</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <Server className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Infrastructure</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Included (up to 5 inboxes)</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Outreach Channels</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Cold Email</span>
                  </div>
                </li>
              </ul>
              <button className={`w-full py-3 sm:py-4 rounded-xl font-bold tracking-wide transition-all text-sm sm:text-base ${selectedTier === 'validation' ? 'bg-blue-600 text-white shadow-md' : 'bg-background-primary text-text-primary border border-border-primary hover:bg-background-surface'}`}>
                Select
              </button>
            </div>

            {/* Scale Pipeline */}
            <div 
              onClick={() => {
                setSelectedTier('scale');
                document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`bg-background-secondary border ${selectedTier === 'scale' ? 'border-blue-500 shadow-xl dark:shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'border-border-primary hover:border-blue-400 shadow-md dark:shadow-none'} rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer transition-theme flex flex-col relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 dark:bg-blue-500/10 rounded-bl-full pointer-events-none transition-colors"></div>
              
              <div className="mb-6 sm:mb-8 relative z-10">
                <span className="px-3 sm:px-4 py-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-full border border-blue-200 dark:border-blue-500/30 mb-4 sm:mb-6 inline-block shadow-sm transition-theme">Scale Pipeline</span>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 transition-theme">Growth</h3>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-400">
                  $1,200 <span className="text-base sm:text-lg font-medium text-text-secondary transition-theme">/ mo</span>
                </div>
              </div>
              
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow relative z-10">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Work Time</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">30 hours per week</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <Server className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Infrastructure</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Included (up to 15 inboxes + LinkedIn)</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Outreach Channels</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Cold Email + LinkedIn Automation</span>
                  </div>
                </li>
              </ul>
              <button className={`w-full py-3 sm:py-4 rounded-xl font-bold tracking-wide transition-all text-sm sm:text-base relative z-10 ${selectedTier === 'scale' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-600/30 border border-blue-200 dark:border-blue-500/50'}`}>
                Select
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="py-16 md:py-32 bg-background-secondary relative overflow-hidden border-t border-border-primary transition-theme">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-blue-200 dark:bg-blue-600/10 blur-[80px] md:blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background-primary/90 backdrop-blur-2xl border border-border-primary p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-2xl relative z-10 transition-theme">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-text-primary transition-theme leading-tight">Calculate Custom Test Drive</h2>
              <p className="text-sm sm:text-base text-text-secondary font-medium transition-theme">Get a pricing breakdown for the first 2 weeks of your part-time SDR engagement.</p>
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
                  className={`w-full bg-background-surface border ${emailError ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-border-primary focus:border-blue-500 focus:ring-blue-500/50'} rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:ring-2 transition-all placeholder:text-text-secondary`}
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
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Target Geo for Sales</label>
                <div className="relative">
                  <select 
                    value={formData.targetGeo}
                    onChange={(e) => setFormData({...formData, targetGeo: e.target.value})}
                    className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none font-medium"
                  >
                    <option value="USA/EMEA" className="bg-background-primary text-text-primary">USA / EMEA</option>
                    <option value="LATAM" className="bg-background-primary text-text-primary">LATAM</option>
                    <option value="CIS" className="bg-background-primary text-text-primary">CIS</option>
                    <option value="Other" className="bg-background-primary text-text-primary">Other</option>
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
                  className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-text-secondary"
                  placeholder="@username or linkedin.com/in/..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !!emailError}
                className="w-full py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-background-surface disabled:text-text-secondary text-white rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] disabled:shadow-none mt-6 sm:mt-8 flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? 'Processing...' : 'Calculate Test Drive'}
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