/*
  Warnings:

  - You are about to drop the column `blockNumber` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `buildingArea` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `floorCount` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `sharedArea` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `unitCount` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `block` on the `subProject` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `subProject` table. All the data in the column will be lost.
  - Added the required column `blockId` to the `subProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direction` to the `subProject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."subProject" DROP CONSTRAINT "subProject_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."project" DROP COLUMN "blockNumber",
DROP COLUMN "buildingArea",
DROP COLUMN "floorCount",
DROP COLUMN "options",
DROP COLUMN "sharedArea",
DROP COLUMN "unitCount";

-- AlterTable
ALTER TABLE "public"."subProject" DROP COLUMN "block",
DROP COLUMN "projectId",
ADD COLUMN     "blockId" INTEGER NOT NULL,
ADD COLUMN     "direction" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."block" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "floorCount" INTEGER NOT NULL,
    "shareArea" INTEGER NOT NULL,
    "buildingArea" INTEGER NOT NULL,
    "description" TEXT,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "block_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."block" ADD CONSTRAINT "block_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subProject" ADD CONSTRAINT "subProject_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "public"."block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
