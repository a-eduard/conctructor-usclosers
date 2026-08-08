import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "../../../../../../../lib/prisma";
import WizardClient from "../../../../../wizard/WizardClient";

export const dynamic = 'force-dynamic';

export default async function AdminPresetBuilderPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  
  const preset = await prisma.onboardingPreset.findUnique({
    where: { id }
  });

  if (!preset) {
    redirect(`/${locale}/admin/marketplace?tab=presets`);
  }

  // Загружаем шаги для билдера
  const steps = await prisma.wizardStep.findMany({
    include: {
      blocks: {
        orderBy: { order: 'asc' },
        include: { options: true },
      },
    },
    orderBy: { stepNumber: 'asc' },
  });

  // Передаем preset как adminPreset
  return <WizardClient dbSteps={steps} adminPreset={preset} />;
}