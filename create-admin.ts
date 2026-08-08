import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@foundry.com";
  const password = "DT5-yRs-MNE-FAr"; // You can set any password here
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email,
      name: "Foundry Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin account successfully created/updated!`);
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error("Failed to create admin account:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });