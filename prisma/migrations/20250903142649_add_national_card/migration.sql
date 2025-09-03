/*
  Warnings:

  - Added the required column `nationalCard` to the `userinfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `userinfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."userinfo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nationalCard" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
