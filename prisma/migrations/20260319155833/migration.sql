-- AlterTable
ALTER TABLE "OutboxEvent" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SyncJob" ALTER COLUMN "updatedAt" DROP DEFAULT;
