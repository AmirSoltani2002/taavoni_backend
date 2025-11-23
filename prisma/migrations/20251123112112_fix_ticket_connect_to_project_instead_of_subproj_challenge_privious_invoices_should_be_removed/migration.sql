/*
  Warnings:

  - You are about to drop the column `subProjectId` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."transaction" DROP CONSTRAINT "transaction_subProjectId_fkey";

-- AlterTable
ALTER TABLE "public"."transaction" DROP COLUMN "subProjectId",
ADD COLUMN     "projectId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
