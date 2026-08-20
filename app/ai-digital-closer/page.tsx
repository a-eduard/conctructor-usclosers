"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const aiCloserImg = '/images/ai-digital-closer/hero.jpg';

export default function AIDigitalCloserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    crmType: 'HubSpot',
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
      const res = await fetch('/api/ai-closer-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'ai_closer_lead_submit', {
            event_category: 'form',
            event_label: 'ai_digital_closer'
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
      (window as any).gtag('event', 'deploy_ai_click', {
        event_category: 'engagement',
        event_label: 'hero_cta'
      });
    }
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-background-primary min-h-screen font-sans text-text-primary selection:bg-cyan-100 dark:selection:bg-cyan-500/30 transition-theme">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-background-secondary transition-theme border-b border-border-primary">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-cyan-200/50 dark:bg-cyan-600/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
          <div className="absolute top-1/3 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-teal-200/50 dark:bg-teal-600/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center flex-col-reverse lg:flex-row">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left mx-auto lg:mx-0 max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-bold text-[10px] sm:text-xs tracking-wide uppercase mb-6 sm:mb-8 shadow-sm transition-theme">
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.1] text-text-primary transition-theme">
                Our AI closer conducts 24/7 discovery, runs live demos, and <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400">registers hot leads.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 leading-relaxed font-medium transition-theme">
                Stop losing deals because your sales team needs to sleep. Deploy an autonomous AI agent that talks to prospects, handles objections, and qualifies leads around the clock.
              </p>
              
              <ul className="space-y-3 mb-8 sm:mb-10 text-left w-fit mx-auto lg:mx-0">
                <li className="flex items-center gap-3 text-text-primary font-bold text-sm sm:text-base transition-theme"><CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> 24/7 Live Product Demos</li>
                <li className="flex items-center gap-3 text-text-primary font-bold text-sm sm:text-base transition-theme"><CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Instant Lead Registration</li>
                <li className="flex items-center gap-3 text-text-primary font-bold text-sm sm:text-base transition-theme"><CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Automated Discovery Loops</li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button 
                  onClick={handleAuditClick}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm sm:text-base tracking-wide rounded-xl transition-all shadow-[0_4px_14px_0_rgba(6,182,212,0.39)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.23)] flex items-center justify-center gap-2 active:scale-95"
                >
                  Deploy AI Closer <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-200 to-teal-100 dark:from-cyan-600/20 dark:to-teal-500/20 rounded-3xl blur-[60px] md:blur-[80px] transform -rotate-6 opacity-60 dark:opacity-100 transition-theme pointer-events-none"></div>
              
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-border-primary bg-background-primary/50 backdrop-blur-sm shadow-2xl p-1.5 sm:p-2 transition-theme z-10">
                <div className="rounded-xl md:rounded-2xl overflow-hidden relative border border-border-primary aspect-[4/3] sm:aspect-auto sm:h-[350px] lg:h-[450px] transition-theme bg-background-secondary">
                  <Image 
                    src={aiCloserImg} 
                    alt="AI Digital Closer Dashboard" 
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">The Human Bottleneck</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">Why relying solely on human SDRs limits your startup&apos;s growth potential.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                image: '/images/ai-digital-closer/icon_pain_missed_leads.png', title: 'Missed Off-Hours Leads', 
                problem: 'B2B buyers research products at night and on weekends. A human team misses 40% of peak interest windows because they are simply asleep.',
                tag: 'Lost Opportunities'
              },
              { 
                image: '/images/ai-digital-closer/icon_pain_fatigue.png', title: 'SDR Burnout & Fatigue', 
                problem: 'Making 100 calls a day destroys motivation. Burned-out reps skip follow-ups, sound robotic on the phone, and quit after 6 months.',
                tag: 'High Churn'
              },
              { 
                image: '/images/ai-digital-closer/icon_pain_inconsistent.png', title: 'Inconsistent Pitches', 
                problem: 'Humans forget key value props, fumble complex objections, and fail to log critical discovery data into the CRM after the call.',
                tag: 'Human Error'
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

      {/* Architecture / Solutions Section */}
      <section className="py-16 md:py-24 bg-background-secondary border-t border-border-primary transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">How the AI Closer Works</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">The anatomy of a perfect, tireless digital sales machine.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                title: '24/7 Autonomous Sales', image: '/images/ai-digital-closer/icon_ai_24_7.png',
                desc: 'Instantly responds to inbound inquiries within seconds, booking meetings and answering questions while your competitors sleep.',
                bullets: ['Zero Wait Time', 'Always Online', 'Global Reach']
              },
              {
                title: 'Live Product Demos', image: '/images/ai-digital-closer/icon_ai_demo.png',
                desc: 'Conducts interactive, personalized product walkthroughs tailored to the prospect\'s exact use case and industry.',
                bullets: ['Dynamic Walkthroughs', 'Use-Case Personalization', 'Objection Handling']
              },
              {
                title: 'Automated Discovery Loops', image: '/images/ai-digital-closer/icon_ai_discovery.png',
                desc: 'Executes perfect BANT/MEDDIC qualification, intelligently navigating conversation trees to identify true buyers.',
                bullets: ['BANT/MEDDIC Scoring', 'Contextual Questions', 'Intent Recognition']
              },
              {
                title: 'Instant CRM Sync', image: '/images/ai-digital-closer/icon_ai_crm.png',
                desc: 'Flawlessly logs chat transcripts, call summaries, and extracted data points directly into HubSpot or Salesforce instantly.',
                bullets: ['Zero Manual Data Entry', 'HubSpot/Salesforce Native', 'Clean Pipelines']
              }
            ].map((module, i) => (
              <div key={i} className="bg-background-primary/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 sm:gap-8 border border-border-primary hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300 group transition-theme">
                <div className="w-24 h-24 sm:w-32 sm:h-32 relative shrink-0 drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_10px_15px_rgba(6,182,212,0.2)] transition-transform duration-500">
                  <Image 
                    src={module.image} 
                    alt={module.title} 
                    fill
                    sizes="(max-width: 640px) 96px, 128px"
                    className="object-contain" 
                  />
                </div>
                <div className="flex-1 flex flex-col h-full">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-text-primary transition-theme">{module.title}</h3>
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium mb-4 sm:mb-6 flex-grow transition-theme">{module.desc}</p>
                  <ul className="space-y-2 sm:space-y-3 mt-auto">
                    {module.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-text-primary transition-theme">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400" /> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Packages Section */}
      <section className="py-16 md:py-24 bg-background-primary border-t border-border-primary/50 overflow-hidden transition-theme">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">Deploy Your AI Agent</h2>
            <p className="text-text-secondary text-base sm:text-lg font-medium transition-theme">Select the AI configuration that fits your sales pipeline.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* AI SDR */}
            <div 
              onClick={() => {
                setSelectedTier('sdr');
                document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`bg-background-secondary border ${selectedTier === 'sdr' ? 'border-cyan-500 shadow-xl dark:shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border-border-primary hover:border-cyan-400 shadow-md dark:shadow-none'} rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer transition-all flex flex-col group`}
            >
              <div className="mb-6 sm:mb-8">
                <span className="px-3 sm:px-4 py-1.5 bg-background-primary text-text-secondary text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-full border border-border-primary mb-4 sm:mb-6 inline-block shadow-sm transition-theme">Inbound Router</span>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 transition-theme">AI SDR</h3>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400">
                  $1,500 <span className="text-base sm:text-lg font-medium text-text-secondary transition-theme">/ mo</span>
                </div>
              </div>
              
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Core Function</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Inbound Qualification & Booking</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Availability</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">24/7 Text/Web Chat Support</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Software Integration</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">CRM Sync + Calendar Booking</span>
                  </div>
                </li>
              </ul>
              <button className={`w-full py-3 sm:py-4 rounded-xl font-bold tracking-wide transition-all text-sm sm:text-base ${selectedTier === 'sdr' ? 'bg-cyan-600 text-white shadow-md' : 'bg-background-primary text-text-primary border border-border-primary hover:bg-background-surface'}`}>
                Deploy AI SDR
              </button>
            </div>

            {/* AI Closer */}
            <div 
              onClick={() => {
                setSelectedTier('closer');
                document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`bg-background-secondary border ${selectedTier === 'closer' ? 'border-cyan-500 shadow-xl dark:shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border-border-primary hover:border-cyan-400 shadow-md dark:shadow-none'} rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer transition-all flex flex-col relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-100 dark:bg-cyan-500/10 rounded-bl-full pointer-events-none transition-colors"></div>
              
              <div className="mb-6 sm:mb-8 relative z-10">
                <span className="px-3 sm:px-4 py-1.5 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-full border border-cyan-200 dark:border-cyan-500/30 mb-4 sm:mb-6 inline-block shadow-sm transition-theme">Full Pipeline</span>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 transition-theme">AI Closer</h3>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400">
                  $3,000 <span className="text-base sm:text-lg font-medium text-text-secondary transition-theme">/ mo</span>
                </div>
              </div>
              
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow relative z-10">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Core Function</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Interactive Demos & Objection Handling</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Availability</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Voice + Video Walkthroughs</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-text-primary block transition-theme">Software Integration</span>
                    <span className="text-[10px] sm:text-xs font-medium text-text-secondary transition-theme">Deep CRM Sync + Custom Knowledge Base</span>
                  </div>
                </li>
              </ul>
              <button className={`w-full py-3 sm:py-4 rounded-xl font-bold tracking-wide transition-all text-sm sm:text-base relative z-10 ${selectedTier === 'closer' ? 'bg-cyan-600 text-white shadow-md' : 'bg-cyan-50 dark:bg-cyan-600/20 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-600/30 border border-cyan-200 dark:border-cyan-500/50'}`}>
                Deploy AI Closer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="py-16 md:py-32 bg-background-secondary relative overflow-hidden border-t border-border-primary/50 transition-theme">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-cyan-200 dark:bg-cyan-600/10 blur-[80px] md:blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background-primary/90 backdrop-blur-2xl border border-border-primary p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-2xl relative z-10 transition-theme">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-text-primary transition-theme leading-tight">Build Your Custom AI Agent</h2>
              <p className="text-sm sm:text-base text-text-secondary font-medium transition-theme">Request a demo of our AI closer tailored specifically to your product.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Corporate Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  // text-base prevents iOS Safari zoom
                  className={`w-full bg-background-surface border ${emailError ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-border-primary focus:border-cyan-500 focus:ring-cyan-500/50'} rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:ring-2 transition-all placeholder:text-text-secondary`}
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
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Which CRM do you use?</label>
                <div className="relative">
                  <select 
                    value={formData.crmType}
                    onChange={(e) => setFormData({...formData, crmType: e.target.value})}
                    className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all appearance-none font-medium"
                  >
                    <option value="HubSpot" className="bg-background-primary text-text-primary">HubSpot</option>
                    <option value="Salesforce" className="bg-background-primary text-text-primary">Salesforce</option>
                    <option value="Pipedrive" className="bg-background-primary text-text-primary">Pipedrive</option>
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
                  className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-text-secondary"
                  placeholder="@username or linkedin.com/in/..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !!emailError}
                className="w-full py-3.5 sm:py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-background-surface disabled:text-text-secondary text-white rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(6,182,212,0.39)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.23)] disabled:shadow-none mt-6 sm:mt-8 flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? 'Processing...' : 'Request AI Demo'}
              </button>
              
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 text-[10px] sm:text-xs font-bold text-text-secondary transition-theme">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Secure submission.
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}