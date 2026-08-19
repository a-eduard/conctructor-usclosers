import React from "react";
import { prisma } from "../../../lib/prisma";
import WizardClient from "./WizardClient";

export default async function WizardPage() {
  // 1. Fetch all steps, blocks, and options from the database
  const steps = await prisma.wizardStep.findMany({
    include: {
      blocks: {
        orderBy: { order: 'asc' },
        include: {
          options: true,
        },
      },
    },
    orderBy: {
      stepNumber: 'asc',
    },
  });

  // 2. Fetch all onboarding presets (Step 0)
  const presets = await prisma.onboardingPreset.findMany({
    orderBy: { createdAt: 'asc' }
  });

  // 3. Pass the data to our Client Component
  return <WizardClient dbSteps={steps} dbPresets={presets} />;
}