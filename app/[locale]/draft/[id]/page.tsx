import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { DraftRestorer } from "./DraftRestorer";

const prisma = new PrismaClient();

export default async function DraftPage({ params }: { params: { locale: string; id: string } }) {
  const { id, locale } = params;

  // 1. Fetch draft from MySQL
  const draft = await prisma.order.findUnique({
    where: { id },
  });

  // 2. Validate if exists and is actually a draft
  if (!draft || draft.status !== "DRAFT" || !draft.draftData) {
    notFound();
  }

  // 3. Pass JSON to Client Component to hydrate the React state
  return <DraftRestorer draftData={draft.draftData} locale={locale} />;
}