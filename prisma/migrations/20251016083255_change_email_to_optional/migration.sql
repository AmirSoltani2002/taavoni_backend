-- DropIndex
DROP INDEX "public"."userinfo_email_key";

-- AlterTable
ALTER TABLE "public"."userinfo" ALTER COLUMN "email" DROP NOT NULL;
