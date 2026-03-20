import { PrismaClient } from '@prisma/client';
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { createCipheriv, createHash, randomBytes } from "node:crypto";

import { DEFAULT_MESSAGE_TEMPLATES } from "../src/services/template-defaults";

config();

const adapter = new PrismaPg({
  connectionString: (process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL)!,
});

const prisma = new PrismaClient({ adapter });

function encryptForSeed(plainText: string) {
  const keyMaterial = process.env.DATA_ENCRYPTION_KEY ?? "dev-only-seed-fallback-key-please-change";
  const key = createHash("sha256").update(keyMaterial, "utf8").digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
}

async function main() {
  const demoSchool = await prisma.school.upsert({
    where: { slug: 'demo-school' },
    update: {},
    create: {
      name: 'Demo School',
      slug: 'demo-school',
      schoolKey: 'demo_school',
      telegramChatId: '-1000000000000',
      telegramBotTokenEnc: encryptForSeed('replace-me-bot-token'),
      novaPoshtaApiKeyEnc: encryptForSeed('replace-me-nova-poshta-key'),
      googleSheetId: 'replace-me-google-sheet-id',
      googleSheetUrl: 'https://docs.google.com/spreadsheets/d/replace-me-google-sheet-id',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: "Demo Admin",
      role: "admin",
    },
    create: {
      name: "Demo Admin",
      email: 'admin@example.com',
      emailVerified: true,
      role: 'admin',
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

  for (const template of DEFAULT_MESSAGE_TEMPLATES) {
    await prisma.messageTemplate.upsert({
      where: {
        schoolId_code: {
          schoolId: demoSchool.id,
          code: template.code,
        },
      },
      update: {
        text: template.text,
        description: template.description,
      },
      create: {
        schoolId: demoSchool.id,
        code: template.code,
        text: template.text,
        description: template.description,
      },
    });
  }

  console.log('Seeded demo school', demoSchool.slug, "with", DEFAULT_MESSAGE_TEMPLATES.length, "templates");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

