import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // --- 1. CREATE TEST USERS ---
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@foundry.com" },
    update: {},
    create: {
      email: "admin@foundry.com",
      name: "Foundry Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`Created ADMIN user: ${admin.email}`);

  const client = await prisma.user.upsert({
    where: { email: "client@foundry.com" },
    update: {},
    create: {
      email: "client@foundry.com",
      name: "Test Client",
      password: hashedPassword,
      role: "USER",
    },
  });
  console.log(`Created USER client: ${client.email}`);


  // --- 3. CREATE SOLUTIONS ---
  const solutionData = [
    {
      slug: "first-sales-call-tomorrow", // Added missing slug field
      icon: "rocket",
      name: "1st Sales Call Tomorrow",
      concept: "Booking a highly targeted prospect call for as early as tomorrow.",
      price: "$500",
      sla: "24 HOURS",
      color: "bg-blue-600",
      step1Data: JSON.stringify({ acv: "$10k-$50k" }),
      step5Data: JSON.stringify({ funnel: "Outbound" }),
      clientProvided: JSON.stringify(["Ideal Customer Profile"]),
      cartItems: JSON.stringify([
        { name: "Priority Setup", price: 100, category: "Setup" }
      ]),
    }
  ];

  for (const sol of solutionData) {
    await prisma.solution.create({ data: sol });
  }

  // --- 4. CREATE WIZARD STEPS ---
  const step2 = await prisma.wizardStep.create({
    data: {
      stepNumber: 2,
      title: "Sales Materials",
      description: "Choose how you want to prepare your sales materials."
    }
  });

  // --- 5. CREATE WIZARD BLOCKS ---
  const pitchDeckBlock = await prisma.wizardBlock.create({
    data: {
      stepId: step2.id,
      name: "Pitch Deck",
      description: "A core presentation for your prospects.",
      order: 1
    }
  });

  // --- 6. CREATE WIZARD OPTIONS ---
  await prisma.wizardOption.create({
    data: {
      blockId: pitchDeckBlock.id,
      type: "myself",
      name: "Do it myself",
      price: 0,
      detailsTitle: "I have my own Pitch Deck",
      bullets: JSON.stringify(["Use existing materials", "No extra cost"]),
    }
  });

  await prisma.wizardOption.create({
    data: {
      blockId: pitchDeckBlock.id,
      type: "service",
      name: "Buy as a service",
      price: 500,
      sla: "3 Days",
      category: "Service",
      detailsTitle: "Let us build a converting Pitch Deck",
      bullets: JSON.stringify(["Professional design", "Copywriting included", "2 revisions"]),
    }
  });

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