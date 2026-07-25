/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { ThemeToggle } from "../../components/ThemeToggle";

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
    <div className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900 font-sans">
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={`/${locale}`}>
              <img
                src="/usc_logo_s.png"
                alt="USClosers Logo"
                className="h-8 hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
              <span
                onClick={() => setActiveCategory(null)}
                className={`cursor-pointer py-1 transition-colors ${activeCategory === null ? "text-indigo-600 border-b-2 border-indigo-600" : "hover:text-slate-800"}`}
              >
                All
              </span>
              {categories.map((cat) => (
                <span
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer py-1 transition-colors capitalize ${activeCategory === cat ? "text-indigo-600 border-b-2 border-indigo-600" : "hover:text-slate-800"}`}
                >
                  {cat.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/dashboard`}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-full flex items-center gap-2"
            >
              Client
            </Link>
            <Link
              href={`/${locale}/admin`}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-full flex items-center gap-2"
            >
              Admin
            </Link>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-8 w-full">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
              Configurable Solutions Marketplace
            </h1>
            <p className="text-slate-500 max-w-md">
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
          <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
            No offers loaded from database yet.
          </div>
        )}

        {displayedCategories.map((category) => (
          <section key={category} className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-6 flex items-center gap-2">
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
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors pr-2">
                          {offer.name}
                        </h3>
                        <span className="shrink-0 bg-green-100 text-green-700 font-bold text-[10px] uppercase tracking-wider px-2 py-1 rounded">
                          SLA: {offer.deliverySla}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-1">
                        {offer.concept}
                      </p>
                      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Starting at
                          </span>
                          <span className="text-xl font-bold font-mono text-slate-900">
                            ${offer.basePrice}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg group-hover:bg-indigo-100 transition-colors uppercase tracking-wide">
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