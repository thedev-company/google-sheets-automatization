import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'changeme', // TODO: replace with hashed password when auth is wired
      role: 'user',
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

