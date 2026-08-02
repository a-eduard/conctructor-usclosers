/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Header } from "../../components/Header";

type Offer = {
  id: string;
  name: string;
  concept: string;
  basePrice: string;
  deliverySla: string;
  category: { id: string; name: string };
};

export default function App() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const locale = useLocale();

  useEffect(() => {
    fetch("/api/offers")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setOffers(data);
        setLoading(false);
      })
      .catch(() => {
        setOffers([]);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500 font-mono">
        Loading storefront...
      </div>
    );

  const categories = Array.from(
    new Set(offers.map((o) => o.category?.name).filter(Boolean)),
  ) as string[];
  categories.sort();
  const displayedCategories = activeCategory ? [activeCategory] : categories;

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans">
      
      <Header 
        leftContent={
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <span
              onClick={() => setActiveCategory(null)}
              className={`cursor-pointer py-2 transition-colors ${activeCategory === null ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600" : "hover:text-slate-900 dark:hover:text-white"}`}
            >
              All
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer py-2 transition-colors capitalize ${activeCategory === cat ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600" : "hover:text-slate-900 dark:hover:text-white"}`}
              >
                {cat.toLowerCase()}
              </span>
            ))}
          </div>
        }
        rightContent={
          <>
            <Link
              href={`/${locale}/dashboard`}
              className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-xl hidden sm:block"
            >
              Client
            </Link>
            <Link
              href={`/${locale}/admin`}
              className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-xl hidden sm:block"
            >
              Admin
            </Link>
          </>
        }
      />

      <main className="max-w-7xl mx-auto py-12 px-8 w-full">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
              Configurable Solutions Marketplace
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Buy predictable outcomes, not agencies.
            </p>
          </div>
          <Link
            href={`/${locale}/wizard`}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm shrink-0 flex items-center justify-center gap-2"
          >
            Start Guided Setup &rarr;
          </Link>
        </div>

        {offers.length === 0 && (
          <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No offers loaded from database yet.
          </div>
        )}

        {displayedCategories.map((category) => (
          <section key={category} className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full inline-block"></span>
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers
                .filter((o) => o.category.name === category)
                .map((offer) => (
                  <Link
                    href={`/${locale}/wizard?preset=${offer.id}`}
                    key={offer.id}
                    className="block group h-full"
                  >
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 h-full shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pr-2">
                          {offer.name}
                        </h3>
                        <span className="shrink-0 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 font-bold text-[10px] uppercase tracking-wider px-2 py-1 rounded">
                          SLA: {offer.deliverySla}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed flex-1">
                        {offer.concept}
                      </p>
                      <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                            Starting at
                          </span>
                          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                            ${offer.basePrice}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors uppercase tracking-wide">
                          Configure &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}