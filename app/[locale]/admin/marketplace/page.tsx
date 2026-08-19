import React from "react";
import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { SolutionManager } from "../../../../components/admin/SolutionManager";
import { PresetManager } from "../../../../components/admin/PresetManager";
import { Box, Rocket } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function SolutionsAdminPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ tab?: string }> 
}) {
  const resolvedParams = await searchParams;
  const tab = resolvedParams.tab || 'solutions';

  // Загружаем данные из обеих таблиц
  const solutions = await prisma.solution.findMany({ orderBy: { createdAt: 'desc' } });
  const presets = await prisma.onboardingPreset.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto w-full">
      
      {/* Навигация (Tabs) */}
      <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link 
          href="?tab=solutions" 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-colors ${
            tab === 'solutions' 
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Box className="w-5 h-5" /> 
          Marketplace Solutions
        </Link>
        <Link 
          href="?tab=presets" 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-colors ${
            tab === 'presets' 
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Rocket className="w-5 h-5" /> 
          Onboarding Presets (Step 0)
        </Link>
      </div>

      {/* Рендерим нужный компонент */}
      {tab === 'solutions' ? (
        <div className="-mx-8">
           <SolutionManager initialSolutions={solutions} />
        </div>
      ) : (
        <div className="-mx-8">
           <PresetManager initialPresets={presets} />
        </div>
      )}

    </div>
  );
}