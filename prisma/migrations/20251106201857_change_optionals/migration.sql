/*
  Warnings:

  - You are about to drop the column `bank` on the `invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."invoice" DROP COLUMN "bank",
ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "number" DROP NOT NULL;
