import { prisma } from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import { DraftRestorer } from "./DraftRestorer";

export default async function DraftPage({ params }: { params: { locale: string; id: string } }) {
  const { id, locale } = params;

  // 1. Fetch draft from MySQL, INCLUDING the related cartItems table
  const draft = await prisma.order.findUnique({
    where: { id },
    include: {
      cartItems: true,
    },
  });

  // 2. Validate if exists and is actually a draft
  if (!draft || draft.status !== "DRAFT") {
    notFound();
  }

  // 3. Parse JSON strings safely for arrays
  let parsedChannels = [];
  try { if (draft.channels) parsedChannels = JSON.parse(draft.channels); } catch(e) {}

  let parsedClientProvided = [];
  try { if (draft.clientProvided) parsedClientProvided = JSON.parse(draft.clientProvided); } catch(e) {}

  // 4. Construct payload from the correct individual columns in the Order model
  const draftPayload = {
    step1Data: {
      methodology: draft.methodology || "",
      channels: parsedChannels,
      acv: draft.acv || "",
      subscriptionModel: draft.subscriptionModel || "",
    },
    step5Data: {
      selectedFunnel: draft.selectedFunnel || "",
    },
    clientProvided: parsedClientProvided,
    cartItems: draft.cartItems, // Already an array of objects thanks to Prisma relation
  };

  return <DraftRestorer draftPayload={draftPayload} locale={locale} />;
}