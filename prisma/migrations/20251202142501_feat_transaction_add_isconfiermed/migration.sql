-- AlterTable
ALTER TABLE "public"."finalTransaction" ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."transaction" ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false;
