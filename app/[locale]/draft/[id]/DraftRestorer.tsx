"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizard } from "../../../../contexts/WizardContext";
import { Loader2 } from "lucide-react";

export function DraftRestorer({ draftPayload, locale }: { draftPayload: any; locale: string }) {
  const { restoreDraft } = useWizard();
  const router = useRouter();

  useEffect(() => {
    if (draftPayload) {
      
      const fullState = {
        currentStep: draftPayload.cartItems && draftPayload.cartItems.length > 0 ? 8 : 1,
        clientProvided: draftPayload.clientProvided || [],
        cartItems: draftPayload.cartItems || [],
        totalOneTime: (draftPayload.cartItems || []).filter((i: any) => i.paymentType === "one-time").reduce((acc: number, item: any) => acc + item.price, 0),
        totalMonthly: (draftPayload.cartItems || []).filter((i: any) => i.paymentType === "monthly").reduce((acc: number, item: any) => acc + item.price, 0),
        ruleResults: { exclude: [], forceRecommend: [], alerts: [] },
        step1Data: draftPayload.step1Data,
        step5Data: draftPayload.step5Data,
        availableOffers: [],
        isLoadingOffers: false,
      };

      // Type assertion to bypass strict generic mismatch during restore
      restoreDraft(fullState as any);
      router.push(`/${locale}/wizard`);
    }
  }, [draftPayload, locale, restoreDraft, router]);

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