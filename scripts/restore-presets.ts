import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const presets = [
  {
    id: "f7124a5f-d6ce-4960-8203-1bbb78745d0e",
    segment: "Enterprise",
    icon: "Rocket",
    name: "Turnkey Department",
    subtitle: "Everything done for you. Max infrastructure & team.",
    description: "We build your entire sales department from scratch. Includes consulting, sourcing, and closing.",
    timeEstimate: "45 Days",
    costEstimate: "From $15,500",
    imageUrl: "/images/presets/turnkey-department.png",
    step1Data: "{}",
    step5Data: "{}",
    clientProvided: "[]",
    cartItems: "[]"
  },
  {
    id: "85335c9d-2671-4941-9a4a-6b662d4d1121",
    segment: "Enterprise",
    icon: "Rocket",
    name: "High-Ticket Enterprise",
    subtitle: "Long cycles, MEDDIC, Full human team setup.",
    description: "Targeting F500. Comprehensive market analysis, senior AEs, and advanced CRM operations.",
    timeEstimate: "30 Days",
    costEstimate: "From $12,300",
    imageUrl: "/images/presets/high-ticket-enterprise.png",
    step1Data: "{}",
    step5Data: "{}",
    clientProvided: "[]",
    cartItems: "[]"
  },
  {
    id: "1e9667f4-55f4-4dcb-a84f-46a66786e883",
    segment: "SMB",
    icon: "Rocket",
    name: "Cold Calling Machine",
    subtitle: "Aggressive outbound calling for B2B Conservative niches.",
    description: "Phone parsing + Live calls + Professional Closer.",
    timeEstimate: "21 Days",
    costEstimate: "From $9,700",
    imageUrl: "/images/presets/cold-calling-machine.png",
    step1Data: "{}",
    step5Data: "{}",
    clientProvided: "[]",
    cartItems: "[]"
  },
  {
    id: "43d54d1a-7010-4675-b57d-a83621c5f61d",
    segment: "SMB",
    icon: "Rocket",
    name: "Inbound Closer",
    subtitle: "Setup for handling incoming hot leads via Ads/SEO.",
    description: "Don't let warm leads slip. Professional closing combined with instant AI qualification.",
    timeEstimate: "10 Days",
    costEstimate: "From $8,300",
    imageUrl: "/images/presets/inbound-closer.png",
    step1Data: "{}",
    step5Data: "{}",
    clientProvided: "[]",
    cartItems: "[]"
  },
  {
    id: "7c76e8bb-5e8c-4347-b8d3-3187d391fe14",
    segment: "SMB",
    icon: "Rocket",
    name: "The Scale-Up Machine",
    subtitle: "Human SDRs + AEs + SalesOps for rapid growth.",
    description: "Full team deployment for rapid scaling. Includes strict BANT qualification and contract management.",
    timeEstimate: "30 Days",
    costEstimate: "From $13,700",
    imageUrl: "/images/presets/the-scale-up-machine.png",
    step1Data: "{}",
    step5Data: "{}",
    clientProvided: "[]",
    cartItems: "[]"
  },
  {
    id: "7471d2ed-ad30-4a86-8741-04acaa1ef585",
    segment: "Startups",
    icon: "Rocket",
    name: "Fundraising Pipeline",
    subtitle: "Target investors, pitch deck, data room prep.",
    description: "Get your startup funded. Visually stunning pitch deck combined with aggressive investor outreach.",
    timeEstimate: "14 Days",
    costEstimate: "From $4,900",
    imageUrl: "/images/presets/fundraising-pipeline.png",
    step1Data: "{}",
    step5Data: "{}",
    clientProvided: "[]",
    cartItems: "[]"
  },
  {
    id: "2f6a2000-aac9-4aa5-947e-e2543279968e",
    segment: "Startups",
    icon: "Rocket",
    name: "Founder-Led Automation",
    subtitle: "Outbound emails + AI SDR. You do the demos.",
    description: "Perfect for early-stage founders. Setup includes AI agents for qualification and direct calendar booking.",
    timeEstimate: "2 Days",
    costEstimate: "From $2,000",
    imageUrl: "/images/presets/founder-led-automation.png",
    step1Data: "{}",
    step5Data: "{}",
    clientProvided: "[]",
    cartItems: "[]"
  }
];

async function main() {
  console.log("Starting presets restoration...");

  for (const preset of presets) {
    await prisma.onboardingPreset.upsert({
      where: { id: preset.id },
      update: preset,
      create: preset,
    });
    console.log(`Restored: ${preset.name}`);
  }

  console.log("All 7 presets successfully restored!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });