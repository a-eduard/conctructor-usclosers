"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, Database, AlertTriangle, XCircle, TrendingDown, Clock, CheckCircle2, Zap, BarChart3, Lock, ShieldCheck, Mail, Phone, Building2, User, Settings2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const dataHeroImg = '/images/data-scraping/hero.jpg';

export default function DataScrapingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    website: '',
    socialLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'mail.ru', 'yandex.ru', 'outlook.com', 'icloud.com'];
    const domain = email.split('@')[1];
    if (domain && freeDomains.includes(domain.toLowerCase())) {
      return 'Please enter a valid corporate email address to receive the free sample.';
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
      const res = await fetch('/api/data-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'submit_lead_form_success', {
            event_category: 'form',
            event_label: 'data_scraping_lead'
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

  const mockData = [
    { company: 'Stripe', name: 'Patrick Collison', title: 'CEO', email: 'p***@stripe.com', phone: '+1 (415) ***-**78', status: 'Safe to send' },
    { company: 'Plaid', name: 'Zach Perret', title: 'CEO', email: 'z***@plaid.com', phone: '+1 (650) ***-**12', status: 'Safe to send' },
    { company: 'Brex', name: 'Henrique Dubugras', title: 'Co-Founder & CEO', email: 'h***@brex.com', phone: '+1 (415) ***-**99', status: 'Safe to send' },
    { company: 'Chime', name: 'Chris Britt', title: 'CEO', email: 'c***@chime.com', phone: '+1 (800) ***-**44', status: 'Safe to send' },
    { company: 'Ramp', name: 'Eric Glyman', title: 'CEO', email: 'e***@ramp.com', phone: '+1 (212) ***-**55', status: 'Safe to send' }
  ];

  return (
    <div className="bg-background-primary min-h-screen text-text-primary font-sans selection:bg-indigo-100 dark:selection:bg-indigo-500/30 transition-theme">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-border-primary bg-background-secondary transition-theme">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-200/50 dark:bg-indigo-600/20 rounded-full blur-[80px] sm:blur-[120px]"></div>
          <div className="absolute top-1/3 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-violet-200/50 dark:bg-violet-600/20 rounded-full blur-[80px] sm:blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center flex-col-reverse lg:flex-row">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left mx-auto lg:mx-0 max-w-2xl"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.1] text-violet-600 dark:text-violet-400 transition-theme">
                Pristine B2B Leads with Guaranteed <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400">Hard Bounce &lt; 2%</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed transition-theme">
                Automatically scrape, enrich, and verify direct emails, phone numbers, and executive profiles. No more spam traps or domain blacklists. Get your first 50 contacts for free in 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <a 
                  href="#lead-form" 
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'click_sample_download', { event_category: 'cta', event_label: 'hero_download' });
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] active:scale-95"
                >
                  Download Free Database Sample <Database className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </motion.div>

            {/* Right Visuals - Now clean, just the generated image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-[500px] mx-auto lg:max-w-none mt-8 lg:mt-0 flex flex-col gap-4 sm:gap-6"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-violet-100 dark:from-indigo-600/20 dark:to-violet-500/20 rounded-3xl blur-[60px] md:blur-[80px] transform -rotate-6 opacity-60 dark:opacity-100 transition-theme pointer-events-none"></div>
              
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-border-primary bg-background-primary/50 backdrop-blur-sm shadow-2xl p-1.5 sm:p-2 transition-theme z-10">
                <div className="rounded-xl md:rounded-2xl overflow-hidden relative border border-border-primary aspect-[4/3] sm:aspect-auto sm:h-[350px] lg:h-[450px] transition-theme bg-background-secondary">
                  <Image 
                    src={dataHeroImg} 
                    alt="Data Scraping Dashboard" 
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
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">The True Cost of Bad Data</h2>
            <p className="text-text-secondary text-base sm:text-lg transition-theme">Using outdated, unverified lists destroys your domain reputation and burns your SDR budget.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                image: '/images/data-scraping/icon_cost_bounce.png', title: 'High Bounce Rate (> 5-10%)', 
                desc: 'Email providers (Google, Microsoft) instantly blacklist your company domain. Deliverability drops even for regular business emails.',
                metric: 'Domain Burned'
              },
              { 
                image: '/images/data-scraping/icon_cost_generic.png', title: 'Generic Inboxes (info@, sales@)', 
                desc: 'SDR budgets wasted. Your perfectly crafted emails get stuck at the assistant level and never reach actual decision-makers (C-level).',
                metric: '0% Reply Rate'
              },
              { 
                image: '/images/data-scraping/icon_cost_outdated.png', title: 'Outdated Static Databases', 
                desc: 'Buying static lists from 2024/2025 means calling ex-employees or closed businesses. B2B data loses relevance by 25% every 6 months.',
                metric: 'Data Decay'
              }
            ].map((Pain, i) => (
              <div key={i} className="bg-background-secondary border border-border-primary hover:shadow-xl dark:hover:border-red-500/30 transition-all duration-300 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col h-full group">
                <div className="w-full h-32 sm:h-40 mb-6 sm:mb-8 relative flex items-center justify-center drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-xl transition-all duration-500">
                  <Image 
                    src={Pain.image} 
                    alt={Pain.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain" 
                  />
                </div>
                <div className="mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-red-600 dark:text-red-400 mb-1.5 sm:mb-2 block transition-theme">Impact</span>
                  <span className="inline-block text-xs sm:text-sm font-bold text-text-primary bg-background-surface px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-border-primary shadow-sm transition-theme">{Pain.metric}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">{Pain.title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base font-medium flex-grow transition-theme">{Pain.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-background-secondary relative overflow-hidden transition-theme border-t border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold text-[10px] sm:text-xs tracking-wide uppercase mb-4 sm:mb-6 border border-indigo-200 dark:border-indigo-500/20 shadow-sm transition-theme">
              <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>The Technology</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">Real-Time Extraction & Verification</h2>
            <p className="text-text-secondary text-base sm:text-lg transition-theme">We don&apos;t sell old files from a drive. Every lead is scraped, enriched, and verified server-side at the exact moment of your request.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 relative mb-12 sm:mb-16">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-indigo-500/20 via-violet-500/30 to-indigo-500/20 z-0 transition-theme"></div>

            {[
              { 
                step: '01', title: 'Targeted Parsing', image: '/images/data-scraping/icon_tech_parsing.png',
                desc: 'Real-time data extraction based on your exact ICP from 15+ open and closed sources simultaneously (LinkedIn Sales Navigator, Crunchbase, GitHub, BuiltWith).' 
              },
              { 
                step: '02', title: 'Cascade Enrichment', image: '/images/data-scraping/icon_tech_enrichment.png',
                desc: 'If one provider misses the email, the system automatically engages secondary and tertiary data layers for maximum coverage.' 
              },
              { 
                step: '03', title: '3-Stage SMTP Check', image: '/images/data-scraping/icon_tech_smtp.png',
                desc: 'Server-level mailbox existence verification without sending an email. 100% removal of Spam Traps and Catch-all addresses.' 
              }
            ].map((step, i) => (
              <div key={i} className="relative z-10 bg-background-primary border border-border-primary rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-500 flex flex-col items-center text-center group">
                <div className="w-full h-32 sm:h-40 mb-5 sm:mb-6 relative flex items-center justify-center drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 group-hover:drop-shadow-[0_20px_20px_rgba(79,70,229,0.2)] transition-all duration-500">
                  <Image 
                    src={step.image} 
                    alt={step.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain" 
                  />
                </div>
                <div className="text-[10px] sm:text-xs font-extrabold text-indigo-600 dark:text-indigo-500 mb-2 sm:mb-3 tracking-widest uppercase bg-indigo-50 dark:bg-indigo-500/10 px-2.5 sm:px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-500/20 transition-theme">Phase {step.step}</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-text-primary transition-theme">{step.title}</h3>
                <p className="text-text-secondary font-medium text-sm sm:text-base leading-relaxed transition-theme">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/40 dark:to-violet-900/40 border border-indigo-100 dark:border-indigo-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center max-w-4xl mx-auto shadow-lg transition-theme">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 sm:mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-text-primary transition-theme">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 dark:text-amber-400 shrink-0" /> 
              The Core Technological Advantage
            </h3>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-medium transition-theme">
              If an address looks suspicious during our real-time validation process, it is automatically dropped from your list, and <strong className="text-indigo-700 dark:text-white font-extrabold">you do not pay for it.</strong> You only pay for contacts guaranteed to receive your emails.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Data Table / Proof */}
      <section className="py-16 md:py-24 bg-background-primary border-t border-border-primary overflow-hidden transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">See The Quality Yourself</h2>
            <p className="text-text-secondary text-base sm:text-lg transition-theme">Hover over rows to see detailed validation logs. This is the exact format your final delivery will be in.</p>
          </div>

          <div className="bg-background-secondary rounded-2xl border border-border-primary overflow-x-auto shadow-xl dark:shadow-2xl transition-theme scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border-primary bg-background-surface transition-theme">
                  <th className="py-4 px-6 text-[10px] sm:text-xs font-extrabold text-text-secondary uppercase tracking-wider transition-theme">Company</th>
                  <th className="py-4 px-6 text-[10px] sm:text-xs font-extrabold text-text-secondary uppercase tracking-wider transition-theme">Executive Name</th>
                  <th className="py-4 px-6 text-[10px] sm:text-xs font-extrabold text-text-secondary uppercase tracking-wider transition-theme">Title</th>
                  <th className="py-4 px-6 text-[10px] sm:text-xs font-extrabold text-text-secondary uppercase tracking-wider transition-theme">Verified Email</th>
                  <th className="py-4 px-6 text-[10px] sm:text-xs font-extrabold text-text-secondary uppercase tracking-wider transition-theme">Direct Phone</th>
                  <th className="py-4 px-6 text-[10px] sm:text-xs font-extrabold text-text-secondary uppercase tracking-wider text-right transition-theme">Validation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary/50 transition-theme">
                {mockData.map((row, i) => (
                  <tr key={i} className="hover:bg-background-surface transition-colors group relative cursor-pointer">
                    <td className="py-4 sm:py-5 px-6 font-bold text-sm sm:text-base text-text-primary flex items-center gap-2 sm:gap-3 transition-theme">
                      <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-secondary transition-theme shrink-0" />
                      {row.company}
                    </td>
                    <td className="py-4 sm:py-5 px-6 text-sm sm:text-base text-text-primary font-bold transition-theme">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-secondary transition-theme shrink-0" />
                        {row.name}
                      </div>
                    </td>
                    <td className="py-4 sm:py-5 px-6 text-sm sm:text-base text-text-secondary font-medium transition-theme">{row.title}</td>
                    <td className="py-4 sm:py-5 px-6 font-mono text-xs sm:text-sm text-indigo-600 dark:text-indigo-300 font-bold flex items-center gap-1.5 sm:gap-2 transition-theme">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-secondary transition-theme shrink-0" />
                      {row.email}
                    </td>
                    <td className="py-4 sm:py-5 px-6 font-mono text-xs sm:text-sm text-text-secondary font-medium transition-theme">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-secondary transition-theme shrink-0" />
                        {row.phone}
                      </div>
                    </td>
                    <td className="py-4 sm:py-5 px-6 text-right relative">
                      <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-[10px] sm:text-xs font-extrabold tracking-wide shadow-sm transition-theme whitespace-nowrap">
                        <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                        Safe to send
                      </div>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 mr-32 sm:mr-36 w-56 sm:w-64 bg-background-primary border border-border-primary rounded-lg p-3 sm:p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-left transition-theme hidden md:block">
                        <div className="text-[10px] sm:text-xs font-mono text-text-secondary space-y-2 font-bold transition-theme">
                          <div className="text-green-600 dark:text-green-400 flex items-center gap-2 transition-theme"><CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5"/> Syntax: Valid</div>
                          <div className="text-green-600 dark:text-green-400 flex items-center gap-2 transition-theme"><CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5"/> MX Records: Found</div>
                          <div className="text-green-600 dark:text-green-400 flex items-center gap-2 transition-theme"><CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5"/> SMTP: Deliverable</div>
                          <div className="text-text-secondary flex items-center gap-2 transition-theme"><Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5"/> Catch-all: False</div>
                          <div className="text-text-secondary flex items-center gap-2 transition-theme"><Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5"/> Spam Trap: False</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing & Guarantees */}
      <section 
        className="py-16 md:py-24 bg-background-secondary border-t border-border-primary transition-theme"
        onMouseEnter={() => {
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'view_pricing_tier', { event_category: 'engagement', event_label: 'pricing_view' });
          }
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-text-primary transition-theme">Simple Pricing. Ironclad Guarantees.</h2>
            <p className="text-text-secondary text-base sm:text-lg transition-theme">Pay only for data that actually drives revenue. No hidden fees.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            {[
              { name: 'Pilot', leads: '500 Contacts', price: '$150', desc: 'Perfect for testing a new market segment or outreach campaign.' },
              { name: 'Growth', leads: '2,500 Contacts', price: '$500', desc: 'For established sales teams executing continuous outbound.', highlighted: true },
              { name: 'Scale (API)', leads: '10,000+ Contacts', price: 'Custom Rate', sub: '$0.12 / lead', desc: 'Direct API access and bulk extraction for agencies and enterprises.' }
            ].map((tier, i) => (
              <div key={i} className={`relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${tier.highlighted ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500 shadow-xl dark:shadow-[0_0_30px_rgba(79,70,229,0.15)] sm:scale-105 z-10' : 'bg-background-primary border-border-primary shadow-lg dark:shadow-none'} flex flex-col transition-theme`}>
                {tier.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 sm:px-4 py-1 bg-indigo-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full shadow-md whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2 transition-theme">{tier.name}</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-text-primary transition-theme">{tier.price}</span>
                  {tier.sub && <span className="text-text-secondary text-xs sm:text-sm ml-2 font-medium transition-theme">{tier.sub}</span>}
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 text-sm sm:text-base font-bold mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border-primary/50 transition-theme">{tier.leads} Verified</div>
                <p className="text-text-secondary text-xs sm:text-sm font-medium leading-relaxed flex-grow mb-6 sm:mb-8 transition-theme">{tier.desc}</p>
                <a href="#lead-form" className={`w-full py-3 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${tier.highlighted ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95' : 'bg-background-surface hover:bg-border-primary text-text-primary active:scale-95'}`}>
                  Get Started
                </a>
              </div>
            ))}
          </div>

          {/* Guarantee Banner */}
          <div className="bg-background-primary border border-border-primary shadow-xl p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-12 transition-theme">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 relative flex items-center justify-center shrink-0 drop-shadow-xl hover:scale-105 transition-transform duration-500">
              <Image 
                src="/images/data-scraping/icon_guarantee.png" 
                alt="Legal SLA Guarantee" 
                fill
                sizes="(max-width: 768px) 96px, 160px"
                className="object-contain" 
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 sm:mb-4 text-text-primary transition-theme leading-tight">
                Legal SLA & <span className="text-emerald-600 dark:text-emerald-400">Hard Bounce Guarantee</span>
              </h3>
              <p className="text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed font-medium transition-theme">
                If the Hard Bounce rate on our delivered list exceeds 2%, we provide an automatic, free top-up of new contacts at a <strong className="text-text-primary font-extrabold transition-theme">3:1 ratio</strong> for every single undelivered email. Guaranteed by contract.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="py-16 md:py-32 bg-background-primary relative overflow-hidden transition-theme border-t border-border-primary">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-indigo-100 dark:bg-indigo-600/10 blur-[80px] md:blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background-secondary border border-border-primary p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-2xl transition-theme">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-text-primary transition-theme leading-tight">Get Your Free 50-Lead Sample</h2>
              <p className="text-sm sm:text-base text-text-secondary font-medium transition-theme">Enter your details below to receive a custom-scraped data sample tailored to your ICP.</p>
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
                  className={`w-full bg-background-surface border ${emailError ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-border-primary focus:border-indigo-500 focus:ring-indigo-500/50'} rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:ring-2 transition-all placeholder:text-text-secondary`}
                  placeholder="name@yourcompany.com"
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
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Company Website</label>
                <input 
                  type="url" 
                  required
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-text-secondary"
                  placeholder="https://yourcompany.com"
                />
                <p className="text-[10px] sm:text-[11px] font-bold text-text-secondary transition-theme">We use this to analyze your business and pre-qualify your ICP.</p>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-bold text-text-secondary transition-theme">Telegram or LinkedIn Profile</label>
                <input 
                  type="text" 
                  required
                  value={formData.socialLink}
                  onChange={(e) => setFormData({...formData, socialLink: e.target.value})}
                  className="w-full bg-background-surface border border-border-primary rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-sm text-text-primary focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-text-secondary"
                  placeholder="@username or linkedin.com/in/..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !!emailError}
                className="w-full py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-background-surface disabled:text-text-secondary text-white rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] disabled:shadow-none mt-6 sm:mt-8 flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? 'Processing Request...' : 'Download Free Sample'}
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