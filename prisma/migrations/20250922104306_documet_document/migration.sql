/*
  Warnings:

  - You are about to drop the column `documet` on the `projectDoc` table. All the data in the column will be lost.
  - You are about to drop the column `documet` on the `subProjectDoc` table. All the data in the column will be lost.
  - Added the required column `document` to the `projectDoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document` to the `subProjectDoc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."projectDoc" DROP COLUMN "documet",
ADD COLUMN     "document" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."subProjectDoc" DROP COLUMN "documet",
ADD COLUMN     "document" TEXT NOT NULL;
