/*
  Warnings:

  - Added the required column `targetBank` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."transaction" ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "targetBank" TEXT NOT NULL;
