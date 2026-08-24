"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Header } from "../../../../components/Header";
import { useWizard } from "../../../../contexts/WizardContext";
import { ArrowRight, Box } from "lucide-react";

export default function SolutionPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const { applyDynamicSolution } = useWizard();
  
  const [solution, setSolution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We will build a specific API route to fetch by slug next,
    // but for now we fetch all and filter to get started safely
    fetch("/api/solutions")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((s: any) => s.slug === params.slug);
        setSolution(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  const handleLaunch = () => {
    if (solution) {
      applyDynamicSolution(solution);
      router.push(`/${locale}/wizard`);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!solution) {
    return <div className="flex h-screen items-center justify-center">Solution not found.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto py-16 px-4 w-full">
        <button onClick={() => router.push(`/${locale}`)} className="text-indigo-600 mb-8 font-medium hover:underline">
          &larr; Back to Solutions
        </button>
        
        <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h1 className="text-4xl font-extrabold mb-4">{solution.name}</h1>
          <p className="text-xl text-slate-500 mb-8">{solution.concept}</p>
          
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-8 mt-8">
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Estimated Package</p>
              <p className="text-3xl font-black">{solution.price}</p>
            </div>
            
            <button 
              onClick={handleLaunch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105"
            >
              Launch Configuration <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}