"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2,
  ArrowRight,
  Send,
  Network,
  Activity,
  Check,
  Calendar,
  CheckSquare,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ORG_NODES = [
  {
    id: 'tl',
    role: 'Sales Team Lead',
    status: { screening: 'Passed (3 stages)', lms: '100%', integration: 'Completed (Gong, HubSpot)' },
    color: 'bg-indigo-600',
    hoverColor: 'bg-indigo-500'
  },
  {
    id: 'sdr',
    role: 'SDR (Sales Dev Rep)',
    status: { screening: 'Passed (3 stages)', lms: '100%', integration: 'Completed (Clay, Smartlead)' },
    color: 'bg-emerald-600',
    hoverColor: 'bg-emerald-500'
  },
  {
    id: 'ae',
    role: 'Account Executive',
    status: { screening: 'Passed (3 stages)', lms: '100%', integration: 'Completed (Gong, HubSpot)' },
    color: 'bg-rose-600',
    hoverColor: 'bg-rose-500'
  }
];

// Ensure TypeScript knows about window properties for GTM
declare global {
  interface Window {
    hasFiredNodeHoverEvent?: boolean;
    hasFiredTimelineEvent?: boolean;
  }
}

export default function EnterpriseSquadBuilderPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [socialId, setSocialId] = useState('');
  const [targetNiche, setTargetNiche] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const timelineSection = document.getElementById('timeline-section');
      if (timelineSection) {
        const rect = timelineSection.getBoundingClientRect();
        // Check if the bottom of the timeline section is visible
        if (rect.bottom <= window.innerHeight && typeof window !== 'undefined' && (window as any).dataLayer && !(window as any).hasFiredTimelineEvent) {
          (window as any).dataLayer.push({
            event: 'timeline_scroll_depth_100'
          });
          (window as any).hasFiredTimelineEvent = true;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNodeHover = (nodeId: string) => {
    setActiveNode(nodeId);
    if (typeof window !== 'undefined' && (window as any).dataLayer && !(window as any).hasFiredNodeHoverEvent) {
      (window as any).dataLayer.push({
        event: 'org_structure_node_hover',
        nodeId: nodeId
      });
      (window as any).hasFiredNodeHoverEvent = true;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'protonmail.com', 'icloud.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();

    if (!emailDomain || publicDomains.includes(emailDomain)) {
      setError('To verify your Enterprise request, please provide your corporate work email.');
      return;
    }

    setIsSubmitting(true);
    
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'enterprise_squad_submit',
        email,
        targetNiche,
        socialId
      });
    }

    // Simulate Webhook POST
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Store email in sessionStorage to pre-fill Calendly if needed
      sessionStorage.setItem('leadEmail', email);
      router.push('/enterprise-squad-builder-thank-you');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-background-primary min-h-screen font-sans text-text-primary selection:bg-indigo-100 dark:selection:bg-indigo-500/30 transition-theme">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-background-secondary transition-theme">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-200/50 dark:bg-indigo-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-sky-200/50 dark:bg-sky-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-xs tracking-wide uppercase mb-8 shadow-sm transition-theme">
                <Network className="w-4 h-4" /> Enterprise Squad Builder
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-text-primary transition-theme">
                Turnkey Autonomous B2B Sales Division in 30 Days. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 dark:from-indigo-400 dark:to-sky-400 block">Guaranteed by SLA.</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed font-medium transition-theme">
                Bypass internal corporate bureaucracy and long hiring cycles. We deploy a fully staffed, trained, and software-equipped commercial cell (Team Lead + SDR + AE). We transfer the ready department to your company&apos;s balance sheet along with your first closed Enterprise deals.
              </p>
              
              <button 
                onClick={scrollToForm}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide rounded-xl transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] flex items-center justify-center gap-2"
              >
                Request Division Architecture
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Org Chart Widget */}
            <div className="relative bg-background-primary rounded-3xl border border-border-primary shadow-xl dark:shadow-2xl overflow-hidden flex flex-col h-[500px] transition-theme">
              <div className="px-6 py-4 border-b border-border-primary flex items-center justify-between bg-background-surface transition-theme">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-extrabold text-text-primary tracking-wider text-sm uppercase transition-theme">Digital Sales Squad Topology</span>
                </div>
              </div>
              
              <div className="flex-1 p-6 relative flex flex-col items-center justify-center">
                {/* Connecting Lines (Desktop) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
                  <path d="M 50% 20% L 50% 40% M 50% 40% L 25% 40% L 25% 60% M 50% 40% L 75% 40% L 75% 60%" stroke="currentColor" className="text-border-primary" strokeWidth="2" fill="none" />
                </svg>

                <div className="w-full h-full relative z-10 flex flex-col items-center justify-between md:justify-start gap-8 md:gap-0">
                  {/* Team Lead Node */}
                  <div className="md:absolute md:top-[15%] md:left-1/2 md:-translate-x-1/2 w-full md:w-auto">
                    <div 
                      onMouseEnter={() => handleNodeHover('tl')}
                      onMouseLeave={() => setActiveNode(null)}
                      className={`relative bg-background-primary p-4 rounded-xl border-2 transition-all cursor-pointer shadow-md ${activeNode === 'tl' ? 'border-indigo-600 dark:border-indigo-400 scale-105' : 'border-border-primary hover:border-indigo-300 dark:hover:border-indigo-500/50'}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold transition-theme">TL</div>
                        <div>
                          <div className="font-bold text-text-primary transition-theme">Sales Team Lead</div>
                          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Deployed</div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {activeNode === 'tl' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-background-secondary text-text-primary p-4 rounded-xl shadow-2xl z-50 pointer-events-none border border-border-primary"
                          >
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between border-b border-border-primary pb-1">
                                <span className="text-text-secondary">Screening:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{ORG_NODES[0].status.screening}</span>
                              </div>
                              <div className="flex justify-between border-b border-border-primary pb-1">
                                <span className="text-text-secondary">LMS Cert:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{ORG_NODES[0].status.lms}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Software:</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-300 truncate ml-2">{ORG_NODES[0].status.integration}</span>
                              </div>
                            </div>
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-solid border-b-background-secondary border-b-8 border-x-transparent border-x-8 border-t-0"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* SDR Node */}
                  <div className="md:absolute md:top-[60%] md:left-[25%] md:-translate-x-1/2 w-full md:w-auto">
                    <div 
                      onMouseEnter={() => handleNodeHover('sdr')}
                      onMouseLeave={() => setActiveNode(null)}
                      className={`relative bg-background-primary p-4 rounded-xl border-2 transition-all cursor-pointer shadow-md ${activeNode === 'sdr' ? 'border-emerald-600 dark:border-emerald-400 scale-105' : 'border-border-primary hover:border-emerald-300 dark:hover:border-emerald-500/50'}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold transition-theme">SDR</div>
                        <div>
                          <div className="font-bold text-text-primary transition-theme">SDR Rep</div>
                          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Deployed</div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {activeNode === 'sdr' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-background-secondary text-text-primary p-4 rounded-xl shadow-2xl z-50 pointer-events-none border border-border-primary"
                          >
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between border-b border-border-primary pb-1">
                                <span className="text-text-secondary">Screening:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{ORG_NODES[1].status.screening}</span>
                              </div>
                              <div className="flex justify-between border-b border-border-primary pb-1">
                                <span className="text-text-secondary">LMS Cert:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{ORG_NODES[1].status.lms}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Software:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-300 truncate ml-2">{ORG_NODES[1].status.integration}</span>
                              </div>
                            </div>
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-solid border-b-background-secondary border-b-8 border-x-transparent border-x-8 border-t-0"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* AE Node */}
                  <div className="md:absolute md:top-[60%] md:left-[75%] md:-translate-x-1/2 w-full md:w-auto">
                    <div 
                      onMouseEnter={() => handleNodeHover('ae')}
                      onMouseLeave={() => setActiveNode(null)}
                      className={`relative bg-background-primary p-4 rounded-xl border-2 transition-all cursor-pointer shadow-md ${activeNode === 'ae' ? 'border-rose-600 dark:border-rose-400 scale-105' : 'border-border-primary hover:border-rose-300 dark:hover:border-rose-500/50'}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold transition-theme">AE</div>
                        <div>
                          <div className="font-bold text-text-primary transition-theme">Account Exec</div>
                          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Deployed</div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {activeNode === 'ae' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-background-secondary text-text-primary p-4 rounded-xl shadow-2xl z-50 pointer-events-none border border-border-primary"
                          >
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between border-b border-border-primary pb-1">
                                <span className="text-text-secondary">Screening:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{ORG_NODES[2].status.screening}</span>
                              </div>
                              <div className="flex justify-between border-b border-border-primary pb-1">
                                <span className="text-text-secondary">LMS Cert:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{ORG_NODES[2].status.lms}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Software:</span>
                                <span className="font-bold text-rose-600 dark:text-rose-300 truncate ml-2">{ORG_NODES[2].status.integration}</span>
                              </div>
                            </div>
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-solid border-b-background-secondary border-b-8 border-x-transparent border-x-8 border-t-0"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barriers Section */}
      <section className="py-24 bg-background-primary border-t border-border-primary/50 transition-theme">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-text-primary transition-theme">The Corporate Hiring Dead End</h2>
            <p className="text-text-secondary text-lg font-medium transition-theme">Visualizing operational and time losses in standard enterprise scaling.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                image: '/images/enterprise-squad/icon_pain_hr.png', title: 'HR Time Collapse', 
                problem: 'Classic hiring, security checks, offer approvals, and onboarding by internal HR take 3 to 6 months. Your product stands idle while competitors take market share.',
                tag: 'Slow Execution'
              },
              { 
                image: '/images/enterprise-squad/icon_pain_software.png', title: 'Software "Zoo" & No RevOps', 
                problem: 'Internal IT departments spend months approving modern outreach tools. Salespeople work in fragmented systems without Conversation Intelligence or automatic scraping.',
                tag: 'IT Bottleneck'
              },
              { 
                image: '/images/enterprise-squad/icon_pain_responsibility.png', title: 'Blurred Responsibility', 
                problem: 'Recruiting agencies charge a fee for "a person showing up to work," but bear no responsibility for meeting KPIs, CRM hygiene, or the team\'s real Win Rate.',
                tag: 'No Guarantee'
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
            <p className="text-text-secondary text-lg font-medium transition-theme">We take full responsibility for building an isolated commercial infrastructure.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                title: 'Module 1: Sales Squad Staffing (HR-Ops)', image: '/images/enterprise-squad/icon_solution_staffing.png',
                desc: 'Mass hunting, 3-stage automated stress screening, and live candidate certification. Deploying a cohesive operational cell: 1 Sales Team Lead + 1 SDR + 1 AE.',
                bullets: ['Stress-tested candidates', 'Complete 3-person cell', 'Ready to execute']
              },
              {
                title: 'Module 2: Product LMS Academy', image: '/images/enterprise-squad/icon_solution_academy.png',
                desc: 'Custom onboarding program development. We train the hired team on the specifics, technical nuances, and value proposition of your complex product before official transfer.',
                bullets: ['Custom curriculum', 'Deep technical training', 'Pre-transfer certification']
              },
              {
                title: 'Module 3: Full Enterprise Sales Ops Cloud', image: '/images/enterprise-squad/icon_solution_cloud.png',
                desc: 'Deployment and infrastructure coverage for the first month: CRM (HubSpot/Salesforce), AI call analysis (Gong), and waterfall enrichment of decision-maker databases via Clay.',
                bullets: ['Pre-configured CRM', 'AI Conversation Intelligence', 'Automated Prospecting']
              },
              {
                title: 'Module 4: Legal SLA Contour', image: '/images/enterprise-squad/icon_solution_sla.png',
                desc: 'Written corporate guarantee: free replacement of any cell employee within 48 hours if they fail to meet target KPIs for activity or funnel volume in the first 90 days.',
                bullets: ['48-Hour Replacement', 'Strict KPI Enforcement', '90-Day Protection']
              }
            ].map((module, i) => (
              <div key={i} className="bg-background-primary/80 backdrop-blur-sm p-8 rounded-3xl flex flex-col items-center text-center gap-6 border border-border-primary hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 group transition-theme">
                <div className="w-full h-56 relative shrink-0 drop-shadow-lg group-hover:scale-110 group-hover:drop-shadow-[0_15px_25px_rgba(79,70,229,0.25)] transition-transform duration-500">
                  <Image 
                    src={module.image} 
                    alt={module.title} 
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain" 
                  />
                </div>
                <div className="flex-1 flex flex-col h-full items-center">
                  <h3 className="text-2xl font-bold mb-3 text-text-primary transition-theme">{module.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-medium mb-6 flex-grow transition-theme">{module.desc}</p>
                  <ul className="space-y-3 mt-auto text-left w-full max-w-sm">
                    {module.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold text-text-primary transition-theme">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline-section" className="py-24 bg-background-primary border-t border-border-primary/50 transition-theme">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="w-64 h-64 md:w-80 md:h-80 mb-8 relative drop-shadow-2xl hover:scale-105 transition-transform duration-500">
               <Image 
                 src="/images/enterprise-squad/icon_timeline_deploy.png" 
                 alt="30-Day Enterprise Deployment Timeline" 
                 fill
                 sizes="(max-width: 768px) 256px, 320px"
                 className="object-contain" 
               />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-text-primary transition-theme">30-Day Enterprise Deployment Timeline</h2>
            <p className="text-text-secondary text-lg font-medium transition-theme">The exact fixed schedule to 879 autonomous division.</p>
          </div>

          <div className="relative border-l border-border-primary ml-4 md:ml-0 md:border-none space-y-12 transition-theme">
            {[
              {
                days: 'Days 1-7',
                title: 'Architecture & Processes',
                desc: 'Writing playbooks, scripts, qualification matrices using MEDDIC methodology. IT infrastructure deployment, purchasing and warming up sender domains.'
              },
              {
                days: 'Days 8-15',
                title: 'Automated Screening',
                desc: 'Running up to 500 candidates through platform call simulators. Shortlist formation and intensive interviews.'
              },
              {
                days: 'Days 16-22',
                title: 'LMS Training',
                desc: 'Final launch of the selected team into a closed corporate academy. Mastering product material, live role-plays, script defense in front of our experts.'
              },
              {
                days: 'Days 23-30',
                title: 'Pilot Launch & Handover',
                desc: 'Putting the division on the line, generating first SQL leads, fixing CRM metrics. Official legal transfer of employees and IT assets to the corporation\'s balance sheet.'
              }
            ].map((step, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0 md:grid md:grid-cols-5 items-center gap-8 group">
                <div className="hidden md:block col-span-2 text-right">
                  <span className="text-xl font-extrabold text-text-secondary group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-theme">{step.days}</span>
                </div>
                <div className="absolute left-[-5px] top-4 md:static md:col-span-1 flex justify-center">
                  <div className="w-3 h-3 bg-indigo-600 dark:bg-indigo-500 rounded-full ring-4 ring-indigo-100 dark:ring-indigo-500/20 group-hover:scale-150 transition-transform shadow-md"></div>
                  {idx !== 3 && <div className="hidden md:block absolute w-0.5 h-[150%] bg-border-primary top-1/2 transition-theme"></div>}
                </div>
                <div className="md:col-span-2 bg-background-secondary p-8 rounded-3xl border border-border-primary group-hover:border-indigo-300 dark:group-hover:border-indigo-500/50 transition-theme shadow-sm group-hover:shadow-md">
                  <div className="md:hidden text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mb-3 transition-theme">{step.days}</div>
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
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-text-primary transition-theme">Department Scaling Comparison</h2>
            <p className="text-text-secondary text-lg font-medium transition-theme">Why traditional HR fails to deploy fast enough for new product launches.</p>
          </div>
          <div className="overflow-x-auto rounded-3xl shadow-xl dark:shadow-2xl border border-border-primary transition-theme">
            <table className="w-full text-left bg-background-primary/80 backdrop-blur-sm overflow-hidden min-w-[800px] transition-theme">
              <thead className="bg-background-surface border-b border-border-primary transition-theme">
                <tr>
                  <th className="p-6 font-extrabold uppercase tracking-wider text-xs text-text-secondary w-1/3 transition-theme">Implementation Parameters</th>
                  <th className="p-6 font-extrabold uppercase tracking-wider text-xs text-text-secondary w-1/3 transition-theme">Internal Corporate HR</th>
                  <th className="p-6 font-extrabold uppercase tracking-wider text-xs text-indigo-700 dark:text-indigo-400 w-1/3 transition-theme">Enterprise Squad Builder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary transition-theme">
                <tr className="hover:bg-background-surface transition-theme">
                  <td className="p-6 font-bold text-text-primary transition-theme">Launch Timelines</td>
                  <td className="p-6 text-text-secondary font-medium transition-theme">90-180 days</td>
                  <td className="p-6 text-indigo-700 dark:text-indigo-400 font-extrabold flex items-center gap-2 transition-theme"><CheckSquare className="w-4 h-4"/> Strictly 30 days (fixed)</td>
                </tr>
                <tr className="hover:bg-background-surface transition-theme">
                  <td className="p-6 font-bold text-text-primary transition-theme">IT Infrastructure</td>
                  <td className="p-6 text-text-secondary font-medium transition-theme">Manual subscription approvals, chaos</td>
                  <td className="p-6 text-indigo-700 dark:text-indigo-400 font-extrabold flex items-center gap-2 transition-theme"><CheckSquare className="w-4 h-4"/> Ready-made stack, paid at launch</td>
                </tr>
                <tr className="hover:bg-background-surface transition-theme">
                  <td className="p-6 font-bold text-text-primary transition-theme">Product Training</td>
                  <td className="p-6 text-text-secondary font-medium transition-theme">Falls on the shoulders of product managers</td>
                  <td className="p-6 text-indigo-700 dark:text-indigo-400 font-extrabold flex items-center gap-2 transition-theme"><CheckSquare className="w-4 h-4"/> Automated via LMS platform</td>
                </tr>
                <tr className="hover:bg-background-surface transition-theme">
                  <td className="p-6 font-bold text-text-primary transition-theme">KPI Guarantees</td>
                  <td className="p-6 text-text-secondary font-medium transition-theme">None (risk of lengthy termination process)</td>
                  <td className="p-6 text-indigo-700 dark:text-indigo-400 font-extrabold flex items-center gap-2 transition-theme"><CheckSquare className="w-4 h-4"/> Legal SLA for replacement in 48 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section id="lead-form" className="py-32 bg-background-primary relative overflow-hidden border-t border-border-primary transition-theme">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-indigo-100 dark:bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="bg-background-secondary/90 backdrop-blur-2xl rounded-3xl shadow-xl dark:shadow-2xl border border-border-primary p-8 md:p-12 transition-theme">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-text-primary transition-theme">Launch an autonomous sales division without operational routine.</h2>
              <p className="text-text-secondary font-medium text-lg transition-theme">Request a comprehensive division design brief tailored to your product.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 transition-theme">Corporate Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cco@enterprise.com"
                  className="w-full px-4 py-4 rounded-xl border border-border-primary bg-background-surface text-text-primary focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-text-secondary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 transition-theme">Target Niche of the New Product <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={targetNiche}
                  onChange={(e) => setTargetNiche(e.target.value)}
                  placeholder="e.g. Cybersecurity Software for Healthcare"
                  className="w-full px-4 py-4 rounded-xl border border-border-primary bg-background-surface text-text-primary focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-text-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 transition-theme">Telegram / LinkedIn ID (Optional)</label>
                <input
                  type="text"
                  value={socialId}
                  onChange={(e) => setSocialId(e.target.value)}
                  placeholder="@username or linkedin.com/in/..."
                  className="w-full px-4 py-4 rounded-xl border border-border-primary bg-background-surface text-text-primary focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-text-secondary"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3 transition-theme">
                  <ShieldCheck className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400 font-bold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-background-surface disabled:text-text-secondary text-white font-bold tracking-wide rounded-xl transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] disabled:shadow-none mt-8"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">Processing <span className="animate-spin text-xl leading-none">⟳</span></span>
                ) : (
                  <>Download Division Design Brief <Send className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}