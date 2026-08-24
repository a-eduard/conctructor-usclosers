"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Header } from "../../components/Header";
import { Target, ArrowRight, ShieldCheck } from "lucide-react";
import { useWizard } from "../../contexts/WizardContext";

type Offer = {
  id: string;
  name: string;
  concept: string;
  basePrice: string;
  deliverySla: string;
  category: { id: string; name: string } | null;
};

type Solution = {
  id: string;
  icon: string;
  name: string;
  concept: string;
  price: string;
  sla: string;
  color: string;
  imageUrl: string | null;
  step1Data: string | null;
  step5Data: string | null;
  clientProvided: string | null;
  cartItems: string | null;
};

export default function App() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const [launchingId, setLaunchingId] = useState<string | null>(null);
  
  const locale = useLocale();
  const router = useRouter();
  const { applyDynamicSolution } = useWizard();

  useEffect(() => {
    Promise.all([
      fetch("/api/offers").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/solutions").then((res) => (res.ok ? res.json() : []))
    ])
      .then(([offersData, solutionsData]) => {
        setOffers(offersData);
        setSolutions(solutionsData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleLaunchSolution = (solution: Solution) => {
    setLaunchingId(solution.id);
    
    setTimeout(() => {
      applyDynamicSolution(solution);
      router.push(`/${locale}/wizard`);
    }, 50);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-slate-500 font-mono text-sm sm:text-base">
        Loading storefront...
      </div>
    );

  const categories = Array.from(
    new Set(offers.map((o) => o.category?.name).filter(Boolean)),
  ) as string[];
  categories.sort();

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      
      <Header 
        leftContent={
          <div className="flex overflow-x-auto no-scrollbar gap-5 md:gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 w-full max-w-[calc(100vw-120px)] md:max-w-none pr-4 md:pr-0">
            <span
              onClick={() => setActiveCategory(null)}
              className={`cursor-pointer py-2 transition-colors whitespace-nowrap shrink-0 ${activeCategory === null ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600" : "hover:text-slate-900 dark:hover:text-white"}`}
            >
              All Services
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer py-2 transition-colors capitalize whitespace-nowrap shrink-0 ${activeCategory === cat ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600" : "hover:text-slate-900 dark:hover:text-white"}`}
              >
                {cat.toLowerCase()}
              </span>
            ))}
          </div>
        }
      />

      <main className="flex-1 max-w-7xl mx-auto py-10 sm:py-16 px-4 sm:px-8 w-full">
        {/* HERO SECTION */}
        <div className="mb-12 sm:mb-16 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            B2B Sales Architecture
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg md:text-xl font-medium leading-relaxed px-2 sm:px-0">
            Buy predictable outcomes, not hours. Choose a turnkey solution below or build your own custom sales engine step by step.
          </p>
        </div>

        {/* DYNAMIC TURNKEY SOLUTIONS SECTION */}
        {activeCategory === null && (
          <section className="mb-16 sm:mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              {solutions.map((solution) => (
                <div
                  key={solution.id}
                  onClick={() => handleLaunchSolution(solution)}
                  className={`block group h-full cursor-pointer transition-opacity ${launchingId && launchingId !== solution.id ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div className="relative bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-500 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-indigo-200 dark:hover:border-indigo-500/30">
                    
                    {/* Decorative gradient blob */}
                    <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${solution.color || 'from-indigo-500 to-purple-600'} opacity-10 blur-3xl rounded-full pointer-events-none transition-opacity group-hover:opacity-30 duration-500`}></div>
                    
                    <div className="flex justify-between items-start mb-5 sm:mb-6 relative z-10">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${solution.color || 'from-indigo-500 to-purple-600'} flex items-center justify-center text-white shadow-inner overflow-hidden ring-4 ring-white dark:ring-slate-900 shrink-0`}>
                        {solution.imageUrl ? (
                          <img src={solution.imageUrl} alt={solution.name} className="w-full h-full object-cover" />
                        ) : (
                          <Target className="w-6 h-6" />
                        )}
                      </div>
                      <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] uppercase tracking-widest px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm shrink-0 whitespace-nowrap ml-3">
                        {solution.sla}
                      </span>
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2 sm:mb-3 relative z-10 tracking-tight">
                      {solution.name}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-8 sm:mb-10 leading-relaxed flex-1 relative z-10 font-medium">
                      {solution.concept}
                    </p>
                    
                    <div className="flex justify-between items-center pt-5 sm:pt-6 mt-auto relative z-10 before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent gap-3">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest mb-0.5 truncate">
                          Est. Package
                        </span>
                        <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tight truncate">
                          {solution.price}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl group-hover:scale-105 group-active:scale-95 transition-all shadow-md min-w-[100px] sm:min-w-[120px] text-center flex items-center justify-center gap-1.5 sm:gap-2 shrink-0">
                        {launchingId === solution.id ? (
                          <span className="animate-pulse">...</span>
                        ) : (
                          <>
                            Launch <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {solutions.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[24px] sm:rounded-[32px] bg-slate-50/50 dark:bg-slate-900/50 px-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">No Solutions Available</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm sm:max-w-md font-medium text-sm sm:text-base">
                    Turnkey solutions will appear here once they are added via the admin marketplace.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800/60 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-xs font-semibold text-slate-400 dark:text-slate-500 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 mb-2 md:mb-0">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Cookie Settings</a>
          </div>
          <div className="order-first md:order-none">
            &copy; {new Date().getFullYear()} USClosers Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}