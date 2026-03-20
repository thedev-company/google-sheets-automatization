-- AlterTable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'OutboxEvent'
  ) THEN
    ALTER TABLE "OutboxEvent" ALTER COLUMN "updatedAt" DROP DEFAULT;
  END IF;
END $$;

-- AlterTable
ALTER TABLE "SyncJob" ALTER COLUMN "updatedAt" DROP DEFAULT;
