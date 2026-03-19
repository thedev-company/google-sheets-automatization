import { PrismaClient } from '@prisma/client';
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const demoSchool = await prisma.school.upsert({
    where: { slug: 'demo-school' },
    update: {},
    create: {
      name: 'Demo School',
      slug: 'demo-school',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: "Demo Admin",
      role: "user",
    },
    create: {
      name: "Demo Admin",
      email: 'admin@example.com',
      emailVerified: true,
      role: 'user',
    },
  });

  const hashedPassword = await hash("changeme123", 10);
  await prisma.account.upsert({
    where: {
      providerId_accountId: {
        providerId: "credential",
        accountId: "admin@example.com",
      },
    },
    update: {
      password: hashedPassword,
    },
    create: {
      userId: (
        await prisma.user.findUniqueOrThrow({
          where: { email: "admin@example.com" },
          select: { id: true },
        })
      ).id,
      providerId: "credential",
      accountId: "admin@example.com",
      password: hashedPassword,
    },
  });

  console.log('Seeded demo school', demoSchool.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

