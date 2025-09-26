/*
  Warnings:

  - You are about to drop the column `documet` on the `userDoc` table. All the data in the column will be lost.
  - Added the required column `document` to the `userDoc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."userDoc" DROP COLUMN "documet",
ADD COLUMN     "document" TEXT NOT NULL;
