-- AlterTable
ALTER TABLE "public"."userDoc" ADD COLUMN "validation" BOOLEAN;

-- Backfill existing documents as verified
UPDATE "public"."userDoc" SET "validation" = true;

-- Require an explicit validation state for every new document
ALTER TABLE "public"."userDoc" ALTER COLUMN "validation" SET NOT NULL;
