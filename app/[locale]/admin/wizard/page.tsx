import React from "react";
import { prisma } from "../../../../lib/prisma";
import { WizardManager } from "../../../../components/admin/WizardManager";

// Force Next.js to always fetch fresh data dynamically, preventing stale cache in the admin panel
export const dynamic = 'force-dynamic';

// This is a Server Component. It fetches data and passes it to the Client Component.
export default async function WizardAdminPage() {
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

  return <WizardManager initialSteps={steps} />;
}