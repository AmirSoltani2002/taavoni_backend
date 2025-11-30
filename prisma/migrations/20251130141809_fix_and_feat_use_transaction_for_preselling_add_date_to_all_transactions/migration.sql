/*
  Warnings:

  - You are about to drop the column `projectId` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `presellingId` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."transaction" DROP CONSTRAINT "transaction_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."finalTransaction" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."transaction" DROP COLUMN "projectId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "presellingId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_presellingId_fkey" FOREIGN KEY ("presellingId") REFERENCES "public"."preSelling"("id") ON DELETE CASCADE ON UPDATE CASCADE;
