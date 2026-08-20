"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  Send,
  Activity,
  CheckCircle2,
  CheckSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const CHART_DATA = [
  { name: 'Week 1', signups: 120, mrr: 15000 },
  { name: 'Week 2', signups: 250, mrr: 22000 },
  { name: 'Week 3', signups: 480, mrr: 35000 },
  { name: 'Week 4', signups: 1050, mrr: 58000 },
];

export default function VentureTractionEnginePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [socialId, setSocialId] = useState('');
  const [fundingStage, setFundingStage] = useState('Seed');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'signups' | 'mrr'>('signups');

  const handleTabClick = (tab: 'signups' | 'mrr') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'mixpanel_mockup_interaction',
        tab: tab
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'protonmail.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();

    if (!emailDomain || publicDomains.includes(emailDomain)) {
      setError('Please use your corporate email for startup verification.');
      return;
    }

    setIsSubmitting(true);
    
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'traction_engine_submit',
        email,
        fundingStage,
        socialId
      });
    }

    // Simulate Webhook POST
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Store email in sessionStorage to pre-fill Calendly if needed
      sessionStorage.setItem('leadEmail', email);
      router.push('/venture-traction-thank-you');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-background-primary min-h-screen font-sans text-text-primary selection:bg-rose-100 dark:selection:bg-rose-500/30 transition-theme">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-background-secondary transition-theme">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-rose-200/50 dark:bg-rose-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-red-200/50 dark:bg-red-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs tracking-wide uppercase mb-8 shadow-sm transition-theme">
                <TrendingUp className="w-4 h-4" /> Venture Traction Engine
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-text-primary transition-theme">
                Ignite ARR Growth Before Your Next Investment Round. <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-red-500 dark:from-rose-400 dark:to-red-400 block">With Guaranteed Traction.</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed font-medium transition-theme">
                Accelerate the scaling of your B2B/SaaS product. We implement aggressive Growth Hacking, bring in 1,000 verified sign-ups, and deploy transparent RevOps analytics to demonstrate to funds. Ready-made charts to close your round in 30 days.
              </p>
              
              <button 
                onClick={scrollToForm}
                className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold tracking-wide rounded-xl transition-all shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)] flex items-center justify-center gap-2"
              >
                Launch Traction Engine
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Chart Mockup */}
            <div className="relative h-[450px] lg:h-[550px] bg-background-primary rounded-3xl border border-border-primary shadow-xl dark:shadow-2xl overflow-hidden flex flex-col transition-theme">
              <div className="px-6 py-4 border-b border-border-primary flex items-center justify-between bg-background-surface transition-theme">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span className="font-extrabold text-text-primary tracking-wider text-sm uppercase transition-theme">Growth Analytics</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleTabClick('signups')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-theme shadow-sm ${activeTab === 'signups' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30' : 'bg-background-primary text-text-secondary hover:text-text-primary border border-border-primary'}`}
                  >
                    Sign-ups
                  </button>
                  <button 
                    onClick={() => handleTabClick('mrr')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-theme shadow-sm ${activeTab === 'mrr' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30' : 'bg-background-primary text-text-secondary hover:text-text-primary border border-border-primary'}`}
                  >
                    MRR
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={activeTab === 'signups' ? '#e11d48' : '#4f46e5'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={activeTab === 'signups' ? '#e11d48' : '#4f46e5'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                    <YAxis hide={true} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc', fontWeight: 'bold', backdropFilter: 'blur(8px)' }}
                      itemStyle={{ color: activeTab === 'signups' ? '#fb7185' : '#818cf8', fontWeight: '900' }}
                      formatter={(value: any) => activeTab === 'mrr' ? [`$${value.toLocaleString()}`, 'MRR'] : [value, 'Sign-ups']}
                    />
                    <ReferenceLine x="Week 3" stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Series B Milestone', fill: '#94a3b8', fontSize: 12, fontWeight: 'bold', dy: -10 }} />
                    <Area 
                      type="monotone" 
                      dataKey={activeTab} 
                      stroke={activeTab === 'signups' ? '#e11d48' : '#4f46e5'} 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorMetric)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barriers Section */}
      <section className="py-24 bg-background-primary border-t border-border-primary/50 transition-theme">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-text-primary transition-theme">Investor Pressure is Real</h2>
            <p className="text-text-secondary text-lg font-medium transition-theme">Focusing on the hard deficits startups face before raising a round.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                image: '/images/venture-traction/icon_pain_crunch.png', title: 'Fundraising Crunch', 
                problem: 'Investors demand hard data and predictable unit economics, but growth has slowed. The time left on your runway is rapidly shrinking.',
                tag: 'Time Pressure'
              },
              { 
                image: '/images/venture-traction/icon_pain_budget.png', title: 'Wasted Budgets', 
                problem: 'Buying expensive contextual and targeted ads gives clicks, but no conversion to activation. A high CAC kills product economics.',
                tag: 'High CAC'
              },
              { 
                image: '/images/venture-traction/icon_pain_analytics.png', title: 'Blind Analytics', 
                problem: 'Metrics are scattered. It\'s impossible to prove clean Pipeline Velocity and LTV to funds because calls, emails, and CRM aren\'t unified.',
                tag: 'No Data'
              }
            ].map((Pain, i) => (
              <div key={i} className="bg-background-secondary p-8 rounded-3xl border border-border-primary flex flex-col h-full hover:shadow-xl hover:border-rose-500/30 transition-all duration-300 group transition-theme">
                <div className="w-full h-40 mb-6 relative flex items-center justify-center drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-xl transition-all duration-500">
                  <Image 
                    src={Pain.image} 
                    alt={Pain.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain" 
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-100 dark:border-transparent transition-theme">{Pain.tag}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-text-primary transition-theme">{Pain.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium flex-grow transition-theme">{Pain.problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 bg-background-secondary border-t border-border-primary transition-theme">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-text-primary transition-theme">Turnkey Package Architecture</h2>
            <p className="text-text-secondary text-lg font-medium transition-theme">We deploy an explosive growth and end-to-end analytics stack.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Module 1: Growth Hacking & CRO Engine', image: '/images/venture-traction/icon_solution_cro.png',
                desc: 'Optimization of the activation funnel, designing viral loops (Referral loops) and retention mechanics to maximize Retention Rate (Day 1/7/30).',
                bullets: ['Viral Loops Design', 'Funnel Optimization', 'Retention Focus']
              },
              {
                title: 'Module 2: 1,000 Verified Sign-ups', image: '/images/venture-traction/icon_solution_signups.png',
                desc: 'Driving targeted, pre-filtered traffic. We bring in 1,000 real users who have passed your Activation Milestone (no bots and fraud).',
                bullets: ['Target Traffic Injection', 'Real Active Users', 'SLA Guaranteed'],
                highlight: true
              },
              {
                title: 'Module 3: Unified RevOps Analytics', image: '/images/venture-traction/icon_solution_revops.png',
                desc: 'Full integration and setup of HubSpot + Gong.io. Automated conversation intelligence, transparent deal tracking, and automated investor dashboards.',
                bullets: ['HubSpot + Gong Setup', 'Conversation Intel', 'Investor Dashboards']
              }
            ].map((module, i) => (
              <div key={i} className={`bg-background-primary/80 backdrop-blur-sm p-8 rounded-3xl flex flex-col h-full hover:shadow-xl transition-all duration-300 group transition-theme ${module.highlight ? 'border-2 border-rose-400 dark:border-rose-500 shadow-lg dark:shadow-[0_0_30px_rgba(225,29,72,0.2)]' : 'border border-border-primary hover:border-rose-300 dark:hover:border-rose-500/30'}`}>
                <div className="w-32 h-32 sm:w-40 sm:h-40 relative shrink-0 drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_10px_15px_rgba(225,29,72,0.2)] transition-transform duration-500 self-center mb-6">
                  <Image 
                    src={module.image} 
                    alt={module.title} 
                    fill
                    sizes="(max-width: 640px) 128px, 160px"
                    className="object-contain" 
                  />
                </div>
                <h3 className="text-xl font-bold mb-4 text-text-primary transition-theme">{module.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium mb-8 flex-grow transition-theme">{module.desc}</p>
                <ul className="space-y-3">
                  {module.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-bold text-text-primary transition-theme">
                      <CheckCircle2 className="w-5 h-5 text-rose-500" /> {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-background-primary border-t border-border-primary/50 transition-theme">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="w-40 h-40 mb-8 relative drop-shadow-xl hover:scale-105 transition-transform duration-500">
               <Image 
                 src="/images/venture-traction/icon_timeline.png" 
                 alt="30-Day Traction Timeline" 
                 fill
                 sizes="160px"
                 className="object-contain" 
               />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-text-primary transition-theme">30-Day Traction Timeline</h2>
            <p className="text-text-secondary text-lg font-medium transition-theme">The exact roadmap to explosive growth and data clarity.</p>
          </div>

          <div className="relative border-l border-border-primary ml-4 md:ml-0 md:border-none space-y-12 transition-theme">
            {[
              {
                days: 'Week 1',
                title: 'Analytics Loop',
                desc: 'Deploying RevOps analytics (HubSpot + Gong), auditing current onboarding, fixing baseline metrics.'
              },
              {
                days: 'Week 2',
                title: 'Growth Engineering (CRO)',
                desc: 'Implementing viral mechanics, trigger email sequences, and optimizing product landing pages to lower sign-up cost.'
              },
              {
                days: 'Week 3',
                title: 'Traffic Scaling',
                desc: 'Activating lead gen channels, launching the 1,000 verified sign-ups package, collecting first R&D feedback.'
              },
              {
                days: 'Week 4',
                title: 'Handover & Board Report',
                desc: 'Stabilizing the pipeline. Handing over clean ARR growth charts, conversion funnels, and a ready investor presentation.'
              }
            ].map((step, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0 md:grid md:grid-cols-5 items-center gap-8 group">
                <div className="hidden md:block col-span-2 text-right">
                  <span className="text-xl font-extrabold text-text-secondary group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-theme">{step.days}</span>
                </div>
                <div className="absolute left-[-5px] top-4 md:static md:col-span-1 flex justify-center">
                  <div className="w-3 h-3 bg-rose-500 rounded-full ring-4 ring-rose-100 dark:ring-rose-500/20 group-hover:scale-150 transition-transform shadow-md"></div>
                  {idx !== 3 && <div className="hidden md:block absolute w-0.5 h-[150%] bg-border-primary top-1/2 transition-theme"></div>}
                </div>
                <div className="md:col-span-2 bg-background-secondary p-8 rounded-3xl border border-border-primary group-hover:border-rose-300 dark:group-hover:border-rose-500/50 transition-theme shadow-sm group-hover:shadow-md">
                  <div className="md:hidden text-sm font-extrabold text-rose-600 dark:text-rose-400 mb-3 transition-theme">{step.days}</div>
                  <h4 className="text-xl font-bold text-text-primary mb-3 transition-theme">{step.title}</h4>
                  <p className="text-text-secondary text-sm leading-relaxed font-medium transition-theme">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="py-24 bg-background-secondary border-t border-border-primary transition-theme">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-text-primary transition-theme">Scaling Approach Comparison</h2>
            <p className="text-text-secondary text-lg font-medium transition-theme">Why typical agencies fail to prepare you for a fundraise.</p>
          </div>
          <div className="overflow-x-auto rounded-3xl shadow-xl dark:shadow-2xl border border-border-primary transition-theme">
            <table className="w-full text-left bg-background-primary/80 backdrop-blur-sm overflow-hidden min-w-[800px] transition-theme">
              <thead className="bg-background-surface border-b border-border-primary transition-theme">
                <tr>
                  <th className="p-6 font-extrabold uppercase tracking-wider text-xs text-text-secondary w-1/3 transition-theme">Startup Metrics & Assets</th>
                  <th className="p-6 font-extrabold uppercase tracking-wider text-xs text-text-secondary w-1/3 transition-theme">Traditional Agencies / In-house</th>
                  <th className="p-6 font-extrabold uppercase tracking-wider text-xs text-rose-600 dark:text-rose-400 w-1/3 transition-theme">Venture Traction Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary transition-theme">
                <tr className="hover:bg-background-surface transition-theme">
                  <td className="p-6 font-bold text-text-primary transition-theme">Launch Speed</td>
                  <td className="p-6 text-text-secondary font-medium transition-theme">1-2 months for tests and hypotheses</td>
                  <td className="p-6 text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-2 transition-theme"><CheckSquare className="w-4 h-4"/> Ready infrastructure in 7 days</td>
                </tr>
                <tr className="hover:bg-background-surface transition-theme">
                  <td className="p-6 font-bold text-text-primary transition-theme">Data Transparency</td>
                  <td className="p-6 text-text-secondary font-medium transition-theme">Chaotic Excel spreadsheets</td>
                  <td className="p-6 text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-2 transition-theme"><CheckSquare className="w-4 h-4"/> Live dashboard (HubSpot + Gong.io)</td>
                </tr>
                <tr className="hover:bg-background-surface transition-theme">
                  <td className="p-6 font-bold text-text-primary transition-theme">Sign-up Quality</td>
                  <td className="p-6 text-text-secondary font-medium transition-theme">Any clicks (vanity metrics)</td>
                  <td className="p-6 text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-2 transition-theme"><CheckSquare className="w-4 h-4"/> Verified accounts (SLA)</td>
                </tr>
                <tr className="hover:bg-background-surface transition-theme">
                  <td className="p-6 font-bold text-text-primary transition-theme">Focus on Round</td>
                  <td className="p-6 text-text-secondary font-medium transition-theme">Marketers don&apos;t care about your round</td>
                  <td className="p-6 text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-2 transition-theme"><CheckSquare className="w-4 h-4"/> Metrics tailored for Due Diligence</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section id="lead-form" className="py-32 bg-background-primary relative overflow-hidden border-t border-border-primary transition-theme">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-rose-200 dark:bg-rose-600/10 blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="bg-background-secondary/90 backdrop-blur-2xl rounded-3xl shadow-xl dark:shadow-2xl border border-border-primary p-8 md:p-12 transition-theme">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-text-primary transition-theme">Defend your product metrics at the next board meeting.</h2>
              <p className="text-text-secondary font-medium text-lg transition-theme">Get a clear roadmap to explosive ARR growth and unit economics clarity.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 transition-theme">Corporate Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@startup.com"
                  className="w-full px-4 py-4 rounded-xl border border-border-primary bg-background-surface text-text-primary focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all placeholder:text-text-secondary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 transition-theme">Current Funding Stage</label>
                <select
                  value={fundingStage}
                  onChange={(e) => {
                    setFundingStage(e.target.value);
                    if (typeof window !== 'undefined' && (window as any).dataLayer) {
                      (window as any).dataLayer.push({
                        event: 'funding_stage_change',
                        stage: e.target.value
                      });
                    }
                  }}
                  className="w-full px-4 py-4 rounded-xl border border-border-primary bg-background-surface text-text-primary focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all appearance-none font-medium"
                >
                  <option value="Pre-seed" className="bg-background-primary text-text-primary">Pre-seed</option>
                  <option value="Seed" className="bg-background-primary text-text-primary">Seed</option>
                  <option value="Series A" className="bg-background-primary text-text-primary">Series A</option>
                  <option value="Bootstrapped" className="bg-background-primary text-text-primary">Bootstrapped</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 transition-theme">Telegram / LinkedIn ID (Optional)</label>
                <input
                  type="text"
                  value={socialId}
                  onChange={(e) => setSocialId(e.target.value)}
                  placeholder="@username or linkedin.com/in/..."
                  className="w-full px-4 py-4 rounded-xl border border-border-primary bg-background-surface text-text-primary focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all placeholder:text-text-secondary"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3 transition-theme">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400 font-bold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-background-surface disabled:text-text-secondary text-white font-bold tracking-wide rounded-xl transition-all shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)] disabled:shadow-none mt-8"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">Generating <span className="animate-spin text-xl leading-none">⟳</span></span>
                ) : (
                  <>Generate ARR Growth Plan <Send className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}