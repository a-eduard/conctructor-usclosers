"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Handshake, 
  ArrowRight, 
  CheckCircle2, 
  Network, 
  Send, 
  FileSignature, 
  ShieldCheck, 
  CheckSquare 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChannelPartnershipPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState('Seed / Pre-revenue');
  const [socialId, setSocialId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'protonmail.com', 'icloud.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();

    if (!emailDomain || publicDomains.includes(emailDomain)) {
      setError('To verify your request, please provide your corporate work email.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      sessionStorage.setItem('leadEmail', email);
      router.push('/book-demo'); 
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background-primary font-sans text-text-primary selection:bg-rose-100 dark:selection:bg-rose-500/30 transition-theme">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-background-secondary transition-theme">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-rose-200/50 dark:bg-rose-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-pink-200/50 dark:bg-pink-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 font-bold text-xs tracking-wide uppercase mb-8 shadow-sm transition-theme">
                <Handshake className="w-4 h-4" />
                Scaleups & Enterprise
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-text-primary leading-[1.1] tracking-tighter mb-6 transition-theme">
                Build Strategic <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-500 dark:from-rose-400 dark:to-pink-400">Partnerships</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-xl font-medium transition-theme">
                We pitch major system integrators, handle alliance negotiations, and secure signed MOUs based on your target enterprise list. Expand your reach without expanding your headcount.
              </p>
              
              <button 
                onClick={scrollToForm}
                className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold tracking-wide rounded-xl transition-all shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)] flex items-center justify-center gap-2"
              >
                Build Partnerships <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border-primary transition-theme">
              <Image
                src="/images/channel-partnership/hero_alliance.png"
                alt="Strategic Channel Partnerships"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/20 to-transparent mix-blend-overlay pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE BOTTLENECK SECTION */}
      <section className="py-24 bg-background-primary border-t border-border-primary/50 transition-theme">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary mb-6 tracking-tighter transition-theme">
              The Scaling Bottleneck
            </h2>
            <p className="text-lg text-text-secondary font-medium transition-theme">
              Why relying solely on direct sales limits your enterprise growth potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Limited Reach',
                tag: 'Linear Growth',
                img: '/images/channel-partnership/icon_pain_reach.png',
                desc: 'Direct outbound only scales linearly with headcount. Reaching enterprise accounts one by one is slow and expensive.'
              },
              {
                title: 'Lack of Authority',
                tag: 'Trust Deficit',
                img: '/images/channel-partnership/icon_pain_authority.png',
                desc: 'Enterprise buyers prefer purchasing through trusted system integrators and vendors they already work with.'
              },
              {
                title: 'High CAC',
                tag: 'Unit Economics',
                img: '/images/channel-partnership/icon_pain_cac.png',
                desc: 'Customer Acquisition Costs spiral out of control when you have to educate the market and hunt every deal manually.'
              }
            ].map((card, idx) => (
              <div key={idx} className="bg-background-secondary p-8 rounded-3xl border border-border-primary flex flex-col h-full hover:shadow-xl hover:border-rose-500/30 transition-all duration-300 group transition-theme">
                <div className="w-full h-40 mb-6 relative flex items-center justify-center drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-xl transition-all duration-500">
                  <Image 
                    src={card.img} 
                    alt={card.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain" 
                  />
                </div>
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-100 dark:border-transparent transition-theme">
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-text-primary text-center md:text-left transition-theme">{card.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium flex-grow text-center md:text-left transition-theme">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-24 bg-background-secondary border-t border-border-primary transition-theme">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary mb-6 tracking-tighter transition-theme">
              How Alliance Building Works
            </h2>
            <p className="text-lg text-text-secondary font-medium transition-theme">
              The anatomy of a perfect channel partnership pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                step: '1', title: 'Ecosystem Mapping', icon: Network,
                desc: 'We identify and map the most lucrative integration partners, agencies, and system integrators in your specific industry vertical.',
                bullets: ['Target List Generation', 'Competitor Analysis']
              },
              {
                step: '2', title: 'Strategic Outreach', icon: Send,
                desc: 'Strategic cold outreach to key decision-makers (VP of Partnerships, Alliances Director) at potential partner organizations.',
                bullets: ['Multi-channel Sequences', 'Pitch Deck Creation']
              },
              {
                step: '3', title: 'Negotiation', icon: Handshake,
                desc: 'Our senior executives run the alliance meetings, structure the commission splits, and negotiate the terms of engagement.',
                bullets: ['Deal Structuring', 'Margin Calculation']
              },
              {
                step: '4', title: 'MOU Signing', icon: FileSignature,
                desc: 'We handle the complex follow-ups required to successfully execute Memorandums of Understanding and secure signed contracts.',
                bullets: ['Legal Coordination', 'Go-to-Market Launch']
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-background-primary/80 backdrop-blur-sm p-8 rounded-3xl border border-border-primary flex flex-col sm:flex-row gap-6 items-start hover:shadow-xl hover:border-rose-500/30 transition-all duration-300 transition-theme">
                <div className="w-16 h-16 rounded-2xl bg-background-surface flex items-center justify-center shrink-0 border border-border-primary shadow-sm transition-theme">
                  <item.icon className="w-8 h-8 text-rose-500 dark:text-rose-400" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest mb-2 transition-theme">Phase {item.step}</div>
                  <h3 className="text-xl font-bold text-text-primary mb-3 transition-theme">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4 font-medium transition-theme">
                    {item.desc}
                  </p>
                  <ul className="space-y-2 text-sm font-bold text-text-primary transition-theme">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2 transition-theme">
                        <CheckCircle2 className="w-4 h-4 text-rose-500" /> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section className="py-24 bg-background-primary border-t border-border-primary/50 transition-theme">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-text-primary transition-theme">
              Transparent Engagement Models
            </h2>
            <p className="text-text-secondary text-lg font-medium transition-theme">
              Select the tier that matches your market expansion phase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tier 1 */}
            <div className="bg-background-secondary rounded-3xl p-8 lg:p-10 border border-border-primary flex flex-col relative transition-theme">
              <div className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest mb-4 transition-theme">New Markets</div>
              <h3 className="text-3xl font-extrabold text-text-primary mb-2 transition-theme">Market Seed</h3>
              <div className="text-4xl font-black text-text-primary mb-8 transition-theme">
                $2,500 <span className="text-lg text-text-secondary font-medium tracking-normal transition-theme">/ mo</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-start gap-3 text-text-primary text-sm font-medium transition-theme">
                  <CheckSquare className="w-5 h-5 text-rose-500 shrink-0" /> 
                  <div><span className="block font-bold text-text-primary transition-theme">1 Dedicated Executive</span>Part-time alliance manager</div>
                </li>
                <li className="flex items-start gap-3 text-text-primary text-sm font-medium transition-theme">
                  <CheckSquare className="w-5 h-5 text-rose-500 shrink-0" /> 
                  <div><span className="block font-bold text-text-primary transition-theme">Target List</span>50 Enterprise targets / month</div>
                </li>
                <li className="flex items-start gap-3 text-text-primary text-sm font-medium transition-theme">
                  <CheckSquare className="w-5 h-5 text-rose-500 shrink-0" /> 
                  <div><span className="block font-bold text-text-primary transition-theme">Basic Assets</span>Standard pitch decks & emails</div>
                </li>
              </ul>
              <button onClick={scrollToForm} className="w-full py-4 rounded-xl border-2 border-border-primary font-bold text-text-primary hover:bg-background-surface transition-theme">
                Select Package
              </button>
            </div>

            {/* Tier 2 */}
            <div className="bg-background-primary/90 rounded-3xl p-8 lg:p-10 border-2 border-rose-500 relative shadow-2xl transition-theme">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-rose-600 to-pink-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-bl-2xl rounded-tr-2xl shadow-md">
                RECOMMENDED
              </div>
              <div className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest mb-4">Scale & Growth</div>
              <h3 className="text-3xl font-extrabold text-text-primary mb-2 transition-theme">Alliance Engine</h3>
              <div className="text-4xl font-black text-rose-600 dark:text-rose-400 mb-8 transition-theme">
                $4,500 <span className="text-lg text-text-secondary font-medium tracking-normal transition-theme">/ mo</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-start gap-3 text-text-primary text-sm font-medium transition-theme">
                  <CheckSquare className="w-5 h-5 text-rose-500 shrink-0" /> 
                  <div><span className="block font-bold text-text-primary transition-theme">Full Deal Team</span>Executive + Data Scout</div>
                </li>
                <li className="flex items-start gap-3 text-text-primary text-sm font-medium transition-theme">
                  <CheckSquare className="w-5 h-5 text-rose-500 shrink-0" /> 
                  <div><span className="block font-bold text-text-primary transition-theme">Aggressive Volume</span>150+ Enterprise targets / month</div>
                </li>
                <li className="flex items-start gap-3 text-text-primary text-sm font-medium transition-theme">
                  <CheckSquare className="w-5 h-5 text-rose-500 shrink-0" /> 
                  <div><span className="block font-bold text-text-primary transition-theme">Legal Support</span>MOU templates and redlining</div>
                </li>
              </ul>
              <button onClick={scrollToForm} className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)]">
                Select Package
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BIG LEAD FORM */}
      <section id="lead-form" className="py-32 bg-background-secondary relative overflow-hidden border-t border-border-primary transition-theme">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-rose-100 dark:bg-rose-600/10 blur-[120px] pointer-events-none rounded-full transition-theme"></div>
        
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="bg-background-primary/90 backdrop-blur-2xl rounded-3xl shadow-xl dark:shadow-2xl border border-border-primary p-8 md:p-12 transition-theme">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-text-primary transition-theme">
                Build Partner Network
              </h2>
              <p className="text-text-secondary font-medium text-lg transition-theme">
                Request a custom roadmap for your channel alliance strategy.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 transition-theme">Corporate Email <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@yourstartup.com"
                  className="w-full px-4 py-4 rounded-xl border border-border-primary bg-background-surface text-text-primary focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all placeholder:text-text-secondary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 transition-theme">Current ARR / Stage <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl border border-border-primary bg-background-surface text-text-primary focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all appearance-none"
                >
                  <option value="Seed / Pre-revenue" className="bg-background-primary text-text-primary">Seed / Pre-revenue</option>
                  <option value="$1M - $5M ARR" className="bg-background-primary text-text-primary">$1M - $5M ARR</option>
                  <option value="$5M - $20M ARR" className="bg-background-primary text-text-primary">$5M - $20M ARR</option>
                  <option value="$20M+ ARR" className="bg-background-primary text-text-primary">$20M+ ARR</option>
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
                  <ShieldCheck className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400 font-bold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-background-surface disabled:text-text-secondary text-white font-bold tracking-wide rounded-xl transition-all shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.23)] disabled:shadow-none mt-8"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">Processing <span className="animate-spin text-xl leading-none">⟳</span></span>
                ) : (
                  <>Request Strategy Session <Send className="w-5 h-5" /></>
                )}
              </button>
              
              <p className="text-center text-xs text-text-secondary mt-6 flex items-center justify-center gap-1.5 font-medium transition-theme">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Strict NDA on all shared data.
              </p>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}