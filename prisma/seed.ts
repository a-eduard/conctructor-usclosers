import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Clean up existing data
  await prisma.offer.deleteMany();
  await prisma.category.deleteMany();

  // 2. Create Categories
  const categoryCloud = await prisma.category.create({ data: { name: "Cloud" } });
  const categorySalesforce = await prisma.category.create({ data: { name: "Salesforce" } });
  const categoryService = await prisma.category.create({ data: { name: "Service" } });
  const categorySolution = await prisma.category.create({ data: { name: "Solution" } });

  // 3. Create Offers
  const offersData = [
    {
      name: "Sales meeting room with AI agents",
      concept: "Video conferencing room with built-in AI for meeting analysis.",
      pain: "Inefficient meetings and lost information.",
      action: "Deploy AI-powered meeting rooms.",
      features: ["AI transcription", "Action item extraction", "CRM integration"],
      basePrice: 200.00,
      deliverySla: "1 DAY",
      categoryId: categoryCloud.id,
    },
    {
      name: "Hire AI SDR",
      concept: "Mass outreach.",
      pain: "Low volume of outbound activities.",
      action: "Setup AI automated outbound.",
      features: ["Email sequencing", "Lead scraping", "Automated replies"],
      basePrice: 0.00,
      deliverySla: "3 DAYS",
      categoryId: categorySalesforce.id,
    },
    {
      name: "LeadGen",
      concept: "Consistent flow of targeted inbound leads from multiple traffic channels.",
      pain: "Empty sales pipeline.",
      action: "Launch omnichannel lead generation.",
      features: ["Google Ads", "LinkedIn outreach", "Landing page optimization"],
      basePrice: 1000.00,
      deliverySla: "7 DAYS",
      categoryId: categoryService.id,
    },
    {
      name: "1st Sales Call Tomorrow",
      concept: "Booking a highly targeted prospect call for as early as tomorrow.",
      pain: "Need immediate sales opportunities.",
      action: "Bypass standard SDR cycles.",
      features: ["Guaranteed meeting", "Qualified prospect", "Briefing document"],
      basePrice: 500.00,
      deliverySla: "24 HOURS",
      categoryId: categorySolution.id,
    }
  ];

  for (const offer of offersData) {
    await prisma.offer.create({
      data: offer,
    });
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });