import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "../../../../../../lib/prisma";
import WizardClient from "../../../../wizard/WizardClient";

export const dynamic = 'force-dynamic';

export default async function AdminBuilderPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  
  const solution = await prisma.solution.findUnique({
    where: { id }
  });

  if (!solution) {
    redirect(`/${locale}/admin/marketplace`);
  }

  // Загружаем те же шаги, что и обычный визард
  const steps = await prisma.wizardStep.findMany({
    include: {
      blocks: {
        orderBy: { order: 'asc' },
        include: { options: true },
      },
    },
    orderBy: { stepNumber: 'asc' },
  });

  return <WizardClient dbSteps={steps} adminSolution={solution} />;
}