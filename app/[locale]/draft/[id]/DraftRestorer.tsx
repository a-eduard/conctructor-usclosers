"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizard } from "../../../../contexts/WizardContext";
import { Loader2 } from "lucide-react";

export function DraftRestorer({ draftData, locale }: { draftData: any; locale: string }) {
  const { restoreDraft } = useWizard();
  const router = useRouter();

  useEffect(() => {
    if (draftData) {
      // 1. Inject saved data into global state
      restoreDraft(draftData);
      
      // 2. Redirect back to wizard (it will open on the exact step they left off)
      router.push(`/${locale}/wizard`);
    }
  }, [draftData, locale, restoreDraft, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B0F19] selection:bg-indigo-500/30">
      <div className="w-20 h-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl flex items-center justify-center mb-6">
        <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
        Restoring your configuration...
      </h2>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Please wait while we load your saved draft.
      </p>
    </div>
  );
}